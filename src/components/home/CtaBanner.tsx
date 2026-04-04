import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="py-20 bg-bg">
      <div className="max-w-[800px] mx-auto px-6 text-center">
        <h2 className="text-[clamp(24px,3.5vw,36px)] font-extrabold leading-[1.2] text-text mb-4">
          Máte zájem o prověřené vozidlo?
        </h2>
        <p className="text-lg text-text-muted mb-8 max-w-[560px] mx-auto">
          Podívejte se na naši nabídku nebo nás kontaktujte — rádi Vám poradíme s výběrem.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/nabidka"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[8px] text-[15px] font-semibold bg-blue !text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(28,138,201,0.35)]"
          >
            Nabídka vozů
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/o-nas#kontakt"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[8px] text-[15px] font-semibold bg-transparent text-blue border-2 border-blue transition-all duration-[250ms] hover:bg-blue hover:!text-white hover:-translate-y-0.5"
          >
            Kontaktujte nás
          </Link>
        </div>
      </div>
    </section>
  );
}
