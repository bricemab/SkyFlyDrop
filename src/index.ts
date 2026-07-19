import cron from "node-cron";
import { config, dryRun } from "./config.js";
import { runScan } from "./scan.js";

const runOnce = process.argv.includes("--once");

async function main(): Promise<void> {
  console.log(
    `SkyFlyDrop · ${dryRun ? "DRY-RUN (pas de token Telegram)" : "LIVE"} · canal=${config.telegram.channel}`,
  );

  await runScan();
  if (runOnce) return;

  const expr = `0 */${config.scanEveryHours} * * *`;
  cron.schedule(expr, () => {
    void runScan();
  });
  console.log(`planifié : toutes les ${config.scanEveryHours}h (${expr}) · Ctrl+C pour arrêter`);
}

main().catch((err: unknown) => {
  console.error("fatal:", err);
  process.exit(1);
});
