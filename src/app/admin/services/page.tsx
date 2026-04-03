import { deleteService } from "@/app/actions/admin-services";
import { CreateServiceForm } from "@/components/CreateServiceForm";
import { db } from "@/db";
import { services } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { asc } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function deleteAction(formData: FormData) {
  "use server";
  const id = String(formData.get("serviceId") ?? "");
  if (id) await deleteService(id);
}

export default async function AdminServicesPage() {
  await requireAdmin();

  const rows = await db
    .select()
    .from(services)
    .orderBy(asc(services.sortOrder), asc(services.title));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-white">Usługi</h1>
        <p className="mt-1 text-sm text-white/60">
          Katalog oferty — widoczny na stronie głównej i przypisywany klientom.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-medium text-white">Nowa usługa</h2>
        <CreateServiceForm />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium text-white">Lista</h2>
        <div className="space-y-4">
          {rows.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-medium text-white">{s.title}</h3>
                    {!s.isActive ? (
                      <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/70">
                        Nieaktywna
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-white/45">/{s.slug}</p>
                  {s.shortDescription ? (
                    <p className="mt-2 text-sm text-white/70">{s.shortDescription}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/services/${s.id}`}
                    className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10"
                  >
                    Edytuj
                  </Link>
                  <form action={deleteAction}>
                    <input type="hidden" name="serviceId" value={s.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-red-500/40 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/10"
                    >
                      Usuń
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
          {rows.length === 0 ? (
            <p className="text-sm text-white/50">Brak usług — dodaj pierwszą powyżej.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
