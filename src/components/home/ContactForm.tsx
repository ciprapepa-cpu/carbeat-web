"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Nepodařilo se odeslat zprávu.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Nastala chyba.");
    }
  }

  if (status === "success") {
    return (
      <div className="p-8 rounded-[20px] bg-green-light border border-green/20 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green/10 flex items-center justify-center">
          <svg width="28" height="28" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-text mb-1">Zpráva odeslána</h3>
        <p className="text-text-muted text-sm">Ozveme se Vám co nejdříve.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-semibold text-blue hover:underline"
        >
          Odeslat další zprávu
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <div>
          <label htmlFor="cf-name" className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
            Jméno *
          </label>
          <input
            id="cf-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-[8px] border border-border bg-surface text-text text-sm focus:outline-none focus:border-blue transition-colors"
            placeholder="Jan Novák"
          />
        </div>
        <div>
          <label htmlFor="cf-email" className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
            E-mail *
          </label>
          <input
            id="cf-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-[8px] border border-border bg-surface text-text text-sm focus:outline-none focus:border-blue transition-colors"
            placeholder="jan@email.cz"
          />
        </div>
      </div>
      <div>
        <label htmlFor="cf-phone" className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
          Telefon
        </label>
        <input
          id="cf-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 rounded-[8px] border border-border bg-surface text-text text-sm focus:outline-none focus:border-blue transition-colors"
          placeholder="+420 ..."
        />
      </div>
      <div>
        <label htmlFor="cf-message" className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
          Zpráva *
        </label>
        <textarea
          id="cf-message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-3 rounded-[8px] border border-border bg-surface text-text text-sm focus:outline-none focus:border-blue transition-colors resize-y"
          placeholder="Mám zájem o..."
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[8px] text-[15px] font-semibold bg-blue !text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(28,138,201,0.35)] disabled:opacity-60 disabled:cursor-not-allowed self-start"
      >
        {status === "sending" ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Odesílám...
          </>
        ) : (
          <>
            Odeslat zprávu
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
