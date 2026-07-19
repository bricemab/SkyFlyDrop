import Link from "next/link";

const steps = [
  { icon: "🎯", title: "Tu choisis", text: "Départ, budget, destinations, cabine — tes critères à toi." },
  { icon: "🤖", title: "On surveille", text: "On scanne les prix au départ de Suisse en continu." },
  { icon: "📩", title: "Tu reçois", text: "Une alerte email dès qu'un vrai bon plan matche." },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <header className="text-center">
        <div className="text-5xl">✈️</div>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">SkyFlyDrop</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-400">
          Les meilleurs deals de vols au départ de Suisse —{" "}
          <span className="text-neutral-100">selon TES critères.</span>
        </p>
        <Link
          href="/alerts"
          className="mt-8 inline-block rounded-full bg-sky-500 px-8 py-3 font-semibold text-white transition hover:bg-sky-400"
        >
          Créer mon alerte gratuite →
        </Link>
        <p className="mt-3 text-sm text-neutral-500">Gratuit · Genève, Zurich, Bâle</p>
      </header>

      <section className="mt-20 grid gap-6 sm:grid-cols-3">
        {steps.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6"
          >
            <div className="text-2xl">{s.icon}</div>
            <h3 className="mt-3 font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-neutral-400">{s.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8 text-center">
        <p className="text-neutral-300">
          Un Genève → Bangkok à <span className="font-semibold text-sky-400">CHF 890</span> au
          lieu de 4200 ? Tu es prévenu <span className="text-neutral-100">avant que ça disparaisse.</span>
        </p>
        <Link
          href="/alerts"
          className="mt-6 inline-block rounded-full border border-neutral-700 px-6 py-2 text-sm font-medium hover:border-neutral-500"
        >
          Je crée mon alerte
        </Link>
      </section>

      <footer className="mt-20 text-center text-xs text-neutral-600">
        SkyFlyDrop · deals de vols au départ de Suisse
      </footer>
    </main>
  );
}
