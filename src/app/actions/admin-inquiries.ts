"use server";

import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const statusSchema = z.enum(["new", "read", "replied", "archived"]);

export async function updateInquiryStatus(
  inquiryId: string,
  status: z.infer<typeof statusSchema>,
) {
  await requireAdmin();
  const s = statusSchema.safeParse(status);
  if (!s.success) throw new Error("Nieprawidłowy status");

  await db
    .update(inquiries)
    .set({ status: s.data })
    .where(eq(inquiries.id, inquiryId));

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${inquiryId}`);
}

export async function updateInquiryStatusForm(formData: FormData) {
  const id = String(formData.get("inquiryId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id) return;
  await updateInquiryStatus(id, status as z.infer<typeof statusSchema>);
}
