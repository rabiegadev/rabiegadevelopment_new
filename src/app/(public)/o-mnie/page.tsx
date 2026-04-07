import { aboutPage } from "@/content/legacyMarketing";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O mnie",
  description:
    "Kamil Rabiega — Full Stack Developer: PHP, JavaScript, aplikacje webowe, strony weselne i narzędzia biznesowe.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <header className="animate-fade-up text-center sm:text-left">
        <p className="text-sm font-medium uppercase tracking-wider text-violet-600">
          O mnie
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-violet-950 md:text-4xl">
          Poznaj mnie bliżej
        </h1>
      </header>

      <div className="mt-10 flex flex-col items-center gap-8 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <span
            aria-hidden
            className="absolute -inset-1 rounded-full bg-gradient-to-br from-violet-400/60 to-fuchsia-400/40 opacity-90 blur-md"
          />
          <Image
            src="/av.jpeg"
            alt={aboutPage.name}
            width={200}
            height={200}
            className="relative h-48 w-48 rounded-2xl object-cover ring-2 ring-white shadow-lg"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-violet-950">
            {aboutPage.name}
          </h2>
          <p className="mt-1 text-sm font-medium text-violet-600">{aboutPage.role}</p>
          <p className="mt-4 text-violet-950/85 leading-relaxed">{aboutPage.lead}</p>
        </div>
      </div>

      <section className="mt-12 animate-fade-up">
        <h2 className="text-lg font-semibold text-violet-950">Moje umiejętności</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {aboutPage.skills.map((s) => (
            <li
              key={s}
              className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-900"
            >
              {s}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/portfolio"
          className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white hover:bg-violet-500"
        >
          Portfolio
        </Link>
        <Link
          href="/kontakt#formularz"
          className="rounded-xl border border-violet-200 bg-white px-5 py-3 text-sm font-medium text-violet-900 hover:bg-violet-50"
        >
          Kontakt
        </Link>
      </div>
    </div>
  );
}
