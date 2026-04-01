"use client";

import { useState, useCallback, useRef } from "react";
import type { CarWithPhotos } from "@/types/car";
import type {
  ContractWizardState,
  PersonType,
  PersonData,
  PersonDataFO,
  PersonDataOSVC,
  PersonDataPO,
  VehicleOrigin,
  PaymentMethod,
  TransferResponsibility,
  PowerOfAttorneyForm,
  SellerPreset,
} from "@/types/contract";
import {
  DECLARATION_LABELS,
  DE_IMPORT_DOC_LABELS,
  DE_ONLY_DOCS,
  CZ_PROTOCOL_ITEMS,
  HIDDEN_DEFECT_INFO,
} from "@/types/contract";
import {
  parseCarName,
  getDefaultDeclarations,
  formatCurrency,
  numberToWords,
  validatePayment,
  detectLegalRegime,
  getRegimeNote,
  PRESET_JOSEF_CIPRA,
  PRESET_CARBEAT,
} from "./contractUtils";
import { ContractPreview } from "./ContractPreview";
import { generateContractDocx } from "./contractDocx";

const inputClass =
  "w-full px-3 py-2 rounded-[8px] border border-border bg-bg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-blue/40 transition-colors";

const STEP_LABELS = [
  "Typ transakce",
  "Prodávající",
  "Kupující",
  "Vozidlo",
  "Cena a platba",
  "Přepis / Registrace",
  "Předání",
  "Náhled",
];

function emptyFO(): PersonDataFO {
  return { type: "fo", jmeno_prijmeni: "", datum_narozeni: "", trvale_bydliste: "", cislo_op: "" };
}

function emptyOSVC(): PersonDataOSVC {
  return { type: "osvc", jmeno_prijmeni: "", datum_narozeni: "", trvale_bydliste: "", cislo_op: "", ico: "", dic: "", zapis_zr: "" };
}

function emptyPO(): PersonDataPO {
  return { type: "po", nazev_firmy: "", sidlo: "", ico: "", dic: "", zapis_or: "", jednajici_osoba: "", jednajici_funkce: "", jednajici_opravneni: "", jednajici_op: "" };
}

function getEmptyPerson(type: PersonType): PersonData {
  switch (type) {
    case "fo": return emptyFO();
    case "osvc": return emptyOSVC();
    case "po": return emptyPO();
  }
}

function createInitialState(car: CarWithPhotos): ContractWizardState {
  const { brand, model } = parseCarName(car.name);
  return {
    currentStep: 0,
    vehicleOrigin: "de_import",
    sellerPreset: "carbeat",
    sellerType: "po",
    seller: { ...PRESET_CARBEAT },
    declarations: getDefaultDeclarations("de_import"),
    servisniKnizka: false,
    servisniKnizkaDetail: "",
    buyerType: "fo",
    buyer: emptyFO(),
    vehicle: {
      tovarni_znacka: brand, model,
      vin: car.vin ?? "",
      datum_prvni_registrace: "",
      barva: car.exterior_color || "",
      stav_tachometru_km: car.km,
      pocet_klicu: 2,
      registracni_znacka: "", cislo_orv: "", platnost_stk: "", cislo_fahrzeugbrief: "",
    },
    stavVozidlaText: "",
    zkusebniJizda: true,
    deImportDocs: ["fahrzeugbrief", "scheckheft"],
    czProtocolItems: Object.fromEntries(Object.keys(CZ_PROTOCOL_ITEMS).map((k) => [k, true])),
    protokolOstatni: "",
    protokolZelenaZnacka: false,
    cenaCzk: car.price > 0 ? car.price : 0,
    cenaSlovy: car.price > 0 ? numberToWords(car.price) : "",
    hasZaloha: false,
    zaloha: { amount: 0, detail: "" },
    paymentMethod: "prevod",
    sellerBankAccount: "",
    splatnostDny: 0,
    predaniPoZaplaceni: true,
    transferResponsibility: "kupujici",
    powerOfAttorney: "overena",
    penalty: { enabled: true, castka_za_den: 500 },
    generateProtocol: true,
    mesto: "Svinišťany",
    datum: "",
  };
}

