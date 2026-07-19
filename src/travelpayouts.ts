import { config } from "./config.js";
import type { PriceEntry } from "./types.js";

interface RawDirection {
  origin: string;
  destination: string;
  price: number;
  airline: string;
  flight_number: number;
  transfers: number;
  departure_at: string;
  return_at?: string;
  expires_at?: string;
}

interface CityDirectionsResponse {
  success: boolean;
  data?: Record<string, RawDirection>;
  error?: string;
}

const BASE = "https://api.travelpayouts.com";

/**
 * "city-directions" : le vol le moins cher vers CHAQUE destination au départ d'un aéroport.
 * Idéal pour "des deals depuis GVA/ZRH/BSL vers n'importe où".
 * Doc: https://support.travelpayouts.com/hc/en-us/articles/203956163
 */
export async function cityDirections(origin: string): Promise<PriceEntry[]> {
  const url = new URL(`${BASE}/v1/city-directions`);
  url.searchParams.set("origin", origin);
  url.searchParams.set("currency", config.currency);
  url.searchParams.set("token", config.tpToken);

  const res = await fetch(url, {
    headers: { "X-Access-Token": config.tpToken, Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Travelpayouts HTTP ${res.status} (${origin}): ${await res.text()}`);
  }

  const json = (await res.json()) as CityDirectionsResponse;
  if (!json.success || json.data === undefined) {
    throw new Error(`Travelpayouts erreur (${origin}): ${json.error ?? "réponse inattendue"}`);
  }

  const foundAt = new Date().toISOString();
  return Object.values(json.data).map((d): PriceEntry => ({
    origin: d.origin,
    destination: d.destination,
    price: d.price,
    currency: config.currency,
    airline: d.airline,
    flightNumber: String(d.flight_number ?? ""),
    transfers: d.transfers ?? 0,
    departureAt: d.departure_at,
    returnAt: d.return_at ?? null,
    foundAt,
  }));
}
