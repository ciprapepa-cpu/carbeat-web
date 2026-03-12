const items = [
  {
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    title: "Cebia certifikát",
    desc: "Ke každému vozu bez výjimky",
  },
  {
    icon: <><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></>,
    title: "Mechanik vítán",
    desc: "Přiveďte si vlastního odborníka",
  },
  {
    icon: <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></>,
    title: "Videohovor u auta",
    desc: "Prohlídka kdekoliv, kdykoliv",
  },
  {
    icon: <><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></>,
    title: "5 min od D11",
    desc: "Svinišťany u Jaroměře",
  },
] as const;

export default function TrustBar() {
  return (
    <section className="bg-surface border-b border-border dark:bg-surface dark:border-border">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-4 max-lg:grid-cols-2 max-xs:grid-cols-1">
          {items.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 py-7 px-6 transition-colors duration-[250ms] hover:bg-blue-xlight
                ${i < items.length - 1 ? "border-r border-border max-lg:last:border-r-0" : ""}
                ${i >= 2 ? "max-lg:border-t max-lg:border-border" : ""}
                max-xs:border-r-0 max-xs:border-b max-xs:border-border max-xs:last:border-b-0
              `}
            >
              <div className="w-12 h-12 bg-blue-light rounded-[8px] flex items-center justify-center shrink-0 text-blue">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  {item.icon}
                </svg>
              </div>
              <div>
                <strong className="block text-sm font-bold text-text mb-0.5">{item.title}</strong>
                <span className="text-[13px] text-text-muted">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
