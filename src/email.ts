import { config } from "./config.js";
import type { Deal } from "./types.js";
import { cityName } from "./airports.js";

function renderEmail(deal: Deal): string {
  const price = `${Math.round(deal.price)} ${deal.currency.toUpperCase()}`;
  const route = `${cityName(deal.origin)} (${deal.origin}) → ${cityName(deal.destination)} (${deal.destination})`;
  const trip = deal.returnAt !== null ? "aller-retour" : "aller simple";
  const stops = deal.transfers === 0 ? "direct" : `${deal.transfers} escale(s)`;
  return `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:480px;margin:auto;padding:8px">
    <h2 style="margin:0 0 4px">✈️ ${route}</h2>
    <p style="font-size:22px;font-weight:700;margin:8px 0">${price}
      <span style="font-size:14px;font-weight:400;color:#666"> · ${trip} · ${stops}</span></p>
    <p style="color:#444;margin:4px 0">${deal.airline}</p>
    <a href="${deal.affiliateUrl}" style="display:inline-block;margin-top:12px;background:#0ea5e9;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600">Voir le vol →</a>
    <p style="color:#999;font-size:12px;margin-top:24px">SkyFlyDrop · tu reçois cet email car tu as créé une alerte.</p>
  </div>`;
}

/** Envoie une alerte deal par email (dry-run si pas de clé Resend). */
export async function sendDealEmail(to: string, deal: Deal): Promise<void> {
  const subject = `✈️ ${cityName(deal.origin)} → ${cityName(deal.destination)} — ${Math.round(deal.price)} ${deal.currency.toUpperCase()}`;

  if (config.resendApiKey === "") {
    console.log(`  [DRY-RUN email] -> ${to} : ${subject}`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: config.emailFrom, to, subject, html: renderEmail(deal) }),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}
