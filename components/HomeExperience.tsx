"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, X } from "lucide-react";
import { sortOffers, type Offer, type OfferSort } from "@/data/offers";
import Header from "./Header";
import Hero from "./Hero";
import CategoryRow from "./CategoryRow";
import OfferStrip from "./OfferStrip";
import HowItWorks from "./HowItWorks";
import BusinessBanner from "./BusinessBanner";
import Footer from "./Footer";
import useFavorites from "./useFavorites";
import useOfferClock from "./useOfferClock";

export default function HomeExperience({ offers, initialNow }: { offers: Offer[]; initialNow: number }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<OfferSort>("recommended");
  const [favorites, favorite] = useFavorites();
  const [businessOpen, setBusinessOpen] = useState(false);
  const now = useOfferClock(initialNow);
  const available = offers.filter(offer => Date.parse(offer.endsAt) > now && offer.quantityLeft > 0);
  const returnFocus = useRef<HTMLElement | null>(null);
  return <>
    <Header onFavorites={() => router.push("/offers?favorites=true")} favoritesOnly={false} favoriteCount={favorites.length} />
    <main id="main">
      <Hero query={query} onQueryChange={setQuery} onSearch={() => router.push(`/offers${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`)} />
      <CategoryRow offers={available} selected="all" onSelect={category => router.push(`/offers${category === "all" ? "" : `?category=${category}`}`)} />
      <OfferStrip offers={sortOffers(available, sort).slice(0, 5)} totalCount={available.length} sort={sort} onSort={setSort} favoriteIds={favorites} onFavorite={favorite} />
      <HowItWorks /><BusinessBanner onPartner={() => { returnFocus.current = document.activeElement as HTMLElement; setBusinessOpen(true); }} />
    </main><Footer />
    <Dialog.Root open={businessOpen} onOpenChange={setBusinessOpen}><Dialog.Portal><Dialog.Overlay className="filter-overlay" /><Dialog.Content className="business-dialog" onCloseAutoFocus={event => { event.preventDefault(); returnFocus.current?.focus(); }}>
      <Dialog.Close className="dialog-close icon-button" aria-label="Закрыть окно"><X size={20} /></Dialog.Close>
      <Dialog.Title>Подключение заведений</Dialog.Title><Dialog.Description>Сейчас мы не принимаем заявки на подключение. Оставлять контактные данные не нужно.</Dialog.Description>
      <a href="#how-title" className="button button-primary" onClick={() => { returnFocus.current = document.getElementById("how-title"); setBusinessOpen(false); }}>Как работает DamTap <ArrowRight size={16} /></a>
    </Dialog.Content></Dialog.Portal></Dialog.Root>
  </>;
}
