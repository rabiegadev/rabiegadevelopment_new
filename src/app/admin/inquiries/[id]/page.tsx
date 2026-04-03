import { updateInquiryStatusForm } from "@/app/actions/admin-inquiries";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const statuses = [
  { value: "new", label: "Nowe" },
  { value: "read", label: "Przeczytane" },
  { value: "replied", label: "Odpowiedziano" },
  { value: "archived", label: "Archiwum" },
] as const;

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [row] = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.id, id))
    .limit(1);

  if (!row) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link
        href="/admin/inquiries"
        className="text-sm text-emerald-400 hover:underline"
      >
        ← Lista zapytań
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-white">Szczegóły zapytania</h1>
        <p className="mt-1 text-sm text-white/60">
          {row.createdAt.toLocaleString("pl-PL")}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-white/50">
            Imię / nazwa
          </div>
          <div className="text-lg text-white">{row.name}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-white/50">
            E-mail
          </div>
          <a
            href={`mailto:${row.email}`}
            className="text-emerald-400 hover:underline"
          >
            {row.email}
          </a>
        </div>
        {row.phone ? (
          <div>
            <div className="text-xs uppercase tracking-wide text-white/50">
              Telefon
            </div>
            <a
              href={`tel:${row.phone}`}
              className="text-white hover:underline"
            >
              {row.phone}
            </a>
          </div>
        ) : null}
        <div>
          <div className="text-xs uppercase tracking-wide text-white/50">
            Wiadomość
          </div>
          <p className="mt-2 whitespace-pre-wrap text-white/90">{row.message}</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-sm font-medium text-white/80">Status</h2>
        <form action={updateInquiryStatusForm} className="mt-3 flex flex-wrap gap-3">
          <input type="hidden" name="inquiryId" value={row.id} />
          <select
            name="status"
            defaultValue={row.status}
            className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Zapisz status
          </button>
        </form>
      </div>
    </div>
  );
}
