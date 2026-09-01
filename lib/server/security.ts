import { createHmac, timingSafeEqual } from "node:crypto";
import { isIP } from "node:net";

export function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyPayloadSignature(payload: string, signature: string, secret: string) {
  const expected = signPayload(payload, secret);
  if (signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function sanitizeCsvCell(value: string) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

export function validateOutboundWebhookUrl(raw: string) {
  const url = new URL(raw);
  if (url.protocol !== "https:") throw new Error("Outbound webhooks must use HTTPS");
  if (url.username || url.password) throw new Error("URL userinfo is not allowed");
  const host = url.hostname.toLowerCase();
  if (["localhost", "0.0.0.0"].includes(host)) throw new Error("Loopback/private hosts are not allowed");
  const ipVersion = isIP(host);
  if (ipVersion === 4) {
    const parts = host.split(".").map(Number);
    if (parts[0] === 10 || parts[0] === 127 || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168) || (parts[0] === 169 && parts[1] === 254)) {
      throw new Error("Private IPv4 targets are not allowed");
    }
  }
  if (ipVersion === 6 && (host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80"))) throw new Error("Private IPv6 targets are not allowed");
  return url.toString();
}
