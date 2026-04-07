import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: {
    default: "Rabiega Development — Portfolio i kontakt",
    template: "%s | Rabiega Development",
  },
  description:
    "Aplikacje webowe dla MŚP, strony weselne, narzędzia biznesowe — Kamil Rabiega, Rabiega Development.",
  metadataBase: new URL("https://rabiegadevelopment.pl"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
