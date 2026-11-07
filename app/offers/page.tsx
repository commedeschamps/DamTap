import { Suspense } from "react";
import Catalogue from "@/components/Catalogue";
import { getSessionOfferSnapshot } from "@/lib/server-offers";

export const dynamic = "force-dynamic";
export const metadata = { title: "Предложения рядом — DamTap" };

export default async function OffersPage() {
  const { offers, initialNow } = await getSessionOfferSnapshot();
  return <Suspense fallback={<main className="page-container route-loading" aria-busy="true">Загружаем предложения…</main>}><Catalogue offers={offers} initialNow={initialNow} /></Suspense>;
}
