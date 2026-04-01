import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
  PageBreak,
  convertMillimetersToTwip,
  Packer,
  PageOrientation,
} from "docx";
import { saveAs } from "file-saver";
import type {
  ContractWizardState,
  LegalRegime,
  PersonData,
} from "@/types/contract";
import {
  DECLARATION_LABELS,
  DE_IMPORT_DOC_LABELS,
  DE_ONLY_DOCS,
  CZ_PROTOCOL_ITEMS,
} from "@/types/contract";
import { formatCurrency } from "./contractUtils";

const FONT = "Georgia";
const FONT_SIZE = 22; // 11pt in half-points
const SMALL_SIZE = 21; // 10.5pt
const HEADING_SIZE = 24; // 12pt

function formatDate(dateStr: string): string {
  if (!dateStr) return "_______________";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

function txt(text: string, opts?: { bold?: boolean; italic?: boolean; size?: number; color?: string }): TextRun {
  return new TextRun({
    text,
    font: FONT,
    size: opts?.size ?? FONT_SIZE,
    bold: opts?.bold,
    italics: opts?.italic,
    color: opts?.color,
  });
}

function heading(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 },
    children: [txt(text, { bold: true, size: HEADING_SIZE })],
  });
}

function numberedPara(num: string, runs: TextRun[]): Paragraph {
  return new Paragraph({
    spacing: { after: 80 },
    indent: { left: convertMillimetersToTwip(10), hanging: convertMillimetersToTwip(10) },
    children: [txt(`${num} `, { bold: true, size: SMALL_SIZE }), ...runs],
  });
}

function simplePara(text: string, opts?: { indent?: boolean; spacing?: number; bold?: boolean }): Paragraph {
  return new Paragraph({
    spacing: { after: opts?.spacing ?? 80 },
    indent: opts?.indent ? { left: convertMillimetersToTwip(10) } : undefined,
    children: [txt(text, { bold: opts?.bold })],
  });
}

function emptyPara(): Paragraph {
  return new Paragraph({ spacing: { after: 40 }, children: [] });
}

function personParagraphs(person: PersonData, role: "prodávající" | "kupující"): Paragraph[] {
  const paras: Paragraph[] = [];
  const add = (label: string, value: string) => {
    paras.push(new Paragraph({
      indent: { left: convertMillimetersToTwip(15) },
      spacing: { after: 40 },
      children: [txt(`${label}: `, { bold: true }), txt(value || "_______________")],
    }));
  };

  if (person.type === "fo") {
    add("Jméno a příjmení", person.jmeno_prijmeni);
    add("Datum narození", formatDate(person.datum_narozeni));
    add("Trvalé bydliště", person.trvale_bydliste);
    add("Číslo OP", person.cislo_op);
    paras.push(new Paragraph({
      indent: { left: convertMillimetersToTwip(15) },
      spacing: { after: 80 },
      children: [txt(`(dále jen „${role}", fyzická osoba)`, { italic: true, size: 20, color: "666666" })],
    }));
  } else if (person.type === "osvc") {
    add("Jméno a příjmení", person.jmeno_prijmeni);
    add("Datum narození", formatDate(person.datum_narozeni));
    add("Trvalé bydliště / místo podnikání", person.trvale_bydliste);
    add("Číslo OP", person.cislo_op);
    add("IČO", person.ico);
    if (person.dic) add("DIČ", person.dic);
    if (person.zapis_zr) add("Zápis v ŽR", person.zapis_zr);
    paras.push(new Paragraph({
      indent: { left: convertMillimetersToTwip(15) },
      spacing: { after: 80 },
      children: [txt(`(dále jen „${role}", podnikající fyzická osoba)`, { italic: true, size: 20, color: "666666" })],
    }));
  } else {
    add("Obchodní firma", person.nazev_firmy);
    add("Sídlo", person.sidlo);
    add("IČO", person.ico);
    if (person.dic) add("DIČ", person.dic);
    if (person.zapis_or) add("Zápis v OR", person.zapis_or);
    const jednajici = `${person.jednajici_osoba || "_______________"}, ${person.jednajici_funkce || "_______________"}${person.jednajici_opravneni ? ` (${person.jednajici_opravneni})` : ""}`;
    add("Jednající", jednajici);
    if (person.jednajici_op) add("OP jednající osoby", person.jednajici_op);
    paras.push(new Paragraph({
      indent: { left: convertMillimetersToTwip(15) },
      spacing: { after: 80 },
      children: [txt(`(dále jen „${role}", právnická osoba)`, { italic: true, size: 20, color: "666666" })],
    }));
  }
  return paras;
}

