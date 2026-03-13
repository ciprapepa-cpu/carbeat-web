"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface HeaderProps {
  onMenuOpen: () => void;
}

const navLinks = [
  { href: "/#proc-carbeat", label: "Proč CarBeat" },
  { href: "/#sluzby", label: "Služby" },
  { href: "/#kontakt", label: "Kontakt" },
] as const;

export default function Header({ onMenuOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 z-[1000] overflow-visible transition-all duration-[250ms]
        top-[36px] md:top-[36px] max-md:top-0
        ${scrolled
          ? "border-b border-border shadow-sm bg-surface dark:bg-[rgba(15,30,44,0.95)] dark:border-border"
          : "border-b border-transparent bg-surface dark:bg-[rgba(15,30,44,0.95)]"
        }
        backdrop-blur-[12px]`}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center h-[68px] max-md:h-[64px]">
          {/* Logo */}
          <Link href="/" className="mr-auto shrink-0 pl-2">
            <Image
              src="/logo.png"
              alt="CarBeat"
              width={192}
              height={96}
              className="h-[82px] w-auto max-md:h-[48px] dark:invert dark:hue-rotate-180"
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1 mr-5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="px-4 py-2 rounded-[8px] text-[15px] font-medium text-text transition-all duration-[250ms] hover:text-blue hover:bg-blue-light"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <Link
            href="/nabidka"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] text-sm font-semibold bg-blue !text-white border-2 border-blue shrink-0 transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(28,138,201,0.35)]"
          >
            Nabídka vozů
          </Link>

          {/* Mobile: theme toggle + hamburger */}
          <ThemeToggle className="md:hidden ml-auto mr-3" />

          <button
            onClick={onMenuOpen}
            className="md:hidden flex flex-col gap-[5px] p-2 cursor-pointer bg-transparent border-none"
            aria-label="Menu"
          >
            <span className="block w-6 h-0.5 bg-text rounded-sm transition-all duration-[250ms] dark:bg-[#e0e8f0]" />
            <span className="block w-6 h-0.5 bg-text rounded-sm transition-all duration-[250ms] dark:bg-[#e0e8f0]" />
            <span className="block w-6 h-0.5 bg-text rounded-sm transition-all duration-[250ms] dark:bg-[#e0e8f0]" />
          </button>
        </nav>
      </div>
    </header>
  );
}
