import { ContactForm } from "@/components/ContactForm";
import { HeroCodeSnippet } from "@/components/home/HeroCodeSnippet";
import { PortfolioImage } from "@/components/PortfolioImage";
import { hero, staticServices } from "@/content/legacyMarketing";
import { db } from "@/db";
import { portfolioProjects, services } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [list, featured] = await Promise.all([
    db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(asc(services.sortOrder), asc(services.title)),
    db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.isPublished, true))
      .orderBy(asc(portfolioProjects.sortOrder), desc(portfolioProjects.startedAt))
      .limit(4),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/40">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-fuchsia-200/30 blur-3xl animate-float-slow-delayed" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-start md:py-24">
          <div className="animate-fade-up">
            <h1 className="text-4xl font-semibold tracking-tight text-violet-950 md:text-5xl md:leading-tight">
              {hero.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-violet-950/75 md:text-lg">
              {hero.lead}
            </p>
            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-center sm:gap-4">
              {hero.tech.map((x) => (
                <div
                  key={x.title}
                  className="rounded-2xl border border-violet-100 bg-white/70 px-2 py-4 shadow-sm shadow-violet-100/60"
                >
                  <div className="text-base font-semibold text-violet-700 md:text-lg">
                    {x.title}
                  </div>
                  <div className="mt-1 text-xs text-violet-950/55 md:text-sm">
                    {x.subtitle}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/kontakt#formularz"
                className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white shadow-md shadow-violet-300/40 transition hover:bg-violet-500"
              >
                Rozpocznij projekt
              </Link>
              <Link
                href="/portfolio"
                className="rounded-xl border border-violet-200 bg-white/80 px-5 py-3 text-sm font-medium text-violet-900 hover:bg-violet-50"
              >
                Zobacz portfolio
              </Link>
            </div>
            <div className="mt-8 max-w-xl">
              <HeroCodeSnippet />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md animate-fade-up-delayed">
            <div className="aspect-square overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-xl shadow-violet-200/50 ring-1 ring-violet-100">
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

      <section className="relative overflow-hidden border-b border-violet-200/60 bg-violet-100/35">
        <div className="pointer-events-none absolute -right-32 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-fuchsia-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-48 w-48 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="animate-fade-up">
              <h2 className="text-2xl font-semibold text-violet-950">
                Przykłady projektów
              </h2>
              <p className="mt-2 max-w-xl text-violet-950/70">
                Moje najnowsze realizacje — szczegóły na podstronach projektów.
              </p>
            </div>
            <Link
              href="/portfolio"
              className="text-sm font-medium text-violet-700 hover:underline"
            >
              Zobacz pełne portfolio →
            </Link>
          </div>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.length === 0 ? (
              <li className="col-span-full rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 px-4 py-10 text-center text-sm text-violet-950/60">
                Dodaj projekty w panelu admina (Portfolio), aby pojawiły się tutaj.
              </li>
            ) : (
              featured.map((p, i) => (
                <li
                  key={p.id}
                  className="animate-fade-up overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm shadow-violet-100/60"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <Link href={`/portfolio/${p.slug}`} className="block">
                    <div className="relative aspect-[4/3] bg-violet-100">
                      <PortfolioImage
                        src={p.heroImageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-violet-600">
                        {p.category}
                      </p>
                      <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-violet-950">
                        {p.title}
                      </h3>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <section
        id="uslugi"
        className="relative scroll-mt-24 overflow-hidden border-b border-violet-200/50 bg-gradient-to-br from-violet-50/95 via-fuchsia-50/40 to-violet-100/50"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/4 -translate-y-1/4 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-16">
          <div className="animate-fade-up">
            <h2 className="text-2xl font-semibold text-violet-950">
              Moje usługi
            </h2>
            <p className="mt-2 max-w-2xl text-violet-950/70">
              Co mogę dla Ciebie zrobić
            </p>
          </div>
          <ul className="mt-10 grid gap-6 lg:grid-cols-3">
            {staticServices.map((block, i) => (
              <li
                key={block.title}
                className="animate-fade-up flex flex-col rounded-2xl border border-violet-100 bg-white/90 p-6 shadow-sm shadow-violet-100/50"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <h3 className="text-lg font-semibold text-violet-950">
                  {block.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-violet-950/80">
                  {block.intro}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-violet-950/75">
                  {block.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-violet-500" aria-hidden>
                        ✓
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/kontakt#formularz"
                  className="mt-6 text-sm font-medium text-violet-700 hover:underline"
                >
                  Więcej szczegółów →
                </Link>
              </li>
            ))}
          </ul>

          {list.length > 0 ? (
            <>
              <h3 className="mt-14 text-lg font-semibold text-violet-950 animate-fade-up">
                Rozszerzona oferta
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-violet-950/70 animate-fade-up">
                Aktualizacje i dodatkowe pozycje z panelu administratora.
              </p>
              <ul className="mt-8 grid gap-6 sm:grid-cols-2">
                {list.map((s, i) => (
                  <li
                    key={s.id}
                    className="animate-fade-up rounded-2xl border border-violet-100 bg-white/90 p-6 shadow-sm shadow-violet-100/50"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <h4 className="text-lg font-medium text-violet-950">
                      {s.title}
                    </h4>
                    {s.shortDescription ? (
                      <p className="mt-2 text-sm text-violet-950/75">
                        {s.shortDescription}
                      </p>
                    ) : null}
                    {s.description ? (
                      <p className="mt-3 whitespace-pre-wrap text-sm text-violet-950/80">
                        {s.description}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </section>

      <section
        id="formularz"
        className="border-t border-violet-200/50 bg-gradient-to-b from-violet-200/30 via-violet-100/40 to-violet-50/80 py-14"
      >
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold text-violet-950">Kontakt</h2>
          <p className="mt-2 max-w-xl text-sm text-violet-950/70">
            Rozpocznijmy współpracę — napisz kilka słów o projekcie, odpowiem
            mailowo.
          </p>
          <div className="mt-8 max-w-xl">
            <ContactForm variant="onLight" />
          </div>
        </div>
      </section>
    </>
  );
}
