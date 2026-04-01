export type VehicleOrigin = "cz" | "de_import" | "eu_import";
export type PersonType = "fo" | "osvc" | "po";
export type PaymentMethod = "prevod" | "hotovost";
export type TransferResponsibility = "kupujici" | "spolecne" | "prodavajici";
export type PowerOfAttorneyForm = "overena" | "elektronicka";
export type LegalRegime = "C2C" | "B2C" | "C2B" | "B2B";
export type SellerPreset = "josef_cipra" | "carbeat" | "jine";

export interface PersonDataFO {
  type: "fo";
  jmeno_prijmeni: string;
  datum_narozeni: string;
  trvale_bydliste: string;
  cislo_op: string;
}

export interface PersonDataOSVC {
  type: "osvc";
  jmeno_prijmeni: string;
  datum_narozeni: string;
  trvale_bydliste: string;
  cislo_op: string;
  ico: string;
  dic: string;
  zapis_zr: string;
}

export interface PersonDataPO {
  type: "po";
  nazev_firmy: string;
  sidlo: string;
  ico: string;
  dic: string;
  zapis_or: string;
  jednajici_osoba: string;
  jednajici_funkce: string;
  jednajici_opravneni: string;
  jednajici_op: string;
}

export type PersonData = PersonDataFO | PersonDataOSVC | PersonDataPO;

export interface VehicleData {
  tovarni_znacka: string;
  model: string;
  vin: string;
  datum_prvni_registrace: string;
  barva: string;
  stav_tachometru_km: number;
  pocet_klicu: number;
  registracni_znacka: string;
  cislo_orv: string;
  platnost_stk: string;
  cislo_fahrzeugbrief: string;
}

export interface PaymentDetailsPrevod {
  cislo_uctu: string;
  splatnost_dny: number;
}

export interface ZalohaDetails {
  amount: number;
  detail: string;
}

export interface PenaltyOption {
  enabled: boolean;
  castka_za_den: number;
}

export interface ContractWizardState {
  currentStep: number;
  // Step 0
  vehicleOrigin: VehicleOrigin;
  // Step 1 — Prodávající
  sellerPreset: SellerPreset;
  sellerType: PersonType;
  seller: PersonData;
  declarations: Record<string, boolean>;
  servisniKnizka: boolean;
  servisniKnizkaDetail: string;
  // Step 2
  buyerType: PersonType;
  buyer: PersonData;
  // Step 3 — Vozidlo (identifikace + stav čl. IV + předávací protokol)
  vehicle: VehicleData;
  stavVozidlaText: string;
  zkusebniJizda: boolean;
  deImportDocs: string[];
  czProtocolItems: Record<string, boolean>;
  protokolOstatni: string;
  protokolZelenaZnacka: boolean;
  // Step 4 — Cena a platba
  cenaCzk: number;
  cenaSlovy: string;
  hasZaloha: boolean;
  zaloha: ZalohaDetails;
  paymentMethod: PaymentMethod;
  sellerBankAccount: string;
  splatnostDny: number;
  predaniPoZaplaceni: boolean;
  // Step 5 — Přepis / Registrace (jen CZ)
  transferResponsibility: TransferResponsibility;
  powerOfAttorney: PowerOfAttorneyForm;
  penalty: PenaltyOption;
  // Step 6 — Předání
  generateProtocol: boolean;
  mesto: string;
  datum: string;
}

export const DECLARATION_LABELS: Record<string, string> = {
  a: "Prodávající prohlašuje, že je výlučným vlastníkem vozidla a jeho dispoziční právo není nijak omezeno.",
  b: "Na vozidle neváznou žádné dluhy, zástavní práva, leasingové smlouvy ani úvěry.",
  c: "Na majetek prodávajícího není vedena exekuce ani insolvenční řízení.",
  d: "Vozidlo nepochází z trestné činnosti a není vedeno jako odcizené (SIS II).",
  f: "Stav tachometru nebyl dle vědomí prodávajícího manipulován.",
  h: "Vozidlo bylo řádně odhlášeno v zemi původu.",
};

export const DE_IMPORT_DOC_LABELS: Record<string, string> = {
  coc: "COC list (Certificate of Conformity)",
  fahrzeugbrief: "Fahrzeugbrief (Zulassungsbescheinigung Teil II) — originál",
  scheckheft: "Servisní knížka / Scheckheft",
  tuv: "TÜV / Dekra protokol",
  technicka_kontrola_cr: "Osvědčení o technické / evidenční kontrole v ČR",
  cebia: "Cebia certifikát",
};

/** Docs only available for DE import (not other EU) */
export const DE_ONLY_DOCS = new Set(["fahrzeugbrief", "tuv"]);

export const CZ_PROTOCOL_ITEMS: Record<string, string> = {
  orv: "Osvědčení o registraci vozidla (ORV)",
  servisni_knizka: "Servisní knížka",
  protokol_stk: "Protokol STK",
  plna_moc: "Plná moc k přepisu",
};

export const HIDDEN_DEFECT_INFO: Record<LegalRegime, string> = {
  C2C: "Skrytá vada (§ 2099 a násl. OZ) je vada, která existovala v okamžiku převzetí, ale nebyla při běžné prohlídce zjistitelná. U prodeje mezi nepodnikateli (C2C) nese důkazní břemeno kupující — musí prokázat, že vada existovala již při převzetí. Spotřebitelská ochrana (§ 2158+ OZ) se neuplatní. Lhůta pro vytčení vad: 24 měsíců od převzetí.",
  B2C: "Skrytá vada (§ 2099 a násl. OZ) je vada, která existovala v okamžiku převzetí, ale nebyla při běžné prohlídce zjistitelná. U prodeje podnikatele spotřebiteli (B2C) platí domněnka vadnosti dle § 2161 odst. 5 OZ: vada, která se projeví do 1 roku od převzetí, se považuje za existující již při převzetí, pokud to povaha věci nevylučuje. Důkazní břemeno nese prodávající. Lhůta pro vytčení vad: 24 měsíců od převzetí.",
  C2B: "Skrytá vada (§ 2099 a násl. OZ) je vada, která existovala v okamžiku převzetí, ale nebyla při běžné prohlídce zjistitelná. Kupující je profesionál — spotřebitelská ochrana se neuplatní. Důkazní břemeno existence skryté vady nese kupující.",
  B2B: "Skrytá vada (§ 2099 a násl. OZ) je vada, která existovala v okamžiku převzetí, ale nebyla při běžné prohlídce zjistitelná. Obchodní závazkový vztah — spotřebitelská ochrana se neuplatní. Důkazní břemeno existence skryté vady nese kupující.",
};
