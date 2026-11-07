"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "motion/react";
import { ArrowDownUp, ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { Offer, OfferSort } from "@/data/offers";
import { sortOptions } from "@/lib/catalogue";
import OfferCard from "./OfferCard";
import SelectControl from "./SelectControl";

type Props = { offers: Offer[]; totalCount: number; sort: OfferSort; onSort: (sort: OfferSort) => void; favoriteIds: string[]; onFavorite: (id: string) => void };
export default function OfferStrip({ offers, totalCount, sort, onSort, favoriteIds, onFavorite }: Props) {
  const reducedMotion = useReducedMotion();
  const [viewport, carousel] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", loop: false, duration: reducedMotion ? 0 : 25 });
  const [navigation, setNavigation] = useState({ selected: 0, count: 0, previous: false, next: false });
  const offerIds = offers.map(offer => offer.id).join(",");
  useEffect(() => {
    if (!carousel) return;
    const sync = () => setNavigation({ selected: carousel.selectedScrollSnap(), count: carousel.scrollSnapList().length, previous: carousel.canScrollPrev(), next: carousel.canScrollNext() });
    sync();
    carousel.on("select", sync).on("reInit", sync);
    return () => { carousel.off("select", sync).off("reInit", sync); };
  }, [carousel]);
  useEffect(() => { carousel?.scrollTo(0, true); }, [carousel, offerIds]);
  return <section className="offer-section page-container" id="offers" aria-labelledby="offers-title" aria-roledescription="карусель">
    <div className="section-heading"><h2 id="offers-title">Вкусное рядом</h2><Link className="text-link" href={`/offers${sort === "recommended" ? "" : `?sort=${sort}`}`}>Смотреть все<ArrowRight size={18} /></Link></div>
    {offers.length > 0 ? <div className="offer-toolbar"><p className="filter-status">Показано: {offers.length} из {totalCount}</p><div className="offer-sort"><SelectControl label="Сортировка" value={sort} onValueChange={value => onSort(value as OfferSort)} options={sortOptions} icon={<ArrowDownUp size={16} />} /></div></div> : <p className="demo-note">Сроки демонстрационных предложений истекли. На сегодня предложений больше нет.</p>}
    <div className="offer-carousel-viewport" ref={viewport} tabIndex={0} aria-label="Лента предложений. Используйте стрелки влево и вправо" onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); carousel?.scrollPrev(!!reducedMotion); }
      if (event.key === "ArrowRight") { event.preventDefault(); carousel?.scrollNext(!!reducedMotion); }
      if (event.key === "Home") { event.preventDefault(); carousel?.scrollTo(0, !!reducedMotion); }
      if (event.key === "End") { event.preventDefault(); carousel?.scrollTo(navigation.count - 1, !!reducedMotion); }
    }}>
      <div className="offer-carousel-track">{offers.map((offer, index) => <div className="offer-slide" key={offer.id} role="group" aria-roledescription="слайд" aria-label={`${index + 1} из ${offers.length}`}><OfferCard offer={offer} favorite={favoriteIds.includes(offer.id)} onFavorite={() => onFavorite(offer.id)} /></div>)}</div>
    </div>
    {navigation.count > 1 && <div className="carousel-navigation"><div className="carousel-dots" aria-label="Позиции ленты">{Array.from({ length: navigation.count }, (_, index) => <button key={index} aria-label={`Позиция ${index + 1}`} aria-current={navigation.selected === index ? "true" : undefined} onClick={() => carousel?.scrollTo(index, !!reducedMotion)}><span /></button>)}</div><span className="carousel-position" aria-live="polite">{navigation.selected + 1} / {navigation.count}</span><div className="strip-controls"><button className="strip-arrow" disabled={!navigation.previous} aria-label="Предыдущие предложения" onClick={() => carousel?.scrollPrev(!!reducedMotion)}><ArrowLeft size={18} /></button><button className="strip-arrow" disabled={!navigation.next} aria-label="Следующие предложения" onClick={() => carousel?.scrollNext(!!reducedMotion)}><ArrowRight size={18} /></button></div></div>}
  </section>;
}
