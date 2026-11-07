"use client";

import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import { X, ZoomIn } from "lucide-react";
import "react-medium-image-zoom/dist/styles.css";
import type { Offer } from "@/data/offers";

export default function OfferPhoto({ offer }: { offer: Offer }) {
  const alt = offer.imageIsIllustration ? "Иллюстрация категории продуктов" : offer.title;
  const discount = offer.oldPrice > 0 ? Math.round((1 - offer.price / offer.oldPrice) * 100) : 0;
  return <div className="detail-visual">
    <Zoom a11yNameButtonZoom="Увеличить изображение" a11yNameButtonUnzoom="Закрыть увеличенное изображение" IconZoom={ZoomIn} IconUnzoom={X} zoomMargin={24} zoomImg={{ src: offer.image, alt }} classDialog="damtap-image-zoom">
      <div className={`detail-photo${offer.imageIsIllustration ? " detail-photo-illustration" : ""}`}>
        <Image src={offer.image} alt={alt} fill priority sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1200px) 50vw, 640px" />
        <span className="discount">−{discount}%</span>
        {offer.imageIsIllustration && <span className="image-caption">Иллюстрация категории</span>}
      </div>
    </Zoom>
    <p className="photo-zoom-hint"><ZoomIn size={15} aria-hidden="true" />Нажмите на изображение, чтобы рассмотреть ближе</p>
  </div>;
}
