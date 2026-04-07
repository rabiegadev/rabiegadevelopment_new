"use server";

import { db } from "@/db";
import {
  portfolioProjectImages,
  portfolioProjects,
} from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { slugifyTitle } from "@/lib/slugify";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

function parseStack(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseImageLines(raw: string): { url: string; sortOrder: number }[] {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines.map((url, i) => ({ url, sortOrder: i }));
}

export async function createPortfolioProject(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const slug = slugRaw ? slugifyTitle(slugRaw) : slugifyTitle(title);
  if (!title || !slug) {
    return { ok: false as const, error: "Tytuł i slug są wymagane." };
  }

  const category = String(formData.get("category") ?? "").trim();
  if (!category) {
    return { ok: false as const, error: "Kategoria jest wymagana." };
  }

  const heroImageUrl = String(formData.get("heroImageUrl") ?? "").trim();
  if (!heroImageUrl) {
    return { ok: false as const, error: "URL / ścieżka zdjęcia głównego jest wymagana." };
  }

  const stack = parseStack(String(formData.get("stack") ?? ""));
  const startedRaw = String(formData.get("startedAt") ?? "").trim();
  const startedAt = startedRaw
    ? new Date(startedRaw + (startedRaw.length === 10 ? "T12:00:00" : ""))
    : null;

  try {
    const [row] = await db
      .insert(portfolioProjects)
      .values({
        slug,
        title,
        category,
        shortDescription:
          String(formData.get("shortDescription") ?? "").trim() || null,
        description: String(formData.get("description") ?? "").trim() || null,
        assumptions: String(formData.get("assumptions") ?? "").trim() || null,
        delivered: String(formData.get("delivered") ?? "").trim() || null,
        stack,
        startedAt: startedAt && !Number.isNaN(startedAt.getTime()) ? startedAt : null,
        heroImageUrl,
        externalUrl:
          String(formData.get("externalUrl") ?? "").trim() || null,
        sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
        isPublished: formData.get("isPublished") === "on",
      })
      .returning({ id: portfolioProjects.id });

    const gallery = parseImageLines(
      String(formData.get("galleryUrls") ?? ""),
    );
    if (row && gallery.length > 0) {
      await db.insert(portfolioProjectImages).values(
        gallery.map((g) => ({
          projectId: row.id,
          imageUrl: g.url,
          sortOrder: g.sortOrder,
        })),
      );
    }
  } catch {
    return {
      ok: false as const,
      error: "Nie udało się zapisać (slug zajęty?).",
    };
  }

  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");
  return { ok: true as const };
}

export async function updatePortfolioProject(
  projectId: string,
  formData: FormData,
) {
  await requireAdmin();
  if (!z.string().uuid().safeParse(projectId).success) {
    return { ok: false as const, error: "Nieprawidłowy projekt." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const slug = slugRaw ? slugifyTitle(slugRaw) : slugifyTitle(title);
  if (!title || !slug) {
    return { ok: false as const, error: "Tytuł i slug są wymagane." };
  }

  const category = String(formData.get("category") ?? "").trim();
  if (!category) {
    return { ok: false as const, error: "Kategoria jest wymagana." };
  }

  const heroImageUrl = String(formData.get("heroImageUrl") ?? "").trim();
  if (!heroImageUrl) {
    return { ok: false as const, error: "Zdjęcie główne jest wymagane." };
  }

  const stack = parseStack(String(formData.get("stack") ?? ""));
  const startedRaw = String(formData.get("startedAt") ?? "").trim();
  const startedAt = startedRaw
    ? new Date(startedRaw + (startedRaw.length === 10 ? "T12:00:00" : ""))
    : null;

  try {
    await db
      .update(portfolioProjects)
      .set({
        slug,
        title,
        category,
        shortDescription:
          String(formData.get("shortDescription") ?? "").trim() || null,
        description: String(formData.get("description") ?? "").trim() || null,
        assumptions: String(formData.get("assumptions") ?? "").trim() || null,
        delivered: String(formData.get("delivered") ?? "").trim() || null,
        stack,
        startedAt:
          startedAt && !Number.isNaN(startedAt.getTime()) ? startedAt : null,
        heroImageUrl,
        externalUrl:
          String(formData.get("externalUrl") ?? "").trim() || null,
        sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
        isPublished: formData.get("isPublished") === "on",
        updatedAt: new Date(),
      })
      .where(eq(portfolioProjects.id, projectId));

    await db
      .delete(portfolioProjectImages)
      .where(eq(portfolioProjectImages.projectId, projectId));

    const gallery = parseImageLines(
      String(formData.get("galleryUrls") ?? ""),
    );
    if (gallery.length > 0) {
      await db.insert(portfolioProjectImages).values(
        gallery.map((g) => ({
          projectId,
          imageUrl: g.url,
          sortOrder: g.sortOrder,
        })),
      );
    }
  } catch {
    return {
      ok: false as const,
      error: "Nie udało się zapisać (slug zajęty?).",
    };
  }

  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${slug}`);
  revalidatePath("/admin/portfolio");
  return { ok: true as const };
}

export async function deletePortfolioProject(projectId: string) {
  await requireAdmin();
  await db
    .delete(portfolioProjects)
    .where(eq(portfolioProjects.id, projectId));
  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");
}
