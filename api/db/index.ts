// api/db/index.ts
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import path from "node:path";
import * as schema from "./schema";

// --- Use DATABASE_URL consistently ---
const dbPath = process.env.DATABASE_URL?.replace("file:", "");
if (!dbPath) {
  // Consider throwing an error or using a default in dev?
  throw new Error("DATABASE_URL environment variable is not set for API.");
}
const absoluteDbPath = path.resolve(process.cwd(), dbPath);
// ---

console.log(`[DB API] Connecting to SQLite database at: ${absoluteDbPath}`);
const sqlite = new Database(absoluteDbPath, { create: true }); // Use resolved path
sqlite.exec("PRAGMA journal_mode = WAL;");
console.log("[DB API] SQLite connection established with WAL mode.");

export const db = drizzle(sqlite, { schema });
console.log("[DB API] Drizzle ORM initialized.");
