"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Search } from "lucide-react";
import type { FormEvent } from "react";

type Props = { query: string; onQueryChange: (query: string) => void; onSearch: () => void };

export default function Hero({ query, onQueryChange, onSearch }: Props) {
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch();
  }
  return <section className="hero" aria-labelledby="hero-title">
    <div className="hero-inner">
      <div className="hero-copy">
        <h1 id="hero-title"><span>Находите вкусное.</span> <span>Платите меньше.</span></h1>
        <p>Еда из кафе, пекарен и магазинов Астаны со скидкой. Хорошему вкусу — ещё один шанс.</p>
        <div className="hero-buttons">
          <Link href="/offers" className="button button-primary">Смотреть предложения <ArrowRight size={18} aria-hidden="true" /></Link>
          <a href="#how-it-works" className="text-link">Как это работает</a>
        </div>
      </div>
      <div className="hero-art"><Image src="/images/hero-detailed.webp" fill priority sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1199px) 50vw, 680px" alt="Парень с пакетом свежих продуктов на фоне Астаны" className="hero-panorama" /></div>
      <form className="food-search" onSubmit={search} role="search" aria-label="Поиск еды рядом">
        <div className="search-input-wrap"><Search size={22} aria-hidden="true" /><label htmlFor="food-search" className="sr-only">Название блюда, заведения, район или адрес</label><input id="food-search" name="query" type="search" value={query} onChange={event => onQueryChange(event.target.value)} placeholder="Блюдо, заведение или адрес…" autoComplete="off" enterKeyHint="search" /></div>
        <span className="search-city"><MapPin size={18} aria-hidden="true" />Астана</span>
        <button className="button button-primary" type="submit">Найти</button>
      </form>
    </div>
  </section>;
}
