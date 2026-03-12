"use client";

import { useState } from "react";
import Header from "./Header";
import MobileNav from "./MobileNav";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Header onMenuOpen={() => setMenuOpen(true)} />
      <MobileNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
