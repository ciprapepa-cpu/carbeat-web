export const revalidate = 60;

import Hero from "@/components/home/Hero";
import Vehicles from "@/components/home/Vehicles";
import Segments from "@/components/home/Segments";
import HowItWorks from "@/components/home/HowItWorks";
import Reviews from "@/components/home/Reviews";
import Services from "@/components/home/Services";
import CtaBanner from "@/components/home/CtaBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <Vehicles />
      <Segments />
      <HowItWorks />
      <Reviews />
      <Services />
      <CtaBanner />
    </>
  );
}
