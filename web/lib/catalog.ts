export const ORIGINS = [
  { code: "GVA", label: "Genève" },
  { code: "ZRH", label: "Zurich" },
  { code: "BSL", label: "Bâle / EuroAirport" },
] as const;

export const REGIONS = [
  { code: "europe", label: "Europe" },
  { code: "north_africa", label: "Afrique du Nord" },
  { code: "middle_east", label: "Moyen-Orient" },
  { code: "asia", label: "Asie" },
  { code: "indian_ocean", label: "Océan Indien" },
  { code: "north_america", label: "Amérique du Nord" },
  { code: "south_america", label: "Amérique du Sud" },
  { code: "africa", label: "Afrique" },
  { code: "oceania", label: "Océanie" },
] as const;

export const CABINS = [
  { code: "any", label: "Peu importe" },
  { code: "economy", label: "Économie" },
  { code: "business", label: "Business" },
] as const;

export type CabinCode = (typeof CABINS)[number]["code"];

export const ORIGIN_CODES: readonly string[] = ORIGINS.map((o) => o.code);
export const REGION_CODES: readonly string[] = REGIONS.map((r) => r.code);
export const CABIN_CODES: readonly string[] = CABINS.map((c) => c.code);
