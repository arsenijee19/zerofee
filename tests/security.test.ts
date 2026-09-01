import { describe, expect, it } from "vitest";
import { createHmac, timingSafeEqual } from "node:crypto";

function canAccess(userCreatorId: string, resourceCreatorId: string, role: "CREATOR" | "ADMIN" | "MEMBER") {
  return role === "ADMIN" || (role === "CREATOR" && userCreatorId === resourceCreatorId);
}

function sanitizeCsvCell(value: string) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function isSafeWebhookUrl(url: string) {
  const parsed = new URL(url);
  return parsed.protocol === "https:" && !["localhost", "127.0.0.1", "0.0.0.0"].includes(parsed.hostname);
}

function verifySignature(payload: string, signature: string, secret: string) {
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

describe("security boundaries", () => {
  it("prevents cross-creator IDOR while allowing admins", () => {
    expect(canAccess("creator_a", "creator_b", "CREATOR")).toBe(false);
    expect(canAccess("creator_a", "creator_b", "ADMIN")).toBe(true);
  });

  it("sanitizes migration CSV formula injection cells", () => {
    expect(sanitizeCsvCell("=IMPORTXML()")).toBe("'=IMPORTXML()");
    expect(sanitizeCsvCell("normal@example.test")).toBe("normal@example.test");
  });

  it("blocks localhost SSRF webhook targets", () => {
    expect(isSafeWebhookUrl("https://example.com/hook")).toBe(true);
    expect(isSafeWebhookUrl("http://example.com/hook")).toBe(false);
    expect(isSafeWebhookUrl("https://127.0.0.1/hook")).toBe(false);
  });

  it("rejects fake webhook signatures", () => {
    const payload = "{\"id\":\"evt_1\"}";
    const valid = createHmac("sha256", "secret").update(payload).digest("hex");
    expect(verifySignature(payload, valid, "secret")).toBe(true);
    expect(verifySignature(payload, valid.replace("a", "b"), "secret")).toBe(false);
  });
});
