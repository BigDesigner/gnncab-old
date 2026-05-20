import fs from "node:fs";
import path from "node:path";

export function loadEnvFile(): void {
  for (const candidate of [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../.env"),
    path.resolve(process.cwd(), "../../.env"),
    path.resolve(process.cwd(), "../../../.env"),
  ]) {
    if (fs.existsSync(candidate)) {
      process.loadEnvFile?.(candidate);
      return;
    }
  }
}
