"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
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
import { postApi, type PartnerReceipt, type Reservation } from "@/lib/api";

type DialogState = "business" | Offer | null;

export default function HomeExperience({ offers, apiError = null }: { offers: Offer[]; apiError?: string | null }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<OfferCategory | "all">("all");
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState<OfferSort>("recommended");
  const [favorites, favorite] = useFavorites();
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [stock, setStock] = useState<Record<string, number>>({});
  const [partnerReceipt, setPartnerReceipt] = useState<PartnerReceipt | null>(null);
  const [partnerPending, setPartnerPending] = useState(false);
  const [partnerError, setPartnerError] = useState<string | null>(null);
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

  function openDialog(value: DialogState) {
    setPartnerReceipt(null);
    setPartnerError(null);
    setDialog(value);
  }
  function reserved(receipt: Reservation) {
    setStock(previous => ({ ...previous, [receipt.offerId]: receipt.quantityLeft }));
  }
  async function submitPartner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (partnerPending) return;
    const data = new FormData(event.currentTarget);
    setPartnerPending(true);
    setPartnerError(null);
    try {
      setPartnerReceipt(await postApi<PartnerReceipt>("partner-applications", {
        venue: data.get("venue"), email: data.get("email"),
      }));
    } catch (error) {
      setPartnerError(error instanceof Error ? error.message : "Не удалось отправить заявку.");
    } finally {
      setPartnerPending(false);
    }
  }
  function reset() { setQuery(""); setSearchInput(""); setCategory("all"); setFavoritesOnly(false); setShowAll(false); setSort("recommended"); }
  function toggleFavorites() {
    setFavoritesOnly(!favoritesOnly); setCategory("all"); setQuery(""); setSearchInput(""); setShowAll(true);
    document.getElementById("offers")?.scrollIntoView({ behavior: "smooth" });
  }
  const liveOffers = offers.map(offer => stock[offer.id] === undefined ? offer : { ...offer, quantityLeft: stock[offer.id] });
  const filtered = liveOffers.filter(offer => offer.quantityLeft > 0 && (!favoritesOnly || favorites.includes(offer.id)) && (category === "all" || offer.category === category) && `${offer.title} ${offer.venue} ${offer.district} ${offer.address} Астана`.toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru")));
  const sorted = sortOffers(filtered, sort);
  const displayed = showAll ? sorted : sorted.slice(0, 5);
  const detail = dialog && typeof dialog === "object" ? liveOffers.find(offer => offer.id === dialog.id) ?? dialog : null;
  return (
    <>
      <Header onFavorites={toggleFavorites} favoritesOnly={favoritesOnly} favoriteCount={favorites.length} />
      <main id="main">
        <Hero query={searchInput} onQueryChange={setSearchInput} onSearch={() => { setQuery(searchInput); setFavoritesOnly(false); setShowAll(true); }} />
        <CategoryRow selected={category} onSelect={value => { setCategory(value); setShowAll(true); setFavoritesOnly(false); }} />
        {apiError && <p className="page-container" role="alert">{apiError}</p>}
        <OfferStrip offers={displayed} totalCount={filtered.length} sort={sort} onSort={setSort} favoriteIds={favorites} onFavorite={favorite} onOpen={openDialog} onViewAll={() => setShowAll(!showAll)} onReset={reset} showAll={showAll} filtered={!!query.trim() || category !== "all" || favoritesOnly} favoritesOnly={favoritesOnly} />
        <HowItWorks />
        <BusinessBanner onPartner={() => openDialog("business")} />
      </main>
      <Footer />
      <dialog ref={modal} className={`app-dialog ${dialog === "business" ? "app-dialog-compact" : ""}`} aria-labelledby="dialog-title" onCancel={() => setDialog(null)} onClick={event => { if (event.target === modal.current) setDialog(null); }}>
        <button className="dialog-close icon-button" onClick={() => setDialog(null)} aria-label="Закрыть окно"><X size={20} /></button>
        {detail ? (
          <OfferDetails key={detail.id} offer={detail} favorite={favorites.includes(detail.id)} onFavorite={() => favorite(detail.id)} onReserved={reserved} />
        ) : dialog === "business" ? (
          <div className="dialog-content">
            <h2 id="dialog-title">Подключение заведений</h2>
            {partnerReceipt ? (
              <div className="reservation-receipt" role="status">
                <h3>Заявка сохранена!</h3>
                <p>Спасибо за интерес к DamTap. Контактные данные переданы в базу заявок.</p>
              </div>
            ) : (
              <form className="api-form" onSubmit={submitPartner}>
                <label>Название заведения
                  <input name="venue" required maxLength={100} autoComplete="organization" disabled={partnerPending} />
                </label>
                <label>Контактный email
                  <input name="email" type="email" required maxLength={254} autoComplete="email" disabled={partnerPending} />
                </label>
                {partnerError && <p className="form-error" role="alert">{partnerError}</p>}
                <button className="button button-primary" type="submit" disabled={partnerPending}>
                  {partnerPending ? "Отправляем…" : "Отправить заявку"}
                </button>
              </form>
            )}
            <a href="#how-title" className="button button-primary" onClick={() => { returnFocus.current = document.getElementById("how-title"); setDialog(null); }}>Как работает DamTap <ArrowRight size={16} /></a>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
