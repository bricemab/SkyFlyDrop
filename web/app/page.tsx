import Link from "next/link";
import { Plane, CalendarDays, ArrowRight, Bell, MapPin } from "lucide-react";
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
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#070a12]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2 font-display text-lg font-bold">
            <Plane className="h-5 w-5 text-cyan-400" /> SkyFlyDrop
          </span>
          <Link
            href="/alerts"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:border-cyan-400/50 hover:bg-white/10"
          >
            <Bell className="h-4 w-4 text-cyan-400" /> Créer une alerte
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
          Départs Genève · Zurich · Bâle
        </span>
        <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
          Envole-toi{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
            pour moins cher.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
          Les meilleurs prix de vols au départ de Suisse, mis à jour en continu. Reçois-les
          selon tes critères.
        </p>
        <Link
          href="/alerts"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-8 py-3.5 font-semibold text-slate-950 shadow-[0_0_40px_-5px_rgba(34,211,238,0.55)] transition hover:brightness-110"
        >
          Recevoir les deals par email <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-6 font-display text-2xl font-bold">Les deals du moment</h2>

        {deals.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center text-white/50 backdrop-blur-xl">
            Les deals arrivent… reviens dans quelques minutes.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((d) => (
              <a
                key={`${d.origin}-${d.destination}`}
                href={d.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_60px_-15px_rgba(34,211,238,0.25)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dealImage(d.destinationName, d.destination)}
                    alt={`Vol vers ${d.destinationName}`}
                    className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-[#070a12]/30 to-transparent" />
                  <div className="tnum absolute right-3 top-3 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-3 py-1 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                    {Math.round(d.price)} {d.currency.toUpperCase()}
                  </div>
                  <div className="absolute inset-x-4 bottom-3">
                    <div className="font-display text-2xl font-bold leading-tight">
                      {d.destinationName}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-white/60">
                      <MapPin className="h-3 w-3" /> depuis {d.originName} ({d.origin})
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-sm text-white/60">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    {fmtDate(d.departureAt)}
                    {d.returnAt !== null ? `–${fmtDate(d.returnAt)}` : ""}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Plane className="h-4 w-4" />
                    {d.transfers === 0 ? "Direct" : `${d.transfers} esc.`}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto mb-20 max-w-4xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center backdrop-blur-xl">
          <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/20 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-violet-500/20 blur-[80px]" />
          <div className="relative">
            <h3 className="font-display text-3xl font-bold">Ne rate plus jamais un bon plan</h3>
            <p className="mx-auto mt-3 max-w-md text-white/60">
              Choisis tes critères, on t&apos;alerte dès qu&apos;un deal tombe.
            </p>
            <Link
              href="/alerts"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-8 py-3.5 font-semibold text-slate-950 shadow-[0_0_30px_-5px_rgba(34,211,238,0.5)] transition hover:brightness-110"
            >
              Créer mon alerte gratuite <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-white/40">
        SkyFlyDrop · deals de vols au départ de Suisse · prix indicatifs via Aviasales
      </footer>
    </div>
  );
}
