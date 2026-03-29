/**
 * GA4 + Meta Pixel event tracking helpers for CarBeat.
 *
 * GA4 events use recommended ecommerce names where applicable
 * so they appear in built-in GA4 reports.
 */

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

function fbq(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
}

/** User views a car listing detail page */
export function trackViewCar(car: {
  id: string;
  name: string;
  price: number;
  fuel?: string;
  transmission?: string;
  year?: number;
}) {
  gtag("event", "view_item", {
    currency: "CZK",
    value: car.price,
    items: [
      {
        item_id: car.id,
        item_name: car.name,
        price: car.price,
        item_category: car.fuel,
        item_category2: car.transmission,
        item_variant: car.year?.toString(),
      },
    ],
  });

  fbq("track", "ViewContent", {
    content_ids: [car.id],
    content_name: car.name,
    content_type: "vehicle",
    value: car.price,
    currency: "CZK",
  });
}

/** User clicks a car card from listing page */
export function trackSelectCar(car: {
  id: string;
  name: string;
  price: number;
  listName?: string;
}) {
  gtag("event", "select_item", {
    item_list_name: car.listName ?? "nabidka",
    items: [
      {
        item_id: car.id,
        item_name: car.name,
        price: car.price,
      },
    ],
  });
}

/** User clicks WhatsApp button */
export function trackWhatsAppClick(context: string, carName?: string) {
  gtag("event", "generate_lead", {
    method: "whatsapp",
    context,
    car_name: carName,
  });

  fbq("track", "Contact", {
    content_name: carName ?? context,
    method: "whatsapp",
  });
}

/** User clicks phone number */
export function trackPhoneClick(context: string, carName?: string) {
  gtag("event", "generate_lead", {
    method: "phone",
    context,
    car_name: carName,
  });

  fbq("track", "Contact", {
    content_name: carName ?? context,
    method: "phone",
  });
}

/** User clicks "Navigovat k nám" */
export function trackNavigateClick() {
  gtag("event", "select_content", {
    content_type: "navigation",
    content_id: "navigovat_k_nam",
  });
}

/** User submits contact form */
export function trackContactFormSubmit() {
  gtag("event", "generate_lead", {
    method: "contact_form",
  });

  fbq("track", "Lead", {
    content_name: "contact_form",
  });
}

/** User opens gallery / lightbox */
export function trackGalleryOpen(carName: string, photoIndex: number) {
  gtag("event", "select_content", {
    content_type: "gallery",
    content_id: carName,
    photo_index: photoIndex,
  });
}

/** User uses filters on nabidka page */
export function trackFilterUse(filterType: string, filterValue: string) {
  gtag("event", "select_content", {
    content_type: "filter",
    content_id: `${filterType}:${filterValue}`,
  });
}
