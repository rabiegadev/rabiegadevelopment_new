"use client";

import { createService } from "@/app/actions/admin-services";
import { useActionState } from "react";

type State = { ok: true } | { ok: false; error: string };

const initial: State = { ok: false, error: "" };

export function CreateServiceForm() {
  const [state, formAction, pending] = useActionState(
    async (_p: State, formData: FormData): Promise<State> => {
      return createService(formData);
    },
    initial,
  );

  if (state.ok) {
    return (
      <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
        Usługa została dodana.
      </p>
    );
  }

  return (
    <form
      action={formAction}
      className="grid max-w-xl gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
    >
      {state.error ? (
        <p className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">Tytuł</span>
        <input
          name="title"
          required
          className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">Slug (opcjonalnie, wygeneruje z tytułu)</span>
        <input
          name="slug"
          className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
          placeholder="np. strony-weselne"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">Krótki opis</span>
        <input
          name="shortDescription"
          className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">Pełny opis</span>
        <textarea
          name="description"
          rows={4}
          className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">Kolejność (sortowanie)</span>
        <input
          name="sortOrder"
          type="number"
          defaultValue={0}
          min={0}
          className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-white/80">
        <input type="checkbox" name="isActive" defaultChecked className="rounded" />
        Aktywna (widoczna na stronie)
      </label>
      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
      >
        {pending ? "Zapisywanie…" : "Dodaj usługę"}
      </button>
    </form>
  );
}
