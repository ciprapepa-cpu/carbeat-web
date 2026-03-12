import { type ReactNode } from "react";

interface Step {
  number: string;
  icon: ReactNode;
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    number: "01",
    icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M3 9h18M3 15h18" /></>,
    title: "Vyberte online",
    desc: "Projděte aktuální nabídku. U každého vozu najdete kompletní výbavu, fotodokumentaci a otevřené přiznání vad. Vše víte předem.",
  },
  {
    number: "02",
    icon: <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></>,
    title: "Prohlídka na dálku i osobně",
    desc: "Zajistíme videohovor přímo u auta. Nemáte čas? Přiveďte si vlastního mechanika — prohlídka je vždy vítána.",
  },
  {
    number: "03",
    icon: <><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
    title: "Odjedete s klidným svědomím",
    desc: "Vozy mají platnou STK, pomůžeme přihlášení, zařídíme výhodné pojištění. Máme kontakty i na financování, nebo dokoupení prodloužené záruky. S vozem odjíždíte ihned po vyřízení formalit.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-dark text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-[2px] uppercase text-blue mb-3">
            Jednoduchý proces
          </span>
          <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold leading-[1.15]">
            Koupě auta<br /><span className="text-blue">bez komplikací</span>
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-8 max-lg:grid-cols-1">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative bg-dark-2 rounded-[20px] p-8 border border-white/8 transition-all duration-[250ms] hover:-translate-y-1 hover:border-blue/30"
            >
              <div className="text-[48px] font-black text-white/8 absolute top-4 right-6 leading-none">
                {step.number}
              </div>
              <div className="w-12 h-12 bg-blue/15 rounded-[8px] flex items-center justify-center text-blue mb-5">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  {step.icon}
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-white/55 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
