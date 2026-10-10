import { describe, expect, it } from "vitest";
import { sanitizeCsvCell, signPayload, validateOutboundWebhookUrl, verifyPayloadSignature } from "@/lib/server/security";
import { safeRedirectPath, slugSchema, passwordSchema, httpsUrlSchema } from "@/lib/server/validation";
import { plainTextPreview, renderBodyHtml, sanitizeRichText } from "@/lib/server/rich-text";
import { validateMediaUpload } from "@/lib/server/media-service";
import { getStorage } from "@/lib/server/storage";

const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47]), Buffer.alloc(32)]);

describe("security boundaries", () => {
  it("sanitizes migration CSV formula injection cells", () => {
    expect(sanitizeCsvCell("=IMPORTXML()")).toBe("'=IMPORTXML()");
    expect(sanitizeCsvCell("+1")).toBe("'+1");
    expect(sanitizeCsvCell("normal@example.test")).toBe("normal@example.test");
  });

  it("blocks SSRF webhook targets, including mapped IPv6, metadata and internal names", () => {
    expect(validateOutboundWebhookUrl("https://example.com/hook")).toContain("example.com");
    for (const bad of [
      "http://example.com/hook",
      "https://127.0.0.1/hook",
      "https://localhost/hook",
      "https://169.254.169.254/latest/meta-data",
      "https://[::1]/hook",
      "https://[::ffff:127.0.0.1]/hook",
      "https://[::ffff:7f00:1]/hook",
      "https://10.0.0.5/hook",
      "https://100.64.0.1/hook",
      "https://service.internal/hook",
      "https://printer.local/hook",
      "https://intranet/hook",
      "https://example.com:8443/hook",
      "https://user:pass@example.com/hook",
      "https://2130706433/hook"
    ]) expect(() => validateOutboundWebhookUrl(bad), bad).toThrow();
  });

  it("verifies webhook signatures in constant time and rejects malformed ones", () => {
    const payload = '{"id":"evt_1"}';
    const valid = signPayload(payload, "secret");
    expect(verifyPayloadSignature(payload, valid, "secret")).toBe(true);
    expect(verifyPayloadSignature(payload, valid.replace(/.$/, valid.endsWith("a") ? "b" : "a"), "secret")).toBe(false);
    expect(verifyPayloadSignature(payload, "zz".repeat(32), "secret")).toBe(false);
    expect(verifyPayloadSignature(payload, "", "secret")).toBe(false);
  });

  it("only allows same-site relative redirect targets", () => {
    expect(safeRedirectPath("/creator/settings?x=1", "/member")).toBe("/creator/settings?x=1");
    for (const bad of ["//evil.com", "https://evil.com", "/\\evil.com", "javascript:alert(1)", "/ok\nSet-Cookie: a=b", "", null, undefined]) {
      expect(safeRedirectPath(bad as string | null | undefined, "/member"), String(bad)).toBe("/member");
    }
  });

  it("strips active content from rich text but keeps safe formatting", () => {
    const dirty = '<p onclick="x()">Hi <strong>there</strong></p><script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:alert(1)">bad</a><a href="https://ok.example/x">ok</a><iframe src="https://evil"></iframe><svg onload=alert(1)>';
    const clean = sanitizeRichText(dirty);
    expect(clean).toContain("<strong>there</strong>");
    expect(clean).toContain('href="https://ok.example/x"');
    expect(clean).toContain('rel="nofollow noopener noreferrer ugc"');
    for (const bad of ["<script", "onclick", "onerror", "javascript:", "<iframe", "<svg", "<img"]) expect(clean).not.toContain(bad);
    expect(sanitizeRichText('<a href="&#106;avascript:alert(1)">x</a>')).not.toContain("javascript");
  });

  it("escapes plain-text posts and auto-links https only", () => {
    const html = renderBodyHtml('Tom & Jerry 5 < 6 https://example.com/a\n\nSecond javascript:alert(1)');
    expect(html).toContain("Tom &amp; Jerry 5 &lt; 6");
    expect(html).toContain('<a href="https://example.com/a"');
    expect(html.match(/<p>/g)).toHaveLength(2);
    expect(plainTextPreview("<p>Short <em>text</em></p>")).toBe("Short text");
  });

  it("validates slugs, passwords and links", () => {
    expect(slugSchema.safeParse("mila-nova").success).toBe(true);
    for (const bad of ["ab", "Admin", "api", "has space", "-lead", "trail-", "dou--ble", "x".repeat(60), "../etc"]) expect(slugSchema.safeParse(bad).success, bad).toBe(false);
    expect(passwordSchema.safeParse("Password123!").success).toBe(true);
    expect(passwordSchema.safeParse("short1").success).toBe(false);
    expect(passwordSchema.safeParse("allletterslonger").success).toBe(false);
    expect(httpsUrlSchema.safeParse("https://example.com/x").success).toBe(true);
    for (const bad of ["http://example.com", "javascript:alert(1)", "https://u:p@example.com", "example.com", "https://nodot"]) expect(httpsUrlSchema.safeParse(bad).success, bad).toBe(false);
  });

  it("validates uploads by purpose, size and real file signature", () => {
    expect(validateMediaUpload({ name: "a.png", mimeType: "image/png", bytes: png, purpose: "AVATAR" })).toBe("png");
    expect(() => validateMediaUpload({ name: "a.pdf", mimeType: "application/pdf", bytes: Buffer.from("%PDF-1.4 x"), purpose: "AVATAR" })).toThrow();
    expect(validateMediaUpload({ name: "a.pdf", mimeType: "application/pdf", bytes: Buffer.from("%PDF-1.4 x"), purpose: "ATTACHMENT" })).toBe("pdf");
    expect(() => validateMediaUpload({ name: "a.png", mimeType: "image/png", bytes: Buffer.from("<svg onload=alert(1)>"), purpose: "ATTACHMENT" })).toThrow(/match/);
    expect(() => validateMediaUpload({ name: "a.svg", mimeType: "image/svg+xml", bytes: Buffer.from("<svg/>"), purpose: "ATTACHMENT" })).toThrow();
    expect(() => validateMediaUpload({ name: "../a.png", mimeType: "image/png", bytes: png, purpose: "ATTACHMENT" })).toThrow();
    expect(() => validateMediaUpload({ name: "a.png", mimeType: "image/png", bytes: Buffer.alloc(3 * 1024 * 1024, 0x89), purpose: "AVATAR" })).toThrow(/under/);
    expect(() => validateMediaUpload({ name: "a.png", mimeType: "image/png", bytes: Buffer.alloc(0), purpose: "AVATAR" })).toThrow();
  });

  it("storage rejects traversal and malformed keys", async () => {
    const storage = getStorage();
    for (const key of ["../../etc/passwd", "media/../../x", "/abs/path", "media//x", "a", "media/ok\0.png"]) await expect(storage.get(key), key).rejects.toThrow();
  });
});
