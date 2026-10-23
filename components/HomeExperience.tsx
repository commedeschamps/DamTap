"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { sortOffers, type Offer, type OfferCategory, type OfferSort } from "@/data/offers";
import Header from "./Header";
import Hero from "./Hero";
import CategoryRow from "./CategoryRow";
import OfferStrip from "./OfferStrip";
import HowItWorks from "./HowItWorks";
import BusinessBanner from "./BusinessBanner";
import Footer from "./Footer";
import OfferDetails from "./OfferDetails";
import useFavorites from "./useFavorites";

type DialogState = "business" | Offer | null;

export default function HomeExperience({ offers }: { offers: Offer[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<OfferCategory | "all">("all");
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState<OfferSort>("recommended");
  const [favorites, favorite] = useFavorites();
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [dialog, setDialog] = useState<DialogState>(null);
  const modal = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (dialog) {
      returnFocus.current = document.activeElement as HTMLElement;
      modal.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      modal.current?.close();
      document.body.style.overflow = "";
      returnFocus.current?.focus();
    }
    return () => { document.body.style.overflow = ""; };
  }, [dialog]);

  function reset() { setQuery(""); setSearchInput(""); setCategory("all"); setFavoritesOnly(false); setShowAll(false); setSort("recommended"); }
  function toggleFavorites() {
    setFavoritesOnly(!favoritesOnly); setCategory("all"); setQuery(""); setSearchInput(""); setShowAll(true);
    document.getElementById("offers")?.scrollIntoView({ behavior: "smooth" });
  }
  const filtered = offers.filter(offer => (!favoritesOnly || favorites.includes(offer.id)) && (category === "all" || offer.category === category) && `${offer.title} ${offer.venue} ${offer.district} ${offer.address} Астана`.toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru")));
  const sorted = sortOffers(filtered, sort);
  const displayed = showAll ? sorted : sorted.slice(0, 5);
  const detail = typeof dialog === "object" ? dialog : null;
  return (
    <>
      <Header onFavorites={toggleFavorites} favoritesOnly={favoritesOnly} favoriteCount={favorites.length} />
      <main id="main">
        <Hero query={searchInput} onQueryChange={setSearchInput} onSearch={() => { setQuery(searchInput); setFavoritesOnly(false); setShowAll(true); }} />
        <CategoryRow selected={category} onSelect={value => { setCategory(value); setShowAll(true); setFavoritesOnly(false); }} />
        <OfferStrip offers={displayed} totalCount={filtered.length} sort={sort} onSort={setSort} favoriteIds={favorites} onFavorite={favorite} onOpen={setDialog} onViewAll={() => setShowAll(!showAll)} onReset={reset} showAll={showAll} filtered={!!query.trim() || category !== "all" || favoritesOnly} favoritesOnly={favoritesOnly} />
        <HowItWorks />
        <BusinessBanner onPartner={() => setDialog("business")} />
      </main>
      <Footer />
      <dialog ref={modal} className={`app-dialog ${dialog === "business" ? "app-dialog-compact" : ""}`} aria-labelledby="dialog-title" onCancel={() => setDialog(null)} onClick={event => { if (event.target === modal.current) setDialog(null); }}>
        <button className="dialog-close icon-button" onClick={() => setDialog(null)} aria-label="Закрыть окно"><X size={20} /></button>
        {detail ? (
          <OfferDetails offer={detail} favorite={favorites.includes(detail.id)} onFavorite={() => favorite(detail.id)} />
        ) : dialog === "business" ? (
          <div className="dialog-content">
            <h2 id="dialog-title">Подключение заведений</h2>
            <p>Сейчас мы не принимаем заявки на подключение. Оставлять контактные данные не нужно.</p>
            <a href="#how-title" className="button button-primary" onClick={() => { returnFocus.current = document.getElementById("how-title"); setDialog(null); }}>Как работает DamTap <ArrowRight size={16} /></a>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
