import { createHmac, timingSafeEqual } from "node:crypto";
import { isIP } from "node:net";

export function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyPayloadSignature(payload: string, signature: string, secret: string) {
  const expected = signPayload(payload, secret);
  if (signature.length !== expected.length || !/^[0-9a-f]+$/i.test(signature)) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function sanitizeCsvCell(value: string) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function isPrivateIpv4(host: string) {
  const [a, b, c] = host.split(".").map(Number);
  return (
    a === 0 || a === 10 || a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0 && c === 0) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

export function validateOutboundWebhookUrl(raw: string) {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("Enter a valid webhook URL");
  }
  if (url.protocol !== "https:") throw new Error("Outbound webhooks must use HTTPS");
  if (url.username || url.password) throw new Error("URL userinfo is not allowed");
  if (url.port && url.port !== "443") throw new Error("Only the default HTTPS port is allowed");
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal") || host.endsWith(".lan") || !host.includes(".") && isIP(host) === 0) {
    throw new Error("Loopback/private hosts are not allowed");
  }
  const ipVersion = isIP(host);
  if (ipVersion === 4 && isPrivateIpv4(host)) throw new Error("Private IPv4 targets are not allowed");
  if (ipVersion === 6) {
    const mapped = host.match(/^::ffff:(?:(\d+\.\d+\.\d+\.\d+)|([0-9a-f]{1,4}):([0-9a-f]{1,4}))$/);
    if (mapped) {
      const v4 = mapped[1] ?? [parseInt(mapped[2], 16) >> 8, parseInt(mapped[2], 16) & 255, parseInt(mapped[3], 16) >> 8, parseInt(mapped[3], 16) & 255].join(".");
      if (isPrivateIpv4(v4)) throw new Error("Private IPv4 targets are not allowed");
    }
    if (host === "::" || host === "::1" || /^f[cd]/.test(host) || /^fe[89ab]/.test(host)) throw new Error("Private IPv6 targets are not allowed");
  }
  return url.toString();
}
