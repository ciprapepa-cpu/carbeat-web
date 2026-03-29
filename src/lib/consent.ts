export interface ConsentState {
  analytics_storage: "granted" | "denied";
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
}

export const CONSENT_COOKIE_NAME = "cookie_consent";
const CONSENT_COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

export const DEFAULT_CONSENT: ConsentState = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

export const FULL_CONSENT: ConsentState = {
  analytics_storage: "granted",
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
};

export function getStoredConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CONSENT_COOKIE_NAME}=([^;]*)`)
  );
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export function applyConsent(consent: ConsentState) {
  const value = encodeURIComponent(JSON.stringify(consent));
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; max-age=${CONSENT_COOKIE_MAX_AGE}; path=/; SameSite=Lax; Secure`;

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", consent);
  }

  window.dispatchEvent(
    new CustomEvent("consent-updated", { detail: consent })
  );
}

export function hasConsent(type: keyof ConsentState): boolean {
  const stored = getStoredConsent();
  return stored?.[type] === "granted";
}
