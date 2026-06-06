# Pre-Deployment Extreme Deep Inspections (Rounds 4 & 5)
**Date:** 2026-06-01
**Context:** Final deployment readiness checks performed prior to the production push on DigitalOcean/VMware Ubuntu. The user forced consecutive "deep inspect" cycles, suspecting hidden edge cases and "blind spots" in the deployment automation.

## Executive Summary
Despite initial passing grades on standard security and architectural audits, repeated deep inspections uncovered **6 critical structural and configuration flaws** in the deployment bash scripts (`setup.sh`, `update.sh`, `osrm-setup.sh`). These bugs were highly contextual and would not trigger during local development or standard testing, acting as "time bombs" that would only detonate during the actual production deployment sequence on a fresh Linux server.

---

## 1. Dependency Installation Bypass (NODE_ENV Lock)
- **Symptom:** The `setup.sh` script would fail during the `pnpm --filter @workspace/gnncab run build` or `migrate` steps, complaining about missing `vite` or `drizzle-kit`.
- **Root Cause:** In `setup.sh`, the `.env` file (containing `NODE_ENV=production`) was sourced into the shell *before* `pnpm install` was executed. PNPM respects the `NODE_ENV` variable, thereby intentionally skipping all `devDependencies`. Because Vite and Drizzle-kit were devDependencies, they were entirely excluded.
- **Resolution:** Moved `pnpm install --frozen-lockfile` to execute *before* `. ./.env`. This ensures all build-time tools are downloaded before the environment transitions into strict production mode.

## 2. Environment File Permissions Destruction (.env Lockout)
- **Symptom:** Following successful database creation, the application would crash immediately on boot with `Permission Denied` when trying to read `.env`.
- **Root Cause:** The custom `upsert_env_value` bash function used `awk` to replace strings, writing to a temp file, and then used `mv "$temp_file" "$env_file"`. Because `setup.sh` runs via `sudo` (as root), `mv` replaced the original user-owned `.env` file with a new file owned by `root:root` with `0600` permissions. The `gnncab` app user lost all read permissions to its own configuration.
- **Resolution:** Replaced `mv` with `cat "$temp_file" > "$env_file"`. By piping the output into the existing file descriptor, Linux preserves the file's original ownership and permissions. Added an explicit `chown "$APP_USER:$APP_USER" .env` failsafe.

## 3. Docker UFW Security Bypass (OSRM Public Exposure)
- **Symptom:** The internal OSRM routing engine was fully exposed to the public internet on port `5001`, despite the host's UFW firewall explicitly denying all incoming traffic except HTTP/HTTPS/SSH.
- **Root Cause:** In `osrm-setup.sh`, the container was launched with `-p 5001:5000`. Docker on Linux automatically manipulates the kernel's `iptables` rules natively, jumping ahead of UFW blocks. This silently exposes any bound port to the entire internet (`0.0.0.0`).
- **Resolution:** Modified the port bind to `-p 127.0.0.1:5001:5000`. This strictly limits the container network interface to `localhost`, guaranteeing that only the API server residing on the same machine can access the routing backend.

## 4. Git "Dubious Ownership" Update Crash
- **Symptom:** The `deploy/update.sh` script, designed for zero-downtime PM2 reloads, would crash abruptly with a `fatal: detected dubious ownership in repository at '/var/www/gnncab'` error.
- **Root Cause:** Modern Git versions (CVE-2022-24765) strictly block execution if the current user does not own the `.git` directory. The update script was running `git log --oneline -1` as the `root` user to print the latest commit hash, while the repository was properly owned by the `gnncab` user.
- **Resolution:** Modified the script to run the log command as the application user: `sudo -u "$APP_USER" git log --oneline -1`.

## 5. Nginx Misaligned EOF Injection
- **Symptom:** Nginx would fail to start or reload, citing syntax errors in `/etc/nginx/sites-available/gnncab.conf`.
- **Root Cause:** A bash Here-Doc (`cat << 'EOF'`) in `setup.sh` had incorrect indentation on the terminating `EOF`. This caused the shell to consume subsequent setup functions and inject bash code directly into the Nginx configuration file.
- **Resolution:** Corrected the bash syntax, ensuring the `EOF` tag was at the extreme left margin, successfully closing the heredoc.

## 6. PM2 Cache Directory Crash (Missing User Home)
- **Symptom:** `pm2` and `pnpm` operations inside `setup.sh` would fail with directory access errors related to `~/.pm2` and `~/.local/share/pnpm`.
- **Root Cause:** The `useradd` command that created the `gnncab` service account lacked the flag to initialize a home directory (`--no-create-home` equivalent behavior). Node tools require a writable `$HOME` to store global caches and daemon states.
- **Resolution:** Updated the user creation logic to explicitly assign `--home-dir /var/www/gnncab` and `--shell /bin/bash`, providing a fully stable and writable environment for PM2 and PNPM global caches.

---
## Conclusion
These six critical flaws emphasize the danger of automated system-level setup scripts. They were fully resolved without altering the application logic. The infrastructure is now hardened against edge-cases and guarantees safe execution during bootstrap and lifecycle updates.
