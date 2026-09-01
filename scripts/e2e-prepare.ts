import { execFileSync } from "node:child_process";
import { closePool, resetDatabaseForTests } from "@/lib/server/db";

async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("Refusing to reset a production database");
  await resetDatabaseForTests();
  await closePool();
  const env = { ...process.env, RUNTIME_MODE: "test" };
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  execFileSync(npm, ["run", "db:migrate"], { stdio: "inherit", env });
  execFileSync(npm, ["run", "seed"], { stdio: "inherit", env });
}

main().catch((error) => { console.error(error); process.exit(1); });
