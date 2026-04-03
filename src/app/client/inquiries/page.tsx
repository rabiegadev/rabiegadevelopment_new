import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { requireClient } from "@/lib/session";
import { desc, eq, or } from "drizzle-orm";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  new: "Nowe",
  read: "Przeczytane",
  replied: "Odpowiedziano",
  archived: "Archiwum",
};

export default async function ClientInquiriesPage() {
  const session = await requireClient();
  const email = session.user.email?.trim() ?? "";

  const filter =
    email.length > 0
      ? or(
          eq(inquiries.userId, session.user.id),
          eq(inquiries.email, email),
        )
      : eq(inquiries.userId, session.user.id);

  const rows = await db
    .select()
    .from(inquiries)
    .where(filter)
    .orderBy(desc(inquiries.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Moje zapytania</h1>
        <p className="mt-1 text-sm text-white/60">
          Wiadomości wysłane przez formularz (zalogowany lub ten sam e-mail).
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-white/50">
          Brak zapytań. Napisz przez formularz na stronie głównej.
        </p>
      ) : (
        <ul className="space-y-4">
          {rows.map((q) => (
            <li
              key={q.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-white/50">
                  {q.createdAt.toLocaleString("pl-PL")}
                </span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/80">
                  {statusLabel[q.status] ?? q.status}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-white/90">
                {q.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
