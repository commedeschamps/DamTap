"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, X } from "lucide-react";
import { sortOffers, type Offer, type OfferSort } from "@/data/offers";
import Header from "./Header";
import Hero from "./Hero";
import CategoryRow from "./CategoryRow";
import OfferStrip from "./OfferStrip";
import HowItWorks from "./HowItWorks";
import BusinessBanner from "./BusinessBanner";
import Footer from "./Footer";
import { formatPrice } from "./OfferCard";
import useFavorites from "./useFavorites";

const categoryIds: Record<string, string> = { "1": "bakery", "2": "ready", "3": "ready", "4": "ready", "5": "bakery", "6": "bakery", "7": "ready", "8": "ready" };

type DialogState = "login" | "business" | Offer | null;

export default function HomeExperience({ offers }: { offers: Offer[] }) {
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("all");
  const [favorites, favorite] = useFavorites();
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [sort, setSort] = useState<OfferSort>("recommended");
  const [dialog, setDialog] = useState<DialogState>(null);
  const [submitted, setSubmitted] = useState(false);
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

  function openDialog(value: DialogState) { setSubmitted(false); setDialog(value); }
  function reset() { setQuery(""); setSearchInput(""); setCategory("all"); setFavoritesOnly(false); setShowAll(false); setSort("recommended"); }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSubmitted(true); }
  const filtered = offers.filter(offer => (!favoritesOnly || favorites.includes(offer.id)) && (category === "all" || categoryIds[offer.id] === category) && `${offer.title} ${offer.venue} Астана`.toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru")));
  const sorted = sortOffers(filtered, sort);
  const displayed = showAll ? sorted : sorted.slice(0, 5);
  const detail = typeof dialog === "object" ? dialog : null;
  return (
    <>
      <Header onLogin={() => openDialog("login")} onFavorites={() => { setFavoritesOnly(!favoritesOnly); setCategory("all"); setQuery(""); setSearchInput(""); document.getElementById("offers")?.scrollIntoView({ behavior: "smooth" }); }} favoritesOnly={favoritesOnly} favoriteCount={favorites.length} />
      <main id="main">
        <Hero query={searchInput} onQueryChange={setSearchInput} onSearch={() => { setQuery(searchInput); setFavoritesOnly(false); setShowAll(true); }} />
        <CategoryRow selected={category} onSelect={value => { setCategory(value); setShowAll(true); setFavoritesOnly(false); }} />
        <OfferStrip offers={displayed} totalCount={filtered.length} sort={sort} onSort={setSort} favoriteIds={favorites} onFavorite={favorite} onOpen={offer => openDialog(offer)} onViewAll={() => setShowAll(!showAll)} onReset={reset} showAll={showAll} filtered={!!query || category !== "all" || favoritesOnly} favoritesOnly={favoritesOnly} />
        <HowItWorks />
        <BusinessBanner onPartner={() => openDialog("business")} />
      </main>
      <Footer />
      <dialog ref={modal} className="app-dialog" aria-labelledby="dialog-title" onCancel={() => setDialog(null)} onClick={event => { if (event.target === modal.current) setDialog(null); }}>
        <button className="dialog-close icon-button" onClick={() => setDialog(null)} aria-label="Закрыть окно"><X /></button>
        {detail ? <><Image className="detail-image" src={detail.image} alt={detail.title} width={640} height={360} /><div className="dialog-content"><p className="dialog-eyebrow">{detail.venue}</p><h2 id="dialog-title">{detail.title}</h2><p className="detail-price">{formatPrice(detail.price)} <del>{formatPrice(detail.oldPrice)}</del></p><p>Осталось: {detail.quantityLeft} шт. · {detail.distanceKm.toLocaleString("ru-RU")} км от вас</p><p><strong>Аллергены:</strong> {detail.allergens.join(", ")}</p><p className="demo-note">Демонстрационное предложение. Покупка и бронирование появятся после подключения сервиса.</p><button className="button button-primary" onClick={() => favorite(detail.id)}>{favorites.includes(detail.id) ? "Убрать из избранного" : "Сохранить в избранное"}</button></div></> : dialog === "login" ? <div className="dialog-content"><h2 id="dialog-title">Добро пожаловать в DamTap</h2><p>Сохраняйте вкусные находки и возвращайтесь за ними.</p><p className="demo-note">Это учебная версия. Вход пока не подключён, а избранное уже сохраняется в этом браузере.</p><button className="button button-primary" onClick={() => setDialog(null)}>Продолжить без входа</button></div> : dialog === "business" ? <div className="dialog-content"><h2 id="dialog-title">Станьте партнёром DamTap</h2>{submitted ? <div className="form-success" role="status"><CheckCircle2 size={38} /><h3>Спасибо за интерес!</h3><p>Демо-форма заполнена. Данные никуда не отправлялись: подключение партнёров появится в полной версии.</p><button className="button button-primary" onClick={() => setDialog(null)}>Понятно</button></div> : <><p>Поможем вашей еде найти новых хозяев.</p><p className="demo-note">Учебная форма — данные не отправляются.</p><form className="partner-form" onSubmit={submit}><label>Название заведения<input name="venue" required autoComplete="organization" placeholder="Например, пекарня «Хлеб»" maxLength={100} /></label><label>Контактный email<input name="email" type="email" required autoComplete="email" placeholder="hello@example.kz" /></label><button type="submit" className="button button-primary">Попробовать демо-форму</button></form></>}</div> : null}
      </dialog>
    </>
  );
}
