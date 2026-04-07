import Link from "next/link";

export const metadata = {
  title: "Umiejętności i stack",
  description:
    "Technologie i obszary, w których pracuję: PHP, JavaScript, Node.js, automatyzacja i aplikacje web.",
};

const areas = [
  {
    title: "Backend i automatyzacja",
    body: "PHP, Node.js, integracje API, skrypty i procesy, które oszczędzają czas — od prostych po bardziej złożone przepływy danych.",
  },
  {
    title: "Frontend i doświadczenie użytkownika",
    body: "JavaScript / TypeScript, nowoczesne frameworki (np. React, Next.js), responsywny interfejs pod web i urządzenia mobilne.",
  },
  {
    title: "Bazy danych i architektura",
    body: "Projektowanie pod PostgreSQL / MySQL, migracje, sensowny podział danych pod skalowalność i utrzymanie.",
  },
  {
    title: "Produkty „od wizytówki do systemu”",
    body: "Strony marketingowe, panele dla Ciebie i klientów, narzędzia do zarządzania ofertą, synchronizacji i kontroli — w zależności od potrzeb.",
  },
];

const stack = [
  "PHP",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "React / Next.js",
  "MySQL / PostgreSQL",
  "REST / API",
  "Git",
];

export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <header className="animate-fade-up">
        <p className="text-sm font-medium uppercase tracking-wider text-violet-600">
          Stack &amp; zakres
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-violet-950 md:text-4xl">
          Czym się zajmuję
        </h1>
        <p className="mt-4 text-lg text-violet-950/75">
          Nie ograniczam się wyłącznie do wesel — buduję strony, aplikacje i
          narzędzia dla par młodych, gości, jak i dla firm z branży usługowej:
          od wizytówki online, przez galerie i strony dla gości, po aplikacje do
          przygotowań, automatyzacje, synchronizację i kontrolę procesów.
        </p>
      </header>

      <section className="mt-14 space-y-10">
        {areas.map((a, i) => (
          <div
            key={a.title}
            className="animate-fade-up rounded-2xl border border-violet-100 bg-white/70 p-6 shadow-sm shadow-violet-100/50"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <h2 className="text-lg font-semibold text-violet-950">{a.title}</h2>
            <p className="mt-3 text-violet-950/80">{a.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 animate-fade-up">
        <h2 className="text-lg font-semibold text-violet-950">
          Technologie (bez „gwiazdek” — realny zestaw)
        </h2>
        <ul className="mt-6 flex flex-wrap gap-2">
          {stack.map((s) => (
            <li
              key={s}
              className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-900"
            >
              {s}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-violet-950/65">
          Lista rośnie wraz z projektami — jeśli czegoś nie ma na liście, napisz
          — często da się dobrać narzędzie pod konkretny cel.
        </p>
      </section>

      <div className="mt-14 flex flex-wrap gap-3 animate-fade-up">
        <Link
          href="/portfolio"
          className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white shadow-sm shadow-violet-300/50 hover:bg-violet-500"
        >
          Zobacz portfolio
        </Link>
        <Link
          href="/kontakt#formularz"
          className="rounded-xl border border-violet-200 bg-white px-5 py-3 text-sm font-medium text-violet-900 hover:bg-violet-50"
        >
          Kontakt
        </Link>
      </div>
    </div>
  );
}
