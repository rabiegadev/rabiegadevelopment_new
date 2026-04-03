"use client";

import { submitContactForm, type ContactFormState } from "@/app/actions/contact";
import { useActionState } from "react";

const initial: ContactFormState = { ok: false, error: "" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initial);

  if (state.ok) {
    return (
      <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-emerald-100">
        Dziękujemy — wiadomość została wysłana. Potwierdzenie trafi na Twój e-mail.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-white/70">Imię lub nazwa</span>
          <input
            name="name"
            required
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none ring-emerald-400/0 focus:ring-2"
            placeholder="Jan Kowalski"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-white/70">E-mail</span>
          <input
            name="email"
            type="email"
            required
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-emerald-400/60"
            placeholder="jan@example.com"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">Telefon (opcjonalnie)</span>
        <input
          name="phone"
          type="tel"
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-emerald-400/60"
          placeholder="+48 …"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">Wiadomość</span>
        <textarea
          name="message"
          required
          rows={5}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-emerald-400/60"
          placeholder="Opisz krótko, czego potrzebujesz…"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-500 px-4 py-2.5 font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
      >
        {pending ? "Wysyłanie…" : "Wyślij"}
      </button>
    </form>
  );
}
