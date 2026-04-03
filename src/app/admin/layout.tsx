import { LogoutButton } from "@/components/LogoutButton";
import Link from "next/link";

const links = [
  { href: "/admin/inquiries", label: "Zapytania" },
  { href: "/admin/users", label: "Użytkownicy" },
  { href: "/admin/services", label: "Usługi" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/admin/inquiries" className="font-semibold text-emerald-400">
              Panel admina
            </Link>
            <nav className="flex flex-wrap gap-4 text-sm text-white/80">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-white/60 hover:text-white">
              Strona www
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
