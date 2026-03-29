import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zásady cookies | CarBeat",
  description:
    "Informace o tom, jaké cookies používáme na webu CarBeat, k čemu slouží a jak můžete spravovat své preference.",
  alternates: { canonical: "/zasady-cookies" },
};

export default function ZasadyCookiesPage() {
  return (
    <>
      <section className="pt-40 pb-12 bg-bg max-md:pt-28">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="inline-block text-xs font-bold tracking-[2px] uppercase text-blue mb-3">
            Právní informace
          </span>
          <h1 className="text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.1] text-text">
            Zásady cookies
          </h1>
        </div>
      </section>

      <section className="pb-20 bg-bg">
        <div className="max-w-[800px] mx-auto px-6 text-text">
          <div className="space-y-8 text-[15px] leading-[1.75]">
            <div>
              <h2 className="text-xl font-bold mb-3">Co jsou cookies?</h2>
              <p className="text-text-muted">
                Cookies jsou malé textové soubory, které se ukládají do Vašeho prohlížeče
                při návštěvě webových stránek. Pomáhají nám zajistit správné fungování webu,
                analyzovat návštěvnost a zobrazovat relevantní reklamy.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">Jaké cookies používáme?</h2>

              <div className="space-y-5">
                <div className="rounded-[12px] border border-border p-5">
                  <h3 className="font-semibold mb-1">Nezbytné cookies</h3>
                  <p className="text-sm text-text-muted mb-2">
                    Zajišťují základní funkce webu, jako je navigace a přístup k zabezpečeným
                    oblastem. Bez těchto cookies by web nemohl správně fungovat. Nelze je vypnout.
                  </p>
                  <div className="text-xs text-text-muted">
                    <span className="font-semibold text-text">cookie_consent</span> — uchovává
                    Vaše preference ohledně cookies (1 rok)
                  </div>
                </div>

                <div className="rounded-[12px] border border-border p-5">
                  <h3 className="font-semibold mb-1">Analytické cookies</h3>
                  <p className="text-sm text-text-muted mb-2">
                    Pomáhají nám pochopit, jak návštěvníci používají náš web. Data jsou
                    anonymizována a slouží ke zlepšování obsahu a uživatelského zážitku.
                  </p>
                  <div className="text-xs text-text-muted space-y-1">
                    <div>
                      <span className="font-semibold text-text">Google Analytics 4</span> —
                      měření návštěvnosti, chování uživatelů, zdroje návštěv
                    </div>
                    <div>
                      Cookies: <code className="bg-surface px-1 rounded">_ga</code>,{" "}
                      <code className="bg-surface px-1 rounded">_ga_*</code> (až 2 roky)
                    </div>
                  </div>
                </div>

                <div className="rounded-[12px] border border-border p-5">
                  <h3 className="font-semibold mb-1">Marketingové cookies</h3>
                  <p className="text-sm text-text-muted mb-2">
                    Slouží k cílení reklam a měření jejich účinnosti. Umožňují Vám zobrazovat
                    relevantní nabídky na sociálních sítích.
                  </p>
                  <div className="text-xs text-text-muted space-y-1">
                    <div>
                      <span className="font-semibold text-text">Meta Pixel</span> —
                      sledování konverzí a retargeting na Facebooku a Instagramu
                    </div>
                    <div>
                      Cookies: <code className="bg-surface px-1 rounded">_fbp</code>,{" "}
                      <code className="bg-surface px-1 rounded">_fbc</code> (až 90 dní)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">Jak spravovat cookies?</h2>
              <p className="text-text-muted">
                Při první návštěvě webu se Vám zobrazí lišta, kde můžete přijmout všechny
                cookies, nebo si vybrat pouze ty kategorie, které Vám vyhovují.
                Své preference můžete kdykoli změnit smazáním cookies ve Vašem prohlížeči —
                při další návštěvě se Vám lišta zobrazí znovu.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">Jak smazat cookies v prohlížeči?</h2>
              <ul className="list-disc pl-5 space-y-1 text-text-muted">
                <li><strong className="text-text">Chrome:</strong> Nastavení → Soukromí a zabezpečení → Smazat údaje o prohlížení</li>
                <li><strong className="text-text">Firefox:</strong> Nastavení → Soukromí a zabezpečení → Cookies a data stránek</li>
                <li><strong className="text-text">Safari:</strong> Předvolby → Soukromí → Spravovat data webových stránek</li>
                <li><strong className="text-text">Edge:</strong> Nastavení → Soukromí → Vymazat údaje o prohlížení</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">Provozovatel</h2>
              <p className="text-text-muted">
                Josef Cipra — CarBeat<br />
                E-mail:{" "}
                <a href="mailto:info@carbeat.cz" className="text-blue hover:text-blue-hover underline">
                  info@carbeat.cz
                </a><br />
                Telefon:{" "}
                <a href="tel:+420777027809" className="text-blue hover:text-blue-hover underline">
                  +420 777 027 809
                </a>
              </p>
            </div>

            <p className="text-xs text-text-muted pt-4 border-t border-border">
              Poslední aktualizace: 29. března 2026
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
