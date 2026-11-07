import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getOffers } from "@/data/offers";
import { getSessionOfferSnapshot } from "@/lib/server-offers";
import OfferPage from "@/components/OfferPage";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offer = getOffers().find(item => item.id === id);
  return { title: offer ? `${offer.title} — DamTap` : "Предложение не найдено — DamTap" };
}
export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { offers, initialNow } = await getSessionOfferSnapshot();
  const offer = offers.find(item => item.id === id);
  if (!offer) notFound();
  return <Suspense fallback={<main className="page-container route-loading" aria-busy="true">Загружаем предложение…</main>}><OfferPage offer={offer} initialNow={initialNow} /></Suspense>;
}
