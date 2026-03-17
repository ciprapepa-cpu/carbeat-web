import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().min(2, "Jméno je příliš krátké").max(100),
  email: z.string().email("Neplatný e-mail").max(200),
  phone: z.string().max(30).optional().default(""),
  message: z.string().min(10, "Zpráva je příliš krátká").max(5000),
});

// POST /api/contact — send contact form via Web3Forms
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(ip, { limit: 5, windowSeconds: 300 });

  if (!allowed) {
    return NextResponse.json(
      { error: "Příliš mnoho zpráv. Zkuste to prosím za chvíli." },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Chyba ve formuláři", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, phone, message } = parsed.data;

  const accessKey = process.env.WEB3FORMS_KEY;

  if (!accessKey) {
    console.log("Contact form submission (WEB3FORMS_KEY not set):", { name, email, phone, message });
    return NextResponse.json({ success: true });
  }

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `Nová zpráva z webu od ${name}`,
      from_name: "CarBeat Web",
      name,
      email,
      phone: phone || "–",
      message,
    }),
  });

  if (!response.ok) {
    console.error("Web3Forms error:", await response.text());
    return NextResponse.json(
      { error: "Nepodařilo se odeslat zprávu. Zkuste to znovu." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
