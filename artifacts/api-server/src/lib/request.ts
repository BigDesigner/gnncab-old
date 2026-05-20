import type { Request } from "express";

export function getRouteParam(req: Request, name: string): string {
  const value = req.params[name];

  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === "string" && value[0].length > 0) {
    return value[0];
  }

  throw new Error(`Missing route parameter: ${name}`);
}
