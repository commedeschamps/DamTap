import type { Metadata } from "next";
import { Nunito, Caveat } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "DamTap — вкусная еда по выгодной цене",
  description: "Блюда и продукты из заведений Астаны по выгодным ценам. Находите вкусное и помогайте сокращать пищевые отходы.",
  applicationName: "DamTap",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${nunito.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
