"use client";

import Image from "next/image";
import { type FormEvent, useState } from "react";
import type { Offer } from "@/data/offers";
import { postApi, type Reservation } from "@/lib/api";
import { formatPrice } from "./OfferCard";

const pickupFormat = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Almaty",
});

export default function OfferDetails({ offer, favorite, onFavorite, onReserved }: {
  offer: Offer;
  favorite: boolean;
  onFavorite: () => void;
  onReserved: (receipt: Reservation) => void;
}) {
  const [quantity, setQuantity] = useState("1");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<Reservation | null>(null);

  async function reserve(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const result = await postApi<Reservation>("reservations", {
        offerId: offer.id, quantity: Number(quantity),
      });
      setReceipt(result);
      onReserved(result);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось забронировать.");
    } finally {
      setPending(false);
    }
  }
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
        <p className="availability-note">Учебный каталог: адреса демонстрационные. Бронь сохраняется на сервере; онлайн-оплаты нет.</p>
        {receipt ? (
          <section className="reservation-receipt" role="status" aria-label="Бронирование подтверждено">
            <h3>Забронировано!</h3>
            <p>{receipt.quantity} шт. · {formatPrice(receipt.totalPrice)}</p>
            <p>Сохраните номер брони: <strong className="reservation-number">{receipt.id}</strong></p>
            <p>Забрать до {pickupFormat.format(new Date(receipt.endsAt))} по времени Астаны.</p>
          </section>
        ) : offer.quantityLeft > 0 ? (
          <form className="api-form" onSubmit={reserve}>
            <label>Количество
              <input type="number" required min={1} max={Math.min(10, offer.quantityLeft)}
                value={quantity} onChange={event => setQuantity(event.currentTarget.value)} disabled={pending} />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button button-primary" type="submit" disabled={pending}>
              {pending ? "Бронируем…" : "Забронировать"}
            </button>
          </form>
        ) : <p role="status">Все порции уже забронированы.</p>}
        <button className="button button-primary" onClick={onFavorite} aria-pressed={favorite}>{favorite ? "Убрать из избранного" : "Сохранить в избранное"}</button>
      </div>
    </>
  );
}
