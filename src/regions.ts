import type { Region } from "./types.js";

/**
 * Carte IATA -> région. Couvre les destinations courantes au départ de Suisse/Europe.
 * Une destination inconnue tombe en "unknown" (plafond par défaut + détection par historique).
 */
const IATA_REGION: Record<string, Region> = {
  // Europe (inclut Canaries / îles méditerranéennes)
  LIS: "europe", OPO: "europe", MAD: "europe", BCN: "europe", AGP: "europe",
  VLC: "europe", SVQ: "europe", PMI: "europe", IBZ: "europe", FCO: "europe",
  MXP: "europe", LIN: "europe", VCE: "europe", NAP: "europe", CTA: "europe",
  BLQ: "europe", BRI: "europe", CDG: "europe", ORY: "europe", NCE: "europe",
  LYS: "europe", MRS: "europe", TLS: "europe", BOD: "europe", NTE: "europe",
  LHR: "europe", LGW: "europe", STN: "europe", LTN: "europe", MAN: "europe",
  EDI: "europe", DUB: "europe", AMS: "europe", BRU: "europe", CRL: "europe",
  CGN: "europe", DUS: "europe", FRA: "europe", MUC: "europe", BER: "europe",
  HAM: "europe", STR: "europe", VIE: "europe", PRG: "europe", BUD: "europe",
  WAW: "europe", KRK: "europe", ATH: "europe", JMK: "europe", JTR: "europe",
  HER: "europe", RHO: "europe", CFU: "europe", CPH: "europe", ARN: "europe",
  OSL: "europe", HEL: "europe", KEF: "europe", ZAG: "europe", SPU: "europe",
  DBV: "europe", TIA: "europe", SOF: "europe", OTP: "europe", LPA: "europe",
  TFS: "europe", ACE: "europe", FUE: "europe", MAH: "europe", FAO: "europe",

  // Afrique du Nord
  RAK: "north_africa", CMN: "north_africa", AGA: "north_africa", FEZ: "north_africa",
  TNG: "north_africa", TUN: "north_africa", DJE: "north_africa", MIR: "north_africa",
  NBE: "north_africa", CAI: "north_africa", HRG: "north_africa", SSH: "north_africa",
  RMF: "north_africa",

  // Moyen-Orient (+ Turquie)
  DXB: "middle_east", AUH: "middle_east", DOH: "middle_east", RUH: "middle_east",
  JED: "middle_east", BAH: "middle_east", KWI: "middle_east", MCT: "middle_east",
  AMM: "middle_east", BEY: "middle_east", TLV: "middle_east", IST: "middle_east",
  SAW: "middle_east", AYT: "middle_east",

  // Asie
  BKK: "asia", HKT: "asia", USM: "asia", DMK: "asia", DPS: "asia", CGK: "asia",
  SIN: "asia", KUL: "asia", BOM: "asia", DEL: "asia", MAA: "asia", CMB: "asia",
  HAN: "asia", SGN: "asia", REP: "asia", PNH: "asia", HKG: "asia", TPE: "asia",
  ICN: "asia", NRT: "asia", HND: "asia", KIX: "asia", PEK: "asia", PVG: "asia",
  CAN: "asia", MNL: "asia", CEB: "asia",

  // Océan Indien
  MRU: "indian_ocean", SEZ: "indian_ocean", MLE: "indian_ocean", RUN: "indian_ocean",

  // Amérique du Nord (+ Mexique / Caraïbes)
  JFK: "north_america", EWR: "north_america", BOS: "north_america", IAD: "north_america",
  LAX: "north_america", SFO: "north_america", LAS: "north_america", MIA: "north_america",
  ORD: "north_america", ATL: "north_america", YUL: "north_america", YYZ: "north_america",
  YVR: "north_america", CUN: "north_america", PUJ: "north_america", HAV: "north_america",
  MBJ: "north_america", SJU: "north_america",

  // Amérique du Sud
  GRU: "south_america", GIG: "south_america", EZE: "south_america", SCL: "south_america",
  LIM: "south_america", BOG: "south_america", MDE: "south_america", UIO: "south_america",

  // Afrique subsaharienne
  JNB: "africa", CPT: "africa", NBO: "africa", DAR: "africa", ZNZ: "africa",
  ACC: "africa", LOS: "africa", DKR: "africa", ADD: "africa", ABJ: "africa",

  // Océanie
  SYD: "oceania", MEL: "oceania", BNE: "oceania", AKL: "oceania", NAN: "oceania",
};

/** Plafond "bon prix" par région (économie, CHF). Cold-start : déclenche sans historique. */
const REGION_MAX_ECONOMY: Record<Region, number> = {
  europe: 39,
  north_africa: 79,
  middle_east: 199,
  asia: 349,
  indian_ocean: 449,
  north_america: 299,
  south_america: 499,
  africa: 399,
  oceania: 699,
  unknown: 199,
};

export function regionOf(iata: string): Region {
  return IATA_REGION[iata] ?? "unknown";
}

export function coldStartCeiling(region: Region): number {
  return REGION_MAX_ECONOMY[region];
}
