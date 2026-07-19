import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { DealRecord } from "./types.js";

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
  CREATE TABLE IF NOT EXISTS deals (
    deal_key TEXT PRIMARY KEY,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    origin_name TEXT NOT NULL,
    destination_name TEXT NOT NULL,
    price INTEGER NOT NULL,
    currency TEXT NOT NULL,
    airline TEXT NOT NULL,
    transfers INTEGER NOT NULL,
    region TEXT NOT NULL,
    departure_at TEXT NOT NULL,
    return_at TEXT,
    affiliate_url TEXT NOT NULL,
    created_at TEXT NOT NULL
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

/** Remplace la vitrine du site par les deals fournis (les moins chers). */
export function replaceBrowseDeals(records: DealRecord[]): void {
  const now = new Date().toISOString();
  const insert = db.prepare(
    `INSERT OR REPLACE INTO deals
     (deal_key, origin, destination, origin_name, destination_name, price, currency,
      airline, transfers, region, departure_at, return_at, affiliate_url, created_at)
     VALUES (@dealKey, @origin, @destination, @originName, @destinationName, @price, @currency,
      @airline, @transfers, @region, @departureAt, @returnAt, @affiliateUrl, @createdAt)`,
  );
  const tx = db.transaction((recs: DealRecord[]) => {
    db.prepare("DELETE FROM deals").run();
    for (const r of recs) insert.run({ ...r, createdAt: now });
  });
  tx(records);
}
