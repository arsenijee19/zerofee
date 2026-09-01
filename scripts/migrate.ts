import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { closePool, query } from "@/lib/server/db";

async function main() {
  const migrations = readdirSync("db/migrations").filter((file) => file.endsWith(".sql")).sort();

  for (const file of migrations) {
    await query("CREATE TABLE IF NOT EXISTS schema_migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
    const applied = await query("SELECT id FROM schema_migrations WHERE id = $1", [file]);
    if (applied.rowCount) continue;
    const sql = readFileSync(join("db/migrations", file), "utf8");
    await query(sql);
    await query("INSERT INTO schema_migrations (id) VALUES ($1) ON CONFLICT DO NOTHING", [file]);
    console.log(`Applied migration ${file}`);
  }
}

main()
  .finally(closePool)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
