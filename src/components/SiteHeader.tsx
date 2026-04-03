import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";

const social = [
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://youtube.com", label: "YouTube" },
];

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/av.jpeg"
            alt="Rabiega Development"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-500/40"
            priority
          />
          <div>
            <div className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Rabiega Development
            </div>
            <div className="text-xs text-slate-500 dark:text-white/50">
              Strony weselne · aplikacje · automatyzacje
            </div>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link
            href="/#uslugi"
            className="text-slate-600 hover:text-emerald-600 dark:text-white/70 dark:hover:text-emerald-400"
          >
            Usługi
          </Link>
          <Link
            href="/#kontakt"
            className="text-slate-600 hover:text-emerald-600 dark:text-white/70 dark:hover:text-emerald-400"
          >
            Kontakt
          </Link>
          <div className="hidden h-4 w-px bg-slate-300 sm:block dark:bg-white/20" />
          {social.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-emerald-600 dark:text-white/50 dark:hover:text-emerald-400"
            >
              {s.label}
            </a>
          ))}
          {session?.user ? (
            <Link
              href={session.user.role === "admin" ? "/admin" : "/client"}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-500"
            >
              Panel
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            >
              Logowanie
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
