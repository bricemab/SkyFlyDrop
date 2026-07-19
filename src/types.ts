export type Region =
  | "europe"
  | "north_africa"
  | "middle_east"
  | "asia"
  | "indian_ocean"
  | "north_america"
  | "south_america"
  | "africa"
  | "oceania"
  | "unknown";

/** Un prix brut renvoyé par l'API Travelpayouts, normalisé. */
export interface PriceEntry {
  origin: string;
  destination: string;
  price: number;
  currency: string;
  airline: string;
  flightNumber: string;
  transfers: number;
  departureAt: string; // ISO
  returnAt: string | null; // ISO ou null (aller simple)
  foundAt: string; // ISO — quand l'API l'a renvoyé
}

/** Un PriceEntry qualifié de "deal" + le lien affilié prêt à poster. */
export interface Deal extends PriceEntry {
  region: Region;
  reference: number | null; // médiane historique si connue
  discountPct: number | null; // remise vs référence (0..1)
  affiliateUrl: string;
}
