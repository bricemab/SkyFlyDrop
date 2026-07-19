import type { Deal } from "./types.js";
import type { Subscriber } from "./db.js";

// EAP (EuroAirport Bâle-Mulhouse) et BSL = même aéroport côté utilisateur
function originMatches(dealOrigin: string, subOrigins: string[]): boolean {
  if (subOrigins.includes(dealOrigin)) return true;
  if (dealOrigin === "EAP" && subOrigins.includes("BSL")) return true;
  if (dealOrigin === "BSL" && subOrigins.includes("EAP")) return true;
  return false;
}

/** Un deal correspond-il aux critères d'un abonné ? */
export function matches(deal: Deal, sub: Subscriber): boolean {
  if (!originMatches(deal.origin, sub.origins)) return false;
  if (sub.regions.length > 0 && !sub.regions.includes(deal.region)) return false;
  if (sub.maxPrice !== null && deal.price > sub.maxPrice) return false;
  if (sub.directOnly && deal.transfers !== 0) return false;
  // les deals actuels sont en économie -> un abonné "business only" n'a pas encore de match
  if (sub.cabin === "business") return false;
  return true;
}
