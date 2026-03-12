import type { Car } from "@/types/car";

/**
 * Hardcoded car data for static generation.
 * Will be replaced by Supabase queries later.
 */

interface CarDetail extends Car {
  photos: string[];
}

export const cars: CarDetail[] = [
  {
    id: "1",
    slug: "mercedes-c43-amg",
    name: "Mercedes-Benz C43 AMG 4Matic Kombi",
    segment: "sportovni",
    category_label: "Sportovní",
    year: 2017,
    km: 92000,
    power_kw: 270,
    fuel: "Benzín",
    engine: "V6 biturbo 3.0",
    transmission: "9G-Tronic Automat",
    transmission_type: "Automat",
    drive: "4MATIC (4x4)",
    body_type: "Kombi",
    price: 699900,
    description:
      "Mercedes-Benz C43 AMG v provedení kombi s pohonem všech kol 4MATIC. Vůz je v původním stavu, pravidelně servisovaný u autorizovaného dealera.",
    defects: [
      "Drobné parkovací odřeniny na nárazníku",
      "Lehké opotřebení sedadla řidiče",
      "Výměna předních brzdových kotoučů do cca 10 000 km",
    ],
    badges: ["Cebia"],
    youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    equipment: {
      Komfort: [
        "Kožené sedačky",
        "Vyhřívaná sedadla",
        "Elektrické sedačky s pamětí",
        "Tempomat",
        "Keyless Go",
        "Dvouzónová klimatizace",
        "Ambientní osvětlení",
      ],
      Bezpečnost: [
        "Distronic Plus",
        "Aktivní brzdný asistent",
        "Blind Spot Assist",
        "Parkovací kamera 360°",
        "LED ILS světlomety",
      ],
      Exteriér: [
        "AMG bodykit",
        '19" AMG kola',
        "Panoramatická střecha",
        "Tónovaná skla",
        "Střešní ližiny",
      ],
      Interiér: [
        "AMG volant",
        "Burmester audio",
        "COMAND navigace",
        "Apple CarPlay",
        "Head-Up Display",
      ],
    },
    is_published: true,
    sort_order: 1,
    meta_title: "Mercedes-Benz C43 AMG 4Matic Kombi | CarBeat",
    meta_description:
      "Mercedes-Benz C43 AMG 4Matic Kombi, 2017, 92 000 km, 270 kW. Ověřený dovoz z Německa. 699 900 Kč.",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    photos: [
      "/images/cars/mercedes-c43.jpg",
      "/images/cars/mercedes-c43.jpg",
      "/images/cars/mercedes-c43.jpg",
    ],
  },
  {
    id: "2",
    slug: "audi-tts",
    name: "Audi TTS 2.0 TFSI Quattro DSG",
    segment: "sportovni",
    category_label: "Sportovní",
    year: 2008,
    km: 125000,
    power_kw: 200,
    fuel: "Benzín",
    engine: "2.0 TFSI",
    transmission: "DSG Automat",
    transmission_type: "Automat",
    drive: "Quattro (4x4)",
    body_type: "Kupé",
    price: 279900,
    description:
      "Audi TTS s motorem 2.0 TFSI a pohonem všech kol Quattro. Sportovní kupé s automatickou převodovkou DSG a výkonem 200 kW.",
    defects: [
      "Opotřebení laku na kapotě",
      "Mírné odřeniny na pravém prahu",
    ],
    badges: ["Cebia"],
    youtube_url: null,
    equipment: {
      Komfort: [
        "Kožené/Alcantara sedačky",
        "Vyhřívaná sedadla",
        "Automatická klimatizace",
        "Tempomat",
      ],
      Bezpečnost: [
        "ESP",
        "Parkovací senzory",
        "Xenonové světlomety",
        "Dešťový senzor",
      ],
      Exteriér: [
        '18" kola',
        "Zadní spoiler",
        "Sportovní výfuky",
        "LED denní svícení",
      ],
      Interiér: [
        "Sportovní volant",
        "BOSE audio",
        "MMI navigace",
        "Aluminiové doplňky",
      ],
    },
    is_published: true,
    sort_order: 2,
    meta_title: "Audi TTS 2.0 TFSI Quattro DSG | CarBeat",
    meta_description:
      "Audi TTS 2.0 TFSI Quattro DSG, 2008, 125 000 km, 200 kW. Ověřený dovoz z Německa. 279 900 Kč.",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    photos: [
      "/images/cars/audi-tts.jpg",
      "/images/cars/audi-tts.jpg",
      "/images/cars/audi-tts.jpg",
    ],
  },
  {
    id: "3",
    slug: "seat-leon",
    name: "Seat Leon Style 1.5 TSI",
    segment: "seat-cupra",
    category_label: "Seat / Cupra",
    year: 2022,
    km: 67000,
    power_kw: 110,
    fuel: "Benzín",
    engine: "1.5 TSI EVO",
    transmission: "Manuál 6st.",
    transmission_type: "Manuál",
    drive: "Přední (FWD)",
    body_type: "Hatchback",
    price: 459900,
    description:
      "Seat Leon Style s úsporným motorem 1.5 TSI. Moderní hatchback s bohatou výbavou a nízkým nájezdem.",
    defects: [
      "Drobný škrábanec na levém zadním blatníku",
    ],
    badges: ["Cebia"],
    youtube_url: null,
    equipment: {
      Komfort: [
        "Dvouzónová klimatizace",
        "Vyhřívaná sedadla",
        "Tempomat",
        "Bezklíčové startování",
        "Parkovací asistent",
      ],
      Bezpečnost: [
        "Adaptivní tempomat",
        "Asistent jízdy v pruhu",
        "Nouzové brzdění",
        "LED světlomety",
        "Parkovací kamera",
      ],
      Exteriér: [
        '17" kola',
        "Full LED svícení",
        "Tónovaná skla",
        "Chromové doplňky",
      ],
      Interiér: [
        "Digitální kokpit",
        '10" infotainment',
        "Bezdrátové Apple CarPlay",
        "Ambient osvětlení",
      ],
    },
    is_published: true,
    sort_order: 3,
    meta_title: "Seat Leon Style 1.5 TSI | CarBeat",
    meta_description:
      "Seat Leon Style 1.5 TSI, 2022, 67 000 km, 110 kW. Ověřený dovoz z Německa. 459 900 Kč.",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    photos: [
      "/images/cars/seat-leon.jpg",
      "/images/cars/seat-leon.jpg",
      "/images/cars/seat-leon.jpg",
    ],
  },
  {
    id: "4",
    slug: "renault-trafic",
    name: "Renault Trafic 1.6 dCi L2H1",
    segment: "japonska",
    category_label: "Užitkové",
    year: 2015,
    km: 105000,
    power_kw: 85,
    fuel: "Nafta",
    engine: "1.6 dCi",
    transmission: "Manuál 6st.",
    transmission_type: "Manuál",
    drive: "Přední (FWD)",
    body_type: "Van",
    price: 249900,
    description:
      "Renault Trafic v prodlouženém provedení L2H1 s naftovým motorem 1.6 dCi. Spolehlivý užitkový vůz vhodný pro podnikání.",
    defects: [
      "Běžné provozní oděrky na nákladovém prostoru",
      "Výměna rozvodů provedena při 90 000 km",
    ],
    badges: ["Cebia"],
    youtube_url: null,
    equipment: {
      Komfort: [
        "Klimatizace",
        "Tempomat",
        "Elektrická okna",
        "Centrální zamykání",
        "Palubní počítač",
      ],
      Bezpečnost: [
        "ABS",
        "ESP",
        "Airbagy řidiče a spolujezdce",
        "Parkovací senzory",
        "Mlhové světlomety",
      ],
      Exteriér: [
        "Střešní nosič",
        "Boční posuvné dveře",
        "Ochranné lišty",
        "Zadní dvoukřídlé dveře",
      ],
      Interiér: [
        "Rádio s Bluetooth",
        "USB vstup",
        "3 sedadla v kabině",
        "Úložné prostory",
      ],
    },
    is_published: true,
    sort_order: 4,
    meta_title: "Renault Trafic 1.6 dCi L2H1 | CarBeat",
    meta_description:
      "Renault Trafic 1.6 dCi L2H1, 2015, 105 000 km, 85 kW. Ověřený dovoz z Německa. 249 900 Kč.",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    photos: [
      "/images/cars/renault-trafic.jpg",
      "/images/cars/renault-trafic.jpg",
      "/images/cars/renault-trafic.jpg",
    ],
  },
];

export function getCarBySlug(slug: string): CarDetail | undefined {
  return cars.find((car) => car.slug === slug);
}

export function getAllSlugs(): string[] {
  return cars.map((car) => car.slug);
}

export type { CarDetail };
