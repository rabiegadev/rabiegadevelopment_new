import { deletePortfolioProject } from "@/app/actions/admin-portfolio";
import { db } from "@/db";
import { portfolioProjects } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { desc } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function deleteAction(formData: FormData) {
  "use server";
  const id = String(formData.get("projectId") ?? "");
  if (id) await deletePortfolioProject(id);
}

export default async function AdminPortfolioPage() {
  await requireAdmin();

  const rows = await db
    .select()
    .from(portfolioProjects)
    .orderBy(desc(portfolioProjects.updatedAt));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Portfolio</h1>
          <p className="mt-1 text-sm text-white/60">
            Projekty widoczne na stronie /portfolio i na stronie głównej.
          </p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Dodaj projekt
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-white/70">
            <tr>
              <th className="px-4 py-3 font-medium">Tytuł</th>
              <th className="px-4 py-3 font-medium">Kategoria</th>
              <th className="px-4 py-3 font-medium">Publikacja</th>
              <th className="px-4 py-3 font-medium">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-white/50">
                  Brak projektów — dodaj pierwszy.
                </td>
              </tr>
            ) : (
              rows.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-white/5 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3 text-white">{p.title}</td>
                  <td className="px-4 py-3 text-white/70">{p.category}</td>
                  <td className="px-4 py-3 text-white/70">
                    {p.isPublished ? "tak" : "nie"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/admin/portfolio/${p.id}`}
                        className="text-emerald-400 hover:underline"
                      >
                        Edytuj
                      </Link>
                      <Link
                        href={`/portfolio/${p.slug}`}
                        className="text-white/60 hover:text-white"
                        target="_blank"
                      >
                        Podgląd
                      </Link>
                      <form action={deleteAction}>
                        <input type="hidden" name="projectId" value={p.id} />
                        <button
                          type="submit"
                          className="text-red-300 hover:underline"
                        >
                          Usuń
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
