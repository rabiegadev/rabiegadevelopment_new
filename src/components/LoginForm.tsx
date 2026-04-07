"use client";

import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "";

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setPending(false);

    if (res?.error) {
      setError("Nieprawidłowy e-mail lub hasło.");
      return;
    }

    const session = await getSession();
    const role = session?.user?.role;

    if (callbackUrl && callbackUrl.startsWith("/")) {
      router.push(callbackUrl);
      router.refresh();
      return;
    }

    router.push(role === "admin" ? "/admin/inquiries" : "/client");
    router.refresh();
  }

  const fieldClass =
    "rounded-xl border border-violet-200 bg-violet-50/50 px-3 py-2.5 text-violet-950 placeholder:text-violet-400 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-400/50";

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-5">
      {error ? (
        <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-900">
          {error}
        </p>
      ) : null}
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-semibold text-violet-950">E-mail</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-semibold text-violet-950">Hasło</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={fieldClass}
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-violet-400/30 transition hover:bg-violet-500 disabled:opacity-60"
      >
        {pending ? "Logowanie…" : "Zaloguj"}
      </button>
    </form>
  );
}
