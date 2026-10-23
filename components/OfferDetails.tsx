"use client";

import Image from "next/image";
import type { Offer } from "@/data/offers";
import { formatPrice } from "./OfferCard";

const pickupFormat = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Almaty",
});

export default function OfferDetails({ offer, favorite, onFavorite }: { offer: Offer; favorite: boolean; onFavorite: () => void }) {
  return (
    <>
      <Image className="detail-image" src={offer.image} alt={offer.title} width={640} height={360} sizes="(max-width: 512px) calc(100vw - 32px), 480px" />
      <div className="dialog-content">
        <p className="detail-venue">{offer.venue}</p>
        <h2 id="dialog-title">{offer.title}</h2>
        <p className="detail-price">{formatPrice(offer.price)} <del>{formatPrice(offer.oldPrice)}</del></p>
        <dl className="detail-facts"><div><dt>Расстояние</dt><dd>{offer.distanceKm.toLocaleString("ru-RU")} км</dd></div><div><dt>Порций в предложении</dt><dd>{offer.quantityLeft}</dd></div></dl>
        <section className="pickup-details" aria-labelledby="pickup-title">
          <h3 id="pickup-title">Самовывоз</h3>
          <p className="pickup-note">Адрес и время указаны для примера и не подтверждены заведением.</p>
          <p><strong>Адрес:</strong> {offer.address}<br />{offer.district}, Астана</p>
          <p className="pickup-window">Выдача с <time dateTime={offer.pickupStartsAt}>{pickupFormat.format(new Date(offer.pickupStartsAt))}</time><br /><strong>Забрать до <time dateTime={offer.endsAt}>{pickupFormat.format(new Date(offer.endsAt))}</time></strong><br />Время Астаны</p>
          <p className="pickup-instructions">{offer.pickupInstructions}</p>
        </section>
        <p><strong>Аллергены:</strong> {offer.allergens.join(", ")}</p>
        <p className="availability-note">Наличие и цена не подтверждены. Оформление заказа и бронирование сейчас недоступны.</p>
        <button className="button button-primary" onClick={onFavorite} aria-pressed={favorite}>{favorite ? "Убрать из избранного" : "Сохранить в избранное"}</button>
      </div>
    </>
  );
}
