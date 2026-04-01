import Image from "next/image";
import { type ReactNode } from "react";

interface WhyItem {
  icon: ReactNode;
  title: string;
  desc: string;
}

const items: WhyItem[] = [
  {
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    title: "Cebia ke každému vozu",
    desc: "Historie, počet majitelů, stav tachometru — vše ověřeno certifikátem Cebia. Žádná slova, jen doklady.",
  },
  {
    icon: <><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16" /></>,
    title: 'Sekce „Co není dokonalé"',
    desc: "Každý vůz má přiznané vady. Žádná překvapení po koupi.",
  },
  {
    icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    title: "Aviloo měření baterie u EV",
    desc: "Pro každý elektromobil zajistíme certifikované měření stavu baterie Aviloo. Kupujete s jistotou.",
  },
  {
    icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>,
    title: "Kompletní zákaznický servis na jednom místě",
    desc: "Pomůžeme s vybráním vozu, doporučením, řekneme Vám silné a slabé stránky a na Vás bude jen si vybrat.",
  },
];

export default function WhyCarBeat() {
  return (
    <section className="py-24 bg-bg" id="proc-carbeat">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 gap-20 items-stretch max-lg:grid-cols-1 max-lg:gap-12">
          {/* Image */}
          <div className="flex flex-col">
            <div className="flex-1 rounded-[20px] overflow-hidden bg-bg dark:bg-bg">
              <Image
                src="/images/josef-cipra.jpg"
                alt="Josef Cipra – CarBeat"
                width={600}
                height={600}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="inline-block text-xs font-bold tracking-[2px] uppercase text-blue mb-3">
              Proč auto od Carbeat
            </span>
            <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold leading-[1.15] text-text mb-3">
              Carbeat.<br />Nadšenci, ne <span className="text-blue">autobazar</span>.
            </h2>
            <p className="text-lg text-text-muted mt-3 max-w-[560px] mb-8">
              Nejsme velká společnost. Každé auto vybíráme dle daných kritérií, soustředíme se na osvědčené a spolehlivé vozy / motorizace. Většina ojetých aut může mít vady - vždy říkáme vše dopředu, nic netajíme. Protože férovost je naše zásada.
            </p>

            <div className="flex flex-col gap-5">
              {items.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-5 rounded-[12px] border border-border bg-surface transition-colors duration-[250ms] hover:bg-blue-xlight dark:bg-[#0f1e2c] dark:border-[#1e3348] dark:hover:border-blue"
                >
                  <div className="w-10 h-10 bg-blue-light rounded-[8px] flex items-center justify-center shrink-0 text-blue">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      {item.icon}
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text mb-1">{item.title}</p>
                    <p className="text-[13px] text-text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
