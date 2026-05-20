import type { NextFunction, Request, Response } from "express";
import { AUTH_COOKIE_NAME, CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "../lib/auth-cookie.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const CSRF_EXEMPT_PATHS = new Set(["/api/auth/login", "/api/auth/register"]);

export function requireCsrfForCookieAuth(req: Request, res: Response, next: NextFunction): void {
  if (SAFE_METHODS.has(req.method) || CSRF_EXEMPT_PATHS.has(req.path)) {
    next();
    return;
  }

  const hasBearerAuth = req.headers.authorization?.startsWith("Bearer ") === true;
  const hasSessionCookie = typeof req.cookies?.[AUTH_COOKIE_NAME] === "string";

  if (!hasSessionCookie || hasBearerAuth) {
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
