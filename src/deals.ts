import { config } from "./config.js";
import type { Deal, PriceEntry } from "./types.js";
import { regionOf, coldStartCeiling } from "./regions.js";
import { buildFlightLink } from "./affiliate.js";
import { median, historyLength } from "./store.js";

export function routeKey(e: PriceEntry): string {
  return `${e.origin}-${e.destination}`;
}

/** Identifie un deal unique (route + mois de départ + prix) pour l'anti-doublon. */
export function dealKey(e: PriceEntry): string {
  const month = e.departureAt.slice(0, 7);
  return `${e.origin}-${e.destination}-${month}-${e.price}`;
}

/**
 * Deal si :
 *   - assez d'historique ET prix <= mediane * (1 - seuil)  (remise réelle), OU
 *   - prix <= plafond région (cold-start, marche sans historique).
 */
export async function evaluate(e: PriceEntry): Promise<Deal | null> {
  const region = regionOf(e.destination);
  const rk = routeKey(e);
  const ref = await median(rk);
  const n = await historyLength(rk);

  let deal = false;
  let discountPct: number | null = null;

  if (ref !== null && n >= config.minHistory && ref > 0) {
    discountPct = (ref - e.price) / ref;
    if (discountPct >= config.discountThreshold) deal = true;
  }

  if (e.price <= coldStartCeiling(region)) deal = true;

  if (!deal) return null;

  return {
    ...e,
    region,
    reference: ref,
    discountPct,
    affiliateUrl: buildFlightLink(e),
  };
}
