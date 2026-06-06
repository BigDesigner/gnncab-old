import crypto from "node:crypto";
import type { CookieOptions, Response } from "express";

export const AUTH_COOKIE_NAME = "gnncab_session";
export const CSRF_COOKIE_NAME = "gnncab_csrf";
export const CSRF_HEADER_NAME = "x-csrf-token";

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

function getAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TWELVE_HOURS_MS,
    ...(process.env.AUTH_COOKIE_DOMAIN ? { domain: process.env.AUTH_COOKIE_DOMAIN } : {}),
  };
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
  setCsrfCookie(res);
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE_NAME, {
    ...getAuthCookieOptions(),
    maxAge: undefined,
  });
  clearCsrfCookie(res);
}

function getCsrfCookieOptions(): CookieOptions {
  return {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TWELVE_HOURS_MS,
    ...(process.env.AUTH_COOKIE_DOMAIN ? { domain: process.env.AUTH_COOKIE_DOMAIN } : {}),
  };
}

function setCsrfCookie(res: Response): void {
  res.cookie(CSRF_COOKIE_NAME, crypto.randomBytes(32).toString("base64url"), getCsrfCookieOptions());
}

function clearCsrfCookie(res: Response): void {
  res.clearCookie(CSRF_COOKIE_NAME, {
    ...getCsrfCookieOptions(),
    maxAge: undefined,
  });
}

export function parseCookieHeader(header: string | undefined): Record<string, string> {
  if (!header) {
    return {};
  }

  return Object.fromEntries(
    header
      .split(";")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const separatorIndex = entry.indexOf("=");
        if (separatorIndex === -1) {
          return [entry, ""];
        }

        const name = entry.slice(0, separatorIndex);
        const value = entry.slice(separatorIndex + 1);
        return [name, decodeURIComponent(value)];
      }),
  );
}
