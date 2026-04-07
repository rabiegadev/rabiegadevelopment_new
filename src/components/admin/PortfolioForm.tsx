"use client";

import {
  createPortfolioProject,
  updatePortfolioProject,
} from "@/app/actions/admin-portfolio";
import Link from "next/link";
import { useActionState } from "react";

type Row = {
  slug: string;
  title: string;
  category: string;
  shortDescription: string | null;
  description: string | null;
  assumptions: string | null;
  delivered: string | null;
  stack: string[];
  startedAt: Date | null;
  heroImageUrl: string;
  externalUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
};

type State = { ok: true } | { ok: false; error: string };
const initial: State = { ok: false, error: "" };

function stackToText(stack: string[]) {
  return stack.join("\n");
}

export function PortfolioCreateForm() {
  const [state, formAction, pending] = useActionState(
    async (_p: State, fd: FormData): Promise<State> => {
      return createPortfolioProject(fd);
    },
    initial,
  );

  if (state.ok) {
    return (
      <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
        Zapisano.{" "}
        <Link href="/admin/portfolio" className="font-medium underline">
          Wróć do listy portfolio
        </Link>
        .
      </p>
    );
  }

  return (
    <PortfolioFields
      formAction={formAction}
      pending={pending}
      error={state.ok === false ? state.error : undefined}
    />
  );
}

export function PortfolioEditForm({
  projectId,
  defaults,
  galleryText,
}: {
  projectId: string;
  defaults: Row;
  galleryText: string;
}) {
  const [state, formAction, pending] = useActionState(
    async (_p: State, fd: FormData): Promise<State> => {
      return updatePortfolioProject(projectId, fd);
    },
    initial,
  );

  if (state.ok) {
    return (
      <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
        Zapisano zmiany.
      </p>
    );
  }

  return (
    <PortfolioFields
      formAction={formAction}
      pending={pending}
      error={state.ok === false ? state.error : undefined}
      defaults={defaults}
      galleryText={galleryText}
    />
  );
}

function PortfolioFields({
  formAction,
  pending,
  error,
  defaults,
  galleryText,
}: {
  formAction: (fd: FormData) => void;
  pending: boolean;
  error?: string;
  defaults?: Row;
  galleryText?: string;
}) {
  const d = defaults;
  const started =
    d?.startedAt != null
      ? d.startedAt.toISOString().slice(0, 10)
      : "";

  return (
    <form action={formAction} className="grid max-w-3xl gap-4">
      {error ? (
        <p className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-sm text-red-200">
          {error}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-white/70">Tytuł</span>
          <input
            name="title"
            required
            defaultValue={d?.title}
            className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-white/70">Slug (URL)</span>
          <input
            name="slug"
            defaultValue={d?.slug}
            className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
            placeholder="auto z tytułu jeśli puste"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">Kategoria</span>
        <input
          name="category"
          required
          defaultValue={d?.category}
          placeholder="np. strona weselna, automatyzacja, aplikacja web"
          className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">Krótki opis (lista / karty)</span>
        <textarea
          name="shortDescription"
          rows={2}
          defaultValue={d?.shortDescription ?? ""}
          className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">Pełny opis</span>
        <textarea
          name="description"
          rows={5}
          defaultValue={d?.description ?? ""}
          className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">Założenia</span>
        <textarea
          name="assumptions"
          rows={4}
          defaultValue={d?.assumptions ?? ""}
          className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">Co zrealizowano</span>
        <textarea
          name="delivered"
          rows={4}
          defaultValue={d?.delivered ?? ""}
          className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">Stack (jedna pozycja na linię)</span>
        <textarea
          name="stack"
          rows={4}
          defaultValue={d ? stackToText(d.stack) : ""}
          placeholder={"PHP\nNode.js\nTypeScript"}
          className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white font-mono text-sm"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-white/70">Data rozpoczęcia</span>
          <input
            name="startedAt"
            type="date"
            defaultValue={started}
            className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-white/70">Kolejność sortowania</span>
          <input
            name="sortOrder"
            type="number"
            defaultValue={d?.sortOrder ?? 0}
            className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">
          Zdjęcie główne — plik w{" "}
          <code className="text-violet-300">public/…</code>, w polu adres z{" "}
          <code className="text-violet-300">/</code> (np.{" "}
          <code className="text-violet-300">/portfolio/djwodzirej/dash.png</code>
          ) lub pełny URL
        </span>
        <input
          name="heroImageUrl"
          required
          defaultValue={d?.heroImageUrl}
          placeholder="/portfolio/djwodzirej/dash.png"
          className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">Link do działającej strony (opcjonalnie)</span>
        <input
          name="externalUrl"
          type="url"
          defaultValue={d?.externalUrl ?? ""}
          placeholder="https://"
          className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-white/70">
          Galeria zrzutów (jeden URL na linię, kolejność = kolejność wyświetlania)
        </span>
        <textarea
          name="galleryUrls"
          rows={6}
          defaultValue={galleryText ?? ""}
          className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white font-mono text-sm"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-white/80">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={d?.isPublished ?? true}
          className="rounded"
        />
        Opublikowany (widoczny publicznie)
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
      >
        {pending ? "Zapisywanie…" : "Zapisz"}
      </button>
    </form>
  );
}
