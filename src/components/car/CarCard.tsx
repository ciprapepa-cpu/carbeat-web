import Image from "next/image";
import Link from "next/link";
import type { CarStatus } from "@/types/car";

interface CarCardProps {
  slug: string;
  name: string;
  category: string;
  year: number;
  km: string;
  powerKw: string;
  transmission: string;
  fuel: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  badges?: readonly string[];
  status?: CarStatus;
}

export default function CarCard({
  slug,
  name,
  category,
  year,
  km,
  powerKw,
  transmission,
  fuel,
  price,
  imageSrc,
  imageAlt,
  badges = ["Cebia"],
  status = "v_nabidce",
}: CarCardProps) {
  const isPripravujeme = status === "pripravujeme";
  const isProdano = status === "prodano";
  const isClickable = status === "v_nabidce";

  const card = (
    <article
      className={`border border-border rounded-[20px] overflow-hidden transition-all duration-[250ms] bg-surface flex flex-col dark:border-border ${
        isClickable
          ? "hover:shadow-lg hover:-translate-y-1"
          : isProdano
            ? "opacity-75"
            : ""
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] bg-bg overflow-hidden dark:bg-bg">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className={`object-cover ${isClickable ? "transition-transform duration-500 hover:scale-105" : ""}`}
          sizes="(max-width: 900px) 100vw, 50vw"
        />

        {/* Status badge — top */}
        {isPripravujeme && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-sm font-bold !bg-[#fef3c7] !text-[#92400e]">
              Připravujeme
            </span>
          </div>
        )}
        {isProdano && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-sm font-bold bg-bg text-text-muted">
              Prodáno
            </span>
          </div>
        )}

        {/* Badges — bottom */}
        {!isProdano && (
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {badges.map((badge) => (
              <span
                key={badge}
                className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-sm font-bold ${
                  badge === "Cebia"
                    ? "!bg-[#dcfce7] !text-[#16a34a]"
                    : "bg-blue text-white"
                }`}
              >
                {badge === "Cebia" ? `✓ ${badge}` : badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 px-[22px] flex flex-col flex-1">
        <p
          className={`text-[11px] font-semibold uppercase tracking-[1.5px] mb-[6px] ${
            isPripravujeme ? "text-[#b45309]" : "text-blue"
          }`}
        >
          {category}
        </p>
        <h3 className="text-xl font-bold text-text mb-[10px] leading-snug min-h-[2.5em] line-clamp-2">
          {name}
        </h3>

        {/* Specs — W layout */}
        <div className="flex justify-between mb-1.5 text-[15px] text-text-muted">
          <span className="spec-icon spec-icon--year">{year}</span>
          <span className="spec-icon spec-icon--km">{km}</span>
          <span className="spec-icon spec-icon--power">{powerKw}</span>
        </div>
        <div className="flex justify-center gap-12 mb-4 text-[15px] text-text-muted">
          <span className="spec-icon spec-icon--trans">{transmission}</span>
          <span className="spec-icon spec-icon--fuel">{fuel}</span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
          {!isProdano && (
            <div className={`font-extrabold text-text ${price === "Cena na dotaz" ? "text-[20px]" : "text-[26px]"}`}>{price}</div>
          )}

          {isClickable && (
            <Link
              href={`/auto/${slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] text-sm font-semibold bg-blue !text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(28,138,201,0.35)]"
            >
              Prohlédnout vůz →
            </Link>
          )}

          {isPripravujeme && (
            <Link
              href="/#kontakt"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] text-sm font-semibold bg-blue !text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(28,138,201,0.35)]"
            >
              Zeptat se na vůz →
            </Link>
          )}
        </div>
      </div>
    </article>
  );

  // Prodáno cards are not clickable at all
  return card;
}
