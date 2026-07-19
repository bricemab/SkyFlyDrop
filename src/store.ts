import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

interface StoreShape {
  seen: Record<string, number>; // dealKey -> epoch ms (anti-doublon)
  history: Record<string, number[]>; // routeKey -> prix récents (baseline)
}

const FILE = "data/store.json";
let cache: StoreShape | null = null;

async function load(): Promise<StoreShape> {
  if (cache !== null) return cache;
  try {
    const raw = await readFile(FILE, "utf8");
    cache = JSON.parse(raw) as StoreShape;
  } catch {
    cache = { seen: {}, history: {} };
  }
  return cache;
}

async function persist(): Promise<void> {
  if (cache === null) return;
  await mkdir(dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(cache, null, 2), "utf8");
}

export async function recordPrice(routeKey: string, price: number, cap = 60): Promise<void> {
  const s = await load();
  const arr = s.history[routeKey] ?? [];
  arr.push(price);
  s.history[routeKey] = arr.slice(-cap);
  await persist();
}

export async function median(routeKey: string): Promise<number | null> {
  const s = await load();
  const arr = s.history[routeKey];
  if (arr === undefined || arr.length === 0) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid]!;
  return (sorted[mid - 1]! + sorted[mid]!) / 2;
}

export async function historyLength(routeKey: string): Promise<number> {
  const s = await load();
  return s.history[routeKey]?.length ?? 0;
}

export async function isSeen(key: string): Promise<boolean> {
  const s = await load();
  return key in s.seen;
}

export async function markSeen(key: string, ttlDays = 3): Promise<void> {
  const s = await load();
  const now = Date.now();
  const ttlMs = ttlDays * 86_400_000;
  for (const [k, ts] of Object.entries(s.seen)) {
    if (now - ts > ttlMs) delete s.seen[k];
  }
  s.seen[key] = now;
  await persist();
}
