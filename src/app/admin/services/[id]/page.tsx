import { updateService } from "@/app/actions/admin-services";
import { db } from "@/db";
import { services } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function updateAction(serviceId: string, formData: FormData) {
  "use server";
  await updateService(serviceId, formData);
}

export default async function AdminServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [s] = await db
    .select()
    .from(services)
    .where(eq(services.id, id))
    .limit(1);

  if (!s) notFound();

  const boundUpdate = updateAction.bind(null, s.id);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link
        href="/admin/services"
        className="text-sm text-emerald-400 hover:underline"
      >
        ← Usługi
      </Link>
      <h1 className="text-2xl font-semibold text-white">Edycja usługi</h1>
      <form action={boundUpdate} className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-white/70">Tytuł</span>
          <input
            name="title"
            required
            defaultValue={s.title}
            className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-white/70">Slug</span>
          <input
            name="slug"
            defaultValue={s.slug}
            className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-white/70">Krótki opis</span>
          <input
            name="shortDescription"
            defaultValue={s.shortDescription ?? ""}
            className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-white/70">Pełny opis</span>
          <textarea
            name="description"
            rows={6}
            defaultValue={s.description ?? ""}
            className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-white/70">Kolejność</span>
          <input
            name="sortOrder"
            type="number"
            min={0}
            defaultValue={s.sortOrder}
            className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={s.isActive}
            className="rounded"
          />
          Aktywna
        </label>
        <button
          type="submit"
          className="mt-2 w-fit rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Zapisz
        </button>
      </form>
    </div>
  );
}
