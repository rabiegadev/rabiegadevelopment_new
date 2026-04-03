import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ClientHomePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "client") {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">
        Cześć, {session.user.name ?? "kliencie"}
      </h1>
      <p className="text-white/70">
        Tutaj zobaczysz przypisane usługi oraz historię swoich zapytań.
      </p>
      <ul className="flex flex-wrap gap-3 text-sm">
        <li>
          <Link
            href="/client/services"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500"
          >
            Moje usługi
          </Link>
        </li>
        <li>
          <Link
            href="/client/inquiries"
            className="rounded-lg border border-white/20 px-4 py-2 text-white hover:bg-white/10"
          >
            Moje zapytania
          </Link>
        </li>
      </ul>
    </div>
  );
}
