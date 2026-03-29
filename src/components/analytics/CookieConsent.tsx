"use client";

import { useState, useEffect, useCallback } from "react";
import {
  type ConsentState,
  DEFAULT_CONSENT,
  FULL_CONSENT,
  getStoredConsent,
  applyConsent,
} from "@/lib/consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    applyConsent(FULL_CONSENT);
    setVisible(false);
  }, []);

  const handleRejectAll = useCallback(() => {
    applyConsent(DEFAULT_CONSENT);
    setVisible(false);
  }, []);

  const handleSavePreferences = useCallback(() => {
    applyConsent(consent);
    setVisible(false);
  }, [consent]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[10000] border-t border-border bg-surface p-5 shadow-lg md:p-6"
    >
      <div className="mx-auto max-w-[900px]">
        <h2 className="mb-2 text-base font-bold text-text">
          Tento web používá cookies
        </h2>
        <p className="mb-4 text-sm text-text-muted">
          Používáme cookies pro analýzu návštěvnosti a cílení reklam.
          Váš souhlas můžete kdykoli změnit v{" "}
          <a href="/zasady-cookies" className="text-blue underline hover:text-blue-hover">
            nastavení cookies
          </a>
          .
        </p>

        {showDetails && (
          <div className="mb-4 space-y-3 rounded-[12px] border border-border bg-bg p-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked
                disabled
                className="h-4 w-4 rounded accent-blue"
              />
              <div>
                <span className="text-sm font-semibold text-text">Nezbytné</span>
                <p className="text-xs text-text-muted">
                  Zajišťují základní funkce webu. Nelze vypnout.
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={consent.analytics_storage === "granted"}
                onChange={(e) =>
                  setConsent((prev) => ({
                    ...prev,
                    analytics_storage: e.target.checked ? "granted" : "denied",
                  }))
                }
                className="h-4 w-4 rounded accent-blue"
              />
              <div>
                <span className="text-sm font-semibold text-text">Analytické</span>
                <p className="text-xs text-text-muted">
                  Pomáhají nám pochopit, jak web používáte (Google Analytics).
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={consent.ad_storage === "granted"}
                onChange={(e) => {
                  const val = e.target.checked ? "granted" : "denied";
                  setConsent((prev) => ({
                    ...prev,
                    ad_storage: val,
                    ad_user_data: val,
                    ad_personalization: val,
                  }));
                }}
                className="h-4 w-4 rounded accent-blue"
              />
              <div>
                <span className="text-sm font-semibold text-text">Marketingové</span>
                <p className="text-xs text-text-muted">
                  Slouží k cílení reklam na Facebooku a dalších platformách.
                </p>
              </div>
            </label>
          </div>
        )}

        {/* GDPR: Accept & Reject must be equally prominent */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleAcceptAll}
            className="rounded-[8px] bg-blue px-6 py-2.5 text-sm font-semibold !text-white transition-all duration-[250ms] hover:bg-blue-hover"
          >
            Přijmout vše
          </button>
          <button
            onClick={handleRejectAll}
            className="rounded-[8px] bg-blue-light px-6 py-2.5 text-sm font-semibold text-text transition-all duration-[250ms] hover:bg-border"
          >
            Odmítnout vše
          </button>
          {!showDetails ? (
            <button
              onClick={() => setShowDetails(true)}
              className="px-4 py-2.5 text-sm text-text-muted underline transition-colors hover:text-text"
            >
              Přizpůsobit
            </button>
          ) : (
            <button
              onClick={handleSavePreferences}
              className="rounded-[8px] bg-dark px-6 py-2.5 text-sm font-semibold !text-white transition-all duration-[250ms] hover:bg-dark-2"
            >
              Uložit nastavení
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
