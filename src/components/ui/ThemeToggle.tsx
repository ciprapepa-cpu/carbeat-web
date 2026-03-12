"use client";

import { useCallback, useEffect, useState } from "react";

interface ThemeToggleProps {
  variant?: "default" | "sm";
  className?: string;
}

export default function ThemeToggle({ variant = "default", className = "" }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = useCallback(() => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("cb-theme", next ? "dark" : "light");
  }, [isDark]);

  const sizeClasses = variant === "sm"
    ? "w-7 h-7 border border-white/15 text-white/50 hover:border-blue hover:text-blue"
    : "w-10 h-10 border-2 border-border text-text hover:border-blue hover:text-blue";

  return (
    <button
      onClick={toggle}
      className={`flex items-center justify-center rounded-[8px] bg-transparent cursor-pointer transition-all duration-[250ms] ease-in-out shrink-0 ${sizeClasses} ${className}`}
      aria-label="Přepnout tmavý režim"
    >
      {isDark ? (
        <svg className={variant === "sm" ? "w-3.5 h-3.5" : "w-[18px] h-[18px]"} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg className={variant === "sm" ? "w-3.5 h-3.5" : "w-[18px] h-[18px]"} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}
