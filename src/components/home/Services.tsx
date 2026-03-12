import { type ReactNode } from "react";

interface Service {
  icon: ReactNode;
  title: string;
  desc: string;
}

const services: Service[] = [
  {
    icon: <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />,
    title: "STK + přihlášení",
    desc: "Vůz předáme s platnou STK (když vůz nemá STK, uděláme novou), můžeme Vám pomoci s přihlášením vozu.",
  },
  {
    icon: <><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></>,
    title: "Financování",
    desc: "Zprostředkujeme nabídku na nejvýhodnější úvěr na trhu. Smlouvu s finančním zástupcem můžete podepsat pohodlně rovnou u nás.",
  },
  {
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    title: "Prodloužená záruka",
    desc: "Můžete si připlatit prodlouženou záruku pro ojeté spalovací vozy i elektromobily (v závislosti na stáří a nájezdu a dalších podmínkách).",
  },
  {
    icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    title: "Aviloo měření baterie",
    desc: "Garantujeme certifikovaný stav baterie našich elektrovozů. Test Aviloo Vám uděláme i na Vašem elektrovoze - buď FLASH (rychlý na místě), nebo PREMIUM (během jízdy).",
  },
  {
    icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>,
    title: "Pojištění",
    desc: "Vyřídíme vám nejvýhodnější povinné ručení i havarijní pojištění s výběrem z nabídek většiny trhu.",
  },
];

export default function Services() {
  return (
    <section className="py-24 bg-bg" id="sluzby">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-[2px] uppercase text-blue mb-3">
            Služby
          </span>
          <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold leading-[1.15] text-text">
            Veškerý servis,<br /><span className="text-blue">který nabízíme</span>
          </h2>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 mt-12">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex flex-col items-start p-6 rounded-[12px] border border-border bg-surface transition-colors duration-[250ms] hover:bg-blue-xlight dark:border-border dark:bg-surface"
            >
              <div className="w-10 h-10 bg-blue-light rounded-[8px] flex items-center justify-center text-blue mb-4">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  {service.icon}
                </svg>
              </div>
              <p className="text-sm font-bold text-text mb-2">{service.title}</p>
              <p className="text-[13px] text-text-muted leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
