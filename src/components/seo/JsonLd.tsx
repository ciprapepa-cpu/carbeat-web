/**
 * JSON-LD structured data components for SEO.
 * Renders <script type="application/ld+json"> in the page head.
 */

interface JsonLdProps {
  data: Record<string, unknown>;
}

function JsonLdScript({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Organization + LocalBusiness — renders on every page via layout.
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "CarBeat",
    url: "https://carbeat.cz",
    logo: "https://carbeat.cz/logo.png",
    image: "https://carbeat.cz/logo.png",
    description:
      "Dovoz prověřených ojetých aut z Německa. Kompletní servis od výběru po předání.",
    telephone: "+420777027809",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CZ",
      addressLocality: "Česká republika",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+420777027809",
      contactType: "sales",
      availableLanguage: ["cs"],
    },
    sameAs: [
      "https://www.instagram.com/carbeat.cz/",
    ],
  };

  return <JsonLdScript data={data} />;
}

/**
 * BreadcrumbList — pass items as [{name, url}].
 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLdScript data={data} />;
}

/**
 * Product (Vehicle) — for car detail pages.
 */
export function CarProductJsonLd({
  name,
  description,
  image,
  url,
  price,
  currency = "CZK",
  year,
  km,
  fuel,
  transmission,
}: {
  name: string;
  description: string;
  image: string | undefined;
  url: string;
  price: number;
  currency?: string;
  year: number;
  km: number;
  fuel: string;
  transmission: string;
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Car",
    name,
    description,
    url,
    vehicleModelDate: String(year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: km,
      unitCode: "KMT",
    },
    fuelType: fuel,
    vehicleTransmission: transmission,
    ...(image ? { image } : {}),
    offers: price > 0
      ? {
          "@type": "Offer",
          price: String(price),
          priceCurrency: currency,
          availability: "https://schema.org/InStock",
          url,
        }
      : undefined,
  };

  // Remove undefined values
  if (!data.offers) delete data.offers;

  return <JsonLdScript data={data} />;
}