function specRow(label: string, value: string): TableRow {
  const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const bottomBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 45, type: WidthType.PERCENTAGE },
        borders: { top: noBorder, left: noBorder, right: noBorder, bottom: bottomBorder },
        children: [new Paragraph({ spacing: { before: 40, after: 40 }, children: [txt(label, { bold: true, size: SMALL_SIZE, color: "555555" })] })],
      }),
      new TableCell({
        width: { size: 55, type: WidthType.PERCENTAGE },
        borders: { top: noBorder, left: noBorder, right: noBorder, bottom: bottomBorder },
        children: [new Paragraph({ spacing: { before: 40, after: 40 }, children: [txt(value || "_______________", { size: SMALL_SIZE })] })],
      }),
    ],
  });
}

function specTable(rows: TableRow[]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
  });
}

export async function generateContractDocx(
  state: ContractWizardState,
  regime: LegalRegime,
  zbyvajiciCastka: number
): Promise<void> {
  const s = state;
  const v = s.vehicle;
  const isImport = s.vehicleOrigin === "de_import" || s.vehicleOrigin === "eu_import";

  const children: (Paragraph | Table)[] = [];

  // ===== HEADER =====
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [txt("KUPNÍ SMLOUVA NA OJETÉ MOTOROVÉ VOZIDLO", { bold: true, size: 28 })],
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [txt("uzavřená dle § 2079 a násl. zákona č. 89/2012 Sb., občanský zákoník, v platném znění", { size: 20, color: "666666" })],
  }));

  // ===== ČLÁNEK I =====
  children.push(heading("ČLÁNEK I — SMLUVNÍ STRANY"));
  children.push(numberedPara("1.1", [txt("Prodávající:", { bold: true })]));
  children.push(...personParagraphs(s.seller, "prodávající"));
  children.push(numberedPara("1.2", [txt("Kupující:", { bold: true })]));
  children.push(...personParagraphs(s.buyer, "kupující"));

  // ===== ČLÁNEK II =====
  children.push(heading("ČLÁNEK II — PŘEDMĚT SMLOUVY — IDENTIFIKACE VOZIDLA"));
  children.push(numberedPara("2.1", [txt("Prodávající prodává kupujícímu a kupující kupuje od prodávajícího následující motorové vozidlo:")]));

  const vehicleRows: TableRow[] = [
    specRow("Tovární značka", v.tovarni_znacka),
    specRow("Model", v.model),
    specRow("VIN", v.vin || "_______________"),
    specRow("Datum první registrace", formatDate(v.datum_prvni_registrace)),
    specRow("Barva", v.barva || "_______________"),
    specRow("Stav tachometru", `${v.stav_tachometru_km.toLocaleString("cs-CZ")} km`),
    specRow("Počet předávaných klíčů", `${v.pocet_klicu} ks`),
  ];
  if (s.vehicleOrigin === "cz") {
    vehicleRows.push(specRow("Registrační značka (RZ)", v.registracni_znacka || "_______________"));
    vehicleRows.push(specRow("Číslo ORV", v.cislo_orv || "_______________"));
    vehicleRows.push(specRow("Platnost STK do", formatDate(v.platnost_stk)));
  }
  if (s.vehicleOrigin === "de_import" && v.cislo_fahrzeugbrief) {
    vehicleRows.push(specRow("Číslo Fahrzeugbrief (Teil II)", v.cislo_fahrzeugbrief));
  }
  children.push(specTable(vehicleRows));
  children.push(emptyPara());

  // ===== ČLÁNEK III =====
  children.push(heading("ČLÁNEK III — PROHLÁŠENÍ PRODÁVAJÍCÍHO"));
  children.push(numberedPara("3.1", [txt("Prodávající tímto prohlašuje, že:")]));
  const declEntries = Object.entries(s.declarations).filter(([, checked]) => checked);
  for (const [id] of declEntries) {
    children.push(new Paragraph({
      indent: { left: convertMillimetersToTwip(15) },
      spacing: { after: 60 },
      children: [txt(`${id}) `, { bold: true }), txt(DECLARATION_LABELS[id])],
    }));
  }

  // ===== ČLÁNEK IV =====
  children.push(heading("ČLÁNEK IV — POPIS STAVU VOZIDLA"));
  children.push(numberedPara("4.1", [txt("Stav vozidla:", { bold: true })]));
  children.push(new Paragraph({
    indent: { left: convertMillimetersToTwip(15) },
    spacing: { after: 120 },
    children: [txt(s.stavVozidlaText || "_______________")],
  }));
  if (s.zkusebniJizda) {
    children.push(numberedPara("4.2", [
      txt("Kupující potvrzuje, že před podpisem této smlouvy absolvoval zkušební jízdu a měl možnost se s technickým stavem vozidla dostatečně seznámit."),
    ]));
  }
  children.push(numberedPara(s.zkusebniJizda ? "4.3" : "4.2", [
    txt("Stav vozidla odpovídá jeho stáří a počtu najetých kilometrů. Prodávající v této souvislosti poskytl kupujícímu pravdivé a podstatné informace."),
  ]));

  // ===== ČLÁNEK V =====
  children.push(heading("ČLÁNEK V — KUPNÍ CENA, PLATEBNÍ PODMÍNKY A PŘECHOD VLASTNICTVÍ"));

  let art5n = 0;
  children.push(numberedPara(`5.${++art5n}`, [txt("Kupní cena: ", { bold: true }), txt(formatCurrency(s.cenaCzk))]));
  children.push(numberedPara(`5.${++art5n}`, [txt("Slovy: ", { bold: true }), txt(s.cenaSlovy || "_______________")]));

  if (s.hasZaloha) {
    children.push(numberedPara(`5.${++art5n}`, [txt("Záloha: ", { bold: true }), txt(formatCurrency(s.zaloha.amount))]));
    if (s.zaloha.detail) {
      children.push(new Paragraph({
        indent: { left: convertMillimetersToTwip(15) },
        spacing: { after: 40 },
        children: [txt(s.zaloha.detail, { size: SMALL_SIZE })],
      }));
    }
    children.push(numberedPara(`5.${++art5n}`, [txt("Zbývající částka: ", { bold: true }), txt(formatCurrency(zbyvajiciCastka))]));
  }

  if (s.paymentMethod === "prevod") {
    children.push(numberedPara(`5.${++art5n}`, [
      txt(`Způsob ${s.hasZaloha ? "úhrady zbývající částky" : "platby"}: `, { bold: true }),
      txt("Bezhotovostní převod"),
    ]));
    children.push(numberedPara(`5.${++art5n}`, [
      txt(`Číslo účtu prodávajícího: ${s.sellerBankAccount || "_______________"}`),
    ]));
    children.push(numberedPara(`5.${++art5n}`, [
      txt(`Splatnost: ${s.splatnostDny === 0 ? "v den podpisu smlouvy" : `${s.splatnostDny} kalendářních dnů od podpisu smlouvy`}.`),
    ]));
    children.push(new Paragraph({
      indent: { left: convertMillimetersToTwip(15) },
      spacing: { after: 80 },
      children: [txt("Kupní cena se považuje za uhrazenou okamžikem připsání na účet prodávajícího.", { size: SMALL_SIZE })],
    }));
  }

  if (s.paymentMethod === "hotovost") {
    children.push(numberedPara(`5.${++art5n}`, [
      txt(`Způsob ${s.hasZaloha ? "úhrady zbývající částky" : "platby"}: `, { bold: true }),
      txt("Hotovost při předání vozidla"),
    ]));
    children.push(new Paragraph({
      indent: { left: convertMillimetersToTwip(15) },
      spacing: { after: 80 },
      children: [txt(
        `Podpisem této smlouvy prodávající potvrzuje převzetí ${s.hasZaloha ? "zbývající části " : ""}kupní ceny v hotovosti. Tato smlouva slouží zároveň jako kvitance ve smyslu § 1952 občanského zákoníku.`,
        { size: SMALL_SIZE },
      )],
    }));
  }

  if (s.predaniPoZaplaceni) {
    children.push(numberedPara(`5.${++art5n}`, [
      txt("K předání vozidla kupujícímu dojde až po úplném zaplacení kupní ceny dle této smlouvy."),
    ]));
  }

  children.push(numberedPara(`5.${++art5n}`, [
    txt("Vlastnické právo k vozidlu přechází na kupujícího okamžikem úplného zaplacení kupní ceny (výhrada vlastnického práva)."),
  ]));
  children.push(numberedPara(`5.${++art5n}`, [
    txt("Nebezpečí škody na vozidle přechází na kupujícího okamžikem fyzického převzetí vozidla."),
  ]));

  // ===== ČLÁNEK VI =====
  children.push(heading("ČLÁNEK VI — ZÁVĚREČNÁ UJEDNÁNÍ"));

  let art6n = 0;

  if (isImport) {
    children.push(numberedPara(`6.${++art6n}`, [
      txt("Kupující provede první registraci vozidla v České republice. Prodávající předá kupujícímu veškeré doklady nezbytné k registraci (viz předávací protokol)."),
    ]));
  } else {
    const transferTexts: Record<string, string> = {
      kupujici: "Přepis vozidla na kupujícího v registru silničních vozidel zajistí kupující na základě plné moci udělené prodávajícím.",
      spolecne: "Obě smluvní strany se společně dostaví na příslušný úřad za účelem přepisu vozidla.",
      prodavajici: "Přepis vozidla zajistí prodávající na základě plné moci udělené kupujícím.",
    };
    children.push(numberedPara(`6.${++art6n}`, [txt(transferTexts[s.transferResponsibility])]));

    if (s.transferResponsibility !== "spolecne") {
      children.push(numberedPara(`6.${++art6n}`, [
        txt(`Forma plné moci: ${s.powerOfAttorney === "overena" ? "úředně ověřená (Czech POINT / notář)" : "elektronická (Portál dopravy)"}.`),
      ]));
    }

    children.push(numberedPara(`6.${++art6n}`, [
      txt("Přepis musí být proveden do 10 pracovních dnů ode dne podpisu smlouvy (§ 8 zák. č. 56/2001 Sb.)."),
    ]));

    if (s.penalty.enabled) {
      children.push(numberedPara(`6.${++art6n}`, [
        txt(`V případě nedodržení výše uvedené lhůty je povinná strana povinna uhradit druhé smluvní straně smluvní pokutu ve výši ${formatCurrency(s.penalty.castka_za_den)} za každý den prodlení.`),
      ]));
    }

    children.push(numberedPara(`6.${++art6n}`, [
      txt("Veškeré náklady spojené s přepisem/registrací vozidla (správní poplatky, evidenční kontrola) hradí kupující."),
    ]));
    children.push(numberedPara(`6.${++art6n}`, [
      txt("Prodávající zruší stávající pojištění odpovědnosti z provozu vozidla ke dni provedení přepisu/registrace vozidla na kupujícího, nejpozději však do 14 kalendářních dnů od podpisu této smlouvy."),
    ]));
  }

  const generalClauses = [
    "Tuto smlouvu lze měnit nebo doplňovat pouze písemnými dodatky podepsanými oběma smluvními stranami.",
    "Práva a povinnosti touto smlouvou neupravené se řídí zákonem č. 89/2012 Sb., občanský zákoník.",
    "Bude-li některé ustanovení této smlouvy shledáno neplatným nebo nevymahatelným, platnost ostatních ustanovení tím není dotčena (salvátorská klauzule).",
    "Smlouva je vyhotovena ve dvou stejnopisech, z nichž každá smluvní strana obdrží jeden.",
    "Obě smluvní strany prohlašují, že tuto smlouvu uzavírají svobodně, vážně, nikoli v tísni či za nápadně nevýhodných podmínek, a že si ji před podpisem přečetly a s jejím obsahem souhlasí.",
  ];
  for (const clause of generalClauses) {
    children.push(numberedPara(`6.${++art6n}`, [txt(clause)]));
  }

  // ===== PODPISY =====
  children.push(emptyPara());
  children.push(emptyPara());
  children.push(emptyPara());

  const sellerName = s.seller.type === "po" ? s.seller.nazev_firmy : (s.seller.type === "fo" || s.seller.type === "osvc") ? s.seller.jmeno_prijmeni : "";
  const buyerName = s.buyer.type === "po" ? s.buyer.nazev_firmy : (s.buyer.type === "fo" || s.buyer.type === "osvc") ? s.buyer.jmeno_prijmeni : "";

  const sigNoBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const sigTopBorder = { style: BorderStyle.SINGLE, size: 1, color: "000000" };

  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            borders: { top: sigNoBorder, bottom: sigNoBorder, left: sigNoBorder, right: sigNoBorder },
            children: [
              new Paragraph({ alignment: AlignmentType.CENTER, children: [txt(`V ${s.mesto || "_______________"} dne ${formatDate(s.datum)}`)] }),
              emptyPara(), emptyPara(), emptyPara(), emptyPara(),
            ],
          }),
          new TableCell({
            width: { size: 10, type: WidthType.PERCENTAGE },
            borders: { top: sigNoBorder, bottom: sigNoBorder, left: sigNoBorder, right: sigNoBorder },
            children: [emptyPara()],
          }),
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            borders: { top: sigNoBorder, bottom: sigNoBorder, left: sigNoBorder, right: sigNoBorder },
            children: [
              new Paragraph({ alignment: AlignmentType.CENTER, children: [txt(`V ${s.mesto || "_______________"} dne ${formatDate(s.datum)}`)] }),
              emptyPara(), emptyPara(), emptyPara(), emptyPara(),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            borders: { top: sigTopBorder, bottom: sigNoBorder, left: sigNoBorder, right: sigNoBorder },
            children: [
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40 }, children: [txt("Prodávající", { bold: true })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [txt(sellerName, { size: 20 })] }),
            ],
          }),
          new TableCell({
            width: { size: 10, type: WidthType.PERCENTAGE },
            borders: { top: sigNoBorder, bottom: sigNoBorder, left: sigNoBorder, right: sigNoBorder },
            children: [emptyPara()],
          }),
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            borders: { top: sigTopBorder, bottom: sigNoBorder, left: sigNoBorder, right: sigNoBorder },
            children: [
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40 }, children: [txt("Kupující", { bold: true })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [txt(buyerName, { size: 20 })] }),
            ],
          }),
        ],
      }),
    ],
  }));

  // ===== PŘEDÁVACÍ PROTOKOL =====
  if (s.generateProtocol) {
    children.push(new Paragraph({ children: [new PageBreak()] }));

    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [txt("PŘÍLOHA Č. 1 — PŘEDÁVACÍ PROTOKOL", { bold: true, size: 26 })],
    }));
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [txt(`ke kupní smlouvě ze dne ${formatDate(s.datum)}`, { size: 20, color: "666666" })],
    }));

    const protoRows: TableRow[] = [
      specRow("Datum předání", formatDate(s.datum)),
      specRow("Místo předání", s.mesto || "_______________"),
      specRow("Vozidlo", `${v.tovarni_znacka} ${v.model}`),
      specRow("VIN", v.vin || "_______________"),
    ];
    if (s.vehicleOrigin === "cz") {
      protoRows.push(specRow("RZ", v.registracni_znacka || "_______________"));
    }
    protoRows.push(specRow("Stav tachometru při předání", `${v.stav_tachometru_km.toLocaleString("cs-CZ")} km`));
    children.push(specTable(protoRows));
    children.push(emptyPara());

    children.push(simplePara("Předávané položky:", { bold: true }));

    const protocolItems = isImport
      ? [
          ...s.deImportDocs
            .filter((id) => !DE_ONLY_DOCS.has(id) || s.vehicleOrigin === "de_import")
            .map((id) => DE_IMPORT_DOC_LABELS[id]),
          `Klíče (${v.pocet_klicu} ks)`,
        ]
      : [
          ...Object.entries(CZ_PROTOCOL_ITEMS)
            .filter(([id]) => s.czProtocolItems[id])
            .map(([, label]) => label),
          `Klíče (${v.pocet_klicu} ks)`,
        ];

    for (const item of protocolItems) {
      children.push(new Paragraph({
        indent: { left: convertMillimetersToTwip(5) },
        spacing: { after: 40 },
        children: [txt(`☐  ${item}`, { size: SMALL_SIZE })],
      }));
    }

    if (s.servisniKnizka) {
      children.push(new Paragraph({
        indent: { left: convertMillimetersToTwip(5) },
        spacing: { after: 40 },
        children: [txt("☐  Servisní knížka", { size: SMALL_SIZE })],
      }));
      if (s.servisniKnizkaDetail) {
        children.push(new Paragraph({
          indent: { left: convertMillimetersToTwip(10) },
          spacing: { after: 40 },
          children: [txt(s.servisniKnizkaDetail, { size: SMALL_SIZE, color: "555555" })],
        }));
      }
    }

    children.push(emptyPara());

    if (s.protokolOstatni || s.protokolZelenaZnacka) {
      children.push(simplePara("Ostatní informace:", { bold: true }));
      if (s.protokolOstatni) {
        children.push(simplePara(s.protokolOstatni, { indent: true }));
      }
      if (s.protokolZelenaZnacka) {
        children.push(new Paragraph({
          indent: { left: convertMillimetersToTwip(5) },
          spacing: { after: 80 },
          children: [txt(
            "V případě použití zvláštní registrační značky (zelené papírové převozové značky) nutno tuto značku odevzdat před přihlášením vozidla na příslušném dopravním úřadě.",
            { size: SMALL_SIZE },
          )],
        }));
      }
    }

    children.push(simplePara("Kupující potvrzuje převzetí vozidla a všech výše uvedených položek."));
    children.push(emptyPara());
    children.push(emptyPara());
    children.push(emptyPara());

    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              borders: { top: sigNoBorder, bottom: sigNoBorder, left: sigNoBorder, right: sigNoBorder },
              children: [emptyPara(), emptyPara(), emptyPara(), emptyPara()],
            }),
            new TableCell({
              width: { size: 10, type: WidthType.PERCENTAGE },
              borders: { top: sigNoBorder, bottom: sigNoBorder, left: sigNoBorder, right: sigNoBorder },
              children: [emptyPara()],
            }),
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              borders: { top: sigNoBorder, bottom: sigNoBorder, left: sigNoBorder, right: sigNoBorder },
              children: [emptyPara(), emptyPara(), emptyPara(), emptyPara()],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              borders: { top: sigTopBorder, bottom: sigNoBorder, left: sigNoBorder, right: sigNoBorder },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40 }, children: [txt("Předávající (prodávající)", { bold: true })] }),
              ],
            }),
            new TableCell({
              width: { size: 10, type: WidthType.PERCENTAGE },
              borders: { top: sigNoBorder, bottom: sigNoBorder, left: sigNoBorder, right: sigNoBorder },
              children: [emptyPara()],
            }),
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              borders: { top: sigTopBorder, bottom: sigNoBorder, left: sigNoBorder, right: sigNoBorder },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40 }, children: [txt("Přebírající (kupující)", { bold: true })] }),
              ],
            }),
          ],
        }),
      ],
    }));
  }

  // ===== BUILD & SAVE =====
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: {
            orientation: PageOrientation.PORTRAIT,
            width: convertMillimetersToTwip(210),
            height: convertMillimetersToTwip(297),
          },
          margin: {
            top: convertMillimetersToTwip(20),
            right: convertMillimetersToTwip(20),
            bottom: convertMillimetersToTwip(20),
            left: convertMillimetersToTwip(20),
          },
        },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `Kupni_smlouva_${v.tovarni_znacka}_${v.model}_${formatDate(s.datum).replace(/\s/g, "")}.docx`.replace(/\s+/g, "_");
  saveAs(blob, fileName);
}
