import {
  assignServiceToClient,
  removeClientService,
} from "@/app/actions/admin-client-services";
import {
  updateUserProfile,
  resetUserPassword,
} from "@/app/actions/admin-users";
import { db } from "@/db";
import { clientServices, services, users } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function assignFormAction(formData: FormData) {
  "use server";
  const userId = String(formData.get("userId") ?? "");
  const serviceId = String(formData.get("serviceId") ?? "");
  const note = String(formData.get("note") ?? "");
  if (userId && serviceId) {
    await assignServiceToClient(userId, serviceId, note);
  }
}

async function removeFormAction(formData: FormData) {
  "use server";
  const linkId = String(formData.get("linkId") ?? "");
  const userId = String(formData.get("userId") ?? "");
  if (linkId && userId) await removeClientService(linkId, userId);
}

async function profileFormAction(formData: FormData) {
  "use server";
  const userId = String(formData.get("userId") ?? "");
  if (userId) await updateUserProfile(userId, formData);
}

async function passwordFormAction(formData: FormData) {
  "use server";
  const userId = String(formData.get("userId") ?? "");
  if (userId) await resetUserPassword(userId, formData);
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!user || user.role !== "client") notFound();

  const assigned = await db
    .select({
      linkId: clientServices.id,
      note: clientServices.note,
      title: services.title,
      slug: services.slug,
      serviceId: services.id,
    })
    .from(clientServices)
    .innerJoin(services, eq(clientServices.serviceId, services.id))
    .where(eq(clientServices.userId, id));

  const assignedIds = new Set(assigned.map((a) => a.serviceId));
  const allServices = await db.select().from(services).orderBy(services.sortOrder);
  const available = allServices.filter((s) => !assignedIds.has(s.id));

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link href="/admin/users" className="text-sm text-emerald-400 hover:underline">
        ← Użytkownicy
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-white">{user.name}</h1>
        <p className="text-white/60">{user.email}</p>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
        <h2 className="text-sm font-medium text-white/80">Profil</h2>
        <form action={profileFormAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <input type="hidden" name="userId" value={user.id} />
          <label className="flex flex-1 flex-col gap-1 text-sm">
            <span className="text-white/60">Nazwa wyświetlana</span>
            <input
              name="name"
              defaultValue={user.name}
              required
              className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
          >
            Zapisz
          </button>
        </form>

        <form action={passwordFormAction} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input type="hidden" name="userId" value={user.id} />
          <label className="flex flex-1 flex-col gap-1 text-sm">
            <span className="text-white/60">Nowe hasło</span>
            <input
              name="password"
              type="password"
              minLength={8}
              required
              placeholder="Min. 8 znaków"
              className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
          >
            Zmień hasło
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
        <h2 className="text-sm font-medium text-white/80">Przypisane usługi</h2>
        {assigned.length === 0 ? (
          <p className="text-sm text-white/50">Brak przypisanych usług.</p>
        ) : (
          <ul className="space-y-3">
            {assigned.map((a) => (
              <li
                key={a.linkId}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3"
              >
                <div>
                  <div className="font-medium text-white">{a.title}</div>
                  {a.note ? (
                    <div className="text-sm text-white/50">{a.note}</div>
                  ) : null}
                </div>
                <form action={removeFormAction}>
                  <input type="hidden" name="linkId" value={a.linkId} />
                  <input type="hidden" name="userId" value={user.id} />
                  <button
                    type="submit"
                    className="text-sm text-red-300 hover:underline"
                  >
                    Usuń
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}

        {available.length > 0 ? (
          <form action={assignFormAction} className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
            <input type="hidden" name="userId" value={user.id} />
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-white/60">Dodaj usługę</span>
              <select
                name="serviceId"
                required
                className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
              >
                {available.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-white/60">Notatka (opcjonalnie)</span>
              <input
                name="note"
                className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
                placeholder="np. pakiet, termin…"
              />
            </label>
            <button
              type="submit"
              className="w-fit rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Przypisz
            </button>
          </form>
        ) : (
          <p className="text-sm text-white/40">
            Wszystkie istniejące usługi są już przypisane lub brak usług w katalogu.
          </p>
        )}
      </section>
    </div>
  );
}
