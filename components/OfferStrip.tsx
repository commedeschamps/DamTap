"use client";

import { ArrowLeft, ArrowRight, SearchX } from "lucide-react";
import { useRef } from "react";
import type { Offer } from "@/data/offers";
import OfferCard from "./OfferCard";

type Props = { offers: Offer[]; favoriteIds: string[]; onFavorite: (id: string) => void; onOpen: (offer: Offer) => void; onViewAll: () => void; onReset: () => void; showAll: boolean; filtered: boolean; favoritesOnly: boolean };

export default function OfferStrip({ offers, favoriteIds, onFavorite, onOpen, onViewAll, onReset, showAll, filtered, favoritesOnly }: Props) {
  const strip = useRef<HTMLDivElement>(null);
  return (
    <section className="offer-section page-container" id="offers" aria-labelledby="offers-title">
      <div className="section-heading"><h2 id="offers-title">{favoritesOnly ? "Ваши избранные продукты" : "Выгодные продукты рядом с вами"}</h2><button className="text-link" onClick={onViewAll}>{showAll ? "Показать пять" : "Смотреть все"}<ArrowRight size={18} /></button></div>
      {filtered && <div className="filter-status" role="status">Найдено: {offers.length}<button onClick={onReset}>Сбросить фильтры</button></div>}
      {offers.length > 0 ? <div className="strip-wrap"><div className="offer-strip" ref={strip} tabIndex={0} aria-label="Предложения. Прокрутите, чтобы увидеть больше">{offers.map(offer => <OfferCard key={offer.id} offer={offer} favorite={favoriteIds.includes(offer.id)} onFavorite={() => onFavorite(offer.id)} onOpen={() => onOpen(offer)} />)}</div><div className="strip-controls"><button className="strip-arrow" aria-label="Предыдущие предложения" onClick={() => strip.current?.scrollBy({ left: -280, behavior: "smooth" })}><ArrowLeft size={18} /></button><button className="strip-arrow" aria-label="Следующие предложения" onClick={() => strip.current?.scrollBy({ left: 280, behavior: "smooth" })}><ArrowRight size={18} /></button></div></div> : <div className="empty-state"><SearchX size={30} /><h3>{favoritesOnly ? "Здесь будут ваши любимые находки" : "Пока нет подходящих предложений"}</h3><p>{favoritesOnly ? "Нажмите на сердечко у понравившегося продукта." : "Попробуйте другой запрос или посмотрите все продукты рядом."}</p><button className="button button-outline" onClick={onReset}>Все продукты</button></div>}
    </section>
  );
}
