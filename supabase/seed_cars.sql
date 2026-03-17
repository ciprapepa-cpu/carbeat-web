-- Seed 4 existing cars into the database
-- Run this in Supabase SQL Editor

INSERT INTO cars (slug, name, segment, category_label, year, km, power_kw, fuel, engine, transmission, transmission_type, drive, body_type, price, description, defects, badges, youtube_url, equipment, status, is_published, sort_order, meta_title, meta_description)
VALUES
(
  'mercedes-c43-amg',
  'Mercedes-Benz C43 AMG 4Matic Kombi',
  'sportovni',
  'Sportovní',
  2017, 92000, 270,
  'Benzín', 'V6 biturbo 3.0', '9G-Tronic Automat', 'Automatická', '4x4', 'Kombi',
  749900,
  'Mercedes-Benz T AMG C43 4Matic 270kW, 92.000 km, velmi zachovalý vůz s malým nájezdem, výkonný, ale i praktický vůz s kompletní servisní historií. Auto je ve velmi dobrém stavu, připravené k okamžitému užití.',
  ARRAY['Drobné parkovací odřeniny na nárazníku', 'Lehké opotřebení sedadla řidiče', 'Výměna předních brzdových kotoučů do cca 10 000 km'],
  ARRAY['Cebia'],
  'https://www.youtube.com/embed/gKf_WgRbY6g',
  '{"Komfort":["Kožené sedačky","Vyhřívaná sedadla","Elektrické sedačky s pamětí","Tempomat","Keyless Go","Dvouzónová klimatizace","Ambientní osvětlení"],"Bezpečnost":["Distronic Plus","Aktivní brzdný asistent","Blind Spot Assist","Parkovací kamera 360°","LED ILS světlomety"],"Exteriér":["AMG bodykit","19\" AMG kola","Panoramatická střecha","Tónovaná skla","Střešní ližiny"],"Interiér":["AMG volant","Burmester audio","COMAND navigace","Apple CarPlay","Head-Up Display"]}'::jsonb,
  'v_nabidce', true, 1,
  'Mercedes-Benz C43 AMG 4Matic Kombi | CarBeat',
  'Mercedes-Benz C43 AMG 4Matic Kombi, 2017, 92 000 km, 270 kW. Ověřený dovoz z Německa. 749 900 Kč.'
),
(
  'audi-tts',
  'Audi TTS 2.0 TFSI Quattro DSG',
  'sportovni',
  'Sportovní',
  2008, 125000, 200,
  'Benzín', '2.0 TFSI', 'DSG Automat', 'Automatická', '4x4', 'Kupé',
  320000,
  'Audi TTS 2.0 TFSI (200 kW, Quattro, DSG) – právě po servisu. Akcelerace 0–100 km/h dle GPS za 4,8 s, výsuvné zadní křídlo plně funkční. Nový servis: silentbloky předních ramen, stabilizační tyčky, olej a filtry.',
  ARRAY['Opotřebení laku na kapotě', 'Mírné odřeniny na pravém prahu'],
  ARRAY['Cebia'],
  'https://www.youtube.com/embed/aAA0MJA6y7s',
  '{"Komfort":["Kožené/Alcantara sedačky","Vyhřívaná sedadla","Automatická klimatizace","Tempomat"],"Bezpečnost":["ESP","Parkovací senzory","Xenonové světlomety","Dešťový senzor"],"Exteriér":["18\" kola","Zadní spoiler","Sportovní výfuky","LED denní svícení"],"Interiér":["Sportovní volant","BOSE audio","MMI navigace","Aluminiové doplňky"]}'::jsonb,
  'v_nabidce', true, 2,
  'Audi TTS 2.0 TFSI Quattro DSG | CarBeat',
  'Audi TTS 2.0 TFSI Quattro DSG, 2008, 125 000 km, 200 kW. Ověřený dovoz z Německa. 320 000 Kč.'
),
(
  'seat-leon',
  'Seat Leon Style 1.5 TSI',
  'seat-cupra',
  'Seat / Cupra',
  2022, 67000, 96,
  'Benzín', '1.5 TSI EVO', 'Manuál 6st.', 'Manuální', 'Předních kol', 'Hatchback',
  394000,
  'SEAT Leon Style 1.5 TSI 2022 (Full LED, CarPlay, vyhřívaný volant), 67 000 km, po servisu (zánovní celoroční pneumatiky, nové přední brzdy, baterie, pylový filtr, kontrola klimatizace) s kompletní servisní historií.',
  ARRAY['Drobný škrábanec na levém zadním blatníku'],
  ARRAY['Cebia'],
  'https://www.youtube.com/embed/RVPy6vf_xkc',
  '{"Komfort":["Dvouzónová klimatizace","Vyhřívaná sedadla","Tempomat","Bezklíčové startování","Parkovací asistent"],"Bezpečnost":["Adaptivní tempomat","Asistent jízdy v pruhu","Nouzové brzdění","LED světlomety","Parkovací kamera"],"Exteriér":["17\" kola","Full LED svícení","Tónovaná skla","Chromové doplňky"],"Interiér":["Digitální kokpit","10\" infotainment","Bezdrátové Apple CarPlay","Ambient osvětlení"]}'::jsonb,
  'v_nabidce', true, 3,
  'Seat Leon Style 1.5 TSI | CarBeat',
  'Seat Leon Style 1.5 TSI, 2022, 67 000 km, 96 kW. Ověřený dovoz z Německa. 394 000 Kč.'
),
(
  'renault-trafic',
  'Renault Trafic 1.6 dCi L2H1',
  'ostatni',
  'Užitkové',
  2015, 105000, 85,
  'Nafta', '1.6 dCi', 'Manuál 6st.', 'Manuální', 'Předních kol', 'VAN',
  229900,
  'Spolehlivá a mimořádně praktická dodávka v prodloužené verzi L2H1. Ideální základ pro přestavbu na obytný vůz, nebo okamžitě připravený pracant pro Vaše podnikání. Čerstvě po velkém servisu: nový olej a filtry, zbrusu nové turbo, nové žhavící svíčky.',
  ARRAY['Běžné provozní oděrky na nákladovém prostoru', 'Výměna rozvodů provedena při 90 000 km'],
  ARRAY['Cebia'],
  'https://www.youtube.com/embed/2185m3CZKpQ',
  '{"Komfort":["Klimatizace","Tempomat","Elektrická okna","Centrální zamykání","Palubní počítač"],"Bezpečnost":["ABS","ESP","Airbagy řidiče a spolujezdce","Parkovací senzory","Mlhové světlomety"],"Exteriér":["Střešní nosič","Boční posuvné dveře","Ochranné lišty","Zadní dvoukřídlé dveře"],"Interiér":["Rádio s Bluetooth","USB vstup","3 sedadla v kabině","Úložné prostory"]}'::jsonb,
  'v_nabidce', true, 4,
  'Renault Trafic 1.6 dCi L2H1 | CarBeat',
  'Renault Trafic 1.6 dCi L2H1, 2015, 105 000 km, 85 kW. Ověřený dovoz z Německa. 229 900 Kč.'
)
ON CONFLICT (slug) DO NOTHING;

