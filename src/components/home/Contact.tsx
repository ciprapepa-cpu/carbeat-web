import { type ReactNode } from "react";
import ContactForm from "./ContactForm";

interface ContactItem {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

const contactItems: ContactItem[] = [
  {
    icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.06a19.79 19.79 0 01-3.07-8.64A2 2 0 012 .04h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />,
    label: "Telefon",
    value: <a href="tel:+420777027809" className="text-blue hover:underline">+420 777 027 809</a>,
  },
  {
    icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
    label: "E-mail",
    value: <a href="mailto:info@carbeat.cz" className="text-blue hover:underline">info@carbeat.cz</a>,
  },
  {
    icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></>,
    label: "Adresa",
    value: <>CarBeat s.r.o.<br />Svinišťany 63, Dolany 552 04<br />DIČ: CZ19856873</>,
  },
  {
    icon: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
    label: "Prohlídky",
    value: "Kdykoliv po předchozí domluvě",
  },
];

export default function Contact() {
  return (
    <section className="py-24 bg-surface" id="kontakt">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Row 1: Contact info + Map */}
        <div className="grid grid-cols-[1fr_1fr] gap-12 max-lg:grid-cols-1">
          {/* Contact info */}
          <div>
            <span className="inline-block text-xs font-bold tracking-[2px] uppercase text-blue mb-3">
              Kontakt
            </span>
            <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold leading-[1.15] text-text mb-3">
              Najdete nás<br /><span className="text-blue">5 minut od D11</span>
            </h2>
            <p className="text-lg text-text-muted mt-3 max-w-[560px] mb-8">
              Přijeďte kdykoliv po domluvě. Vůz Vám ukážeme osobně, nebo zajistíme videohovor na dálku.
            </p>

            {/* Contact items */}
            <div className="flex flex-col gap-5 mb-8">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-light rounded-[8px] flex items-center justify-center shrink-0 text-blue">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      {item.icon}
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue uppercase tracking-wide mb-0.5">{item.label}</p>
                    <p className="text-base font-semibold text-text leading-relaxed">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex gap-3 flex-wrap">
              <a
                href="https://wa.me/420777027809"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[8px] text-[15px] font-semibold bg-[#25D366] text-white dark:text-white border-2 border-[#25D366] transition-all duration-[250ms] hover:bg-[#1da851] hover:border-[#1da851] hover:-translate-y-0.5"
                target="_blank"
                rel="noopener"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Napsat na WhatsApp
              </a>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Svini%C5%A1%C5%A5any+63%2C+Dolany+552+04"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[8px] text-[15px] font-semibold bg-transparent text-blue border-2 border-blue transition-all duration-[250ms] hover:bg-blue hover:!text-white hover:-translate-y-0.5"
                target="_blank"
                rel="noopener"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Navigovat k nám
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="flex items-center">
            <div className="w-full rounded-[20px] overflow-hidden bg-bg dark:bg-bg min-h-[400px]">
              <iframe
                src="https://maps.google.com/maps?q=CarBeat+s.r.o.+Svini%C5%A1%C5%A5any+63+Dolany&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full min-h-[400px] border-0"
                allowFullScreen
                loading="lazy"
                title="CarBeat s.r.o. - Svinišťany 63, Dolany"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Contact form — full width */}
        <div id="napiste-nam" className="mt-16 p-8 rounded-[20px] bg-bg dark:bg-bg max-sm:p-6">
          <h3 className="text-lg font-bold text-text mb-1">Napište nám</h3>
          <p className="text-sm text-text-muted mb-6">
            Popište, co hledáte, a my se Vám ozveme.
          </p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
