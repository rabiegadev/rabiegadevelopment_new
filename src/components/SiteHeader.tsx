import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="border-b border-violet-100/90 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-12 w-12 shrink-0">
            <span
              aria-hidden
              className="absolute -inset-1 rounded-full bg-gradient-to-br from-violet-400/70 via-fuchsia-400/50 to-violet-500/40 opacity-90 blur-md"
            />
            <span
              aria-hidden
              className="absolute -inset-0.5 rounded-full bg-violet-300/30 blur-[2px]"
            />
            <Image
              src="/av.jpeg"
              alt="Rabiega Development"
              width={48}
              height={48}
              className="relative h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-md"
              priority
            />
          </span>
          <div>
            <div className="text-lg font-semibold tracking-tight text-violet-950">
              Rabiega Development
            </div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-violet-700/90 sm:text-xs sm:normal-case sm:tracking-normal">
              <span className="hidden sm:inline">
                Założenia — Projekt — Demo — Wdrożenie
              </span>
              <span className="sm:hidden">Założenia · Projekt · Demo · Wdrożenie</span>
            </div>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm sm:gap-4">
          <Link
            href="/o-mnie"
            className="text-violet-950/75 hover:text-violet-700"
          >
            O mnie
          </Link>
          <Link
            href="/#uslugi"
            className="text-violet-950/75 hover:text-violet-700"
          >
            Usługi
          </Link>
          <Link
            href="/portfolio"
            className="text-violet-950/75 hover:text-violet-700"
          >
            Portfolio
          </Link>
          <Link
            href="/umiejetnosci"
            className="text-violet-950/75 hover:text-violet-700"
          >
            Umiejętności
          </Link>
          <Link
            href="/kontakt"
            className="font-medium text-violet-950/90 hover:text-violet-700"
          >
            Kontakt
          </Link>
          {session?.user ? (
            <Link
              href={session.user.role === "admin" ? "/admin" : "/client"}
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-white hover:bg-violet-500"
            >
              Panel
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg border-2 border-violet-400/80 bg-violet-100/90 px-3 py-1.5 text-sm font-semibold text-violet-950 shadow-sm shadow-violet-300/40 hover:border-violet-500 hover:bg-violet-200/90"
            >
              Logowanie
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
