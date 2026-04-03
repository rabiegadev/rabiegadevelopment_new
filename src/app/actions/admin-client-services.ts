"use server";

import { db } from "@/db";
import { clientServices, users } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function assignServiceToClient(
  userId: string,
  serviceId: string,
  note?: string,
) {
  await requireAdmin();

  const [u] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!u || u.role !== "client") {
    return { ok: false as const, error: "Można przypisywać usługi tylko klientom." };
  }

  const sid = z.string().uuid().safeParse(serviceId);
  if (!sid.success) {
    return { ok: false as const, error: "Nieprawidłowa usługa." };
  }

  try {
    await db.insert(clientServices).values({
      userId,
      serviceId: sid.data,
      note: note?.trim() || null,
    });
  } catch {
    return { ok: false as const, error: "Ta usługa jest już przypisana." };
  }

  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/client/services");
  return { ok: true as const };
}

export async function removeClientService(linkId: string, userId: string) {
  await requireAdmin();
  await db
    .delete(clientServices)
    .where(
      and(
        eq(clientServices.id, linkId),
        eq(clientServices.userId, userId),
      ),
    );
  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/client/services");
}
