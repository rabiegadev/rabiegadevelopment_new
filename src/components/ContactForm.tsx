"use client";

import { submitContactForm, type ContactFormState } from "@/app/actions/contact";
import { useActionState } from "react";

const initial: ContactFormState = { ok: false, error: "" };

type Variant = "onDark" | "onLight";

export function ContactForm({
  variant = "onDark",
  projectContext,
}: {
  variant?: Variant;
  projectContext?: string;
}) {
  const [state, formAction, pending] = useActionState(submitContactForm, initial);

  const isLight = variant === "onLight";
  const label = isLight ? "text-violet-950/70" : "text-white/70";
  const field =
    isLight
      ? "rounded-lg border border-violet-200 bg-white px-3 py-2 text-violet-950 outline-none focus:ring-2 focus:ring-violet-400/60"
      : "rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-violet-400/60";
  const btn =
    isLight
      ? "rounded-lg bg-violet-600 px-4 py-2.5 font-medium text-white hover:bg-violet-500 disabled:opacity-60"
      : "rounded-lg bg-violet-500 px-4 py-2.5 font-medium text-white hover:bg-violet-400 disabled:opacity-60";
  const errBox =
    isLight
      ? "rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800"
      : "rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200";
  const okBox =
    isLight
      ? "rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-900"
      : "rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-emerald-100";

  if (state.ok) {
    return <p className={okBox}>Dziękujemy — wiadomość została wysłana.</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {projectContext ? (
        <input type="hidden" name="projectContext" value={projectContext} />
      ) : null}
      {state.error ? <p className={errBox}>{state.error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={`flex flex-col gap-1 text-sm ${label}`}>
          <span>Imię lub nazwa</span>
          <input
            name="name"
            required
            className={field}
            placeholder="Jan Kowalski"
          />
        </label>
        <label className={`flex flex-col gap-1 text-sm ${label}`}>
          <span>E-mail</span>
          <input
            name="email"
            type="email"
            required
            className={field}
            placeholder="jan@example.com"
          />
        </label>
      </div>
      <label className={`flex flex-col gap-1 text-sm ${label}`}>
        <span>Telefon (opcjonalnie)</span>
        <input name="phone" type="tel" className={field} placeholder="+48 …" />
      </label>
      <label className={`flex flex-col gap-1 text-sm ${label}`}>
        <span>Wiadomość</span>
        <textarea
          name="message"
          required
          rows={5}
          className={field}
          placeholder="Opisz, czego potrzebujesz…"
        />
      </label>
      <button type="submit" disabled={pending} className={btn}>
        {pending ? "Wysyłanie…" : "Wyślij"}
      </button>
    </form>
  );
}
