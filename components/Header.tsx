"use client";

import Logo from "./Logo";
import { ChevronDown, Heart, MapPin, Search, UserRound, Utensils } from "lucide-react";

type Props = { onLogin: () => void; onFavorites: () => void; favoritesOnly: boolean; favoriteCount: number };

export default function Header({ onLogin, onFavorites, favoritesOnly, favoriteCount }: Props) {
  return (
    <>
      <a className="skip-link" href="#main">Перейти к содержимому</a>
      <header className="site-header">
        <div className="header-inner">
          <a href="#" className="brand" aria-label="DamTap — на главную"><Logo /></a>
          <nav className="desktop-menu" aria-label="Основная навигация">
            <a href="#offers">Продукты</a><a href="#how-it-works">Как это работает</a>
            <a href="#business">Для бизнеса</a><a href="#about">О нас</a>
          </nav>
          <label className="header-city"><MapPin size={19} aria-hidden="true" /><span className="sr-only">Ваш город</span><select defaultValue="Астана"><option>Астана</option></select><ChevronDown size={14} aria-hidden="true" /></label>
          <div className="header-actions">
            <a className="icon-button search-link" href="#food-search" aria-label="Поиск продуктов"><Search /></a>
            <button className="icon-button favorites-control" onClick={onFavorites} aria-label={`Избранное: ${favoriteCount}`} aria-pressed={favoritesOnly}><Heart fill={favoritesOnly ? "currentColor" : "none"} />{favoriteCount > 0 && <span className="favorite-count">{favoriteCount}</span>}</button>
            <button className="icon-button profile-button" onClick={onLogin} aria-label="Личный кабинет"><UserRound /></button>
            <button className="button button-primary login-button" onClick={onLogin}>Войти</button>
          </div>
        </div>
      </header>
      <nav className="mobile-nav" aria-label="Мобильная навигация">
        <a href="#" aria-label="Главная"><Logo symbolOnly /><span>Главная</span></a>
        <a href="#offers"><Utensils size={21} /><span>Продукты</span></a>
        <button onClick={onFavorites} aria-pressed={favoritesOnly}><Heart size={21} fill={favoritesOnly ? "currentColor" : "none"} /><span>Избранное{favoriteCount > 0 ? ` · ${favoriteCount}` : ""}</span></button>
        <button onClick={onLogin}><UserRound size={21} /><span>Профиль</span></button>
      </nav>
    </>
  );
}
