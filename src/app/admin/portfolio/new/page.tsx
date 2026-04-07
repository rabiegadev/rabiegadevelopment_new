import { PortfolioCreateForm } from "@/components/admin/PortfolioForm";
import Link from "next/link";

export default function AdminPortfolioNewPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/portfolio"
        className="text-sm text-emerald-400 hover:underline"
      >
        ← Lista portfolio
      </Link>
      <h1 className="text-2xl font-semibold text-white">Nowy projekt</h1>
      <PortfolioCreateForm />
    </div>
  );
}
