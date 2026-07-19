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
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <div className="text-5xl">🎉</div>
        <h1 className="mt-4 text-2xl font-bold">C&apos;est fait !</h1>
        <p className="mt-3 text-neutral-400">
          Tu recevras les deals qui matchent tes critères sur{" "}
          <b className="text-neutral-200">{email}</b>.
        </p>
        <Link href="/" className="mt-8 inline-block text-sky-400 hover:underline">
          ← Retour à l&apos;accueil
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-12">
      <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-300">
        ← SkyFlyDrop
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Crée ton alerte</h1>
      <p className="mt-2 text-neutral-400">Reçois par email les deals qui te correspondent.</p>

      <form onSubmit={submit} className="mt-8 space-y-7">
        <Field label="Ton email">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="toi@exemple.ch"
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 outline-none focus:border-sky-500"
          />
        </Field>

        <Field label="Aéroport(s) de départ">
          <Chips items={ORIGINS} selected={origins} onToggle={(c) => toggle(origins, setOrigins, c)} />
        </Field>

        <Field label="Destinations (vide = partout)">
          <Chips items={REGIONS} selected={regions} onToggle={(c) => toggle(regions, setRegions, c)} />
        </Field>

        <Field label="Cabine">
          <Chips items={CABINS} selected={[cabin]} onToggle={(c) => setCabin(c as CabinCode)} />
        </Field>

        <Field label="Budget max (CHF, optionnel)">
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="ex. 400"
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 outline-none focus:border-sky-500"
          />
        </Field>

        <label className="flex items-center gap-3 text-sm text-neutral-300">
          <input
            type="checkbox"
            checked={directOnly}
            onChange={(e) => setDirectOnly(e.target.checked)}
            className="h-5 w-5 rounded border-neutral-700 bg-neutral-900"
          />
          Vols directs uniquement
        </label>

        {status === "error" && <p className="text-sm text-red-400">{message}</p>}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-xl bg-sky-500 py-3 font-semibold text-white transition hover:bg-sky-400 disabled:opacity-50"
        >
          {status === "loading" ? "…" : "Activer mon alerte"}
        </button>
      </form>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-300">{label}</label>
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
            className={`rounded-full border px-4 py-2 text-sm transition ${
              on
                ? "border-sky-500 bg-sky-500/20 text-sky-200"
                : "border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-500"
            }`}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
