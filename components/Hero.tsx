"use client";

import Image from "next/image";
import { ArrowRight, ChevronDown, MapPin, Search } from "lucide-react";
import { FormEvent } from "react";

type Props = { onSearch: (query: string) => void };

export default function Hero({ onSearch }: Props) {
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(String(new FormData(event.currentTarget).get("query") ?? ""));
    document.getElementById("offers")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-art"><Image src="/images/hero.webp" fill priority unoptimized sizes="100vw" alt="Парень с пакетом свежих продуктов на фоне Астаны" className="hero-panorama" />
      <Image src="/images/leaves-tl.webp" alt="" width={230} height={108} className="hero-leaves hero-leaves-left" />
      <Image src="/images/leaves-tl.webp" alt="" width={230} height={108} className="hero-leaves hero-leaves-right" /></div>
      <div className="hero-inner">
        <div className="hero-copy">
          <h1 id="hero-title"><span>Вкусная еда</span>{" "}<span>не должна</span>{" "}<span>пропадать</span></h1>
          <p>DamTap — это маркетплейс, где кафе, магазины и пекарни предлагают качественные продукты со скидкой, а мы вместе уменьшаем пищевые отходы в Казахстане.</p>
          <div className="hero-buttons"><a href="#offers" className="button button-primary">Найти еду рядом <ArrowRight size={17} /></a><a href="#how-it-works" className="button button-outline">Как это работает</a></div>
        </div>
      </div>
      <form className="food-search" onSubmit={search} role="search" aria-label="Поиск еды рядом">
        <div className="search-input-wrap"><Search size={23} aria-hidden="true" /><label htmlFor="food-search" className="sr-only">Название продукта, кафе или района</label><input id="food-search" name="query" type="search" placeholder="Введите название продукта, кафе или района" /></div>
        <label className="search-city"><MapPin size={20} aria-hidden="true" /><span className="sr-only">Город поиска</span><select name="city" defaultValue="Астана"><option>Астана</option></select><ChevronDown size={14} aria-hidden="true" /></label>
        <button className="button button-primary" type="submit">Найти</button>
      </form>
    </section>
  );
}
