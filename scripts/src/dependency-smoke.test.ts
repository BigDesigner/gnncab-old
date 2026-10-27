import assert from "node:assert/strict";
import test from "node:test";
import bcrypt from "bcrypt";
import { insertUserSchema, insertTripSchema } from "@workspace/db/schema";

test("bcrypt native binding hashes and verifies passwords", async () => {
  const hash = await bcrypt.hash("DependencySmoke!42", 4);
  assert.equal(await bcrypt.compare("DependencySmoke!42", hash), true);
  assert.equal(await bcrypt.compare("wrong-password", hash), false);
});

test("Drizzle user schemas reject invalid roles and missing required fields", () => {
  const user = {
    email: "smoke@example.test",
    passwordHash: "test-only-hash",
    firstName: "Dependency",
    lastName: "Smoke",
    role: "customer",
  };
  assert.equal(insertUserSchema.safeParse(user).success, true);
  assert.equal(insertUserSchema.safeParse({ ...user, role: "superadmin" }).success, false);
  assert.equal(insertUserSchema.safeParse({ role: "customer" }).success, false);
});

test("Drizzle trip schema loads with the upgraded Zod runtime", () => {
  assert.equal(insertTripSchema.safeParse({}).success, false);
});
