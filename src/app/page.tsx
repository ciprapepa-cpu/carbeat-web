import Hero from "@/components/home/Hero";
import Vehicles from "@/components/home/Vehicles";
import Segments from "@/components/home/Segments";
import HowItWorks from "@/components/home/HowItWorks";
import WhyCarBeat from "@/components/home/WhyCarBeat";
import Reviews from "@/components/home/Reviews";
import Services from "@/components/home/Services";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Vehicles />
      <Segments />
      <HowItWorks />
      <WhyCarBeat />
      <Reviews />
      <Services />
      <Contact />
    </>
  );
}
