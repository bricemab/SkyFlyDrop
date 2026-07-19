import { config } from "./config.js";
import type { PriceEntry } from "./types.js";

function ddmm(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${day}${month}`;
}

/**
 * Lien de recherche Aviasales portant TON marker -> monétisé + ouvre le vol exact.
 * Format du chemin : ORIGINE + JJMM(aller) + DEST + [JJMM(retour)] + nbPax
 *   ex. aller-retour : GVA0210DXB09101
 *   ex. aller simple : GVA0210DXB1
 * La détection ET le lien viennent d'Aviasales -> prix cohérent (pas de décalage).
 */
export function buildFlightLink(e: PriceEntry): string {
  const out = ddmm(e.departureAt);
  const ret = e.returnAt !== null ? ddmm(e.returnAt) : "";
  const path = `${e.origin}${out}${e.destination}${ret}1`;

  const url = new URL(`https://www.aviasales.com/search/${path}`);
  url.searchParams.set("marker", config.tpMarker);
  url.searchParams.set("currency", config.currency);
  return url.toString();
}
