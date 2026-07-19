import { config, dryRun } from "./config.js";

interface TelegramResponse {
  ok: boolean;
  description?: string;
}

/** Poste sur le canal. Sans token -> DRY-RUN (log console). */
export async function postMessage(html: string): Promise<void> {
  if (dryRun) {
    console.log("\n--- [DRY-RUN] message Telegram ---\n" + html + "\n----------------------------------\n");
    return;
  }

  const url = `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: config.telegram.channel,
      text: html,
      parse_mode: "HTML",
      disable_web_page_preview: false,
    }),
  });

  const json = (await res.json()) as TelegramResponse;
  if (!res.ok || !json.ok) {
    throw new Error(`Telegram: ${json.description ?? res.status}`);
  }
}
