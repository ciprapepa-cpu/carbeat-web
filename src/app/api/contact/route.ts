import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().min(2, "Jméno je příliš krátké").max(100),
  email: z.string().email("Neplatný e-mail").max(200),
  phone: z.string().max(30).optional().default(""),
  message: z.string().min(10, "Zpráva je příliš krátká").max(5000),
});

// POST /api/contact — send contact form as email via Supabase Edge Function or direct email
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

  // Send notification email via Resend (or any provider)
  // For now, we'll use a simple fetch to a Resend-compatible API
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    // Fallback: log the message (in dev or if Resend not configured)
    console.log("Contact form submission:", { name, email, phone, message });
    return NextResponse.json({ success: true });
  }

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "CarBeat Web <noreply@carbeat.cz>",
      to: ["info@carbeat.cz"],
      reply_to: email,
      subject: `Nová zpráva z webu od ${name}`,
      text: [
        `Jméno: ${name}`,
        `E-mail: ${email}`,
        phone ? `Telefon: ${phone}` : null,
        ``,
        `Zpráva:`,
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    }),
  });

  if (!emailResponse.ok) {
    console.error("Resend error:", await emailResponse.text());
    return NextResponse.json(
      { error: "Nepodařilo se odeslat zprávu. Zkuste to znovu." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
