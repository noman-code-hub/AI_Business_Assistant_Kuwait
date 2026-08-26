import { describe, expect, it } from "vitest";
import { mapAuthError } from "./auth.service";

describe("mapAuthError", () => {
  it("maps email-already-in-use", () => {
    const result = mapAuthError({ code: "auth/email-already-in-use", message: "raw" });
    expect(result.code).toBe("auth/email-already-in-use");
    expect(result.message).toMatch(/already exists/i);
  });

  it("maps invalid credential", () => {
    const result = mapAuthError({ code: "auth/invalid-credential", message: "raw" });
    expect(result.message).toMatch(/invalid email or password/i);
  });

  it("handles unknown errors", () => {
    const result = mapAuthError(new Error("boom"));
    expect(result.code).toBe("auth/unknown");
  });
});
