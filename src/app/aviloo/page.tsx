"use client";

import { useState } from "react";

const certificates = [
  {
    src: "/aviloo/certifikat-aviloo-1.pdf",
    alt: "AVILOO Battery Certificate - Premium Test",
  },
  {
    src: "/aviloo/certifikat-aviloo-2.pdf",
    alt: "AVILOO Battery Certificate - Flash Test",
  },
];

const steps = [
  {
    number: "01",
    title: "Zapojení AVILOO Boxu",
    desc: "Do diagnostického portu (OBD) vozidla se připojí speciální AVILOO Box.",
  },
  {
    number: "02",
    title: "Plné nabití",
    desc: "Baterii vozidla je potřeba nabít na 100 %.",
  },
  {
    number: "03",
    title: "Běžná jízda",
    desc: "Vozidlo se běžným stylem jízdy postupně vybije ze 100 % na úroveň 10 %.",
  },
  {
    number: "04",
    title: "Výsledek",
    desc: "Do 2 pracovních dnů je vystaven detailní a oficiální AVILOO Battery Certificate.",
  },
];

export default function AvilooPage() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      {/* Page Hero */}
      <section className="pt-[calc(36px+68px)] max-md:pt-[64px] bg-dark pb-14">
        <div className="max-w-[1200px] mx-auto px-6 pt-14">
          <p className="text-[12px] font-bold tracking-[2px] uppercase text-blue mb-3">
            Diagnostika baterie
          </p>
          <h1 className="text-[clamp(32px,5vw,52px)] font-black !text-white mb-3 leading-[1.1]">
            AVILOO <span className="text-blue">Battery Test</span>
          </h1>
          <p className="text-lg text-white/50">
            Nezávislé ověření kondice trakční baterie elektromobilů a plug-in hybridů
          </p>
        </div>
      </section>

      {/* Flash Test */}
      <section className="py-24 bg-surface">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-[11px] font-bold tracking-[2px] uppercase text-blue mb-2">
                Rychlý test
              </span>
              <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold text-text leading-tight mb-4">
                AVILOO <span className="text-blue">Flash Test</span>
              </h2>
              <p className="text-lg text-text-muted mb-6 leading-relaxed">
                Rychlý test, rychlý prodej! Navržený speciálně pro profesionály, slouží ke
                komplexnímu zjištění aktuální funkčnosti trakčních baterií.
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-light flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-text text-[15px]">Blesková rychlost</p>
                    <p className="text-sm text-text-muted">Celý proces testování zabere pouhé 3 minuty.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-light flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-text text-[15px]">Bez nutnosti jízdy</p>
                    <p className="text-sm text-text-muted">
                      Vozidlo nemusí nikam jezdit — ideální pro rychlou kontrolu.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-light flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0h6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v10m6 0v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-text text-[15px]">Objektivní hodnocení</p>
                    <p className="text-sm text-text-muted">
                      Skóre je zcela nezávislé na výrobci vozidla, vychází z rozsáhlé databáze.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-bg border border-border rounded-[20px] p-10 text-center">
              <div className="text-[80px] font-black text-blue leading-none mb-2">3</div>
              <div className="text-2xl font-bold text-text mb-2">minuty</div>
              <p className="text-text-muted">Kompletní diagnostika baterie bez jízdy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Test */}
      <section className="py-24 bg-bg">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-[11px] font-bold tracking-[2px] uppercase text-blue mb-2">
              Nejkomplexnější test na trhu
            </span>
            <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold text-text leading-tight mb-4">
              AVILOO <span className="text-blue">Premium Test</span>
            </h2>
            <p className="text-lg text-text-muted max-w-[600px] mx-auto leading-relaxed">
              Nezávislý a objektivní test podrobně analyzuje přesný stav kondice baterie
              (State of Health) a vyjadřuje jej v procentech.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-surface border border-border rounded-[20px] p-8 transition-all duration-[250ms] hover:border-blue hover:shadow-[0_4px_16px_rgba(28,138,201,0.10)]"
              >
                <div className="text-[48px] font-black text-blue-light leading-none mb-4 dark:text-blue/20">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-text mb-2">{step.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-surface border border-border rounded-[20px] p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-light flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-text text-[15px] mb-1">Časový limit</p>
              <p className="text-sm text-text-muted leading-relaxed">
                Vybití (jízdu) ze 100 % na 10 % je nutné stihnout v rozmezí maximálně 7 dnů
                od zahájení testu. Výsledky jsou k dispozici do 2 pracovních dnů.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certificates */}
      <section className="py-24 bg-surface">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-[11px] font-bold tracking-[2px] uppercase text-blue mb-2">
              Ověřeno a certifikováno
            </span>
            <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold text-text leading-tight mb-4">
              AVILOO <span className="text-blue">certifikáty</span>
            </h2>
            <p className="text-lg text-text-muted max-w-[560px] mx-auto">
              Kliknutím na certifikát jej zobrazíte v plné velikosti
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-[800px] mx-auto">
            {certificates.map((cert, i) => (
              <div
                key={i}
                onClick={() => setLightbox(cert.src)}
                className="group bg-bg border border-border rounded-[20px] overflow-hidden transition-all duration-[250ms] hover:border-blue hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-white pointer-events-none">
                  <embed
                    src={`${cert.src}#toolbar=0&navpanes=0&scrollbar=0`}
                    type="application/pdf"
                    className="w-full h-full"
                  />
                </div>
                <div className="p-4 text-center border-t border-border">
                  <p className="font-bold text-text text-sm">Certifikát AVILOO {i + 1}</p>
                  <p className="text-xs text-text-muted mt-1">Klikněte pro zvětšení</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-blue relative overflow-hidden text-center">
        <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.10)_0%,transparent_65%)] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <h2 className="text-[clamp(28px,4.5vw,48px)] font-black !text-white mb-4 leading-tight">
            Máte zájem o test baterie?
          </h2>
          <p className="text-lg text-white/75 mb-10 max-w-[520px] mx-auto">
            Kontaktujte nás a domluvte si termín diagnostiky Vašeho elektromobilu.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="tel:+420777027809"
              className="inline-flex items-center gap-2 px-9 py-4.5 rounded-[8px] text-base font-bold bg-white text-blue border-2 border-white transition-all duration-[250ms] hover:bg-blue-light"
            >
              Zavolat
            </a>
            <a
              href="https://wa.me/420777027809"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-9 py-4.5 rounded-[8px] text-base font-semibold bg-transparent !text-white border-2 border-white/60 transition-all duration-[250ms] hover:bg-white/10 hover:border-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[2000] bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer border-none"
            aria-label="Zavřít"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <iframe
            src={lightbox}
            className="w-full max-w-[800px] h-[90vh] rounded-[12px] bg-white"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
