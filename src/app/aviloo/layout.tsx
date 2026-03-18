import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AVILOO Battery Test — diagnostika baterie elektromobilů | CarBeat",
  description:
    "Nezávislé testování kondice trakční baterie elektromobilů a plug-in hybridů. Flash Test (3 min) nebo Premium Test s kompletní analýzou. Certifikovaný AVILOO partner.",
  alternates: { canonical: "/aviloo" },
  openGraph: {
    title: "AVILOO Battery Test | CarBeat",
    description:
      "Certifikované měření stavu baterie elektromobilů. Flash Test i Premium Test.",
  },
};

export default function AvilooLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
