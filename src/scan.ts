import { setTimeout as sleep } from "node:timers/promises";
import { config } from "./config.js";
import { cityDirections } from "./travelpayouts.js";
import { evaluate, dealKey, routeKey } from "./deals.js";
import { recordPrice, isSeen, markSeen } from "./store.js";
import { formatDeal } from "./format.js";
import { postMessage } from "./telegram.js";
import { ensureCatalog } from "./airports.js";
import { activeSubscribers, alreadySent, markSent } from "./db.js";
import { matches } from "./match.js";
import { sendDealEmail } from "./email.js";
import type { PriceEntry } from "./types.js";

export async function runScan(): Promise<void> {
  console.log(`[${new Date().toISOString()}] scan · origines=${config.origins.join(",")}`);
  await ensureCatalog();
  const subscribers = activeSubscribers();
  let candidates = 0;
  let posted = 0;
  let emailed = 0;

  for (const origin of config.origins) {
    let entries: PriceEntry[];
    try {
      entries = await cityDirections(origin);
    } catch (err) {
      console.error(`  ${origin}: échec API —`, err instanceof Error ? err.message : err);
      continue;
    }
    console.log(`  ${origin}: ${entries.length} destinations`);

    for (const e of entries) {
      await recordPrice(routeKey(e), e.price);

      const deal = await evaluate(e);
      if (deal === null) continue;
      candidates++;

      const key = dealKey(e);

      // 1) canal broadcast (dédup via store.json)
      if (!(await isSeen(key))) {
        try {
          await postMessage(formatDeal(deal));
          await markSeen(key);
          posted++;
          await sleep(1200); // throttle Telegram (~1 msg/s par canal)
        } catch (err) {
          console.error(`  post échoué ${key}:`, err instanceof Error ? err.message : err);
        }
      }

      // 2) alertes email perso (dédup par abonné)
      for (const sub of subscribers) {
        if (!matches(deal, sub)) continue;
        if (alreadySent(sub.id, key)) continue;
        try {
          await sendDealEmail(sub.email, deal);
          markSent(sub.id, key);
          emailed++;
        } catch (err) {
          console.error(`  email ${sub.email} échoué:`, err instanceof Error ? err.message : err);
        }
      }
    }
  }

  console.log(
    `scan terminé · candidats=${candidates} · postés=${posted} · emails=${emailed} · abonnés=${subscribers.length}`,
  );
}
