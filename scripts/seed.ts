import { mkdirSync, writeFileSync } from "node:fs";
import { getSeedState } from "@/lib/domain/seed";

mkdirSync("db", { recursive: true });
writeFileSync("db/seed-state.json", JSON.stringify(getSeedState(), null, 2), "utf8");
console.log("Deterministic ZeroFee seed state written to db/seed-state.json");