export function ContractWizard({ car }: { car: CarWithPhotos }) {
  const [state, setState] = useState<ContractWizardState>(() => createInitialState(car));
  const printRef = useRef<HTMLDivElement>(null);

  const update = useCallback(<K extends keyof ContractWizardState>(key: K, value: ContractWizardState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateVehicle = useCallback((field: string, value: string | number) => {
    setState((prev) => ({ ...prev, vehicle: { ...prev.vehicle, [field]: value } }));
  }, []);

  const toggleDeclaration = useCallback((id: string) => {
    setState((prev) => ({ ...prev, declarations: { ...prev.declarations, [id]: !prev.declarations[id] } }));
  }, []);

  const toggleDeDoc = useCallback((id: string) => {
    setState((prev) => {
      const docs = prev.deImportDocs.includes(id) ? prev.deImportDocs.filter((d) => d !== id) : [...prev.deImportDocs, id];
      return { ...prev, deImportDocs: docs };
    });
  }, []);

  const toggleCzProtocol = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      czProtocolItems: { ...prev.czProtocolItems, [id]: !prev.czProtocolItems[id] },
    }));
  }, []);

  function selectSellerPreset(preset: SellerPreset) {
    if (preset === "josef_cipra") {
      setState((prev) => ({ ...prev, sellerPreset: preset, sellerType: "fo", seller: { ...PRESET_JOSEF_CIPRA } }));
    } else if (preset === "carbeat") {
      setState((prev) => ({ ...prev, sellerPreset: preset, sellerType: "po", seller: { ...PRESET_CARBEAT } }));
    } else {
      setState((prev) => ({ ...prev, sellerPreset: preset, sellerType: "fo", seller: emptyFO() }));
    }
  }

  function changeSellerType(type: PersonType) {
    setState((prev) => ({ ...prev, sellerPreset: "jine" as SellerPreset, sellerType: type, seller: getEmptyPerson(type) }));
  }

  function changeBuyerType(type: PersonType) {
    setState((prev) => ({ ...prev, buyerType: type, buyer: getEmptyPerson(type) }));
  }

  function changeOrigin(origin: VehicleOrigin) {
    setState((prev) => ({ ...prev, vehicleOrigin: origin, declarations: getDefaultDeclarations(origin) }));
  }

  function updateSeller(field: string, value: string) {
    setState((prev) => ({ ...prev, seller: { ...prev.seller, [field]: value } as PersonData }));
  }

  function updateBuyer(field: string, value: string) {
    setState((prev) => ({ ...prev, buyer: { ...prev.buyer, [field]: value } as PersonData }));
  }

  function updatePrice(value: number) {
    setState((prev) => ({ ...prev, cenaCzk: value, cenaSlovy: value > 0 ? numberToWords(value) : "" }));
  }

  const zbyvajiciCastka = state.hasZaloha ? Math.max(0, state.cenaCzk - state.zaloha.amount) : state.cenaCzk;
  const hotovostAmount = state.paymentMethod === "hotovost" ? zbyvajiciCastka : 0;
  const paymentValidation = validatePayment(state.cenaCzk, state.paymentMethod, hotovostAmount);
  const regime = detectLegalRegime(state.sellerType, state.buyerType);
  const isImport = state.vehicleOrigin === "de_import" || state.vehicleOrigin === "eu_import";

  return (
    <div>
      {/* Step indicator */}
      <div className="print:hidden sticky top-0 z-20 bg-bg/95 backdrop-blur-sm py-3 -mx-6 px-6 mb-8 flex flex-wrap gap-1">
        {STEP_LABELS.map((label, i) => (
          <button key={i} onClick={() => setState((prev) => ({ ...prev, currentStep: i }))}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              state.currentStep === i ? "bg-blue !text-white"
              : i < state.currentStep ? "bg-green-light text-green border border-green"
              : "bg-surface border border-border text-text-muted"
            }`}>{i + 1}. {label}</button>
        ))}
      </div>

      {/* Legal regime badge */}
      {state.currentStep >= 1 && state.currentStep < 7 && (
        <div className="print:hidden mb-6 p-3 rounded-[8px] bg-blue/10 border border-blue/20 text-sm">
          <span className="font-semibold text-blue">Režim: {regime}</span>
          <span className="text-text-muted ml-2">— {getRegimeNote(regime)}</span>
        </div>
      )}

      <div className="print:hidden">

        {/* ===== STEP 0: Typ transakce ===== */}
        {state.currentStep === 0 && (
          <StepSection title="Typ transakce">
            <p className="text-sm text-text-muted mb-4">Jaký je původ vozidla?</p>
            <div className="space-y-2">
              {([["cz","Registrováno v ČR (přepis)"],["de_import","Dovoz z Německa"],["eu_import","Dovoz z jiné země EU"]] as [VehicleOrigin,string][]).map(([val,label]) => (
                <label key={val} className="flex items-center gap-3 p-3 rounded-[8px] border border-border hover:bg-bg/50 cursor-pointer transition-colors">
                  <input type="radio" name="origin" checked={state.vehicleOrigin===val} onChange={()=>changeOrigin(val)} className="accent-blue" />
                  <span className="text-text">{label}</span>
                </label>
              ))}
            </div>
          </StepSection>
        )}

        {/* ===== STEP 1: Prodávající ===== */}
        {state.currentStep === 1 && (
          <div>
            {/* Sticky preset selector */}
            <div className="sticky top-0 z-10 bg-bg/95 backdrop-blur-sm pb-4 mb-4 border-b border-border">
              <h4 className="text-sm font-semibold text-text mb-2">Prodávající</h4>
              <div className="flex gap-2 flex-wrap">
                {([["josef_cipra","Josef Cipra (FO)"],["carbeat","CarBeat s.r.o."],["jine","Jiné"]] as [SellerPreset,string][]).map(([val,label]) => (
                  <button key={val} onClick={()=>selectSellerPreset(val)}
                    className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-colors ${
                      state.sellerPreset===val ? "bg-blue !text-white" : "bg-surface border border-border text-text-muted hover:text-text"
                    }`}>{label}</button>
                ))}
              </div>
            </div>

            <StepSection title={state.sellerPreset==="jine" ? "Údaje prodávajícího" : ""}>
              {/* Type selector for "Jiné" */}
              {state.sellerPreset === "jine" && (
                <div className="flex gap-2 mb-6">
                  {([["fo","Fyzická osoba"],["osvc","OSVČ"],["po","Právnická osoba"]] as [PersonType,string][]).map(([val,label]) => (
                    <button key={val} onClick={()=>changeSellerType(val)}
                      className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-colors ${
                        state.sellerType===val ? "bg-blue !text-white" : "bg-surface border border-border text-text-muted hover:text-text"
                      }`}>{label}</button>
                  ))}
                </div>
              )}

              <PersonForm person={state.seller} onUpdate={updateSeller} />

              {/* Prohlášení */}
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="text-sm font-semibold text-text mb-3">Prohlášení prodávajícího</h4>
                <div className="space-y-2">
                  {Object.entries(DECLARATION_LABELS).map(([id, text]) => {
                    if (id === "h" && state.vehicleOrigin === "cz") return null;
                    return (
                      <label key={id} className="flex items-start gap-3 p-2 rounded-[6px] hover:bg-bg/50 cursor-pointer">
                        <input type="checkbox" checked={state.declarations[id] ?? false} onChange={()=>toggleDeclaration(id)} className="accent-blue mt-0.5" />
                        <span className="text-sm text-text">{text}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

            </StepSection>
          </div>
        )}

        {/* ===== STEP 2: Kupující ===== */}
        {state.currentStep === 2 && (
          <StepSection title="Kupující">
            <div className="flex gap-2 mb-6">
              {([["fo","Fyzická osoba"],["osvc","OSVČ"],["po","Právnická osoba"]] as [PersonType,string][]).map(([val,label]) => (
                <button key={val} onClick={()=>changeBuyerType(val)}
                  className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-colors ${
                    state.buyerType===val ? "bg-blue !text-white" : "bg-surface border border-border text-text-muted hover:text-text"
                  }`}>{label}</button>
              ))}
            </div>
            <PersonForm person={state.buyer} onUpdate={updateBuyer} />
          </StepSection>
        )}

        {/* ===== STEP 3: Vozidlo (identifikace + stav čl. IV + předávací protokol) ===== */}
        {state.currentStep === 3 && (
          <div className="space-y-6">
            {/* 3A: Identifikace vozidla */}
            <StepSection title="Identifikace vozidla">
              <p className="text-sm text-text-muted mb-4">Údaje předvyplněné z databáze. Zkontrolujte a doplňte.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Tovární značka"><input className={inputClass} value={state.vehicle.tovarni_znacka} onChange={(e)=>updateVehicle("tovarni_znacka",e.target.value)} /></Field>
                <Field label="Model"><input className={inputClass} value={state.vehicle.model} onChange={(e)=>updateVehicle("model",e.target.value)} /></Field>
                <Field label="VIN"><input className={inputClass} value={state.vehicle.vin} onChange={(e)=>updateVehicle("vin",e.target.value.toUpperCase())} maxLength={17} placeholder="17místný VIN kód" /></Field>
                <Field label="Datum první registrace"><input className={inputClass} type="date" value={state.vehicle.datum_prvni_registrace} onChange={(e)=>updateVehicle("datum_prvni_registrace",e.target.value)} /></Field>
                <Field label="Barva vozidla"><input className={inputClass} value={state.vehicle.barva} onChange={(e)=>updateVehicle("barva",e.target.value)} /></Field>
                <Field label="Stav tachometru (km)"><input className={inputClass} type="number" value={state.vehicle.stav_tachometru_km} onChange={(e)=>updateVehicle("stav_tachometru_km",parseInt(e.target.value)||0)} /></Field>
                <Field label="Počet klíčů"><input className={inputClass} type="number" value={state.vehicle.pocet_klicu} onChange={(e)=>updateVehicle("pocet_klicu",parseInt(e.target.value)||0)} min={1} /></Field>
                {state.vehicleOrigin === "cz" && (<>
                  <Field label="Registrační značka (RZ/SPZ)"><input className={inputClass} value={state.vehicle.registracni_znacka} onChange={(e)=>updateVehicle("registracni_znacka",e.target.value.toUpperCase())} /></Field>
                  <Field label="Číslo ORV"><input className={inputClass} value={state.vehicle.cislo_orv} onChange={(e)=>updateVehicle("cislo_orv",e.target.value)} /></Field>
                  <Field label="Platnost STK do"><input className={inputClass} type="date" value={state.vehicle.platnost_stk} onChange={(e)=>updateVehicle("platnost_stk",e.target.value)} /></Field>
                </>)}
                {state.vehicleOrigin === "de_import" && (
                  <Field label="Číslo Fahrzeugbrief (Teil II)"><input className={inputClass} value={state.vehicle.cislo_fahrzeugbrief} onChange={(e)=>updateVehicle("cislo_fahrzeugbrief",e.target.value)} /></Field>
                )}
              </div>
            </StepSection>

            {/* 3B: Stav vozidla — Článek IV */}
            <StepSection title="Stav vozidla — Článek IV">
              <Field label="Popis stavu vozidla">
                <textarea className={inputClass+" min-h-[120px]"} value={state.stavVozidlaText} onChange={(e)=>update("stavVozidlaText",e.target.value)}
                  placeholder="Automobil dovezený z Německa, s drobnými provozními oděrkami, vše ukázáno. Platná německá STK, po evidenční kontrole." />
              </Field>
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-text mb-3">Zkušební jízda</h4>
                <div className="flex gap-4">
                  {([[true,"Ano, proběhla"],[false,"Ne"]] as [boolean,string][]).map(([val,label]) => (
                    <label key={String(val)} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={state.zkusebniJizda===val} onChange={()=>update("zkusebniJizda",val)} className="accent-blue" />
                      <span className="text-sm text-text">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Info o skrytých vadách */}
              <div className="mt-6 p-4 rounded-[8px] bg-blue/5 border border-blue/15 text-sm text-text-muted">
                <h4 className="font-semibold text-text mb-2">Informace o skrytých vadách ({regime})</h4>
                <p>{HIDDEN_DEFECT_INFO[regime]}</p>
              </div>
            </StepSection>

            {/* 3C: Předávací protokol */}
            <StepSection title="Předávací protokol">
              <h4 className="text-sm font-semibold text-text mb-3">Předávané položky</h4>
              {isImport ? (
                <div className="space-y-2 mb-6">
                  {Object.entries(DE_IMPORT_DOC_LABELS)
                    .filter(([id]) => !DE_ONLY_DOCS.has(id) || state.vehicleOrigin === "de_import")
                    .map(([id, label]) => (
                    <label key={id} className="flex items-start gap-3 p-2 rounded-[6px] hover:bg-bg/50 cursor-pointer">
                      <input type="checkbox" checked={state.deImportDocs.includes(id)} onChange={()=>toggleDeDoc(id)} className="accent-blue mt-0.5" />
                      <span className="text-sm text-text">{label}</span>
                    </label>
                  ))}
                  {!state.deImportDocs.includes("coc") && (
                    <div className="mt-3 p-3 rounded-[8px] bg-yellow-500/10 border border-yellow-500/30 text-sm text-yellow-700 dark:text-yellow-400">
                      Bez COC listu bude nutné individuální schválení technické způsobilosti (dražší a delší proces).
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2 mb-6">
                  {Object.entries(CZ_PROTOCOL_ITEMS).map(([id, label]) => (
                    <label key={id} className="flex items-start gap-3 p-2 rounded-[6px] hover:bg-bg/50 cursor-pointer">
                      <input type="checkbox" checked={state.czProtocolItems[id] ?? false} onChange={()=>toggleCzProtocol(id)} className="accent-blue mt-0.5" />
                      <span className="text-sm text-text">{label}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Servisní knížka */}
              <div className="mb-6 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-text mb-3">Servisní knížka</h4>
                <label className="flex items-center gap-3 mb-3 cursor-pointer">
                  <input type="checkbox" checked={state.servisniKnizka} onChange={()=>update("servisniKnizka",!state.servisniKnizka)} className="accent-blue" />
                  <span className="text-sm text-text">Servisní knížka je k vozidlu k dispozici</span>
                </label>
                {state.servisniKnizka && (
                  <Field label="Podrobnosti (papírová/elektronická, provedený servis...)">
                    <textarea className={inputClass+" min-h-[80px]"} value={state.servisniKnizkaDetail} onChange={(e)=>update("servisniKnizkaDetail",e.target.value)}
                      placeholder="Např. papírová servisní knížka ve vozidle, pravidelný servis u autorizovaného servisu..." />
                  </Field>
                )}
              </div>

              <h4 className="text-sm font-semibold text-text mb-3">Ostatní informace</h4>
              <textarea className={inputClass+" min-h-[60px] mb-3"} value={state.protokolOstatni} onChange={(e)=>update("protokolOstatni",e.target.value)}
                placeholder="Další informace k předání..." />
              <label className="flex items-start gap-3 p-2 rounded-[6px] hover:bg-bg/50 cursor-pointer">
                <input type="checkbox" checked={state.protokolZelenaZnacka} onChange={()=>update("protokolZelenaZnacka",!state.protokolZelenaZnacka)} className="accent-blue mt-0.5" />
                <span className="text-sm text-text">V případě použití zvláštní registrační značky (zelené papírové převozové značky) nutno tuto značku odevzdat před přihlášením vozidla na příslušném dopravním úřadě.</span>
              </label>
            </StepSection>
          </div>
        )}

        {/* ===== STEP 4: Cena a platba ===== */}
        {state.currentStep === 4 && (
          <StepSection title="Kupní cena a platba">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field label="Kupní cena (Kč)"><input className={inputClass} type="number" value={state.cenaCzk} onChange={(e)=>updatePrice(parseInt(e.target.value)||0)} /></Field>
              <Field label="Kupní cena slovy"><input className={inputClass} value={state.cenaSlovy} onChange={(e)=>update("cenaSlovy",e.target.value)} /></Field>
            </div>

            <div className="mb-6 p-4 rounded-[8px] border border-border">
              <label className="flex items-center gap-3 mb-3 cursor-pointer">
                <input type="checkbox" checked={state.hasZaloha} onChange={()=>setState((prev)=>({...prev,hasZaloha:!prev.hasZaloha,zaloha:!prev.hasZaloha?prev.zaloha:{amount:0,detail:""}}))} className="accent-blue" />
                <span className="text-sm font-semibold text-text">Byla složena záloha</span>
              </label>
              {state.hasZaloha && (
                <div className="space-y-4 mt-3">
                  <Field label="Výše zálohy (Kč)"><input className={inputClass} type="number" value={state.zaloha.amount} onChange={(e)=>setState((prev)=>({...prev,zaloha:{...prev.zaloha,amount:parseInt(e.target.value)||0}}))} max={state.cenaCzk} /></Field>
                  <Field label="Podrobnosti zálohy (kdy, jakým způsobem)">
                    <textarea className={inputClass+" min-h-[60px]"} value={state.zaloha.detail} onChange={(e)=>setState((prev)=>({...prev,zaloha:{...prev.zaloha,detail:e.target.value}}))}
                      placeholder="Např. záloha 50 000 Kč uhrazena dne 1. 4. 2026 hotově při prohlídce vozidla" />
                  </Field>
                  <div className="p-3 rounded-[8px] bg-bg text-sm">
                    <span className="text-text-muted">Zbývající částka k úhradě: </span>
                    <span className="font-semibold text-text">{formatCurrency(zbyvajiciCastka)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-text mb-3">{state.hasZaloha ? "Způsob úhrady zbývající částky" : "Způsob platby"}</h4>
              <div className="space-y-2">
                {([["prevod","Bezhotovostní převod na účet"],["hotovost","Hotovost při předání vozidla"]] as [PaymentMethod,string][]).map(([val,label]) => (
                  <label key={val} className="flex items-center gap-3 p-3 rounded-[8px] border border-border hover:bg-bg/50 cursor-pointer transition-colors">
                    <input type="radio" name="payment" checked={state.paymentMethod===val} onChange={()=>update("paymentMethod",val)} className="accent-blue" />
                    <span className="text-text">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {!paymentValidation.valid && paymentValidation.warning && (
              <div className="mb-4 p-3 rounded-[8px] bg-yellow-500/10 border border-yellow-500/30 text-sm text-yellow-700 dark:text-yellow-400">{paymentValidation.warning}</div>
            )}

            {state.paymentMethod === "prevod" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Field label="Číslo účtu prodávajícího"><input className={inputClass} value={state.sellerBankAccount} onChange={(e)=>update("sellerBankAccount",e.target.value)} placeholder="123456789/0100" /></Field>
                <Field label="Splatnost (dny od podpisu, 0 = v den podpisu)"><input className={inputClass} type="number" value={state.splatnostDny} onChange={(e)=>update("splatnostDny",parseInt(e.target.value)||0)} min={0} /></Field>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={state.predaniPoZaplaceni} onChange={()=>update("predaniPoZaplaceni",!state.predaniPoZaplaceni)} className="accent-blue" />
                <span className="text-sm text-text">K předání vozidla dojde až po úplném zaplacení kupní ceny</span>
              </label>
            </div>
          </StepSection>
        )}

        {/* ===== STEP 5: Přepis / Registrace ===== */}
        {state.currentStep === 5 && (
          <StepSection title={isImport ? "Registrace v ČR" : "Přepis v registru vozidel"}>
            {isImport ? (
              <p className="text-sm text-text">
                Kupující provede první registraci vozidla v České republice. Prodávající předá kupujícímu veškeré doklady nezbytné k registraci (viz předávací protokol).
              </p>
            ) : (
              <div>
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-text mb-3">Kdo zajistí přepis?</h4>
                  <div className="space-y-2">
                    {([["kupujici","Kupující (na základě plné moci od prodávajícího)"],["spolecne","Společně na úřadě (doporučujeme)"],["prodavajici","Prodávající (na základě plné moci od kupujícího)"]] as [TransferResponsibility,string][]).map(([val,label]) => (
                      <label key={val} className="flex items-center gap-3 p-3 rounded-[8px] border border-border hover:bg-bg/50 cursor-pointer transition-colors">
                        <input type="radio" name="transfer" checked={state.transferResponsibility===val} onChange={()=>update("transferResponsibility",val)} className="accent-blue" />
                        <span className="text-text">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {state.transferResponsibility !== "spolecne" && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-text mb-3">Forma plné moci</h4>
                    <div className="space-y-2">
                      {([["overena","Úředně ověřená (Czech POINT / notář)"],["elektronicka","Elektronická (Portál dopravy)"]] as [PowerOfAttorneyForm,string][]).map(([val,label]) => (
                        <label key={val} className="flex items-center gap-3 p-3 rounded-[8px] border border-border hover:bg-bg/50 cursor-pointer transition-colors">
                          <input type="radio" name="poa" checked={state.powerOfAttorney===val} onChange={()=>update("powerOfAttorney",val)} className="accent-blue" />
                          <span className="text-text">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-sm text-text-muted mb-6">Přepis musí být proveden do 10 pracovních dnů ode dne podpisu smlouvy (§ 8 zák. č. 56/2001 Sb.).</p>
                <div className="pt-4 border-t border-border">
                  <label className="flex items-center gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" checked={state.penalty.enabled} onChange={()=>update("penalty",{...state.penalty,enabled:!state.penalty.enabled})} className="accent-blue" />
                    <span className="text-sm text-text">Zahrnout smluvní pokutu za nedodržení 10denní lhůty</span>
                  </label>
                  {state.penalty.enabled && (
                    <Field label="Smluvní pokuta za den prodlení (Kč)"><input className={inputClass} type="number" value={state.penalty.castka_za_den} onChange={(e)=>update("penalty",{...state.penalty,castka_za_den:parseInt(e.target.value)||0})} min={0} /></Field>
                  )}
                </div>
              </div>
            )}
          </StepSection>
        )}

        {/* ===== STEP 6: Předání ===== */}
        {state.currentStep === 6 && (
          <StepSection title="Předání a podpis">
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={state.generateProtocol} onChange={()=>update("generateProtocol",!state.generateProtocol)} className="accent-blue" />
                <span className="text-sm text-text">Vygenerovat předávací protokol jako přílohu č. 1 (doporučeno)</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Místo podpisu"><input className={inputClass} value={state.mesto} onChange={(e)=>update("mesto",e.target.value)} /></Field>
              <Field label="Datum podpisu"><input className={inputClass} type="date" value={state.datum} onChange={(e)=>update("datum",e.target.value)} /></Field>
            </div>
          </StepSection>
        )}
      </div>

      {/* ===== STEP 7: Náhled ===== */}
      {state.currentStep === 7 && (
        <div>
          <div className="print:hidden mb-4 flex flex-wrap gap-3">
            <button onClick={()=>window.print()} className="px-5 py-2.5 rounded-[8px] text-sm font-semibold bg-blue !text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover">
              Tisk / Uložit PDF
            </button>
            <button onClick={()=>generateContractDocx(state, regime, zbyvajiciCastka)} className="px-5 py-2.5 rounded-[8px] text-sm font-semibold bg-surface text-text border-2 border-border transition-all duration-[250ms] hover:bg-blue-light hover:border-blue">
              Stáhnout DOCX
            </button>
          </div>
          <div ref={printRef}>
            <ContractPreview state={state} regime={regime} zbyvajiciCastka={zbyvajiciCastka} />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="print:hidden flex justify-between mt-8">
        <button onClick={()=>setState((prev)=>({...prev,currentStep:Math.max(0,prev.currentStep-1)}))} disabled={state.currentStep===0}
          className="px-4 py-2 rounded-[8px] text-sm font-medium bg-bg border border-border text-text hover:bg-blue-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed">← Zpět</button>
        {state.currentStep < 7 && (
          <button onClick={()=>setState((prev)=>({...prev,currentStep:prev.currentStep+1}))}
            className="px-5 py-2.5 rounded-[8px] text-sm font-semibold bg-blue !text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover">
            {state.currentStep===6 ? "Náhled smlouvy →" : "Další →"}
          </button>
        )}
      </div>
    </div>
  );
}

/* -- Helper components -- */

function StepSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-surface border border-border rounded-[12px] p-6">
      {title && <h3 className="text-base font-semibold text-text mb-4">{title}</h3>}
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="block text-sm font-medium text-text-muted mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function PersonForm({ person, onUpdate }: { person: PersonData; onUpdate: (field: string, value: string) => void }) {
  if (person.type === "fo") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Jméno a příjmení *"><input className={inputClass} value={person.jmeno_prijmeni} onChange={(e)=>onUpdate("jmeno_prijmeni",e.target.value)} /></Field>
        <Field label="Datum narození *"><input className={inputClass} type="date" value={person.datum_narozeni} onChange={(e)=>onUpdate("datum_narozeni",e.target.value)} /></Field>
        <Field label="Trvalé bydliště *"><input className={inputClass} value={person.trvale_bydliste} onChange={(e)=>onUpdate("trvale_bydliste",e.target.value)} /></Field>
        <Field label="Číslo občanského průkazu *"><input className={inputClass} value={person.cislo_op} onChange={(e)=>onUpdate("cislo_op",e.target.value)} /></Field>
      </div>
    );
  }
  if (person.type === "osvc") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Jméno a příjmení *"><input className={inputClass} value={person.jmeno_prijmeni} onChange={(e)=>onUpdate("jmeno_prijmeni",e.target.value)} /></Field>
        <Field label="Datum narození *"><input className={inputClass} type="date" value={person.datum_narozeni} onChange={(e)=>onUpdate("datum_narozeni",e.target.value)} /></Field>
        <Field label="Trvalé bydliště / místo podnikání *"><input className={inputClass} value={person.trvale_bydliste} onChange={(e)=>onUpdate("trvale_bydliste",e.target.value)} /></Field>
        <Field label="Číslo občanského průkazu *"><input className={inputClass} value={person.cislo_op} onChange={(e)=>onUpdate("cislo_op",e.target.value)} /></Field>
        <Field label="IČO *"><input className={inputClass} value={person.ico} onChange={(e)=>onUpdate("ico",e.target.value)} /></Field>
        <Field label="DIČ"><input className={inputClass} value={person.dic} onChange={(e)=>onUpdate("dic",e.target.value)} placeholder="Nepovinné" /></Field>
        <Field label="Zápis v živnostenském rejstříku"><input className={inputClass} value={person.zapis_zr} onChange={(e)=>onUpdate("zapis_zr",e.target.value)} placeholder="Nepovinné" /></Field>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Obchodní firma (název) *"><input className={inputClass} value={person.nazev_firmy} onChange={(e)=>onUpdate("nazev_firmy",e.target.value)} /></Field>
      <Field label="Sídlo *"><input className={inputClass} value={person.sidlo} onChange={(e)=>onUpdate("sidlo",e.target.value)} /></Field>
      <Field label="IČO *"><input className={inputClass} value={person.ico} onChange={(e)=>onUpdate("ico",e.target.value)} /></Field>
      <Field label="DIČ"><input className={inputClass} value={person.dic} onChange={(e)=>onUpdate("dic",e.target.value)} placeholder="Nepovinné" /></Field>
      <Field label="Jednající osoba — jméno *"><input className={inputClass} value={person.jednajici_osoba} onChange={(e)=>onUpdate("jednajici_osoba",e.target.value)} /></Field>
      <Field label="Funkce *"><input className={inputClass} value={person.jednajici_funkce} onChange={(e)=>onUpdate("jednajici_funkce",e.target.value)} placeholder="Např. jednatel" /></Field>
      <Field label="Oprávnění jednat"><input className={inputClass} value={person.jednajici_opravneni} onChange={(e)=>onUpdate("jednajici_opravneni",e.target.value)} placeholder="Nepovinné" /></Field>
      <Field label="Číslo OP jednající osoby *"><input className={inputClass} value={person.jednajici_op} onChange={(e)=>onUpdate("jednajici_op",e.target.value)} /></Field>
      <Field label="Zápis v obchodním rejstříku"><input className={inputClass} value={person.zapis_or} onChange={(e)=>onUpdate("zapis_or",e.target.value)} placeholder="Nepovinné" /></Field>
    </div>
  );
}
