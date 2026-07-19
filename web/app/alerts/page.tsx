"use client";

import { useState } from "react";
import Link from "next/link";
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
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-900/60 p-10 text-center">
          <div className="text-6xl">🎉</div>
          <h1 className="mt-4 text-2xl font-bold">C&apos;est fait !</h1>
          <p className="mt-3 text-neutral-400">
            Tu recevras les deals qui matchent tes critères sur{" "}
            <b className="text-neutral-100">{email}</b>.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
          >
            ← Voir les deals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-sky-600 via-indigo-700 to-slate-900">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Link href="/" className="text-sm text-sky-100/80 transition hover:text-white">
            ← SkyFlyDrop
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Crée ton alerte</h1>
          <p className="mt-2 max-w-lg text-sky-100">
            Dis-nous ce que tu cherches, on t&apos;envoie les deals qui matchent — gratuit, sans
            spam.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-10 lg:grid-cols-[1.4fr_1fr]">
        <form
          onSubmit={submit}
          className="space-y-7 rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8"
        >
          <Field label="Ton email" icon="📧">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="toi@exemple.ch"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800/50 px-4 py-3 text-white placeholder-neutral-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </Field>

          <Field label="Aéroport(s) de départ" icon="🛫">
            <Chips items={ORIGINS} selected={origins} onToggle={(c) => toggle(origins, setOrigins, c)} />
          </Field>

          <Field label="Destinations" icon="🌍" hint="vide = partout">
            <Chips items={REGIONS} selected={regions} onToggle={(c) => toggle(regions, setRegions, c)} />
          </Field>

          <Field label="Cabine" icon="💺">
            <Chips items={CABINS} selected={[cabin]} onToggle={(c) => setCabin(c as CabinCode)} />
          </Field>

          <Field label="Budget max" icon="💸" hint="CHF, optionnel">
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="ex. 400"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800/50 px-4 py-3 text-white placeholder-neutral-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </Field>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-neutral-300">
            <input
              type="checkbox"
              checked={directOnly}
              onChange={(e) => setDirectOnly(e.target.checked)}
              className="h-5 w-5 rounded border-neutral-700 bg-neutral-800 accent-sky-500"
            />
            Vols directs uniquement
          </label>

          {status === "error" && (
            <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{message}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 py-3.5 font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-400 disabled:opacity-50"
          >
            {status === "loading" ? "…" : "Activer mon alerte"}
          </button>
        </form>

        <aside className="hidden lg:block">
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6">
            <h3 className="font-semibold text-neutral-100">Pourquoi SkyFlyDrop&nbsp;?</h3>
            <ul className="mt-4 space-y-3 text-sm text-neutral-300">
              <li className="flex gap-3">
                <span>⚡</span> Alerté avant que le deal disparaisse
              </li>
              <li className="flex gap-3">
                <span>🎯</span> Uniquement ce qui matche TES critères
              </li>
              <li className="flex gap-3">
                <span>🇨🇭</span> Départs Genève, Zurich, Bâle
              </li>
              <li className="flex gap-3">
                <span>🆓</span> Gratuit, désinscription en 1 clic
              </li>
            </ul>

            <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-800">
              <div className="relative aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://loremflickr.com/600/450/bali?lock=42"
                  alt="exemple"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute right-3 top-3 rounded-full bg-sky-500 px-3 py-1 text-xs font-bold text-white">
                  420 CHF
                </div>
                <div className="absolute bottom-3 left-4">
                  <div className="font-bold">Bali</div>
                  <div className="text-xs text-white/70">exemple d&apos;alerte</div>
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
  icon?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-200">
        {icon !== undefined && <span>{icon}</span>}
        {label}
        {hint !== undefined && <span className="text-xs font-normal text-neutral-500">· {hint}</span>}
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
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
              on
                ? "border-sky-400 bg-sky-500/20 text-sky-100 shadow-sm shadow-sky-500/20"
                : "border-neutral-700 bg-neutral-800/50 text-neutral-300 hover:border-neutral-500 hover:text-white"
            }`}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
