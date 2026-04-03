import { LoginForm } from "@/components/LoginForm";
import { Suspense } from "react";

export const metadata = {
  title: "Logowanie | Rabiega Development",
};

function LoginFallback() {
  return (
    <p className="text-sm text-slate-500 dark:text-white/50">Ładowanie…</p>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        Logowanie
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-white/60">
        Panel administratora lub strefa klienta.
      </p>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">
        <Suspense fallback={<LoginFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
