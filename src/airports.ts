import { readFile, writeFile, mkdir } from "node:fs/promises";

interface NamedRaw {
  code?: string;
  name?: string | null;
  city_code?: string | null;
  name_translations?: { fr?: string; en?: string };
}

/** Le nom lisible : fr > en > name (souvent null dans les données brutes). */
function bestName(r: NamedRaw): string | undefined {
  return r.name_translations?.fr ?? r.name_translations?.en ?? r.name ?? undefined;
}

const LANGS = ["fr", "en"] as const;
const labels = new Map<string, string>();
let loaded = false;

/** Charge cities/airports depuis le cache local, sinon depuis Travelpayouts (fr puis en). */
async function loadFile(kind: "cities" | "airports"): Promise<NamedRaw[]> {
  const cache = `data/${kind}.json`;
  try {
    return JSON.parse(await readFile(cache, "utf8")) as NamedRaw[];
  } catch {
    // pas en cache -> on télécharge
  }
  for (const lang of LANGS) {
    try {
      const res = await fetch(`https://api.travelpayouts.com/data/${lang}/${kind}.json`);
      if (!res.ok) continue;
      const text = await res.text();
      await mkdir("data", { recursive: true });
      await writeFile(cache, text, "utf8");
      return JSON.parse(text) as NamedRaw[];
    } catch {
      // langue suivante
    }
  }
  throw new Error(`impossible de charger ${kind}.json`);
}

/** À appeler une fois avant de formater : construit la table code -> nom de ville. */
export async function ensureCatalog(): Promise<void> {
  if (loaded) return;
  try {
    const cities = await loadFile("cities");
    const cityName = new Map<string, string>();
    for (const c of cities) {
      const n = bestName(c);
      if (c.code !== undefined && n !== undefined) cityName.set(c.code, n);
    }

    const airports = await loadFile("airports");
    for (const a of airports) {
      if (a.code === undefined) continue;
      const viaCity = a.city_code ? cityName.get(a.city_code) : undefined;
      const label = viaCity ?? bestName(a);
      if (label !== undefined) labels.set(a.code, label);
    }

    // certains codes sont directement des codes de ville (GVA, PAR...)
    for (const [code, name] of cityName) {
      if (!labels.has(code)) labels.set(code, name);
    }

    loaded = true;
    console.log(`catalogue chargé : ${labels.size} codes`);
  } catch (err) {
    console.error("catalogue non chargé (fallback codes):", err instanceof Error ? err.message : err);
  }
}

/** Nom de ville pour un code IATA, ou le code lui-même en repli. */
export function cityName(iata: string): string {
  return labels.get(iata) ?? iata;
}
