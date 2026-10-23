"use client";

import Link from "next/link";

import { ChevronDown, Heart, Info, MapPin, Search, Utensils } from "lucide-react";
import Logo from "./Logo";

type Props = { onFavorites: () => void; favoritesOnly: boolean; favoriteCount: number };

export default function Header({ onFavorites, favoritesOnly, favoriteCount }: Props) {
  return (
    <>
      <a className="skip-link" href="#main">Перейти к содержимому</a>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="DamTap — на главную"><Logo priority /></Link>
          <nav className="desktop-menu" aria-label="Основная навигация">
            <a href="#offers">Предложения</a><a href="#how-it-works">Как это работает</a>
            <a href="#business">Для заведений</a><a href="#about">О DamTap</a>
          </nav>
          <label className="header-city"><MapPin size={19} aria-hidden="true" /><span className="sr-only">Ваш город</span><select defaultValue="Астана"><option>Астана</option></select><ChevronDown size={14} aria-hidden="true" /></label>
          <div className="header-actions">
            <a className="icon-button search-link" href="#food-search" aria-label="Поиск продуктов"><Search /></a>
            <button className="icon-button favorites-control" onClick={onFavorites} aria-label={`Избранное: ${favoriteCount}`} aria-pressed={favoritesOnly}><Heart fill={favoritesOnly ? "currentColor" : "none"} />{favoriteCount > 0 && <span className="favorite-count">{favoriteCount}</span>}</button>
          </div>
        </div>
      </header>
      <nav className="mobile-nav" aria-label="Мобильная навигация">
        <Link href="/" aria-label="Главная"><Logo symbolOnly /><span>Главная</span></Link>
        <a href="#offers"><Utensils size={21} /><span>Предложения</span></a>
        <button onClick={onFavorites} aria-pressed={favoritesOnly}><Heart size={21} fill={favoritesOnly ? "currentColor" : "none"} /><span>Избранное{favoriteCount > 0 ? ` · ${favoriteCount}` : ""}</span></button>
        <a href="#about"><Info size={21} /><span>О DamTap</span></a>
      </nav>
    </>
  );
}
