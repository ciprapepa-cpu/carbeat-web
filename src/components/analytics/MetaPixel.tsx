"use client";

import { useEffect, useRef } from "react";
import { getStoredConsent, type ConsentState } from "@/lib/consent";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function MetaPixel() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!PIXEL_ID || process.env.NODE_ENV === "development") return;

    function initPixel() {
      if (initialized.current || !PIXEL_ID) return;
      initialized.current = true;

      /* eslint-disable @typescript-eslint/no-explicit-any */
      const f = window as any;
      if (f.fbq) return;
      const n: any = (f.fbq = function (...args: any[]) {
        n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
      });
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [] as any[];
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(script);

      f.fbq("init", PIXEL_ID);
      f.fbq("track", "PageView");
    }

    const stored = getStoredConsent();
    if (stored?.ad_storage === "granted") {
      initPixel();
    }

    function handleConsent(e: Event) {
      const detail = (e as CustomEvent<ConsentState>).detail;
      if (detail?.ad_storage === "granted") {
        initPixel();
      }
    }

    window.addEventListener("consent-updated", handleConsent);
    return () => window.removeEventListener("consent-updated", handleConsent);
  }, []);

  return null;
}
