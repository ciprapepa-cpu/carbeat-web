"use client";

import { useState } from "react";
import { faqItems } from "./faqData";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-bg" id="faq">
      <div className="max-w-[800px] mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-[2px] uppercase text-blue mb-3">
            Časté dotazy
          </span>
          <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold leading-[1.15] text-text">
            Často se nás ptáte
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqItems.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-[12px] border border-border bg-surface transition-colors duration-[250ms] dark:bg-[#0f1e2c] dark:border-[#1e3348]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer bg-transparent border-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-semibold text-text leading-snug">
                    {item.question}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className={`shrink-0 text-blue transition-transform duration-[250ms] ${isOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-[300ms] ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-text-muted leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
