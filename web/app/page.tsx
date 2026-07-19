import Link from "next/link";
import { getDeals } from "@/lib/db";
import { dealImage } from "@/lib/images";

export const dynamic = "force-dynamic";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-CH", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
}

export default function Home() {
  const deals = getDeals(18);

  return (
    <div>
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-lg font-bold">✈️ SkyFlyDrop</span>
        <Link
          href="/alerts"
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
        >
          Créer une alerte
        </Link>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-indigo-700 to-slate-900" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Envole-toi pour moins cher.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-sky-100">
            Les meilleurs prix de vols au départ de <b>Genève, Zurich &amp; Bâle</b>, mis à jour
            en continu.
          </p>
          <Link
            href="/alerts"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-semibold text-slate-900 shadow-lg transition hover:bg-sky-50"
          >
            Recevoir les deals par email →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-6 text-2xl font-bold">🔥 Les deals du moment</h2>

        {deals.length === 0 ? (
          <p className="text-neutral-400">Les deals arrivent… reviens dans quelques minutes.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((d) => (
              <a
                key={`${d.origin}-${d.destination}`}
                href={d.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 transition hover:border-neutral-600"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dealImage(d.destinationName, d.destination)}
                    alt={d.destinationName}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute right-3 top-3 rounded-full bg-sky-500 px-3 py-1 text-sm font-bold text-white shadow">
                    {Math.round(d.price)} {d.currency.toUpperCase()}
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="text-xl font-bold leading-tight">{d.destinationName}</div>
                    <div className="text-xs text-white/70">
                      depuis {d.originName} ({d.origin})
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-sm text-neutral-400">
                  <span>
                    📅 {fmtDate(d.departureAt)}
                    {d.returnAt !== null ? ` – ${fmtDate(d.returnAt)}` : ""}
                  </span>
                  <span>
                    {d.transfers === 0
                      ? "Direct"
                      : `${d.transfers} escale${d.transfers > 1 ? "s" : ""}`}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto mb-16 max-w-4xl px-6">
        <div className="rounded-3xl bg-gradient-to-r from-sky-600 to-indigo-600 px-8 py-10 text-center">
          <h3 className="text-2xl font-bold">Ne rate plus jamais un bon plan</h3>
          <p className="mt-2 text-sky-100">
            Choisis tes critères, on t&apos;alerte dès qu&apos;un deal tombe.
          </p>
          <Link
            href="/alerts"
            className="mt-6 inline-block rounded-full bg-white px-8 py-3 font-semibold text-slate-900 transition hover:bg-sky-50"
          >
            Créer mon alerte gratuite
          </Link>
        </div>
      </section>

      <footer className="pb-10 text-center text-xs text-neutral-600">
        SkyFlyDrop · deals de vols au départ de Suisse · prix indicatifs via Aviasales
      </footer>
    </div>
  );
}
