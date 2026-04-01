import Link from "next/link";
import Image from "next/image";

const nabidkaLinks = [
  { href: "/nabidka", label: "Všechna vozidla" },
  { href: "/nabidka?segment=japonska", label: "Japonská auta" },
  { href: "/nabidka?segment=seat-cupra", label: "Seat / Cupra" },
  { href: "/nabidka?segment=elektro", label: "Elektroauta" },
  { href: "/nabidka?segment=sportovni", label: "Sportovní auta" },
] as const;

const infoLinks = [
  { href: "/o-nas", label: "O nás" },
  { href: "/faq", label: "Časté dotazy" },
  { href: "/o-nas#kontakt", label: "Kontakt" },
  { href: "mailto:info@carbeat.cz", label: "info@carbeat.cz" },
  { href: "tel:+420777027809", label: "+420 777 027 809" },
] as const;

export default function Footer() {
  return (
    <footer className="bg-dark text-white/55 py-14 pb-9 dark:bg-[#060e16]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Top */}
        <div className="grid grid-cols-[2fr_1fr_1fr] gap-12 mb-12 pb-12 border-b border-white/8 max-lg:grid-cols-2 max-md:grid-cols-1">
          {/* Brand */}
          <div>
            <Image
              src="/logo.png"
              alt="CarBeat"
              width={104}
              height={52}
              className="h-[52px] w-auto mb-4 brightness-0 invert"
              unoptimized
            />
            <p className="text-sm leading-relaxed max-w-[280px]">
              Dovoz a prodej prověřených ojetých vozů z Německa. Absolutní transparentnost — Cebia certifikát ke každému vozu, vady vždy přiznáváme.
            </p>
          </div>

          {/* Nabídka */}
          <div>
            <p className="text-xs font-bold tracking-[2px] uppercase text-white/28 mb-4">
              Nabídka
            </p>
            <ul className="flex flex-col gap-2.5">
              {nabidkaLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition-colors duration-[250ms] hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informace */}
          <div>
            <p className="text-xs font-bold tracking-[2px] uppercase text-white/28 mb-4">
              Informace
            </p>
            <ul className="flex flex-col gap-2.5">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition-colors duration-[250ms] hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex justify-between items-center text-[13px] flex-wrap gap-3">
          <span>© {new Date().getFullYear()} CarBeat s.r.o.</span>
          <span>Svinišťany · 5 min od D11 u Jaroměře</span>
        </div>
      </div>
    </footer>
  );
}
