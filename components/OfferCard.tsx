"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, MapPin, Package, Timer } from "lucide-react";
import useCountdownClock from "./useCountdownClock";
import type { Offer } from "@/data/offers";
import FavoriteButton from "./FavoriteButton";

const pickupFormat = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Almaty" });
const priceFormat = new Intl.NumberFormat("ru-RU");
export const formatPrice = (price: number) => `${priceFormat.format(price)} ₸`;

function Countdown({ endsAt }: { endsAt: string }) {
  const now = useCountdownClock();
  const remaining = now === null ? null : Math.max(0, Math.floor((Date.parse(endsAt) - now) / 1000));
  const hours = remaining === null ? "--" : String(Math.floor(remaining / 3600)).padStart(2, "0");
  const minutes = remaining === null ? "--" : String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
  const seconds = remaining === null ? "--" : String(remaining % 60).padStart(2, "0");
  return <span className="countdown" role="timer" aria-live="off" aria-label={remaining === 0 ? "Предложение завершено" : `До окончания: ${hours} часов ${minutes} минут ${seconds} секунд`}><Timer size={16} aria-hidden="true" /><span>{remaining === 0 ? "Завершено" : `${hours}:${minutes}:${seconds}`}</span></span>;
}

type Props = { offer: Offer; favorite: boolean; onFavorite: () => void; href?: string };
export default function OfferCard({ offer, favorite, onFavorite, href = `/offers/${offer.id}` }: Props) {
  const discount = offer.oldPrice > 0 ? Math.round((1 - offer.price / offer.oldPrice) * 100) : 0;
  return <article className="offer-card">
    <div className={`offer-image${offer.imageIsIllustration ? " offer-image-illustration" : ""}`}>
      <Link className="offer-image-link" href={href} aria-label={`Подробнее: ${offer.title}`}><Image src={offer.image} alt={offer.imageIsIllustration ? "Иллюстрация категории продуктов" : offer.title} fill sizes="(max-width: 540px) calc(100vw - 32px), (max-width: 1199px) 40vw, 320px" /></Link>
      {discount > 0 && <span className="discount">−{discount}%</span>}
      <FavoriteButton className="offer-favorite" favorite={favorite} onToggle={onFavorite} label={`${favorite ? "Убрать из избранного" : "Добавить в избранное"}: ${offer.title}`} hint={favorite ? "Убрать из избранного" : "Сохранить на потом"} />
      {offer.imageIsIllustration && <span className="image-caption">Иллюстрация</span>}
    </div>
    <div className="offer-body">
      <h3><Link href={href}>{offer.title}</Link></h3>
      <div className="card-price-row"><div className="prices"><strong>{formatPrice(offer.price)}</strong>{offer.oldPrice > offer.price && <del>{formatPrice(offer.oldPrice)}</del>}</div></div>
      <p className="venue">{offer.venue}</p>
      <p className="card-pickup"><Clock3 size={15} aria-hidden="true" /><span>Забрать <time dateTime={offer.pickupStartsAt}>{pickupFormat.format(new Date(offer.pickupStartsAt))}</time>–<time dateTime={offer.endsAt}>{pickupFormat.format(new Date(offer.endsAt))}</time></span></p>
      <div className="card-meta"><p className="card-stock"><Package size={14} aria-hidden="true" /><span>Порций: {offer.quantityLeft}</span></p><p className="card-distance"><MapPin size={14} aria-hidden="true" /><span>{offer.distanceKm.toLocaleString("ru-RU")} км</span></p></div>
      <p className="card-location">{offer.district}</p>
      <div className="offer-bottom"><span className="card-deadline">До окончания</span><Countdown endsAt={offer.endsAt} /></div>
    </div>
  </article>;
}
