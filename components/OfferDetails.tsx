"use client";

import Image from "next/image";
import type { Offer } from "@/data/offers";
import { formatPrice } from "./OfferCard";

const pickupFormat = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Almaty" });

export default function OfferDetails({ offer, favorite, onFavorite }: { offer: Offer; favorite: boolean; onFavorite: () => void }) {
  return (
    <>
      <Image className="detail-image" src={offer.image} alt={offer.title} width={640} height={360} sizes="(max-width: 532px) calc(100vw - 32px), 500px" />
      <div className="dialog-content">
        <p className="dialog-eyebrow">{offer.venue}</p>
        <h2 id="dialog-title">{offer.title}</h2>
        <p className="detail-price">{formatPrice(offer.price)} <del>{formatPrice(offer.oldPrice)}</del></p>
        <p>Осталось: {offer.quantityLeft} шт. · {offer.distanceKm.toLocaleString("ru-RU")} км от вас</p>
        <section className="pickup-details" aria-labelledby="pickup-title">
          <h3 id="pickup-title">Самовывоз</h3>
          <p><strong>Адрес:</strong> {offer.address}<br />{offer.district}, Астана</p>
          <p className="pickup-window">Выдача с <time dateTime={offer.pickupStartsAt}>{pickupFormat.format(new Date(offer.pickupStartsAt))}</time><br /><strong>Забрать до <time dateTime={offer.endsAt}>{pickupFormat.format(new Date(offer.endsAt))}</time></strong><br /><span className="demo-note">Время Астаны</span></p>
          <p className="pickup-instructions">{offer.pickupInstructions}</p>
        </section>
        <p><strong>Аллергены:</strong> {offer.allergens.join(", ")}</p>
        <p className="demo-note">Демонстрационное предложение: адрес и время указаны для примера. Покупка и бронирование появятся после подключения сервиса.</p>
        <button className="button button-primary" onClick={onFavorite} aria-pressed={favorite}>{favorite ? "Убрать из избранного" : "Сохранить в избранное"}</button>
      </div>
    </>
  );
}
