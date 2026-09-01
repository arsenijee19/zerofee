import pg, { type QueryResultRow } from "pg";
import { getEnv } from "@/lib/server/env";

const { Pool } = pg;
let pool: pg.Pool | undefined;

export function getPool() {
  if (!pool) pool = new Pool({ connectionString: getEnv().DATABASE_URL });
  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
  const result = await getPool().query<T>(text, params);
  return result;
}

export async function one<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
  const result = await query<T>(text, params);
  return result.rows[0];
}

export async function transaction<T>(fn: (client: pg.PoolClient) => Promise<T>) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const value = await fn(client);
    await client.query("COMMIT");
    return value;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function resetDatabaseForTests() {
  await query(`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
  `);
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}
