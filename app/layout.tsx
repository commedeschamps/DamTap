import type { Metadata } from "next";
import "./fonts.css";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "DamTap — вкусная еда по выгодной цене",
  description: "Блюда и продукты из заведений Астаны по выгодным ценам. Находите вкусное и помогайте сокращать пищевые отходы.",
  applicationName: "DamTap",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preload" href="/fonts/manrope-latin-variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/manrope-cyrillic-variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
