import { NextResponse } from "next/server";
import { upsertSubscriber } from "@/lib/db";
import { ORIGIN_CODES, REGION_CODES, CABIN_CODES, type CabinCode } from "@/lib/catalog";

function isEmail(v: unknown): v is string {
  return typeof v === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim());
}

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  if (!isEmail(b.email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }
  const email = b.email.trim().toLowerCase();

  const origins = Array.isArray(b.origins)
    ? b.origins.filter((x): x is string => typeof x === "string" && ORIGIN_CODES.includes(x))
    : [];
  if (origins.length === 0) {
    return NextResponse.json(
      { error: "Choisis au moins un aéroport de départ." },
      { status: 400 },
    );
  }

  const regions = Array.isArray(b.regions)
    ? b.regions.filter((x): x is string => typeof x === "string" && REGION_CODES.includes(x))
    : [];

  const cabin: CabinCode =
    typeof b.cabin === "string" && CABIN_CODES.includes(b.cabin) ? (b.cabin as CabinCode) : "any";

  const maxPrice =
    typeof b.maxPrice === "number" && Number.isFinite(b.maxPrice) && b.maxPrice > 0
      ? Math.round(b.maxPrice)
      : null;

  const directOnly = b.directOnly === true;

  try {
    upsertSubscriber({ email, origins, maxPrice, regions, cabin, directOnly });
  } catch {
    return NextResponse.json({ error: "Erreur d'enregistrement." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
