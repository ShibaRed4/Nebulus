// scripts/migrate.ts
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import path from "node:path";

const dbPath = process.env.DATABASE_URL?.replace("file:", "");
if (!dbPath) {
  console.error("Error: DATABASE_URL environment variable is not set in .env");
  process.exit(1);
}
// Resolve path relative to project root (where package.json is)
const absoluteDbPath = path.resolve(process.cwd(), dbPath);
const migrationsFolder = "./api/db/migrations"; // <-- Point to the correct folder

console.log(`[Migrate] Applying migrations from: ${migrationsFolder}`);
console.log(`[Migrate] Target database: ${absoluteDbPath}`);

try {
  // Connect to the *correct* database file
  const sqlite = new Database(absoluteDbPath, { create: true });
  const db = drizzle(sqlite);

  // Apply migrations from the *correct* folder
  await migrate(db, { migrationsFolder });

  console.log("[Migrate] Migrations applied successfully.");
  sqlite.close();
  process.exit(0);
} catch (error) {
  console.error("[Migrate] Error applying migrations:", error);
  process.exit(1);
}
