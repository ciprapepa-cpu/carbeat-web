import type {
  PersonType,
  PersonDataFO,
  PersonDataPO,
  LegalRegime,
  PaymentMethod,
  VehicleOrigin,
} from "@/types/contract";

export function detectLegalRegime(
  sellerType: PersonType,
  buyerType: PersonType
): LegalRegime {
  if ((sellerType === "po" || sellerType === "osvc") && buyerType === "fo") return "B2C";
  if (sellerType === "fo" && (buyerType === "po" || buyerType === "osvc")) return "C2B";
  if ((sellerType === "po" || sellerType === "osvc") && (buyerType === "po" || buyerType === "osvc")) return "B2B";
  return "C2C";
}

export function getRegimeNote(regime: LegalRegime): string {
  switch (regime) {
    case "C2C": return "Neaplikuje se spotřebitelská ochrana. Důkazní břemeno vad nese kupující.";
    case "B2C": return "Aplikuje se spotřebitelská ochrana (§ 2158+ OZ). Důkazní břemeno nese prodávající.";
    case "C2B": return "Bez spotřebitelské ochrany. Kupující je profesionál.";
    case "B2B": return "Bez spotřebitelské ochrany. Obchodní závazkový vztah.";
  }
}

export function validatePayment(
  price: number,
  method: PaymentMethod,
  hotovostAmount?: number
): { valid: boolean; warning?: string } {
  const amount = hotovostAmount ?? (method === "hotovost" ? price : 0);
  if (amount > 270000) {
    return {
      valid: false,
      warning: `Hotovostní platba ${formatCurrency(amount)} překračuje zákonný limit 270 000 Kč (zák. č. 254/2004 Sb.).`,
    };
  }
  return { valid: true };
}

export function getDefaultDeclarations(origin: VehicleOrigin): Record<string, boolean> {
  const defaults: Record<string, boolean> = { a: true, b: true, c: true, d: true, f: true };
  if (origin === "de_import" || origin === "eu_import") defaults.h = true;
  return defaults;
}

export function parseCarName(name: string): { brand: string; model: string } {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return { brand: parts[0], model: parts.slice(1).join(" ") };
  return { brand: name, model: "" };
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("cs-CZ")} Kč`;
}

/* --- Číslo na slova (česky) --- */

const ONES = ["","jedna","dva","tři","čtyři","pět","šest","sedm","osm","devět","deset","jedenáct","dvanáct","třináct","čtrnáct","patnáct","šestnáct","sedmnáct","osmnáct","devatenáct"];
const TENS = ["","","dvacet","třicet","čtyřicet","padesát","šedesát","sedmdesát","osmdesát","devadesát"];
const HUNDREDS = ["","jednosto","dvěstě","třista","čtyřista","pětset","šestset","sedmset","osmset","devětset"];

function thousandForm(n: number): string { return n >= 2 && n <= 4 ? "tisíce" : "tisíc"; }
function millionForm(n: number): string { if (n === 1) return "milion"; return n >= 2 && n <= 4 ? "miliony" : "milionů"; }

function convertHundreds(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  const ten = Math.floor(n / 10), one = n % 10, h = Math.floor(n / 100), rest = n % 100;
  if (n < 100) return one === 0 ? TENS[ten] : `${TENS[ten]}${ONES[one]}`;
  return `${HUNDREDS[h]}${rest === 0 ? "" : convertHundreds(rest)}`;
}

export function numberToWords(n: number): string {
  if (n === 0) return "nula korun českých";
  const millions = Math.floor(n / 1000000), thousands = Math.floor((n % 1000000) / 1000), rest = n % 1000;
  const parts: string[] = [];
  if (millions > 0) parts.push(millions === 1 ? "jeden milion" : `${convertHundreds(millions)} ${millionForm(millions)}`);
  if (thousands > 0) parts.push(thousands === 1 ? "tisíc" : `${convertHundreds(thousands)} ${thousandForm(thousands)}`);
  if (rest > 0) parts.push(convertHundreds(rest));
  return `${parts.join(" ")} korun českých`;
}

/* --- Seller presets --- */

export const PRESET_JOSEF_CIPRA: PersonDataFO = {
  type: "fo",
  jmeno_prijmeni: "Josef Cipra",
  datum_narozeni: "1986-04-01",
  trvale_bydliste: "Svinišťany 63, Dolany, 552 01",
  cislo_op: "219186351",
};

export const PRESET_CARBEAT: PersonDataPO = {
  type: "po",
  nazev_firmy: "CarBeat s.r.o.",
  sidlo: "Svinišťany 63, Dolany, 552 01",
  ico: "19856873",
  dic: "CZ19856873",
  zapis_or: "Krajský soud v Hradci Králové, sp. zn. C 51924",
  jednajici_osoba: "Josef Cipra",
  jednajici_funkce: "jednatel",
  jednajici_opravneni: "",
  jednajici_op: "",
};
