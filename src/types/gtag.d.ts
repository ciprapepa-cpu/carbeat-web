interface Window {
  dataLayer: Record<string, unknown>[];
  gtag: (...args: unknown[]) => void;
  fbq: (...args: unknown[]) => void;
  _fbq: unknown;
}
