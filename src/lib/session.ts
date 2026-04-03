import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }
  return session;
}

export async function requireClient() {
  const session = await auth();
  if (!session?.user || session.user.role !== "client") {
    redirect("/login");
  }
  return session;
}
