const GoogleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" className="inline-block align-[-1px]">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const reviews = [
  {
    initials: "TD",
    name: "Tomáš Daniel",
    date: "leden 2026",
    text: `\u201EOd prvního kontaktu přes flexibilní domluvu v průběhu až po finální popis aktuálního stavu auta (nechal jsem si předem prověřit nezávislým technikem a také vstřícnost). Slušné a transparentní chování, více takových prodejců! Tady nejsem naposledy.\u201C`,
  },
  {
    initials: "MM",
    name: "Martina Maixnerová",
    date: "prosinec 2025",
    text: `\u201EVelice profesionální a přátelský přístup. Pan Cipra mi poradil s výběrem auta a následně i s výběrem druhé sady kol. Při koupi dalšího vozu, budu rozhodně opět kontaktovat CarBeat. Opravdu mohu doporučit. Výborná komunikace a domluva.\u201C`,
  },
  {
    initials: "YR",
    name: "Yuliana Reblyan",
    date: "listopad 2025",
    text: `\u201ERychlé jednání, velmi příjemný přístup, dobrý poměr cena/výkon, časová flexibilita a rozumná domluva.\u201C`,
  },
] as const;

export default function Reviews() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-[2px] uppercase text-blue mb-3">
            Hodnocení zákazníků
          </span>
          <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold leading-[1.15] text-text">
            Co říkají <span className="text-blue">spokojení zákazníci</span>
          </h2>

          {/* Google badge */}
          <div className="inline-flex items-center gap-3 mt-6 px-6 py-3 rounded-full border border-border bg-surface dark:bg-surface dark:border-border">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <div className="text-sm">
              <strong className="text-text">5,0</strong>
              <span className="text-text-muted"> / 5</span>
            </div>
            <div className="text-[13px] text-text-muted">16 recenzí na Google</div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
          {reviews.map((review) => (
            <div
              key={review.initials}
              className="p-7 rounded-[16px] border border-border bg-surface transition-all duration-[250ms] hover:-translate-y-1 hover:shadow-md dark:bg-surface dark:border-border"
            >
              <div className="text-[#f59e0b] text-lg mb-4">★★★★★</div>
              <p className="text-sm text-text-muted leading-relaxed mb-6">{review.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue/15 flex items-center justify-center text-sm font-bold text-blue">
                  {review.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-text">{review.name}</div>
                  <div className="text-xs text-text-muted">
                    <GoogleIcon /> Google · {review.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a
            href="https://www.google.com/maps/place/CarBeat+s.r.o./@50.38,15.9,17z/"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[8px] text-[15px] font-semibold bg-transparent text-blue border-2 border-blue transition-all duration-[250ms] hover:bg-blue hover:!text-white"
            target="_blank"
            rel="noopener"
          >
            Všech 16 recenzí na Google
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
