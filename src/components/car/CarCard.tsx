import Image from "next/image";
import Link from "next/link";

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
}: CarCardProps) {
  return (
    <article className="border border-border rounded-[20px] overflow-hidden transition-all duration-[250ms] bg-surface flex flex-col hover:shadow-lg hover:-translate-y-1 dark:border-border">
      {/* Image */}
      <div className="relative aspect-[16/10] bg-bg overflow-hidden dark:bg-bg">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 900px) 100vw, 50vw"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {badges.map((badge) => (
            <span
              key={badge}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                badge === "Cebia"
                  ? "!bg-[#dcfce7] !text-[#16a34a]"
                  : "bg-blue text-white"
              }`}
            >
              {badge === "Cebia" ? `✓ ${badge}` : badge}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 px-[22px] flex flex-col flex-1">
        <p className="text-[11px] font-semibold text-blue uppercase tracking-[1.5px] mb-[6px]">{category}</p>
        <h3 className="text-xl font-bold text-text mb-[10px] leading-snug min-h-[2.5em] line-clamp-2">{name}</h3>

        {/* Spec row 1 */}
        <div className="flex flex-wrap gap-4 mb-2 text-[15px] text-text-muted">
          <span className="spec-icon spec-icon--year">{year}</span>
          <span className="spec-icon spec-icon--km">{km}</span>
          <span className="spec-icon spec-icon--power">{powerKw}</span>
        </div>
        {/* Spec row 2 */}
        <div className="flex flex-wrap gap-4 mb-4 text-[15px] text-text-muted">
          <span className="spec-icon spec-icon--trans">{transmission}</span>
          <span className="spec-icon spec-icon--fuel">{fuel}</span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
          <div className="text-[26px] font-extrabold text-text">{price}</div>
          <Link
            href={`/auto/${slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] text-sm font-semibold bg-blue !text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(28,138,201,0.35)]"
          >
            Detail →
          </Link>
        </div>
      </div>
    </article>
  );
}
