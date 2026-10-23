"use client";

import { ArrowLeft, ArrowRight, SearchX } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Offer, OfferSort } from "@/data/offers";
import OfferCard from "./OfferCard";

const sortOptions: { value: OfferSort; label: string }[] = [
  { value: "recommended", label: "По умолчанию" }, { value: "distance", label: "Сначала ближе" },
  { value: "price", label: "Сначала дешевле" }, { value: "ending", label: "Скоро закончатся" },
  { value: "discount", label: "Больше скидка" },
];

type Props = { offers: Offer[]; totalCount: number; sort: OfferSort; onSort: (sort: OfferSort) => void; favoriteIds: string[]; onFavorite: (id: string) => void; onOpen: (offer: Offer) => void; onViewAll: () => void; onReset: () => void; showAll: boolean; filtered: boolean; favoritesOnly: boolean };

export default function OfferStrip({ offers, totalCount, sort, onSort, favoriteIds, onFavorite, onOpen, onViewAll, onReset, showAll, filtered, favoritesOnly }: Props) {
  const strip = useRef<HTMLDivElement>(null);
  const offerIds = offers.map(offer => offer.id).join(",");
  useEffect(() => { if (strip.current) strip.current.scrollLeft = 0; }, [offerIds]);
  return (
    <section className="offer-section page-container" id="offers" aria-labelledby="offers-title">
      <div className="section-heading"><h2 id="offers-title">{favoritesOnly ? "Ваше избранное" : "Вкусное рядом"}</h2>{totalCount > 5 && <button className="text-link" onClick={onViewAll}>{showAll ? "Свернуть" : "Смотреть все"}<ArrowRight size={18} /></button>}</div>
      {favoritesOnly && <p className="favorites-note">Избранное сохраняется в этом браузере — можно вернуться к нему позже.</p>}
      <div className="offer-toolbar">
        <div className="filter-status" role="status">Показано: {offers.length} из {totalCount}{(filtered || sort !== "recommended") && <button onClick={onReset}>Сбросить фильтры</button>}</div>
        <label className="offer-sort">Сортировка<select value={sort} onChange={event => onSort(event.target.value as OfferSort)}>{sortOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
      </div>
      {offers.length > 0 ? <div className="strip-wrap"><div className="offer-strip" ref={strip} tabIndex={0} aria-label="Предложения. Прокрутите, чтобы увидеть больше">{offers.map(offer => <OfferCard key={offer.id} offer={offer} favorite={favoriteIds.includes(offer.id)} onFavorite={() => onFavorite(offer.id)} onOpen={() => onOpen(offer)} />)}</div><div className="strip-controls"><button className="strip-arrow" aria-label="Предыдущие предложения" onClick={() => strip.current?.scrollBy({ left: -280, behavior: "smooth" })}><ArrowLeft size={18} /></button><button className="strip-arrow" aria-label="Следующие предложения" onClick={() => strip.current?.scrollBy({ left: 280, behavior: "smooth" })}><ArrowRight size={18} /></button></div></div> : <div className="empty-state"><SearchX size={30} /><h3>{favoritesOnly ? "Здесь появятся блюда, которые вам понравились." : "По вашему запросу пока ничего не найдено."}</h3><p>{favoritesOnly ? "Нажмите на сердечко, чтобы сохранить блюдо." : "Попробуйте другой запрос или посмотрите все продукты рядом."}</p><button className="button button-outline" onClick={onReset}>Все предложения</button></div>}
    </section>
  );
}
