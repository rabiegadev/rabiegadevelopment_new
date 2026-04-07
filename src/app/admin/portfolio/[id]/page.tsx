import { PortfolioEditForm } from "@/components/admin/PortfolioForm";
import { db } from "@/db";
import { portfolioProjectImages, portfolioProjects } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [p] = await db
    .select()
    .from(portfolioProjects)
    .where(eq(portfolioProjects.id, id))
    .limit(1);

  if (!p) notFound();

  const images = await db
    .select()
    .from(portfolioProjectImages)
    .where(eq(portfolioProjectImages.projectId, id))
    .orderBy(asc(portfolioProjectImages.sortOrder));

  const galleryText = images.map((i) => i.imageUrl).join("\n");

  return (
    <div className="space-y-6">
      <Link
        href="/admin/portfolio"
        className="text-sm text-emerald-400 hover:underline"
      >
        ← Lista portfolio
      </Link>
      <h1 className="text-2xl font-semibold text-white">Edycja: {p.title}</h1>
      <PortfolioEditForm
        projectId={p.id}
        defaults={{
          slug: p.slug,
          title: p.title,
          category: p.category,
          shortDescription: p.shortDescription,
          description: p.description,
          assumptions: p.assumptions,
          delivered: p.delivered,
          stack: Array.isArray(p.stack) ? (p.stack as string[]) : [],
          startedAt: p.startedAt,
          heroImageUrl: p.heroImageUrl,
          externalUrl: p.externalUrl,
          sortOrder: p.sortOrder,
          isPublished: p.isPublished,
        }}
        galleryText={galleryText}
      />
    </div>
  );
}
