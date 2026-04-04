import Link from "next/link";
import Image from "next/image";

const segments = [
  {
    href: "/nabidka?segment=japonska",
    variant: "suv" as const,
    bg: "bg-gradient-to-br from-[#1a3c5e] via-[#0d2637] to-[#071521]",
    labelColor: "text-blue",
    label: "Spolehlivost & kvalita",
    title: "Japonská auta",
    brands: "Toyota · Mazda · Honda · Nissan · Subaru",
    graphic: (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 250" fill="none">
        <rect x="20" y="15" width="160" height="100" rx="3" stroke="rgba(255,255,255,0.10)" strokeWidth="2" fill="none" />
        <circle cx="100" cy="65" r="28" fill="rgba(220,50,50,0.14)" stroke="rgba(220,50,50,0.20)" strokeWidth="2" />
      </svg>
    ),
  },
  {
    href: "/nabidka?segment=seat-cupra",
    variant: "seat" as const,
    bg: "bg-gradient-to-br from-[#1a1508] via-[#2a1f0a] to-[#0d0a03]",
    labelColor: "text-[#d4af37]",
    label: "Sportovní styl VW Group",
    title: "Seat / Cupra",
    brands: "Leon · Ibiza · Arona · Cupra Formentor · Born",
    graphic: (
      <div className="absolute top-[3%] left-[10%] right-[10%] w-[80%] h-[46%] pointer-events-none">
        <Image
          src="/images/logo-cupra.png"
          alt=""
          fill
          className="object-contain opacity-[0.12] scale-[1.08]"
          sizes="200px"
          unoptimized
        />
      </div>
    ),
  },
  {
    href: "/nabidka?segment=elektro",
    variant: "ev" as const,
    bg: "bg-gradient-to-br from-[#0d3d2e] via-[#0a3322] to-[#061a10]",
    labelColor: "text-[#4ade80]",
    label: "Stav baterie Aviloo",
    title: "Elektroauta",
    brands: "Tesla · VW ID · Hyundai Ioniq · Kia EV6",
    graphic: (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 250" fill="none">
        <path d="M110 15 L85 60 L98 60 L88 115 L128 52 L113 52 Z" stroke="rgba(74,222,128,0.16)" strokeWidth="2.5" fill="rgba(74,222,128,0.05)" strokeLinejoin="round" />
        <path d="M108 28 L90 58 L99 58 L92 105 L122 54 L111 54 Z" stroke="rgba(74,222,128,0.08)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/nabidka?segment=sportovni",
    variant: "sport" as const,
    bg: "bg-gradient-to-br from-[#2d0d0d] via-[#1a0505] to-[#0f0303]",
    labelColor: "text-[#ef4444]",
    label: "Pro nadšence",
    title: "Sportovní auta",
    brands: "Audi TTS · Mercedes AMG · BMW M · Golf GTI",
    graphic: (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 250" fill="none">
        {/* Checkered pattern — 8 cols × 5 rows */}
        {[0, 1, 2, 3, 4].map((row) =>
          [0, 1, 2, 3, 4, 5, 6, 7].map((col) => {
            const isFilled = (row + col) % 2 === 0;
            return isFilled ? (
              <rect key={`${row}-${col}`} x={20 + col * 20} y={15 + row * 20} width="20" height="20" fill="rgba(239,68,68,0.12)" />
            ) : (
              <rect key={`${row}-${col}`} x={20 + col * 20} y={15 + row * 20} width="20" height="20" stroke="rgba(239,68,68,0.10)" strokeWidth="1" />
            );
          })
        )}
      </svg>
    ),
  },
] as const;

export default function Segments() {
  return (
    <section className="py-24 bg-surface" id="segmenty">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-12">
          <span className="inline-block text-xs font-bold tracking-[2px] uppercase text-blue mb-3">
            Co nabízíme
          </span>
          <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold leading-[1.15] text-text">
            Čtyři kategorie, na které se zaměřujeme.<br />
            Jeden <span className="text-blue">férový přístup</span>.
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-5 max-xl:grid-cols-2 max-xs:grid-cols-1">
          {segments.map((seg) => (
            <Link
              key={seg.href}
              href={seg.href}
              className="group relative rounded-[20px] overflow-hidden aspect-[4/5] max-md:aspect-square block transition-all duration-[250ms] hover:-translate-y-1.5 hover:shadow-lg"
            >
              {/* BG */}
              <div className={`absolute inset-0 ${seg.bg} transition-transform duration-500 group-hover:scale-[1.06]`} />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 from-40% to-transparent to-80%" />
              {/* Graphic */}
              {seg.graphic}
              {/* Body */}
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className={`text-[11px] font-bold tracking-[2px] uppercase ${seg.labelColor} mb-1.5`}>
                  {seg.label}
                </p>
                <h3 className="text-[22px] font-extrabold text-white mb-1.5">{seg.title}</h3>
                <p className="text-[13px] text-white/50 mb-4">{seg.brands}</p>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/70 transition-all duration-[250ms] group-hover:text-white group-hover:gap-2.5">
                  Zobrazit vozy
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
