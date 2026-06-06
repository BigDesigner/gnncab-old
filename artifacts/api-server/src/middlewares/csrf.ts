import type { NextFunction, Request, Response } from "express";
import { AUTH_COOKIE_NAME, CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "../lib/auth-cookie.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const CSRF_EXEMPT_PATHS = new Set(["/api/auth/login", "/api/auth/register"]);

export function requireCsrfForCookieAuth(req: Request, res: Response, next: NextFunction): void {
  if (SAFE_METHODS.has(req.method) || CSRF_EXEMPT_PATHS.has(req.path)) {
    next();
    return;
  }

  const hasOrigin = typeof req.headers["origin"] === "string";
  const hasSessionCookie = typeof req.cookies?.[AUTH_COOKIE_NAME] === "string";
  const isNative = req.headers["x-client-type"] === "native";

  // If session cookie is present and it is a browser context (has Origin or not explicitly native),
  // we enforce CSRF protection even if Bearer auth is also present, to prevent potential CSRF bypasses.
  if (hasSessionCookie && (hasOrigin || !isNative)) {
    // Proceed to CSRF checks (do not bypass)
  } else if (!hasSessionCookie || req.headers.authorization?.startsWith("Bearer ") === true) {
    next();
    return;
  }

  const csrfCookie = req.cookies?.[CSRF_COOKIE_NAME];
  const csrfHeader = req.headers[CSRF_HEADER_NAME];

  if (
    typeof csrfCookie !== "string" ||
    typeof csrfHeader !== "string" ||
    csrfCookie.length === 0 ||
    csrfCookie !== csrfHeader
  ) {
    res.status(403).json({
      error: "Forbidden",
      message: "Missing or invalid CSRF token",
    });
    return;
  }

  next();
}
