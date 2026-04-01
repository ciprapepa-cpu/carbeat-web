"use client";

import type {
  ContractWizardState,
  LegalRegime,
  PersonData,
} from "@/types/contract";
import { DECLARATION_LABELS, DE_IMPORT_DOC_LABELS, CZ_PROTOCOL_ITEMS, DE_ONLY_DOCS } from "@/types/contract";
import { formatCurrency } from "./contractUtils";

interface ContractPreviewProps {
  state: ContractWizardState;
  regime: LegalRegime;
  zbyvajiciCastka: number;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "_______________";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric", year: "numeric" });
}

function personBlock(person: PersonData, role: "prodávající" | "kupující"): React.ReactNode {
  if (person.type === "fo") {
    return (
      <>
        <p><strong>Jméno a příjmení:</strong> {person.jmeno_prijmeni || "_______________"}</p>
        <p><strong>Datum narození:</strong> {formatDate(person.datum_narozeni)}</p>
        <p><strong>Trvalé bydliště:</strong> {person.trvale_bydliste || "_______________"}</p>
        <p><strong>Číslo OP:</strong> {person.cislo_op || "_______________"}</p>
        <p className="text-gray-600 italic text-[10pt]">(dále jen „{role}", fyzická osoba)</p>
      </>
    );
  }
  if (person.type === "osvc") {
    return (
      <>
        <p><strong>Jméno a příjmení:</strong> {person.jmeno_prijmeni || "_______________"}</p>
        <p><strong>Datum narození:</strong> {formatDate(person.datum_narozeni)}</p>
        <p><strong>Trvalé bydliště / místo podnikání:</strong> {person.trvale_bydliste || "_______________"}</p>
        <p><strong>Číslo OP:</strong> {person.cislo_op || "_______________"}</p>
        <p><strong>IČO:</strong> {person.ico || "_______________"}</p>
        {person.dic && <p><strong>DIČ:</strong> {person.dic}</p>}
        {person.zapis_zr && <p><strong>Zápis v ŽR:</strong> {person.zapis_zr}</p>}
        <p className="text-gray-600 italic text-[10pt]">(dále jen „{role}", podnikající fyzická osoba)</p>
      </>
    );
  }
  return (
    <>
      <p><strong>Obchodní firma:</strong> {person.nazev_firmy || "_______________"}</p>
      <p><strong>Sídlo:</strong> {person.sidlo || "_______________"}</p>
      <p><strong>IČO:</strong> {person.ico || "_______________"}</p>
      {person.dic && <p><strong>DIČ:</strong> {person.dic}</p>}
      {person.zapis_or && <p><strong>Zápis v OR:</strong> {person.zapis_or}</p>}
      <p><strong>Jednající:</strong> {person.jednajici_osoba || "_______________"}, {person.jednajici_funkce || "_______________"}
        {person.jednajici_opravneni && ` (${person.jednajici_opravneni})`}
      </p>
      {person.jednajici_op && <p><strong>OP jednající osoby:</strong> {person.jednajici_op}</p>}
      <p className="text-gray-600 italic text-[10pt]">(dále jen „{role}", právnická osoba)</p>
    </>
  );
}

export function ContractPreview({ state, regime, zbyvajiciCastka }: ContractPreviewProps) {
  const s = state;
  const v = s.vehicle;
  const isImport = s.vehicleOrigin === "de_import" || s.vehicleOrigin === "eu_import";

  // Counter for article VI numbered paragraphs (before the general list)
  let art6counter = 0;

  return (
    <div className="contract-print bg-white text-black p-8 md:p-12 rounded-[12px] border border-border print:border-0 print:p-0 print:rounded-none" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "11pt", lineHeight: "1.6" }}>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .contract-print, .contract-print * { visibility: visible; }
          .contract-print { position: absolute; left: 0; top: 0; width: 100%; }
          @page { margin: 2cm; size: A4; }
          .page-break { page-break-before: always; }
          .no-break { break-inside: avoid; }
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold uppercase tracking-wide mb-2">
          Kupní smlouva na ojeté motorové vozidlo
        </h1>
        <p className="text-sm text-gray-600">
          uzavřená dle § 2079 a násl. zákona č. 89/2012 Sb., občanský zákoník, v platném znění
        </p>
      </div>

      {/* Článek I — Smluvní strany */}
      <Article number="I" title="Smluvní strany">
        <P n="1.1"><span className="font-bold">Prodávající:</span></P>
        <div className="ml-8 mb-4">
          {personBlock(s.seller, "prodávající")}
        </div>
        <P n="1.2"><span className="font-bold">Kupující:</span></P>
        <div className="ml-8">
          {personBlock(s.buyer, "kupující")}
        </div>
      </Article>

      {/* Článek II — Předmět smlouvy */}
      <Article number="II" title="Předmět smlouvy — identifikace vozidla">
        <P n="2.1">
          Prodávající prodává kupujícímu a kupující kupuje od prodávajícího následující motorové vozidlo:
        </P>
        <table className="w-full border-collapse mb-3 ml-8" style={{ fontSize: "10.5pt" }}>
          <tbody>
            <TR label="Tovární značka" value={v.tovarni_znacka} />
            <TR label="Model" value={v.model} />
            <TR label="VIN" value={v.vin || "_______________"} />
            <TR label="Datum první registrace" value={formatDate(v.datum_prvni_registrace)} />
            <TR label="Barva" value={v.barva || "_______________"} />
            <TR label="Stav tachometru" value={`${v.stav_tachometru_km.toLocaleString("cs-CZ")} km`} />
            <TR label="Počet předávaných klíčů" value={`${v.pocet_klicu} ks`} />
            {s.vehicleOrigin === "cz" && (
              <>
                <TR label="Registrační značka (RZ)" value={v.registracni_znacka || "_______________"} />
                <TR label="Číslo ORV" value={v.cislo_orv || "_______________"} />
                <TR label="Platnost STK do" value={formatDate(v.platnost_stk)} />
              </>
            )}
            {s.vehicleOrigin === "de_import" && v.cislo_fahrzeugbrief && (
              <TR label="Číslo Fahrzeugbrief (Teil II)" value={v.cislo_fahrzeugbrief} />
            )}
          </tbody>
        </table>
      </Article>

      {/* Článek III — Prohlášení prodávajícího */}
      <Article number="III" title="Prohlášení prodávajícího">
        <P n="3.1">Prodávající tímto prohlašuje, že:</P>
        <ol className="list-none space-y-1.5 ml-8">
          {Object.entries(s.declarations)
            .filter(([, checked]) => checked)
            .map(([id]) => (
              <li key={id} className="pl-6 relative">
                <span className="absolute left-0 font-bold">{id})</span>
                {DECLARATION_LABELS[id]}
              </li>
            ))}
        </ol>
      </Article>

      {/* Článek IV — Stav vozidla */}
      <Article number="IV" title="Popis stavu vozidla">
        <P n="4.1"><strong>Stav vozidla:</strong></P>
        <p className="mb-3 whitespace-pre-line ml-8">
          {s.stavVozidlaText || "_______________"}
        </p>
        {s.zkusebniJizda && (
          <P n="4.2">
            Kupující potvrzuje, že před podpisem této smlouvy absolvoval zkušební jízdu a měl možnost
            se s technickým stavem vozidla dostatečně seznámit.
          </P>
        )}
        <P n={s.zkusebniJizda ? "4.3" : "4.2"}>
          Stav vozidla odpovídá jeho stáří a počtu najetých kilometrů. Prodávající v této souvislosti poskytl kupujícímu pravdivé a podstatné informace.
        </P>
      </Article>

      {/* Článek V — Kupní cena a přechod vlastnictví */}
      <Article number="V" title="Kupní cena, platební podmínky a přechod vlastnictví">
        <P n="5.1">
          <strong>Kupní cena:</strong> {formatCurrency(s.cenaCzk)}
        </P>
        <P n="5.2">
          <strong>Slovy:</strong> {s.cenaSlovy || "_______________"}
        </P>

        {s.hasZaloha && (
          <>
            <P n="5.3"><strong>Záloha:</strong> {formatCurrency(s.zaloha.amount)}</P>
            {s.zaloha.detail && <p className="text-[10.5pt] ml-8 mb-1">{s.zaloha.detail}</p>}
            <P n="5.4"><strong>Zbývající částka:</strong> {formatCurrency(zbyvajiciCastka)}</P>
          </>
        )}

        {s.paymentMethod === "prevod" && (
          <>
            <P n={s.hasZaloha ? "5.5" : "5.3"}>
              <strong>Způsob {s.hasZaloha ? "úhrady zbývající částky" : "platby"}:</strong> Bezhotovostní převod
            </P>
            <P n={s.hasZaloha ? "5.6" : "5.4"}>
              Číslo účtu prodávajícího: {s.sellerBankAccount || "_______________"}
            </P>
            <P n={s.hasZaloha ? "5.7" : "5.5"}>
              Splatnost: {s.splatnostDny === 0 ? "v den podpisu smlouvy" : `${s.splatnostDny} kalendářních dnů od podpisu smlouvy`}.
            </P>
            <p className="mt-2 text-[10.5pt] ml-8">Kupní cena se považuje za uhrazenou okamžikem připsání na účet prodávajícího.</p>
          </>
        )}

        {s.paymentMethod === "hotovost" && (
          <>
            <P n={s.hasZaloha ? "5.5" : "5.3"}>
              <strong>Způsob {s.hasZaloha ? "úhrady zbývající částky" : "platby"}:</strong> Hotovost při předání vozidla
            </P>
            <p className="mt-2 text-[10.5pt] ml-8">
              Podpisem této smlouvy prodávající potvrzuje převzetí {s.hasZaloha ? "zbývající části " : ""}kupní ceny v hotovosti.
              Tato smlouva slouží zároveň jako kvitance ve smyslu § 1952 občanského zákoníku.
            </p>
          </>
        )}

        {s.predaniPoZaplaceni && (
          <P n={s.hasZaloha ? (s.paymentMethod === "prevod" ? "5.8" : "5.6") : (s.paymentMethod === "prevod" ? "5.6" : "5.4")}>
            K předání vozidla kupujícímu dojde až po úplném zaplacení kupní ceny dle této smlouvy.
          </P>
        )}

        <P n={(() => {
          let n = 3;
          if (s.hasZaloha) n += 2;
          if (s.paymentMethod === "prevod") n += 3; else n += 1;
          if (s.predaniPoZaplaceni) n += 1;
          return `5.${n}`;
        })()}>
          Vlastnické právo k vozidlu přechází na kupujícího okamžikem úplného zaplacení kupní ceny (výhrada vlastnického práva).
        </P>
        <P n={(() => {
          let n = 3;
          if (s.hasZaloha) n += 2;
          if (s.paymentMethod === "prevod") n += 3; else n += 1;
          if (s.predaniPoZaplaceni) n += 1;
          return `5.${n + 1}`;
        })()}>
          Nebezpečí škody na vozidle přechází na kupujícího okamžikem fyzického převzetí vozidla.
        </P>
      </Article>

      {/* Článek VI — Závěrečná ujednání */}
      <Article number="VI" title="Závěrečná ujednání">
        {/* Přepis / registrace */}
        {isImport ? (
          <P n={`6.${++art6counter}`}>
            Kupující provede první registraci vozidla v České republice. Prodávající předá kupujícímu veškeré doklady nezbytné k registraci (viz předávací protokol).
          </P>
        ) : (
          <>
            <P n={`6.${++art6counter}`}>
              {s.transferResponsibility === "kupujici" &&
                "Přepis vozidla na kupujícího v registru silničních vozidel zajistí kupující na základě plné moci udělené prodávajícím."}
              {s.transferResponsibility === "spolecne" &&
                "Obě smluvní strany se společně dostaví na příslušný úřad za účelem přepisu vozidla."}
              {s.transferResponsibility === "prodavajici" &&
                "Přepis vozidla zajistí prodávající na základě plné moci udělené kupujícím."}
            </P>
            {s.transferResponsibility !== "spolecne" && (
              <P n={`6.${++art6counter}`}>
                Forma plné moci: {s.powerOfAttorney === "overena" ? "úředně ověřená (Czech POINT / notář)" : "elektronická (Portál dopravy)"}.
              </P>
            )}
            <P n={`6.${++art6counter}`}>
              Přepis musí být proveden do 10 pracovních dnů ode dne podpisu smlouvy (§ 8 zák. č. 56/2001 Sb.).
            </P>
            {s.penalty.enabled && (
              <P n={`6.${++art6counter}`}>
                V případě nedodržení výše uvedené lhůty je povinná strana povinna uhradit druhé smluvní straně
                smluvní pokutu ve výši {formatCurrency(s.penalty.castka_za_den)} za každý den prodlení.
              </P>
            )}
            <P n={`6.${++art6counter}`}>
              Veškeré náklady spojené s přepisem/registrací vozidla (správní poplatky, evidenční kontrola) hradí kupující.
            </P>
            <P n={`6.${++art6counter}`}>
              Prodávající zruší stávající pojištění odpovědnosti z provozu vozidla ke dni provedení přepisu/registrace vozidla na kupujícího, nejpozději však do 14 kalendářních dnů od podpisu této smlouvy.
            </P>
          </>
        )}

        {/* Obecná ustanovení */}
        <P n={`6.${++art6counter}`}>Tuto smlouvu lze měnit nebo doplňovat pouze písemnými dodatky podepsanými oběma smluvními stranami.</P>
        <P n={`6.${++art6counter}`}>Práva a povinnosti touto smlouvou neupravené se řídí zákonem č. 89/2012 Sb., občanský zákoník.</P>
        <P n={`6.${++art6counter}`}>Bude-li některé ustanovení této smlouvy shledáno neplatným nebo nevymahatelným, platnost ostatních ustanovení tím není dotčena (salvátorská klauzule).</P>
        <P n={`6.${++art6counter}`}>Smlouva je vyhotovena ve dvou stejnopisech, z nichž každá smluvní strana obdrží jeden.</P>
        <P n={`6.${++art6counter}`}>Obě smluvní strany prohlašují, že tuto smlouvu uzavírají svobodně, vážně, nikoli v tísni či za nápadně nevýhodných podmínek, a že si ji před podpisem přečetly a s jejím obsahem souhlasí.</P>
      </Article>

      {/* Podpisy */}
      <div className="mt-12 flex justify-between gap-12 no-break">
        <div className="flex-1 text-center">
          <p className="mb-2">V {s.mesto || "_______________"} dne {formatDate(s.datum)}</p>
          <div className="mt-16 border-t border-black pt-2">
            <p className="font-medium">Prodávající</p>
            <p className="text-sm">
              {s.seller.type === "po" ? s.seller.nazev_firmy : s.seller.type === "fo" || s.seller.type === "osvc" ? s.seller.jmeno_prijmeni : ""}
            </p>
          </div>
        </div>
        <div className="flex-1 text-center">
          <p className="mb-2">V {s.mesto || "_______________"} dne {formatDate(s.datum)}</p>
          <div className="mt-16 border-t border-black pt-2">
            <p className="font-medium">Kupující</p>
            <p className="text-sm">
              {s.buyer.type === "po" ? s.buyer.nazev_firmy : s.buyer.type === "fo" || s.buyer.type === "osvc" ? s.buyer.jmeno_prijmeni : ""}
            </p>
          </div>
        </div>
      </div>

      {/* ====== Předávací protokol ====== */}
      {s.generateProtocol && (
        <div className="page-break mt-12">
          <div className="text-center mb-8">
            <h2 className="text-lg font-bold uppercase tracking-wide mb-1">
              Příloha č. 1 — Předávací protokol
            </h2>
            <p className="text-sm text-gray-600">ke kupní smlouvě ze dne {formatDate(s.datum)}</p>
          </div>

          <table className="w-full border-collapse mb-6" style={{ fontSize: "10.5pt" }}>
            <tbody>
              <TR label="Datum předání" value={formatDate(s.datum)} />
              <TR label="Místo předání" value={s.mesto || "_______________"} />
              <TR label="Vozidlo" value={`${v.tovarni_znacka} ${v.model}`} />
              <TR label="VIN" value={v.vin || "_______________"} />
              {s.vehicleOrigin === "cz" && <TR label="RZ" value={v.registracni_znacka || "_______________"} />}
              <TR label="Stav tachometru při předání" value={`${v.stav_tachometru_km.toLocaleString("cs-CZ")} km`} />
            </tbody>
          </table>

          <h3 className="font-bold mb-2">Předávané položky:</h3>
          <div className="mb-6">
            {isImport ? (
              <CheckList items={[
                ...s.deImportDocs
                  .filter((id) => !DE_ONLY_DOCS.has(id) || s.vehicleOrigin === "de_import")
                  .map((id) => DE_IMPORT_DOC_LABELS[id]),
                `Klíče (${v.pocet_klicu} ks)`,
              ]} />
            ) : (
              <CheckList items={[
                ...Object.entries(CZ_PROTOCOL_ITEMS)
                  .filter(([id]) => s.czProtocolItems[id])
                  .map(([, label]) => label),
                `Klíče (${v.pocet_klicu} ks)`,
              ]} />
            )}
            {s.servisniKnizka && (
              <div className="mt-3">
                <CheckList items={["Servisní knížka"]} />
                {s.servisniKnizkaDetail && (
                  <p className="text-[10pt] ml-6 mt-1 text-gray-600">{s.servisniKnizkaDetail}</p>
                )}
              </div>
            )}
          </div>

          {/* Ostatní informace */}
          {(s.protokolOstatni || s.protokolZelenaZnacka) && (
            <div className="mb-6">
              <h3 className="font-bold mb-2">Ostatní informace:</h3>
              {s.protokolOstatni && <p className="mb-2 whitespace-pre-line">{s.protokolOstatni}</p>}
              {s.protokolZelenaZnacka && (
                <p className="text-[10.5pt]">
                  V případě použití zvláštní registrační značky (zelené papírové převozové značky) nutno tuto značku
                  odevzdat před přihlášením vozidla na příslušném dopravním úřadě.
                </p>
              )}
            </div>
          )}

          <p className="mb-2">
            Kupující potvrzuje převzetí vozidla a všech výše uvedených položek.
          </p>

          <div className="mt-12 flex justify-between gap-12 no-break">
            <div className="flex-1 text-center">
              <div className="mt-16 border-t border-black pt-2">
                <p className="font-medium">Předávající (prodávající)</p>
              </div>
            </div>
            <div className="flex-1 text-center">
              <div className="mt-16 border-t border-black pt-2">
                <p className="font-medium">Přebírající (kupující)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -- Helper components -- */

function Article({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 no-break">
      <h2 className="text-center font-bold mb-2 uppercase text-[12pt]">
        Článek {number} — {title}
      </h2>
      {children}
    </div>
  );
}

/** Numbered paragraph: renders "5.3 Text..." */
function P({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="mb-2 pl-8 relative">
      <span className="absolute left-0 font-bold text-[10.5pt]">{n}</span>
      {children}
    </p>
  );
}

function TR({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-gray-300">
      <td className="py-1.5 pr-4 font-medium text-gray-700 w-[45%]">{label}</td>
      <td className="py-1.5">{value || "_______________"}</td>
    </tr>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 border border-gray-400 rounded-sm flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
