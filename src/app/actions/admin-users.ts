"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createSchema = z.object({
  email: z.string().email().max(320).trim().toLowerCase(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(200).trim(),
  role: z.enum(["admin", "client"]),
});

export async function createUser(formData: FormData) {
  await requireAdmin();

  const parsed = createSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { ok: false as const, error: "Sprawdź dane (hasło min. 8 znaków)." };
  }

  const { email, password, name, role } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    await db.insert(users).values({
      email,
      name,
      role,
      passwordHash,
    });
  } catch {
    return { ok: false as const, error: "Użytkownik z tym e-mailem już istnieje." };
  }

  revalidatePath("/admin/users");
  return { ok: true as const };
}

export async function setUserActive(userId: string, active: boolean) {
  await requireAdmin();
  await db.update(users).set({ active }).where(eq(users.id, userId));
  revalidatePath("/admin/users");
}

export async function updateUserProfile(
  userId: string,
  formData: FormData,
) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name || name.length > 200) {
    return { ok: false as const, error: "Podaj poprawną nazwę." };
  }
  await db.update(users).set({ name, updatedAt: new Date() }).where(eq(users.id, userId));
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  return { ok: true as const };
}

export async function resetUserPassword(userId: string, formData: FormData) {
  await requireAdmin();
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) {
    return { ok: false as const, error: "Hasło min. 8 znaków." };
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, userId));
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  return { ok: true as const };
}
