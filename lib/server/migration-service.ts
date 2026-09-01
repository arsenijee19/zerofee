import { createHash } from "node:crypto";
import type { AuthUser } from "@/lib/server/auth";
import { hashToken, randomToken } from "@/lib/server/crypto";
import { sanitizeCsvCell } from "@/lib/server/security";
import { transaction } from "@/lib/server/db";
import { requireCreatorOwner } from "@/lib/server/policies";

export type ParsedMigrationRow = {
  name: string;
  email: string;
  externalId: string;
  externalTier: string;
  status: string;
  interval: "monthly" | "annual";
  amountMinor: number;
  currency: string;
  valid: boolean;
  errors: string[];
};

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let cell = "";
  let row: string[] = [];
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"' && text[i + 1] === '"') { cell += '"'; i += 1; continue; }
    if (char === '"') { quoted = !quoted; continue; }
    if (char === "," && !quoted) { row.push(cell); cell = ""; continue; }
    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cell); rows.push(row); row = []; cell = ""; continue;
    }
    cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim()));
}

export function parsePatreonCsv(text: string): ParsedMigrationRow[] {
  if (Buffer.byteLength(text) > 1024 * 1024) throw new Error("Migration CSV exceeds size limit");
  const rows = parseCsv(text);
  if (rows.length < 2) throw new Error("CSV has no data rows");
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const index = (variants: string[]) => variants.map((v) => headers.indexOf(v)).find((i) => i >= 0) ?? -1;
  const nameIdx = index(["name", "member name", "full name"]);
  const emailIdx = index(["email", "email address"]);
  const idIdx = index(["patreon id", "external id", "member id"]);
  const tierIdx = index(["tier", "patron tier", "external tier"]);
  const statusIdx = index(["status", "patron status"]);
  const intervalIdx = index(["billing frequency", "interval"]);
  const amountIdx = index(["amount", "pledge amount", "monthly amount"]);
  if (nameIdx < 0 || emailIdx < 0 || tierIdx < 0) throw new Error("Required Patreon headings are missing");
  return rows.slice(1).map((cells) => {
    const email = (cells[emailIdx] ?? "").trim().toLowerCase();
    const amount = (cells[amountIdx] ?? "0").replace(/[^0-9.]/g, "");
    const errors = [];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("invalid email");
    const interval = /annual|year/i.test(cells[intervalIdx] ?? "") ? "annual" : "monthly";
    return {
      name: sanitizeCsvCell((cells[nameIdx] ?? "").trim()),
      email,
      externalId: (cells[idIdx] ?? email).trim(),
      externalTier: sanitizeCsvCell((cells[tierIdx] ?? "").trim()),
      status: (cells[statusIdx] ?? "active").trim(),
      interval,
      amountMinor: Math.round(Number(amount || 0) * 100),
      currency: "EUR",
      valid: errors.length === 0,
      errors
    };
  });
}

export async function importMigrationCsv(user: AuthUser, creatorId: string, tierId: string, csv: string) {
  await requireCreatorOwner(user, creatorId);
  const parsed = parsePatreonCsv(csv);
  return transaction(async (client) => {
    const project = await client.query<{ id: string }>("INSERT INTO migration_projects (creator_id, source, name, state) VALUES ($1,'patreon','Patreon import','IMPORTING') RETURNING id", [creatorId]);
    let imported = 0;
    const inviteTokens: string[] = [];
    for (const row of parsed.filter((r) => r.valid)) {
      const hash = createHash("sha256").update(`${row.externalId}:${row.email}`).digest("hex");
      const saved = await client.query<{ id: string }>(
        `INSERT INTO migration_import_rows
         (project_id,external_member_id,member_name,email,external_tier,mapped_tier_id,status,interval,amount_minor,currency,raw_fields,row_hash)
         VALUES ($1,$2,$3,$4,$5,$6,'IMPORTED',$7,$8,$9,$10,$11)
         ON CONFLICT (project_id,row_hash) DO NOTHING RETURNING id`,
        [project.rows[0].id, row.externalId, row.name, row.email, row.externalTier, tierId, row.interval, row.amountMinor, row.currency, row, hash]
      );
      if (saved.rowCount) {
        imported += 1;
        const token = randomToken("mig");
        inviteTokens.push(token);
        await client.query("INSERT INTO migration_invitations (import_row_id, token_hash, expires_at, status) VALUES ($1,$2,now()+interval '14 days','INVITE_READY')", [saved.rows[0].id, hashToken(token)]);
      }
    }
    await client.query("UPDATE migration_projects SET state = 'IMPORTED' WHERE id = $1", [project.rows[0].id]);
    return { projectId: project.rows[0].id, parsed: parsed.length, imported, invalid: parsed.filter((r) => !r.valid).length, inviteTokens };
  });
}
