import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

// Même base que le site web (racine du repo /data)
const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), "data", "skyflydrop.db");
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
  CREATE TABLE IF NOT EXISTS sent_alerts (
    subscriber_id INTEGER NOT NULL,
    deal_key TEXT NOT NULL,
    sent_at TEXT NOT NULL,
    PRIMARY KEY (subscriber_id, deal_key)
  );
`);

export interface Subscriber {
  id: number;
  email: string;
  origins: string[];
  maxPrice: number | null;
  regions: string[];
  cabin: "any" | "economy" | "business";
  directOnly: boolean;
}

interface SubRow {
  id: number;
  email: string;
  origins: string;
  max_price: number | null;
  regions: string;
  cabin: string;
  direct_only: number;
}

export function activeSubscribers(): Subscriber[] {
  const rows = db
    .prepare(
      "SELECT id, email, origins, max_price, regions, cabin, direct_only FROM subscribers WHERE active = 1",
    )
    .all() as SubRow[];
  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    origins: JSON.parse(r.origins) as string[],
    maxPrice: r.max_price,
    regions: JSON.parse(r.regions) as string[],
    cabin: r.cabin === "economy" || r.cabin === "business" ? r.cabin : "any",
    directOnly: r.direct_only === 1,
  }));
}

export function alreadySent(subscriberId: number, dealKey: string): boolean {
  const row = db
    .prepare("SELECT 1 FROM sent_alerts WHERE subscriber_id = ? AND deal_key = ?")
    .get(subscriberId, dealKey);
  return row !== undefined;
}

export function markSent(subscriberId: number, dealKey: string): void {
  db.prepare(
    "INSERT OR IGNORE INTO sent_alerts (subscriber_id, deal_key, sent_at) VALUES (?, ?, ?)",
  ).run(subscriberId, dealKey, new Date().toISOString());
}
