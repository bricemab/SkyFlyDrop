# SkyFlyDrop ✈️

Détecteur de deals de vols au départ de Suisse → poste automatiquement sur Telegram
avec des liens affiliés **Travelpayouts** (tu touches une commission à chaque réservation).

## Comment ça marche

```
cron → API Travelpayouts (prix les moins chers depuis GVA/ZRH/BSL vers partout)
     → détection deal (plafond région + remise vs médiane historique)
     → construit le lien affilié (ton marker) → poste sur Telegram
```

- **Source unique** : Aviasales/Travelpayouts pour la détection ET le lien → prix cohérent.
- **Anti-doublon** : un deal n'est posté qu'une fois (`data/store.json`).
- **Baseline** : chaque run enregistre les prix → la détection par remise s'améliore avec le temps.

## Lancer en local

```bash
npm install
npm run scan      # un seul scan (mode --once)
npm start         # service : scan puis répétition toutes les 6h
npm run typecheck # vérifie les types
```

Sans `TG_BOT_TOKEN` dans `.env` → **DRY-RUN** : les deals sont affichés en console, rien n'est posté.

## Config (`.env`)

| Variable | Rôle |
|---|---|
| `TP_TOKEN` | Token API Travelpayouts |
| `TP_MARKER` | Ton ID partenaire (marker) → dans chaque lien |
| `ORIGINS` | Aéroports de départ surveillés (IATA) |
| `CURRENCY` | Devise (chf) |
| `TG_BOT_TOKEN` | Token du bot Telegram (@BotFather) — vide = dry-run |
| `TG_CHANNEL` | @handle du canal |
| `DISCOUNT_THRESHOLD` | Remise mini vs médiane pour déclencher (0.35 = −35%) |
| `MIN_HISTORY` | Nb de prix mini avant d'utiliser la détection par remise |

Seuils cold-start par région : `src/regions.ts`.

## Reste à faire pour passer LIVE

1. **Créer le bot** : `@BotFather` → `/newbot` → copier le token dans `TG_BOT_TOKEN`.
2. **Ajouter le bot admin** du canal `@SkyFlyDrop_com` (droit "poster").
3. **Déployer sur le VPS** (Infomaniak) : `git pull`, `npm ci`, `npm start` sous `pm2` ou un service systemd + cron.

## Sécurité

- `.env` et la clé SSH (`bricemab_ssh_vps`) sont **gitignorés** — ne jamais committer.
- Si le token a fuité, régénère-le sur Travelpayouts.
