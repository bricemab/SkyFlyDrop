import "dotenv/config";

function required(name: string): string {
  const v = process.env[name];
  if (v === undefined || v.trim() === "") {
    throw new Error(`Variable d'environnement manquante: ${name} (voir .env)`);
  }
  return v.trim();
}

function optional(name: string, fallback: string): string {
  const v = process.env[name];
  return v !== undefined && v.trim() !== "" ? v.trim() : fallback;
}

export const config = {
  tpToken: required("TP_TOKEN"),
  tpMarker: required("TP_MARKER"),
  currency: optional("CURRENCY", "chf").toLowerCase(),
  origins: optional("ORIGINS", "GVA,ZRH,BSL")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter((s) => s.length > 0),
  telegram: {
    botToken: (process.env.TG_BOT_TOKEN ?? "").trim(),
    channel: optional("TG_CHANNEL", "@SkyFlyDrop_com"),
  },
  scanEveryHours: Math.max(1, Number(optional("SCAN_EVERY_HOURS", "6"))),
  discountThreshold: Number(optional("DISCOUNT_THRESHOLD", "0.35")),
  minHistory: Math.max(1, Number(optional("MIN_HISTORY", "5"))),
} as const;

/** Sans token Telegram -> on n'envoie rien, on logue (mode test). */
export const dryRun: boolean = config.telegram.botToken === "";
