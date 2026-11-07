"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, MapPin, Search } from "lucide-react";
import { FormEvent } from "react";

type Props = { query: string; onQueryChange: (query: string) => void; onSearch: () => void };

export default function Hero({ query, onQueryChange, onSearch }: Props) {
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch();
  }
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-art"><div className="hero-scene"><Image src="/images/hero-detailed.webp" fill priority sizes="100vw" alt="Парень с пакетом свежих продуктов на фоне Астаны" className="hero-panorama" /></div></div>
      <div className="hero-inner">
        <div className="hero-copy">
          <h1 id="hero-title"><span>Находите вкусное.</span>{" "}<span>Платите меньше.</span></h1>
          <p>Любимые блюда из заведений вашего города по выгодным ценам.</p>
          <div className="hero-buttons"><Link href="/offers" className="button button-primary">Смотреть предложения <ArrowRight size={17} /></Link><a href="#how-it-works" className="button hero-secondary">Как это работает</a></div>
        </div>
      </div>
      <form className="food-search" onSubmit={search} role="search" aria-label="Поиск еды рядом">
        <div className="search-input-wrap"><Search size={23} aria-hidden="true" /><label htmlFor="food-search" className="sr-only">Название блюда, заведения, район или адрес</label><input id="food-search" name="query" type="search" value={query} onChange={event => onQueryChange(event.target.value)} placeholder="Блюдо, заведение или адрес" /></div>
        <label className="search-city"><MapPin size={20} aria-hidden="true" /><span className="sr-only">Город поиска</span><select name="city" defaultValue="Астана"><option>Астана</option></select><ChevronDown size={14} aria-hidden="true" /></label>
        <button className="button button-primary" type="submit">Найти</button>
      </form>
    </section>
  );
}
