"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { EKG_PATH } from "./ekgPath";

const videos = [
  "/videos/video-1-leon.mp4",
  "/videos/video-2-amg-interier.mp4",
  "/videos/video-3-arona.mp4",
  "/videos/video-4-mini.mp4",
  "/videos/video-5-amg-exterier.mp4",
  "/videos/video-6-mazda.mp4",
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const pulseRef = useRef<SVGPathElement>(null);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % videos.length);
  }, []);

  // EKG pulse-travel animationiteration triggers slide change
  useEffect(() => {
    const pulse = pulseRef.current;
    if (!pulse) return;

    const handler = () => nextSlide();
    pulse.addEventListener("animationiteration", handler);
    return () => pulse.removeEventListener("animationiteration", handler);
  }, [nextSlide]);

  // Play/pause videos on slide change
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === activeSlide) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeSlide]);

  return (
    <div className="min-h-[calc(100vh-36px-68px)] min-h-[calc(100dvh-36px-68px)] flex flex-col mt-[calc(36px+68px)] max-md:min-h-[calc(100vh-64px)] max-md:min-h-[calc(100dvh-64px)] max-md:mt-[64px]">
      <section className="relative flex-1 flex items-center overflow-hidden bg-dark">
        {/* Video slideshow */}
        <div className="absolute inset-0 z-0">
          {videos.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out will-change-[opacity] ${
                i === activeSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                muted
                playsInline
                preload={i === 0 ? "auto" : "metadata"}
                autoPlay={i === 0}
                className="w-full h-full object-cover object-[center_40%]"
              >
                <source src={src} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[rgba(10,20,30,0.90)] from-45% to-[rgba(10,20,30,0.60)]" />

        {/* Decorative light */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(28,138,201,0.18)_0%,transparent_70%)] pointer-events-none z-[2]" />

        {/* Content */}
        <div className="max-w-[1200px] mx-auto px-6 w-full">
          <div className="relative z-[3] max-w-[680px] pt-12 pb-[120px]">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 mb-9">
              <div className="w-10 h-0.5 bg-blue" />
              <span className="text-[13px] font-semibold tracking-[2px] uppercase text-blue">
                Prodej aut Svinišťany u Jaroměře · Královehradecký kraj
              </span>
            </div>

            <h1 className="text-[clamp(36px,5.5vw,64px)] font-black leading-[1.08] text-white mb-4">
              Auto bez<br />
              <span className="text-blue">starostí.</span>
            </h1>
            <p className="text-[clamp(28px,4vw,48px)] font-extrabold leading-[1.1] text-white/72 mb-11">
              Prověřená ojetá auta z Německa.
            </p>

            {/* CTA */}
            <div className="flex gap-3.5 flex-wrap mb-13 max-md:flex-col">
              <Link
                href="/nabidka"
                className="inline-flex items-center gap-2 px-9 py-[18px] rounded-[8px] text-base font-semibold bg-blue text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(28,138,201,0.35)] max-md:justify-center"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18M3 9h18M3 15h18" />
                </svg>
                Prohlédnout nabídku
              </Link>
              <a
                href="tel:+420777027809"
                className="inline-flex items-center gap-2 px-9 py-[18px] rounded-[8px] text-base font-semibold bg-transparent !text-white border-2 border-white/60 transition-all duration-[250ms] hover:bg-white/12 hover:border-white max-md:justify-center"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.06a19.79 19.79 0 01-3.07-8.64A2 2 0 012 .04h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                Zavolat
              </a>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-[100px] right-10 z-[4] flex flex-col gap-2.5 max-md:hidden">
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`w-2 border-none cursor-pointer p-0 transition-all duration-300 ${
                i === activeSlide
                  ? "bg-blue h-7 rounded"
                  : "bg-white/30 h-2 rounded-full"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* EKG pulse line */}
        <div className="absolute bottom-0 left-0 right-0 h-[90px] pointer-events-none overflow-hidden z-[4]">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            <path
              className="fill-none stroke-[#1c8ac9] stroke-[3.5] [stroke-linecap:round] [stroke-linejoin:round] opacity-85 [filter:drop-shadow(0_0_10px_rgba(28,138,201,0.9))_drop-shadow(0_0_3px_#1c8ac9)] [stroke-dasharray:2800] [stroke-dashoffset:2800] animate-[drawPulse_2.8s_cubic-bezier(0.4,0,0.2,1)_forwards_0.8s]"
              d={EKG_PATH}
            />
            <path
              className="fill-none stroke-[#60c8f0] stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round] opacity-40 blur-[3px] [stroke-dasharray:2800] [stroke-dashoffset:2800] animate-[drawPulse_2.8s_cubic-bezier(0.4,0,0.2,1)_forwards_0.9s]"
              d={EKG_PATH}
            />
            <path
              ref={pulseRef}
              className="fill-none stroke-white/95 stroke-[4] [stroke-linecap:round] [stroke-linejoin:round] [stroke-dasharray:22_9999] [stroke-dashoffset:22] opacity-0 [filter:drop-shadow(0_0_4px_rgba(255,255,255,1))_drop-shadow(0_0_10px_rgba(28,138,201,0.9))_drop-shadow(0_0_20px_rgba(28,138,201,0.5))_drop-shadow(0_0_36px_rgba(28,138,201,0.25))] animate-[travelGlow_5s_linear_infinite_3.6s]"
              d={EKG_PATH}
            />
          </svg>
        </div>
      </section>

      {/* Trust Bar — inside hero-wrap for unified viewport height */}
      <section className="bg-surface border-b border-border dark:bg-surface dark:border-border">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {[
              { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, title: "Cebia certifikát", desc: "Ke každému vozu bez výjimky" },
              { icon: <><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></>, title: "Mechanik vítán", desc: "Přiveďte si vlastního odborníka" },
              { icon: <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></>, title: "Videohovor u auta", desc: "Prohlídka kdekoliv, kdykoliv" },
              { icon: <><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></>, title: "5 min od D11", desc: "Svinišťany u Jaroměře" },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 py-7 px-6 transition-colors duration-[250ms] hover:bg-blue-xlight
                  ${i < 3 ? "border-r border-border max-lg:even:border-r-0 max-sm:border-r-0" : ""}
                  ${i >= 2 ? "max-lg:border-t max-lg:border-border" : ""}
                  max-sm:border-r-0 max-sm:border-b max-sm:border-border max-sm:last:border-b-0
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
    </div>
  );
}
