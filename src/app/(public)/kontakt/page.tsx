import { ContactForm } from "@/components/ContactForm";
import { getContact } from "@/config/contact";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Dane kontaktowe Rabiega Development — telefon, e-mail, adres, media społecznościowe i formularz.",
};

export default function KontaktPage() {
  const c = getContact();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <header className="animate-fade-up">
        <p className="text-sm font-medium uppercase tracking-wider text-violet-600">
          Kontakt
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-violet-950 md:text-4xl">
          Dane kontaktowe
        </h1>
        <p className="mt-4 text-violet-950/75">
          Poniżej znajdziesz sposoby kontaktu, adres oraz linki do profili w
          mediach społecznościowych. Możesz też wysłać wiadomość przez formularz.
        </p>
      </header>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 animate-fade-up">
        <section className="rounded-2xl border border-violet-200/80 bg-white/70 p-6 shadow-sm shadow-violet-100/50">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-600">
            Adres
          </h2>
          <p className="mt-2 font-medium text-violet-950">{c.city}</p>
          <p className="mt-1 whitespace-pre-line text-sm text-violet-950/80">
            {c.address}
          </p>
        </section>

        <section className="rounded-2xl border border-violet-200/80 bg-white/70 p-6 shadow-sm shadow-violet-100/50">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-600">
            Telefon
          </h2>
          <ul className="mt-2 space-y-2">
            {c.phones.map((p) => (
              <li key={p}>
                <a
                  href={`tel:${p.replace(/\s/g, "")}`}
                  className="font-medium text-violet-800 hover:underline"
                >
                  {p}
                </a>
              </li>
            ))}
          </ul>
          <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-violet-600">
            E-mail
          </h2>
          <ul className="mt-2 space-y-2">
            {c.emails.map((e) => (
              <li key={e}>
                <a
                  href={`mailto:${e}`}
                  className="font-medium text-violet-800 hover:underline break-all"
                >
                  {e}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-10 animate-fade-up">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-600">
          Media społecznościowe
        </h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {c.social.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-900 transition hover:border-violet-400 hover:bg-violet-100"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="formularz"
        className="mt-14 scroll-mt-24 rounded-2xl border border-violet-200/90 bg-gradient-to-br from-violet-100/50 to-white p-6 shadow-inner shadow-violet-100/50 sm:p-8"
      >
        <h2 className="text-xl font-semibold text-violet-950">
          Formularz kontaktowy
        </h2>
        <p className="mt-2 text-sm text-violet-950/70">
          Odpowiem tak szybko, jak to możliwe. Możesz też napisać bezpośrednio na
          adres e-mail podany wyżej.
        </p>
        <div className="mt-6 max-w-xl">
          <ContactForm variant="onLight" />
        </div>
      </section>

      <p className="mt-10 text-center text-sm text-violet-950/55">
        <Link href="/" className="font-medium text-violet-700 hover:underline">
          ← Strona główna
        </Link>
      </p>
    </div>
  );
}
