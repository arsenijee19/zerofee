import { query } from "@/lib/server/db";
import { getEnv } from "@/lib/server/env";

export type OutboundEmail = { to: string; userId?: string | null; subject: string; text: string };

/** Mock provider stores mail in test_mailbox; resend sends through the Resend HTTP API. */
export async function sendEmail(message: OutboundEmail) {
  const env = getEnv();
  if (env.EMAIL_PROVIDER === "resend") {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.EMAIL_FROM, to: [message.to], subject: message.subject, text: message.text }),
      signal: AbortSignal.timeout(10_000)
    });
    if (!response.ok) throw new Error(`Email provider rejected message (${response.status})`);
    return;
  }
  await query("INSERT INTO test_mailbox (user_id, email, subject, body) VALUES ($1,$2,$3,$4)", [message.userId ?? null, message.to, message.subject, message.text]);
}

export function absoluteUrl(path: string) {
  return new URL(path, getEnv().APP_URL).toString();
}
