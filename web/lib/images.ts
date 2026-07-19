/** Photo de destination (LoremFlickr, mot-clé = ville, stable via lock). */
export function dealImage(cityName: string, seed: string): string {
  const first = cityName.split(" ")[0] ?? "travel";
  const kw = encodeURIComponent(first.length > 0 ? first : "travel");
  let h = 7;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) | 0;
  const lock = Math.abs(h) % 1000;
  return `https://loremflickr.com/800/520/${kw}?lock=${lock}`;
}
