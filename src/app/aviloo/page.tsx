"use client";

import { useState } from "react";
import Image from "next/image";

const certificates = [
  {
    src: "/aviloo/certifikat-aviloo-1.jpg",
    alt: "AVILOO Battery Certificate - Premium Test",
    label: "This is AVILOO",
  },
  {
    src: "/aviloo/certifikat-aviloo-2.jpg",
    alt: "AVILOO Battery Certificate - Flash Test",
    label: "AVILOO Flash Test",
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
      <section className="pt-[calc(36px+68px)] max-md:pt-[64px] bg-dark dark:bg-[#152a3a] pb-14">
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
                Vybití (jízdou) ze 100 % na 10 % je nutné stihnout v rozmezí maximálně 7 dnů
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
                <div className="relative aspect-[3/2] overflow-hidden bg-white">
                  <Image
                    src={cert.src}
                    alt={cert.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, 400px"
                  />
                </div>
                <div className="p-4 text-center border-t border-border">
                  <p className="font-bold text-text text-sm">{cert.label}</p>
                  <p className="text-xs text-text-muted mt-1">Klikněte pro zvětšení</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-bg">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-[11px] font-bold tracking-[2px] uppercase text-blue mb-2">
              Ceník
            </span>
            <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold text-text leading-tight mb-4">
              Kolik to <span className="text-blue">stojí?</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[960px] mx-auto">
            {/* Flash Test */}
            <div className="bg-surface border border-border rounded-[20px] p-8 flex flex-col items-center text-center transition-all duration-[250ms] hover:border-blue hover:shadow-[0_4px_16px_rgba(28,138,201,0.10)]">
              <div className="w-12 h-12 rounded-xl bg-blue-light flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text mb-1">Flash Test</h3>
              <p className="text-sm text-text-muted mb-4">Rychlý 3minutový test</p>
              <div className="text-[36px] font-black text-blue leading-none mb-1">1 900 Kč</div>
              <p className="text-xs text-text-muted">s DPH</p>
            </div>

            {/* Premium do 2 dnů */}
            <div className="bg-surface border-2 border-blue rounded-[20px] p-8 flex flex-col items-center text-center shadow-[0_4px_16px_rgba(28,138,201,0.10)]">
              <div className="w-12 h-12 rounded-xl bg-blue-light flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text mb-1">Premium Test</h3>
              <p className="text-sm text-text-muted mb-4">Půjčení AVILOO Boxu do 2 dnů</p>
              <div className="text-[36px] font-black text-blue leading-none mb-1">4 200 Kč</div>
              <p className="text-xs text-text-muted">s DPH</p>
            </div>

            {/* Premium do 7 dnů */}
            <div className="bg-surface border border-border rounded-[20px] p-8 flex flex-col items-center text-center transition-all duration-[250ms] hover:border-blue hover:shadow-[0_4px_16px_rgba(28,138,201,0.10)]">
              <div className="w-12 h-12 rounded-xl bg-blue-light flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text mb-1">Premium Test</h3>
              <p className="text-sm text-text-muted mb-4">Půjčení AVILOO Boxu do 7 dnů</p>
              <div className="text-[36px] font-black text-blue leading-none mb-1">4 900 Kč</div>
              <p className="text-xs text-text-muted">s DPH</p>
            </div>
          </div>

          <div className="mt-6 bg-surface border border-border rounded-[20px] p-5 flex items-start gap-4 max-w-[960px] mx-auto">
            <div className="w-10 h-10 rounded-lg bg-blue-light flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-text text-[15px] mb-1">Kauce u Premium Testu</p>
              <p className="text-sm text-text-muted leading-relaxed">
                Při zapůjčení AVILOO Boxu je nutná vratná kauce <strong className="text-text">25 000 Kč</strong>.
                Kauce je vrácena po řádném vrácení zařízení.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported vehicles */}
      <section className="py-24 bg-surface">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="bg-bg border border-border rounded-[20px] p-8 sm:p-10 text-center">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-blue-light flex items-center justify-center">
              <svg className="w-7 h-7 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-[clamp(22px,3vw,30px)] font-extrabold text-text leading-tight mb-3">
              Zjistěte, zda je možné otestovat váš vůz
            </h2>
            <p className="text-text-muted max-w-[600px] mx-auto mb-6 leading-relaxed">
              AVILOO podporuje širokou škálu elektromobilů a plug-in hybridů na trhu. Zda je mezi nimi i vaše vozidlo (nebo vozidla vašich zákazníků), si můžete snadno a rychle ověřit.
            </p>
            <a
              href="https://aviloo.com/en/vehicle-coverage"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[8px] text-[15px] font-semibold bg-blue !text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(28,138,201,0.35)]"
            >
              Seznam podporovaných vozidel
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
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
              className="inline-flex items-center gap-2 px-9 py-4.5 rounded-[8px] text-base font-bold bg-white !text-blue border-2 border-white transition-all duration-[250ms] hover:bg-blue-light"
            >
              Zavolat
            </a>
            <a
              href="https://wa.me/420777027809"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-9 py-4.5 rounded-[8px] text-base font-bold bg-[#25D366] !text-white border-2 border-[#25D366] transition-all duration-[250ms] hover:bg-[#1da851] hover:border-[#1da851]"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[2000] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors cursor-pointer border-none backdrop-blur-sm"
            aria-label="Zavřít"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative w-full max-w-[900px] aspect-[3/2]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox}
              alt="AVILOO certifikát"
              fill
              className="object-contain rounded-[12px]"
              sizes="(max-width: 768px) 100vw, 900px"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
