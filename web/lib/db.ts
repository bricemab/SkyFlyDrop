import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

// DB partagée avec le worker (racine du repo /data)
const DB_PATH =
  process.env.DB_PATH ?? path.join(process.cwd(), "..", "data", "skyflydrop.db");
mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    origins TEXT NOT NULL,
    max_price INTEGER,
    regions TEXT NOT NULL,
    cabin TEXT NOT NULL DEFAULT 'any',
    direct_only INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );
`);

export interface SubscriberInput {
  email: string;
  origins: string[];
  maxPrice: number | null;
  regions: string[];
  cabin: "any" | "economy" | "business";
  directOnly: boolean;
}

export function upsertSubscriber(s: SubscriberInput): void {
  db.prepare(
    `INSERT INTO subscribers (email, origins, max_price, regions, cabin, direct_only, active, created_at)
     VALUES (@email, @origins, @maxPrice, @regions, @cabin, @directOnly, 1, @createdAt)
     ON CONFLICT(email) DO UPDATE SET
       origins=@origins, max_price=@maxPrice, regions=@regions,
       cabin=@cabin, direct_only=@directOnly, active=1`,
  ).run({
    email: s.email,
    origins: JSON.stringify(s.origins),
    maxPrice: s.maxPrice,
    regions: JSON.stringify(s.regions),
    cabin: s.cabin,
    directOnly: s.directOnly ? 1 : 0,
    createdAt: new Date().toISOString(),
  });
}

export function countSubscribers(): number {
  const row = db
    .prepare("SELECT COUNT(*) AS n FROM subscribers WHERE active = 1")
    .get() as { n: number };
  return row.n;
}