-- Seed car_photos for existing cars (local /public/ images)
-- These use local paths that start with /images/ — the app resolves them directly

-- Mercedes C43 AMG photos
INSERT INTO car_photos (car_id, storage_path, position)
SELECT id, path, pos FROM cars,
  (VALUES
    ('/images/cars/mercedes-c43/IMG_E5736.jpg', 0),
    ('/images/cars/mercedes-c43/IMG_E5753.jpg', 1),
    ('/images/cars/mercedes-c43/IMG_E5755.jpg', 2),
    ('/images/cars/mercedes-c43/IMG_E5762.jpg', 3),
    ('/images/cars/mercedes-c43/IMG_E5764.jpg', 4),
    ('/images/cars/mercedes-c43/IMG_E5766.jpg', 5),
    ('/images/cars/mercedes-c43/IMG_E5773.jpg', 6),
    ('/images/cars/mercedes-c43/IMG_E5776.jpg', 7),
    ('/images/cars/mercedes-c43/IMG_E5777.jpg', 8),
    ('/images/cars/mercedes-c43/IMG_E5780.jpg', 9),
    ('/images/cars/mercedes-c43/IMG_E5784.jpg', 10),
    ('/images/cars/mercedes-c43/IMG_E5787.jpg', 11),
    ('/images/cars/mercedes-c43/IMG_E5788.jpg', 12)
  ) AS t(path, pos)
WHERE slug = 'mercedes-c43-amg'
ON CONFLICT DO NOTHING;

