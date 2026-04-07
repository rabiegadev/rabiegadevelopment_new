"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { sendContactEmails } from "@/lib/mail";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  email: z.string().email().max(320).trim(),
  phone: z.string().max(50).trim().optional(),
  message: z.string().min(1).max(8000).trim(),
});

export type ContactFormState =
  | { ok: true }
  | { ok: false; error: string };

export async function submitContactForm(
  _prev: ContactFormState | undefined,
  formData: FormData,
): Promise<ContactFormState> {
  const session = await auth();

  const phoneRaw = String(formData.get("phone") ?? "").trim();

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: phoneRaw.length > 0 ? phoneRaw : undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Uzupełnij poprawnie wszystkie pola." };
  }

  const { name, email, phone, message } = parsed.data;

  const projectContext = String(
    formData.get("projectContext") ?? "",
  ).trim();
  const fullMessage =
    projectContext.length > 0
      ? `${projectContext}\n\n---\n\n${message}`
      : message;

  await db.insert(inquiries).values({
    name,
    email,
    phone: phone || null,
    message: fullMessage,
    userId:
      session?.user?.role === "client" ? session.user.id : null,
  });

  try {
    await sendContactEmails({ name, email, phone, message: fullMessage });
  } catch (e) {
    console.error("[contact] mail error", e);
  }

  revalidatePath("/admin/inquiries");
  revalidatePath("/client/inquiries");
  return { ok: true };
}
