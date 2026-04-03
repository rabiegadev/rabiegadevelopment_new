export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-10 dark:border-white/10 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500 dark:text-white/50">
        © {new Date().getFullYear()} Rabiega Development · rabiegadevelopment.pl
      </div>
    </footer>
  );
}
