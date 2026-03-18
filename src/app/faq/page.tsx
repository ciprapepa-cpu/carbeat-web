import type { Metadata } from "next";
import FAQ from "@/components/o-nas/FAQ";
import { faqItems } from "@/components/o-nas/faqData";

export const metadata: Metadata = {
  title: "Časté dotazy | CarBeat",
  description:
    "Jak probíhá dovoz auta z Německa? Odkud auta kupujeme? Poskytujeme záruku? Odpovědi na nejčastější otázky o nákupu prověřených ojetých vozů z Německa.",
  alternates: { canonical: "/faq" },
};

function FAQJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function FAQPage() {
  return (
    <>
      <FAQJsonLd />

      {/* Page header */}
      <section className="pt-40 pb-4 bg-bg max-md:pt-28">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="inline-block text-xs font-bold tracking-[2px] uppercase text-blue mb-3">
            FAQ
          </span>
          <h1 className="text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.1] text-text">
            Časté dotazy
          </h1>
        </div>
      </section>

      <FAQ />
    </>
  );
}
