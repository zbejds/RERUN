import "server-only";
import { Pool, type PoolClient } from "pg";
import { env } from "./env";
import { SCHEMA_SQL } from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __rerunPool: Pool | undefined;
}

export function db(): Pool | null {
  if (!env.databaseUrl) return null;
  if (!global.__rerunPool) {
    global.__rerunPool = new Pool({
      connectionString: env.databaseUrl,
      ssl: env.databaseSsl ? { rejectUnauthorized: false } : undefined,
      max: 5,
      idleTimeoutMillis: 20_000,
    });
  }
  return global.__rerunPool;
}

/**
 * Create the tables if they are missing, once per server instance. This means a
 * fresh (empty) Neon database works without any manual SQL step.
 */
let schemaReady: Promise<void> | null = null;
export function ensureSchema(): Promise<void> {
  const pool = db();
  if (!pool) return Promise.resolve();
  if (!schemaReady) {
    schemaReady = pool
      .query(SCHEMA_SQL)
      .then(() => undefined)
      .catch((e) => {
        schemaReady = null; // retry on the next request
        throw e;
      });
  }
  return schemaReady;
}

export async function withTx<T>(fn: (c: PoolClient) => Promise<T>): Promise<T> {
  const pool = db();
  if (!pool) throw new Error("Database not configured");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const out = await fn(client);
    await client.query("COMMIT");
    return out;
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}
