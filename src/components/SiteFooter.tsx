import { getContact } from "@/config/contact";
import Link from "next/link";

export function SiteFooter() {
  const c = getContact();
  const primaryEmail = c.emails[0];
  const primaryPhone = c.phones[0];

  const nav = [
    { href: "/", label: "Strona główna" },
    { href: "/o-mnie", label: "O mnie" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/kontakt", label: "Kontakt" },
  ];

  return (
    <footer className="border-t border-violet-200/80 bg-violet-100/50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <nav
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 border-b border-violet-200/60 pb-4 text-sm text-violet-800/90"
          aria-label="Stopka — nawigacja"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-violet-950 hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-center justify-between gap-4 pt-5 text-center sm:flex-row sm:text-left">
          <div className="space-y-1 text-sm text-violet-950/80">
            <p className="font-medium text-violet-950">Rabiega Development</p>
            <p className="text-violet-950/70">{c.city}</p>
            {primaryPhone ? (
              <p>
                <a
                  href={`tel:${primaryPhone.replace(/\s/g, "")}`}
                  className="hover:text-violet-800 hover:underline"
                >
                  {primaryPhone}
                </a>
              </p>
            ) : null}
            {primaryEmail ? (
              <p>
                <a
                  href={`mailto:${primaryEmail}`}
                  className="hover:text-violet-800 hover:underline break-all"
                >
                  {primaryEmail}
                </a>
              </p>
            ) : null}
          </div>
          <Link
            href="/kontakt"
            className="shrink-0 rounded-full border border-violet-300/90 bg-white/80 px-4 py-2 text-sm font-semibold text-violet-900 shadow-sm shadow-violet-200/50 transition hover:border-violet-400 hover:bg-violet-50"
          >
            Pełne dane i social media →
          </Link>
        </div>

        <p className="pt-5 text-center text-xs text-violet-950/50">
          © {new Date().getFullYear()} Rabiega Development. Wszystkie prawa
          zastrzeżone.
        </p>
      </div>
    </footer>
  );
}
