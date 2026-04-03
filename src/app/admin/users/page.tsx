import { setUserActive } from "@/app/actions/admin-users";
import { CreateUserForm } from "@/components/CreateUserForm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { desc } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function toggleActive(formData: FormData) {
  "use server";
  const userId = String(formData.get("userId") ?? "");
  const next = String(formData.get("active") ?? "") === "true";
  if (userId) await setUserActive(userId, next);
}

export default async function AdminUsersPage() {
  await requireAdmin();

  const rows = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-white">Użytkownicy</h1>
        <p className="mt-1 text-sm text-white/60">
          Zarządzanie kontami klientów i administratorów.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-medium text-white">Nowy użytkownik</h2>
        <CreateUserForm />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium text-white">Lista</h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-white/70">
              <tr>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Nazwa</th>
                <th className="px-4 py-3 font-medium">Rola</th>
                <th className="px-4 py-3 font-medium">Aktywny</th>
                <th className="px-4 py-3 font-medium">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-white/5 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3 text-white">{u.email}</td>
                  <td className="px-4 py-3 text-white/80">{u.name}</td>
                  <td className="px-4 py-3 text-white/80">
                    {u.role === "admin" ? "Admin" : "Klient"}
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleActive}>
                      <input type="hidden" name="userId" value={u.id} />
                      <input
                        type="hidden"
                        name="active"
                        value={u.active ? "false" : "true"}
                      />
                      <button
                        type="submit"
                        className={
                          u.active
                            ? "text-amber-300 hover:underline"
                            : "text-emerald-400 hover:underline"
                        }
                      >
                        {u.active ? "Wyłącz" : "Włącz"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    {u.role === "client" ? (
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="text-emerald-400 hover:underline"
                      >
                        Usługi
                      </Link>
                    ) : (
                      <span className="text-white/40">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
