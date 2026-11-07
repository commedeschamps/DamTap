"use client";

import Image from "next/image";
import businessBanner from "@/public/images/business-banner.webp";
import { ArrowRight, Heart, Leaf } from "lucide-react";

const benefits = [
  { Icon: Leaf, label: <>Меньше<br />пищевых отходов</> },
  { Icon: Heart, label: <>Бережное<br />отношение к еде</> },
];

export default function BusinessBanner({ onPartner }: { onPartner: () => void }) {
  return (
    <section className="business-section page-container" id="business" aria-labelledby="business-title">
      <div className="business-art">
        <Image
          src={businessBanner}
          fill
          alt="Уютное кафе с террасой в Астане"
          sizes="(max-width: 767px) calc(100vw - 32px), 50vw"
        />
      </div>
      <div className="business-content">
        <div className="business-copy">
          <h2 id="business-title">Вы представитель бизнеса?</h2>
          <p>Дайте хорошей еде ещё один шанс,<br className="desktop-break" /> сокращая излишки и пищевые отходы.</p>
          <div className="business-buttons">
            <button className="button button-primary" onClick={onPartner}>Условия подключения <ArrowRight size={16} /></button>
            <a className="text-link" href="#how-it-works">Как работает сервис</a>
          </div>
        </div>
        <ul className="business-benefits">
          {benefits.map(({ Icon, label }, i) => (
            <li key={i}><span className="benefit-icon"><Icon size={24} aria-hidden="true" /></span><span>{label}</span></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
