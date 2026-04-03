import { ContactForm } from "@/components/ContactForm";
import { db } from "@/db";
import { services } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const list = await db
    .select()
    .from(services)
    .where(eq(services.isActive, true))
    .orderBy(asc(services.sortOrder), asc(services.title));

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white to-slate-50 dark:border-white/10 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              rabiegadevelopment.pl
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl">
              Strony i aplikacje pod wesela oraz dla firm z branży usługowej.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600 dark:text-white/70">
              Projektuję strony weselne, aplikacje wspierające przygotowania do
              ślubu, narzędzia dla usługodawców — od wizytówek po automatyzacje
              i zarządzanie ofertą.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#kontakt"
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-500"
              >
                Porozmawiajmy
              </Link>
              <Link
                href="#uslugi"
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-800 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                Zobacz usługi
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="aspect-square overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-slate-900 dark:shadow-none">
              <Image
                src="/av.jpeg"
                alt="Rabiega Development"
                width={640}
                height={640}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section id="uslugi" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Usługi
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-white/65">
          Poniżej katalog zarządzany z panelu administratora. Możesz go dowolnie
          rozbudowywać.
        </p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {list.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-slate-300 p-8 text-slate-500 dark:border-white/20 dark:text-white/50">
              Brak opublikowanych usług — dodaj je w panelu admina po zalogowaniu.
            </li>
          ) : (
            list.map((s) => (
              <li
                key={s.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
              >
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                  {s.title}
                </h3>
                {s.shortDescription ? (
                  <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
                    {s.shortDescription}
                  </p>
                ) : null}
                {s.description ? (
                  <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600 dark:text-white/75">
                    {s.description}
                  </p>
                ) : null}
              </li>
            ))
          )}
        </ul>
      </section>

      <section
        id="kontakt"
        className="border-t border-slate-200 bg-slate-900 py-16 text-white dark:border-white/10"
      >
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold">Kontakt</h2>
          <p className="mt-2 max-w-xl text-sm text-white/65">
            Napisz kilka słów o projekcie — odpowiem mailowo. Potwierdzenie
            dostaniesz na podany adres (wymaga skonfigurowania Resend w
            zmiennych środowiskowych).
          </p>
          <div className="mt-8 max-w-xl">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
