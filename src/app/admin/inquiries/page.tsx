import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { desc } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  new: "Nowe",
  read: "Przeczytane",
  replied: "Odpowiedziano",
  archived: "Archiwum",
};

export default async function AdminInquiriesPage() {
  await requireAdmin();

  const rows = await db
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Zapytania</h1>
        <p className="mt-1 text-sm text-white/60">
          Historia wiadomości z formularza kontaktowego.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-white/70">
            <tr>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Kontakt</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Podgląd</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-white/50"
                >
                  Brak zapytań.
                </td>
              </tr>
            ) : (
              rows.map((q) => (
                <tr
                  key={q.id}
                  className="border-b border-white/5 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-white/80">
                    {q.createdAt.toLocaleString("pl-PL")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{q.name}</div>
                    <div className="text-white/60">{q.email}</div>
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {statusLabel[q.status] ?? q.status}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/inquiries/${q.id}`}
                      className="text-emerald-400 hover:underline"
                    >
                      Szczegóły
                    </Link>
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
