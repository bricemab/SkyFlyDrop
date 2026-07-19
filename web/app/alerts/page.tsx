"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Mail,
  PlaneTakeoff,
  Globe2,
  Armchair,
  Wallet,
  PartyPopper,
  Zap,
  Target,
  ArrowLeft,
} from "lucide-react";
import { ORIGINS, REGIONS, CABINS, type CabinCode } from "@/lib/catalog";

type Status = "idle" | "loading" | "done" | "error";

export default function AlertsPage() {
  const [email, setEmail] = useState("");
  const [origins, setOrigins] = useState<string[]>(["GVA"]);
  const [regions, setRegions] = useState<string[]>([]);
  const [cabin, setCabin] = useState<CabinCode>("any");
  const [maxPrice, setMaxPrice] = useState("");
  const [directOnly, setDirectOnly] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  function toggle(list: string[], set: (v: string[]) => void, code: string): void {
    set(list.includes(code) ? list.filter((c) => c !== code) : [...list, code]);
  }

  async function submit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          origins,
          regions,
          cabin,
          maxPrice: maxPrice ? Number(maxPrice) : null,
          directOnly,
        }),
      });
      const data: { ok?: boolean; error?: string } = await res.json();
      if (!res.ok || data.ok !== true) {
        setStatus("error");
        setMessage(data.error ?? "Une erreur est survenue.");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setMessage("Réseau indisponible.");
    }
  }

  if (status === "done") {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center backdrop-blur-xl">
          <PartyPopper className="mx-auto h-12 w-12 text-cyan-400" />
          <h1 className="mt-4 font-display text-2xl font-bold">C&apos;est fait&nbsp;!</h1>
          <p className="mt-3 text-white/60">
            Tu recevras les deals qui matchent tes critères sur{" "}
            <b className="text-white">{email}</b>.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110"
          >
            <ArrowLeft className="h-4 w-4" /> Voir les deals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-5xl px-6 pb-6 pt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> SkyFlyDrop
        </Link>
        <h1 className="mt-5 font-display text-4xl font-bold tracking-tight">Crée ton alerte</h1>
        <p className="mt-2 max-w-lg text-white/60">
          Dis-nous ce que tu cherches, on t&apos;envoie les deals qui matchent — gratuit, sans
          spam.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 px-6 pb-16 lg:grid-cols-[1.4fr_1fr]">
        <form
          onSubmit={submit}
          className="space-y-7 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8"
        >
          <Field label="Ton email" icon={<Mail className="h-4 w-4 text-cyan-400" />}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="toi@exemple.ch"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none backdrop-blur transition focus:border-cyan-400/60 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/20"
            />
          </Field>

          <Field
            label="Aéroport(s) de départ"
            icon={<PlaneTakeoff className="h-4 w-4 text-cyan-400" />}
          >
            <Chips items={ORIGINS} selected={origins} onToggle={(c) => toggle(origins, setOrigins, c)} />
          </Field>

          <Field
            label="Destinations"
            hint="vide = partout"
            icon={<Globe2 className="h-4 w-4 text-cyan-400" />}
          >
            <Chips items={REGIONS} selected={regions} onToggle={(c) => toggle(regions, setRegions, c)} />
          </Field>

          <Field label="Cabine" icon={<Armchair className="h-4 w-4 text-cyan-400" />}>
            <Chips items={CABINS} selected={[cabin]} onToggle={(c) => setCabin(c as CabinCode)} />
          </Field>

          <Field
            label="Budget max"
            hint="CHF, optionnel"
            icon={<Wallet className="h-4 w-4 text-cyan-400" />}
          >
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="ex. 400"
              className="tnum w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none backdrop-blur transition focus:border-cyan-400/60 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/20"
            />
          </Field>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-white/70">
            <input
              type="checkbox"
              checked={directOnly}
              onChange={(e) => setDirectOnly(e.target.checked)}
              className="h-5 w-5 rounded border-white/20 bg-white/5 accent-cyan-400"
            />
            Vols directs uniquement
          </label>

          {status === "error" && (
            <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 py-3.5 font-semibold text-slate-950 shadow-[0_0_30px_-5px_rgba(34,211,238,0.5)] transition hover:brightness-110 disabled:opacity-50"
          >
            {status === "loading" ? "…" : "Activer mon alerte"}
          </button>
        </form>

        <aside className="hidden lg:block">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <h3 className="font-display font-semibold text-white">Pourquoi SkyFlyDrop&nbsp;?</h3>
            <ul className="mt-4 space-y-4 text-sm text-white/70">
              <li className="flex gap-3">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" /> Alerté avant que le deal
                disparaisse
              </li>
              <li className="flex gap-3">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" /> Uniquement ce qui
                matche TES critères
              </li>
              <li className="flex gap-3">
                <PlaneTakeoff className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" /> Départs Genève,
                Zurich, Bâle
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" /> Gratuit, désinscription
                en 1 clic
              </li>
            </ul>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <div className="relative aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://loremflickr.com/600/450/bali?lock=42"
                  alt="Exemple de destination"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] to-transparent" />
                <div className="tnum absolute right-3 top-3 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-3 py-1 text-xs font-bold text-slate-950">
                  420 CHF
                </div>
                <div className="absolute bottom-3 left-4">
                  <div className="font-display font-bold">Bali</div>
                  <div className="text-xs text-white/60">exemple d&apos;alerte</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  hint,
  children,
}: {
  label: string;
  icon?: ReactNode;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/90">
        {icon}
        {label}
        {hint !== undefined && <span className="text-xs font-normal text-white/40">· {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function Chips({
  items,
  selected,
  onToggle,
}: {
  items: ReadonlyArray<{ readonly code: string; readonly label: string }>;
  selected: string[];
  onToggle: (code: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => {
        const on = selected.includes(it.code);
        return (
          <button
            type="button"
            key={it.code}
            onClick={() => onToggle(it.code)}
            className={`rounded-xl border px-4 py-2 text-sm font-medium backdrop-blur transition ${
              on
                ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-100 shadow-[0_0_16px_-4px_rgba(34,211,238,0.6)]"
                : "border-white/10 bg-white/5 text-white/70 hover:border-white/25 hover:text-white"
            }`}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
