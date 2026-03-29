/**
 * Inline script that sets consent defaults BEFORE any tracking loads.
 * Server Component — no 'use client'. Renders synchronous <script> in <head>.
 *
 * 1. Set all consent types to denied
 * 2. Immediately recover stored consent from cookie (returning visitors)
 */
export default function ConsentDefaults() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}

          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied',
            'wait_for_update': 500
          });

          try {
            var cc = document.cookie.match(/cookie_consent=([^;]+)/);
            if (cc) {
              var stored = JSON.parse(decodeURIComponent(cc[1]));
              gtag('consent', 'update', stored);
            }
          } catch(e) {}
        `,
      }}
    />
  );
}
