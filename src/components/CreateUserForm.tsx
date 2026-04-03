"use client";

import { createUser } from "@/app/actions/admin-users";
import { useActionState } from "react";

type State = { ok: true } | { ok: false; error: string };

const initial: State = { ok: false, error: "" };

export function CreateUserForm() {
  const [state, formAction, pending] = useActionState(
    async (_p: State, formData: FormData): Promise<State> => {
      return createUser(formData);
    },
    initial,
  );

  if (state.ok) {
    return (
      <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
        Użytkownik został utworzony.
      </p>
    );
  }

  return (
    <form action={formAction} className="grid max-w-xl gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      {state.error ? (
        <p className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">E-mail</span>
        <input
          name="email"
          type="email"
          required
          className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">Imię / nazwa</span>
        <input
          name="name"
          required
          className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">Hasło (min. 8 znaków)</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">Rola</span>
        <select
          name="role"
          className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
        >
          <option value="client">Klient</option>
          <option value="admin">Administrator</option>
        </select>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
      >
        {pending ? "Tworzenie…" : "Dodaj użytkownika"}
      </button>
    </form>
  );
}
