import { db } from "@/db";
import { clientServices, services } from "@/db/schema";
import { requireClient } from "@/lib/session";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function ClientServicesPage() {
  const session = await requireClient();

  const rows = await db
    .select({
      linkId: clientServices.id,
      title: services.title,
      shortDescription: services.shortDescription,
      description: services.description,
      note: clientServices.note,
      createdAt: clientServices.createdAt,
    })
    .from(clientServices)
    .innerJoin(services, eq(clientServices.serviceId, services.id))
    .where(eq(clientServices.userId, session.user.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Moje usługi</h1>
        <p className="mt-1 text-sm text-white/60">
          Usługi przypisane do Twojego konta przez administratora.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-white/50">
          Nie masz jeszcze przypisanych usług. Skontaktuj się, jeśli oczekujesz dostępu.
        </p>
      ) : (
        <ul className="space-y-4">
          {rows.map((r) => (
            <li
              key={r.linkId}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h2 className="text-lg font-medium text-white">{r.title}</h2>
              {r.shortDescription ? (
                <p className="mt-2 text-sm text-white/70">{r.shortDescription}</p>
              ) : null}
              {r.description ? (
                <p className="mt-3 whitespace-pre-wrap text-sm text-white/80">
                  {r.description}
                </p>
              ) : null}
              {r.note ? (
                <p className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                  <span className="font-medium">Notatka: </span>
                  {r.note}
                </p>
              ) : null}
              <p className="mt-3 text-xs text-white/40">
                Przypisano: {r.createdAt.toLocaleString("pl-PL")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
