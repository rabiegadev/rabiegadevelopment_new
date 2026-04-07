import { PortfolioImage } from "@/components/PortfolioImage";
import { db } from "@/db";
import { portfolioProjects } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portfolio",
  description:
    "Wybrane realizacje: strony weselne, aplikacje, automatyzacje i narzędzia dla firm.",
};

export default async function PortfolioIndexPage() {
  const rows = await db
    .select()
    .from(portfolioProjects)
    .where(eq(portfolioProjects.isPublished, true))
    .orderBy(desc(portfolioProjects.sortOrder), desc(portfolioProjects.startedAt));

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <header className="max-w-2xl animate-fade-up">
        <p className="text-sm font-medium uppercase tracking-wider text-violet-600">
          Portfolio
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-violet-950 md:text-4xl">
          Realizacje
        </h1>
        <p className="mt-4 text-lg text-violet-950/70">
          Od stron i galerii po automatyzacje i aplikacje do zarządzania — poniżej
          kilka przykładów. Szczegóły po kliknięciu w projekt.
        </p>
      </header>

      <ul className="mt-14 grid gap-10 md:grid-cols-2">
        {rows.length === 0 ? (
          <li className="col-span-full rounded-2xl border border-dashed border-violet-200 bg-white/60 px-6 py-12 text-center text-violet-950/60">
            Wkrótce pojawią się tutaj projekty — dodaj je w panelu administratora.
          </li>
        ) : (
          rows.map((p, i) => (
            <li
              key={p.id}
              className="animate-fade-up group rounded-2xl border border-violet-100 bg-white/80 p-2 shadow-sm shadow-violet-200/40"
              style={{ animationDelay: `${Math.min(i, 5) * 80}ms` }}
            >
              <Link href={`/portfolio/${p.slug}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-violet-100">
                  <PortfolioImage
                    src={p.heroImageUrl}
                    alt=""
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="px-3 pb-4 pt-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-violet-600">
                    {p.category}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-violet-950">
                    {p.title}
                  </h2>
                  {p.startedAt ? (
                    <p className="mt-1 text-sm text-violet-950/50">
                      Start:{" "}
                      {p.startedAt.toLocaleDateString("pl-PL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  ) : null}
                  {p.shortDescription ? (
                    <p className="mt-3 line-clamp-3 text-sm text-violet-950/75">
                      {p.shortDescription}
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(p.stack as string[]).slice(0, 5).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="mt-4 inline-flex text-sm font-medium text-violet-700 group-hover:underline">
                    Zobacz case study →
                  </span>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
