"use client";

import Link from "next/link";
import Image from "next/image";
import SocialIcons from "@/components/ui/SocialIcons";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: "/nabidka", label: "Nabídka vozů" },
  { href: "/o-nas", label: "O nás" },
  { href: "/faq", label: "FAQ" },
  { href: "/aviloo", label: "Aviloo" },
] as const;

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-surface flex flex-col p-6 gap-2 overflow-y-auto dark:bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Image
          src="/logo.png"
          alt="CarBeat"
          width={200}
          height={100}
          className="h-[80px] w-auto logo-img"
          style={{ maxHeight: "80px", width: "auto" }}
        />
        <button
          onClick={onClose}
          className="bg-transparent border-none p-2 cursor-pointer text-text dark:text-[#e0e8f0]"
          aria-label="Zavřít"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav links */}
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          className="block py-4 px-3 text-lg font-semibold text-text border-b border-border transition-colors duration-[250ms] hover:text-blue"
        >
          {link.label}
        </Link>
      ))}

      {/* CTAs */}
      <a
        href="tel:+420777027809"
        className="mt-4 w-full flex items-center justify-center gap-2 px-7 py-3.5 rounded-[8px] text-[15px] font-semibold bg-blue text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover"
      >
        📞 +420 777 027 809
      </a>
      <a
        href="https://wa.me/420777027809"
        target="_blank"
        rel="noopener"
        className="w-full flex items-center justify-center gap-2 px-7 py-3.5 rounded-[8px] text-[15px] font-semibold bg-[#25D366] text-white border-2 border-[#25D366] transition-all duration-[250ms] hover:bg-[#1da851]"
      >
        💬 WhatsApp
      </a>

      {/* Social */}
      <SocialIcons
        className="justify-center gap-4 mt-6 pt-6 border-t border-border"
        linkClassName="flex items-center justify-center w-11 h-11 rounded-[8px] bg-blue-light text-blue transition-all duration-[250ms] hover:bg-blue hover:text-white"
        iconSize={22}
      />
    </div>
  );
}
