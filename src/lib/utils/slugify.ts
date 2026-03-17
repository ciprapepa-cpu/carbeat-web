const CZECH_MAP: Record<string, string> = {
  á: "a", č: "c", ď: "d", é: "e", ě: "e", í: "i",
  ň: "n", ó: "o", ř: "r", š: "s", ť: "t", ú: "u",
  ů: "u", ý: "y", ž: "z",
  Á: "a", Č: "c", Ď: "d", É: "e", Ě: "e", Í: "i",
  Ň: "n", Ó: "o", Ř: "r", Š: "s", Ť: "t", Ú: "u",
  Ů: "u", Ý: "y", Ž: "z",
  ä: "a", ö: "o", ü: "u", ß: "ss",
  Ä: "a", Ö: "o", Ü: "u",
};

export function slugify(input: string): string {
  return input
    .split("")
    .map((ch) => CZECH_MAP[ch] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
