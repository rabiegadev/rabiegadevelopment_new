import { LoginForm } from "@/components/LoginForm";
import { Suspense } from "react";

export const metadata = {
  title: "Logowanie | Rabiega Development",
};

function LoginFallback() {
  return (
    <p className="text-sm text-violet-800/80">Ładowanie formularza…</p>
  );
}

export default function LoginPage() {
  return (
    <div className="relative px-4 py-10 sm:py-14">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(139,92,246,0.22),transparent_60%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-lg">
        <h1 className="text-3xl font-bold tracking-tight text-violet-950">
          Logowanie
        </h1>
        <p className="mt-3 text-base text-violet-900/85">
          Panel administratora lub strefa klienta. Użyj konta utworzonego w
          systemie.
        </p>
        <div className="mt-8 rounded-2xl border border-violet-200/90 bg-white/90 p-6 shadow-lg shadow-violet-300/25 ring-1 ring-violet-100/80 backdrop-blur-sm sm:p-8">
          <Suspense fallback={<LoginFallback />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