-- Audi TTS photos
INSERT INTO car_photos (car_id, storage_path, position)
SELECT id, path, pos FROM cars,
  (VALUES
    ('/images/cars/audi-tts/IMG_E6479.jpg', 0),
    ('/images/cars/audi-tts/IMG_E6480.jpg', 1),
    ('/images/cars/audi-tts/IMG_E6482.jpg', 2),
    ('/images/cars/audi-tts/IMG_E6483.jpg', 3),
    ('/images/cars/audi-tts/IMG_6484.jpg', 4),
    ('/images/cars/audi-tts/IMG_6486.jpg', 5),
    ('/images/cars/audi-tts/IMG_E6487.jpg', 6),
    ('/images/cars/audi-tts/IMG_6488.jpg', 7),
    ('/images/cars/audi-tts/IMG_E6489.jpg', 8),
    ('/images/cars/audi-tts/IMG_E6491.jpg', 9),
    ('/images/cars/audi-tts/IMG_6492.jpg', 10),
    ('/images/cars/audi-tts/IMG_6494.jpg', 11),
    ('/images/cars/audi-tts/IMG_E6495.jpg', 12),
    ('/images/cars/audi-tts/IMG_E6496.jpg', 13),
    ('/images/cars/audi-tts/IMG_E6497.jpg', 14),
    ('/images/cars/audi-tts/IMG_E6498.jpg', 15),
    ('/images/cars/audi-tts/IMG_E6499.jpg', 16),
    ('/images/cars/audi-tts/IMG_E6500.jpg', 17),
    ('/images/cars/audi-tts/IMG_6501.jpg', 18),
    ('/images/cars/audi-tts/IMG_E6505.jpg', 19),
    ('/images/cars/audi-tts/IMG_E6510.jpg', 20)
  ) AS t(path, pos)
WHERE slug = 'audi-tts'
ON CONFLICT DO NOTHING;

-- Seat Leon photos
INSERT INTO car_photos (car_id, storage_path, position)
SELECT id, path, pos FROM cars,
  (VALUES
    ('/images/cars/seat-leon/IMG_E6803.jpg', 0),
    ('/images/cars/seat-leon/IMG_E6804.jpg', 1),
    ('/images/cars/seat-leon/IMG_E6805.jpg', 2),
    ('/images/cars/seat-leon/IMG_E6806.jpg', 3),
    ('/images/cars/seat-leon/IMG_E6807.jpg', 4),
    ('/images/cars/seat-leon/IMG_E6808.jpg', 5),
    ('/images/cars/seat-leon/IMG_E6809.jpg', 6),
    ('/images/cars/seat-leon/IMG_E6810.jpg', 7),
    ('/images/cars/seat-leon/IMG_E6812.jpg', 8),
    ('/images/cars/seat-leon/IMG_6813.jpg', 9),
    ('/images/cars/seat-leon/IMG_6814.jpg', 10),
    ('/images/cars/seat-leon/IMG_6815.jpg', 11),
    ('/images/cars/seat-leon/IMG_E6816.jpg', 12),
    ('/images/cars/seat-leon/IMG_E6823.jpg', 13),
    ('/images/cars/seat-leon/IMG_E6824.jpg', 14),
    ('/images/cars/seat-leon/IMG_E6825.jpg', 15),
    ('/images/cars/seat-leon/IMG_E6830.jpg', 16),
    ('/images/cars/seat-leon/IMG_E6831.jpg', 17),
    ('/images/cars/seat-leon/IMG_E6832.jpg', 18),
    ('/images/cars/seat-leon/IMG_E6835.jpg', 19)
  ) AS t(path, pos)
WHERE slug = 'seat-leon'
ON CONFLICT DO NOTHING;

-- Renault Trafic photos
INSERT INTO car_photos (car_id, storage_path, position)
SELECT id, path, pos FROM cars,
  (VALUES
    ('/images/cars/renault-trafic/IMG_E6838.jpg', 0),
    ('/images/cars/renault-trafic/IMG_E6839.jpg', 1),
    ('/images/cars/renault-trafic/IMG_E6840.jpg', 2),
    ('/images/cars/renault-trafic/IMG_E6841.jpg', 3),
    ('/images/cars/renault-trafic/IMG_6842.jpg', 4),
    ('/images/cars/renault-trafic/IMG_6843.jpg', 5),
    ('/images/cars/renault-trafic/IMG_E6846.jpg', 6),
    ('/images/cars/renault-trafic/IMG_E6849.jpg', 7),
    ('/images/cars/renault-trafic/IMG_6850.jpg', 8),
    ('/images/cars/renault-trafic/IMG_E6851.jpg', 9),
    ('/images/cars/renault-trafic/IMG_E6852.jpg', 10),
    ('/images/cars/renault-trafic/IMG_E6854.jpg', 11),
    ('/images/cars/renault-trafic/IMG_E6855.jpg', 12),
    ('/images/cars/renault-trafic/IMG_E6857.jpg', 13),
    ('/images/cars/renault-trafic/IMG_E6859.jpg', 14),
    ('/images/cars/renault-trafic/IMG_E6864.jpg', 15),
    ('/images/cars/renault-trafic/IMG_E6865.jpg', 16),
    ('/images/cars/renault-trafic/IMG_E6866.jpg', 17)
  ) AS t(path, pos)
WHERE slug = 'renault-trafic'
ON CONFLICT DO NOTHING;
