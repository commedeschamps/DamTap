"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Clock3, MapPin, Package, Share2 } from "lucide-react";
import { toast } from "sonner";
import OfferPhoto from "./OfferPhoto";
import FavoriteButton from "./FavoriteButton";
import type { Offer } from "@/data/offers";
import { catalogueReturnPath } from "@/lib/catalogue";
import Header from "./Header";
import Footer from "./Footer";
import { formatPrice } from "./OfferCard";
import useFavorites from "./useFavorites";
import useOfferClock from "./useOfferClock";

const dateFormat = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Almaty" });

export default function OfferPage({ offer, initialNow }: { offer: Offer; initialNow: number }) {
  const [favorites, toggleFavorite] = useFavorites();
  const searchParams = useSearchParams();
  const router = useRouter();
  const now = useOfferClock(initialNow);
  const expired = Date.parse(offer.endsAt) <= now || offer.quantityLeft <= 0;
  const favorite = favorites.includes(offer.id);
  const back = catalogueReturnPath(searchParams.get("returnTo"));
  async function share() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/offers/${offer.id}`);
      toast.success("Ссылка скопирована", { description: "Можно отправить её другу.", id: "share-offer" });
    } catch { toast.error("Не удалось скопировать ссылку", { description: "Скопируйте адрес страницы из браузера.", id: "share-offer" }); }
  }
  return <>
    <Header onFavorites={() => router.push("/offers?favorites=true")} favoritesOnly={false} favoriteCount={favorites.length} />
    <main id="main" className="detail-page page-container">
      <nav className="detail-breadcrumb" aria-label="Навигация предложения"><Link className="text-link" href={back}><ArrowLeft size={18} />К предложениям</Link><button className="text-link" onClick={share}><Share2 size={17} />Поделиться</button></nav>
      <div className="detail-layout">
        <OfferPhoto offer={offer} />
        <div className="detail-summary">
          <h1>{offer.title}</h1><p className="detail-venue">{offer.venue}</p>
          <p className="detail-location"><MapPin size={17} aria-hidden="true" /><span>{offer.district}, Астана</span></p>
          <div className="detail-price-row"><strong>{formatPrice(offer.price)}</strong><del>{formatPrice(offer.oldPrice)}</del><span>Экономия {formatPrice(offer.oldPrice - offer.price)}</span></div>
          <div className="detail-availability"><Package size={18} aria-hidden="true" /><span>{expired ? "Предложение завершено" : `Порций в демо-предложении: ${offer.quantityLeft}`}</span></div>
          <section className="detail-pickup-summary" aria-labelledby="detail-pickup-title"><h2 id="detail-pickup-title"><Clock3 size={20} aria-hidden="true" />Самовывоз</h2><p>С <time dateTime={offer.pickupStartsAt}>{dateFormat.format(new Date(offer.pickupStartsAt))}</time><br />до <time dateTime={offer.endsAt}>{dateFormat.format(new Date(offer.endsAt))}</time></p><small>Время Астаны</small></section>
          <FavoriteButton className="button button-primary detail-save" favorite={favorite} onToggle={() => toggleFavorite(offer.id)} label={favorite ? "Убрать из избранного" : "Сохранить в избранное"}>{favorite ? "Сохранено в избранном" : "Сохранить в избранное"}</FavoriteButton>
          <div className="detail-order-status" role="note"><strong>{expired ? "Срок предложения истёк" : "Это демонстрационное предложение"}</strong><p>{expired ? "Время самовывоза закончилось или порций больше нет. Посмотрите другие предложения в каталоге." : "Наличие и цена не подтверждены. Заказ и бронирование пока недоступны. Можно сохранить блюдо в избранное."}</p>{expired && <Link href={back} className="text-link">Выбрать другое предложение</Link>}</div>
        </div>
      <div className="detail-information">
        <section aria-labelledby="collection-title"><h2 id="collection-title">Где и как забрать</h2><p className="detail-address">{offer.address}</p><p>{offer.district}, Астана</p><p>{offer.pickupInstructions}</p><p className="demo-note">Адрес и правила выдачи приведены для примера и не подтверждены заведением.</p></section>
        <section aria-labelledby="allergens-title"><h2 id="allergens-title">Аллергены</h2><ul className="allergen-list">{offer.allergens.map(allergen => <li key={allergen}>{allergen}</li>)}</ul><p className="demo-note">Состав указан для демонстрации. Перед покупкой уточните его у заведения.</p><Link href="/offers" className="text-link">Посмотреть другие предложения <ArrowLeft className="arrow-forward" size={16} /></Link></section>
      </div>
      </div>
    </main><Footer />
  </>;
}
