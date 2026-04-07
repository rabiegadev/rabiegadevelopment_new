import { ContactForm } from "@/components/ContactForm";
import { PortfolioImage } from "@/components/PortfolioImage";
import { db } from "@/db";
import { portfolioProjectImages, portfolioProjects } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [p] = await db
    .select({ title: portfolioProjects.title })
    .from(portfolioProjects)
    .where(
      and(
        eq(portfolioProjects.slug, slug),
        eq(portfolioProjects.isPublished, true),
      ),
    )
    .limit(1);
  if (!p) return { title: "Projekt" };
  return { title: p.title };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [p] = await db
    .select()
    .from(portfolioProjects)
    .where(eq(portfolioProjects.slug, slug))
    .limit(1);

  if (!p || !p.isPublished) notFound();

  const images = await db
    .select()
    .from(portfolioProjectImages)
    .where(eq(portfolioProjectImages.projectId, p.id))
    .orderBy(asc(portfolioProjectImages.sortOrder));

  const stack = Array.isArray(p.stack) ? (p.stack as string[]) : [];

  const projectContext = `Szukasz podobnego rozwiązania? W treści wiadomości podaj proszę nazwę tego projektu: „${p.title}” (slug: ${p.slug}).`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <Link
        href="/portfolio"
        className="text-sm font-medium text-violet-700 hover:underline"
      >
        ← Portfolio
      </Link>

      <header className="mt-8 animate-fade-up">
        <p className="text-sm font-medium uppercase tracking-wider text-violet-600">
          {p.category}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-violet-950 md:text-4xl">
          {p.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-violet-950/65">
          {p.startedAt ? (
            <span>
              Start projektu:{" "}
              {p.startedAt.toLocaleDateString("pl-PL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          ) : null}
          {p.externalUrl ? (
            <a
              href={p.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-violet-700 hover:underline"
            >
              Otwórz działającą stronę →
            </a>
          ) : null}
        </div>
      </header>

      <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-violet-100 bg-violet-50 shadow-sm animate-fade-up">
        <PortfolioImage
          src={p.heroImageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 42rem"
          priority
        />
      </div>

      {stack.length > 0 ? (
        <ul className="mt-8 flex flex-wrap gap-2 animate-fade-up">
          {stack.map((t) => (
            <li
              key={t}
              className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-900"
            >
              {t}
            </li>
          ))}
        </ul>
      ) : null}

      {p.description ? (
        <section className="mt-12 animate-fade-up">
          <h2 className="text-lg font-semibold text-violet-950">Opis</h2>
          <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-violet-950/85">
            {p.description}
          </p>
        </section>
      ) : null}

      {p.assumptions ? (
        <section className="mt-10 animate-fade-up">
          <h2 className="text-lg font-semibold text-violet-950">Założenia</h2>
          <p className="mt-3 whitespace-pre-wrap text-violet-950/85">
            {p.assumptions}
          </p>
        </section>
      ) : null}

      {p.delivered ? (
        <section className="mt-10 animate-fade-up">
          <h2 className="text-lg font-semibold text-violet-950">
            Co zostało zrealizowane
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-violet-950/85">
            {p.delivered}
          </p>
        </section>
      ) : null}

      {images.length > 0 ? (
        <section className="mt-12 animate-fade-up">
          <h2 className="text-lg font-semibold text-violet-950">
            Zrzuty ekranu / materiały
          </h2>
          <ul className="mt-6 space-y-8">
            {images.map((img) => (
              <li key={img.id}>
                <div className="relative aspect-video overflow-hidden rounded-xl border border-violet-100 bg-violet-50">
                  <PortfolioImage
                    src={img.imageUrl}
                    alt={img.caption ?? ""}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 42rem"
                  />
                </div>
                {img.caption ? (
                  <p className="mt-2 text-sm text-violet-950/60">{img.caption}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section
        id="kontakt-projekt"
        className="mt-16 space-y-6 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6 shadow-sm animate-fade-up md:p-8"
      >
        <div>
          <h2 className="text-xl font-semibold text-violet-950">
            Szukasz podobnego rozwiązania?
          </h2>
          <p className="mt-2 text-sm text-violet-950/75">
            Skontaktuj się — w treści wiadomości podaj nazwę tego projektu, żebym
            mógł odnieść się do tej realizacji.
          </p>
        </div>
        <ContactForm variant="onLight" projectContext={projectContext} />
      </section>
    </article>
  );
}
