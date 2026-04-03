"use server";

import { db } from "@/db";
import { services } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const serviceSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  slug: z.string().min(1).max(200).optional(),
  shortDescription: z.string().max(500).optional(),
  description: z.string().max(20000).optional(),
  sortOrder: z.coerce.number().int().min(0).max(999999),
  isActive: z.boolean(),
});

export async function createService(formData: FormData) {
  await requireAdmin();

  const rawSlug = formData.get("slug") as string | null;
  const parsed = serviceSchema.safeParse({
    title: formData.get("title"),
    slug: rawSlug?.trim() || undefined,
    shortDescription: (formData.get("shortDescription") as string)?.trim() || undefined,
    description: (formData.get("description") as string)?.trim() || undefined,
    sortOrder: formData.get("sortOrder") ?? 0,
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
  });

  if (!parsed.success) {
    return { ok: false as const, error: "Uzupełnij poprawnie pola usługi." };
  }

  const d = parsed.data;
  const slug = d.slug && d.slug.length > 0 ? slugify(d.slug) : slugify(d.title);
  if (!slug) {
    return { ok: false as const, error: "Slug jest wymagany (litery/cyfry)." };
  }

  try {
    await db.insert(services).values({
      title: d.title,
      slug,
      shortDescription: d.shortDescription ?? null,
      description: d.description ?? null,
      sortOrder: d.sortOrder,
      isActive: d.isActive,
    });
  } catch {
    return { ok: false as const, error: "Usługa z tym slug już istnieje." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/");
  return { ok: true as const };
}

export async function updateService(serviceId: string, formData: FormData) {
  await requireAdmin();

  const rawSlug = formData.get("slug") as string | null;
  const parsed = serviceSchema.safeParse({
    title: formData.get("title"),
    slug: rawSlug?.trim() || undefined,
    shortDescription: (formData.get("shortDescription") as string)?.trim() || undefined,
    description: (formData.get("description") as string)?.trim() || undefined,
    sortOrder: formData.get("sortOrder") ?? 0,
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
  });

  if (!parsed.success) {
    return { ok: false as const, error: "Uzupełnij poprawnie pola usługi." };
  }

  const d = parsed.data;
  const slug = d.slug && d.slug.length > 0 ? slugify(d.slug) : slugify(d.title);

  try {
    await db
      .update(services)
      .set({
        title: d.title,
        slug,
        shortDescription: d.shortDescription ?? null,
        description: d.description ?? null,
        sortOrder: d.sortOrder,
        isActive: d.isActive,
        updatedAt: new Date(),
      })
      .where(eq(services.id, serviceId));
  } catch {
    return { ok: false as const, error: "Nie udało się zapisać (slug zajęty?)." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/");
  return { ok: true as const };
}

export async function deleteService(serviceId: string) {
  await requireAdmin();
  await db.delete(services).where(eq(services.id, serviceId));
  revalidatePath("/admin/services");
  revalidatePath("/");
}
