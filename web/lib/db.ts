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

export interface DealRow {
  origin: string;
  destination: string;
  originName: string;
  destinationName: string;
  price: number;
  currency: string;
  airline: string;
  transfers: number;
  region: string;
  departureAt: string;
  returnAt: string | null;
  affiliateUrl: string;
}

interface DealDbRow {
  origin: string;
  destination: string;
  origin_name: string;
  destination_name: string;
  price: number;
  currency: string;
  airline: string;
  transfers: number;
  region: string;
  departure_at: string;
  return_at: string | null;
  affiliate_url: string;
}

export function getDeals(limit = 18): DealRow[] {
  const rows = db
    .prepare(
      `SELECT origin, destination, origin_name, destination_name, price, currency, airline,
              transfers, region, departure_at, return_at, affiliate_url
       FROM deals ORDER BY price ASC LIMIT ?`,
    )
    .all(limit) as DealDbRow[];
  return rows.map((r) => ({
    origin: r.origin,
    destination: r.destination,
    originName: r.origin_name,
    destinationName: r.destination_name,
    price: r.price,
    currency: r.currency,
    airline: r.airline,
    transfers: r.transfers,
    region: r.region,
    departureAt: r.departure_at,
    returnAt: r.return_at,
    affiliateUrl: r.affiliate_url,
  }));
}
