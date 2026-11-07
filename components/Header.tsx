"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { navigationSpring } from "@/lib/motion";

import { ChevronDown, Heart, Info, MapPin, Menu, Search, Utensils } from "lucide-react";
import Logo from "./Logo";

type Props = { onFavorites: () => void; favoritesOnly: boolean; favoriteCount: number };

export default function Header({ onFavorites, favoritesOnly, favoriteCount }: Props) {
  const pathname = usePathname();
  const isCatalogue = pathname.startsWith("/offers");
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    let frame = 0;
    function updateSection() {
      frame = 0;
      const marker = window.innerHeight * 0.45;
      const about = document.getElementById("about");
      const offers = document.getElementById("offers");
      setActiveSection(about && about.getBoundingClientRect().top < marker ? "about" : offers && offers.getBoundingClientRect().top < marker ? "offers" : "home");
    }
    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(updateSection);
    }
    updateSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const mobileActive = isCatalogue ? (favoritesOnly ? "favorites" : "offers") : activeSection;

  return (
    <>
      <a className="skip-link" href="#main">Перейти к содержимому</a>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="DamTap — на главную"><Logo priority /></Link>
          <nav className="desktop-menu" aria-label="Основная навигация">
            <Link href="/offers" aria-current={isCatalogue ? "page" : undefined}>Предложения</Link><Link href="/#how-it-works">Как это работает</Link>
            <Link href="/#business">Для заведений</Link><a href="#about">О DamTap</a>
          </nav>
          <details className="tablet-menu"><summary aria-label="Открыть меню навигации"><Menu size={22} aria-hidden="true" /><span>Меню</span></summary><nav aria-label="Навигация на планшете"><Link href="/offers">Предложения</Link><Link href="/#how-it-works">Как это работает</Link><Link href="/#business">Для заведений</Link><a href="#about">О DamTap</a></nav></details>
          <label className="header-city"><MapPin size={19} aria-hidden="true" /><span className="sr-only">Ваш город</span><select defaultValue="Астана"><option>Астана</option></select><ChevronDown size={14} aria-hidden="true" /></label>
          <div className="header-actions">
            <a className="icon-button search-link" href={pathname === "/offers" ? "#catalogue-search" : isCatalogue ? "/offers#catalogue-search" : "#food-search"} onClick={event => {
              if (pathname !== "/offers") return;
              const input = document.querySelector<HTMLInputElement>("#catalogue-search input");
              if (input) { event.preventDefault(); input.focus(); input.scrollIntoView({ block: "center" }); }
            }} aria-label="Поиск продуктов"><Search /></a>
            <button className="icon-button favorites-control" onClick={onFavorites} aria-label={`Избранное: ${favoriteCount}`} aria-pressed={favoritesOnly}><Heart fill={favoritesOnly ? "currentColor" : "none"} />{favoriteCount > 0 && <span className="favorite-count">{favoriteCount}</span>}</button>
          </div>
        </div>
      </header>
      <nav className="mobile-nav" aria-label="Мобильная навигация">
        <Link href="/" aria-label="Главная" aria-current={!isCatalogue && activeSection === "home" ? "location" : undefined}>{mobileActive === "home" && <motion.span className="mobile-nav-indicator" layoutId="mobile-nav-indicator" transition={navigationSpring} />}<Logo symbolOnly /><span>Главная</span></Link>
        <Link href="/offers" aria-current={(isCatalogue || activeSection === "offers") && !favoritesOnly ? "page" : undefined}>{mobileActive === "offers" && <motion.span className="mobile-nav-indicator" layoutId="mobile-nav-indicator" transition={navigationSpring} />}<Utensils size={21} /><span>Предложения</span></Link>
        <button onClick={onFavorites} aria-pressed={favoritesOnly} aria-current={(isCatalogue || activeSection === "offers") && favoritesOnly ? "location" : undefined}>{mobileActive === "favorites" && <motion.span className="mobile-nav-indicator" layoutId="mobile-nav-indicator" transition={navigationSpring} />}<Heart size={21} fill={favoritesOnly ? "currentColor" : "none"} /><span>Избранное{favoriteCount > 0 ? ` · ${favoriteCount}` : ""}</span></button>
        <a href="#about" aria-current={!isCatalogue && activeSection === "about" ? "location" : undefined}>{mobileActive === "about" && <motion.span className="mobile-nav-indicator" layoutId="mobile-nav-indicator" transition={navigationSpring} />}<Info size={21} /><span>О DamTap</span></a>
      </nav>
    </>
  );
}
