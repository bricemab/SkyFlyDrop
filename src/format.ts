import type { Deal, Region } from "./types.js";
import { cityName, countryFlag } from "./airports.js";

const REGION_EMOJI: Record<Region, string> = {
  europe: "🇪🇺",
  north_africa: "🌍",
  middle_east: "🕌",
  asia: "🌏",
  indian_ocean: "🏝️",
  north_america: "🗽",
  south_america: "🌎",
  africa: "🦁",
  oceania: "🦘",
  unknown: "✈️",
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-CH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function tripNights(d: Deal): number | null {
  if (d.returnAt === null) return null;
  const ms = new Date(d.returnAt).getTime() - new Date(d.departureAt).getTime();
  const nights = Math.round(ms / 86_400_000);
  return nights > 0 ? nights : null;
}

/** Message HTML prêt pour l'API Telegram. */
export function formatDeal(d: Deal): string {
  const flag = countryFlag(d.destination) || REGION_EMOJI[d.region];
  const price = `${Math.round(d.price)} ${d.currency.toUpperCase()}`;
  const trip = d.returnAt !== null ? "aller-retour" : "aller simple";
  const stops =
    d.transfers === 0 ? "direct" : `${d.transfers} escale${d.transfers > 1 ? "s" : ""}`;
  const nights = tripNights(d);
  const nightsTxt = nights !== null ? ` · ${nights} nuit${nights > 1 ? "s" : ""}` : "";
  const dates =
    d.returnAt !== null
      ? `${fmtDate(d.departureAt)} → ${fmtDate(d.returnAt)}`
      : fmtDate(d.departureAt);
  const disc =
    d.discountPct !== null ? ` <b>(−${Math.round(d.discountPct * 100)}%)</b>` : "";

  return [
    `${flag} <b>${cityName(d.origin)} (${d.origin}) → ${cityName(d.destination)} (${d.destination})</b>`,
    ``,
    `💸 <b>${price}</b>${disc} · ${trip} · ${stops}${nightsTxt}`,
    `📅 ${dates}`,
    `✈️ ${d.airline}`,
    ``,
    `👉 <a href="${d.affiliateUrl}">Voir le vol</a>`,
  ].join("\n");
}
