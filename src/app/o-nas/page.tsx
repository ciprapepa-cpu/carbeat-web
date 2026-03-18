import type { Metadata } from "next";
import WhyCarBeat from "@/components/home/WhyCarBeat";
import Services from "@/components/home/Services";
import Contact from "@/components/home/Contact";

export const metadata: Metadata = {
  title: "O nás | CarBeat",
  description:
    "Proč si vybrat CarBeat? Dovážíme prověřená ojetá vozidla z Německa. Cebia certifikát, přiznané vady, osobní přístup. Naše služby a kontakt.",
  alternates: { canonical: "/o-nas" },
};

export default function ONasPage() {
  return (
    <>
      {/* Page header */}
      <section className="pt-40 pb-12 bg-bg max-md:pt-28">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="inline-block text-xs font-bold tracking-[2px] uppercase text-blue mb-3">
            Kdo jsme
          </span>
          <h1 className="text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.1] text-text">
            O nás
          </h1>
        </div>
      </section>

      <WhyCarBeat />
      <Services />
      <Contact />
    </>
  );
}
