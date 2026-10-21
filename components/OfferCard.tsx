"use client";

import Image from "next/image";
import { Heart, MapPin, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import type { Offer } from "@/data/offers";

const priceFormat = new Intl.NumberFormat("ru-RU");
export const formatPrice = (price: number) => `${priceFormat.format(price)} ₸`;

function Countdown({ endsAt }: { endsAt: string }) {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, Math.floor((Date.parse(endsAt) - Date.now()) / 1000)));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);
  const hours = remaining === null ? "--" : String(Math.floor(remaining / 3600)).padStart(2, "0");
  const minutes = remaining === null ? "--" : String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
  const seconds = remaining === null ? "--" : String(remaining % 60).padStart(2, "0");
  return <span className="countdown" role="timer" aria-label={remaining === 0 ? "Предложение завершено" : `До окончания: ${hours} часов ${minutes} минут ${seconds} секунд`}><Timer size={16} aria-hidden="true" /><span>{remaining === 0 ? "Завершено" : `${hours}:${minutes}:${seconds}`}</span></span>;
}

export default function OfferCard({ offer, favorite, onFavorite, onOpen }: { offer: Offer; favorite: boolean; onFavorite: () => void; onOpen: () => void }) {
  const discount = offer.oldPrice > 0 ? Math.round((1 - offer.price / offer.oldPrice) * 100) : 0;
  return (
    <article className="offer-card">
      <div className="offer-image">
        <button className="offer-image-link" onClick={onOpen} aria-label={`Подробнее: ${offer.title}`}><Image src={offer.image} alt={offer.title} fill sizes="(max-width: 600px) 260px, (max-width: 1000px) 280px, 20vw" /></button>
        <span className="discount">−{discount}%</span>
        <button className="offer-favorite" onClick={onFavorite} aria-pressed={favorite} aria-label={`${favorite ? "Убрать из избранного" : "Добавить в избранное"}: ${offer.title}`}><Heart size={22} fill={favorite ? "currentColor" : "none"} /></button>
        <span className="distance"><MapPin size={12} aria-hidden="true" />{offer.distanceKm.toLocaleString("ru-RU")} км</span>
      </div>
      <div className="offer-body"><h3><button onClick={onOpen}>{offer.title}</button></h3><p className="venue">{offer.venue}</p><div className="offer-bottom"><div className="prices"><strong>{formatPrice(offer.price)}</strong><del>{formatPrice(offer.oldPrice)}</del></div><Countdown endsAt={offer.endsAt} /></div></div>
    </article>
  );
}
