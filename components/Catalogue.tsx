"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Drawer } from "vaul";
import { useQueryStates } from "nuqs";
import { AnimatePresence, motion } from "motion/react";
import { layoutTransition } from "@/lib/motion";
import { useState } from "react";
import { ArrowDownUp, Heart, LayoutGrid, Map, MapPin, SearchX, SlidersHorizontal, X } from "lucide-react";
import type { Offer } from "@/data/offers";
import { catalogueParsers } from "@/lib/search-params";
import { catalogueCategories, filterOffers, PRICE_LIMIT, sortOptions, type CatalogueFilters } from "@/lib/catalogue";
import Header from "./Header";
import Footer from "./Footer";
import FilterPanel from "./FilterPanel";
import CatalogueCategories from "./CatalogueCategories";
import OfferSearch from "./OfferSearch";
import SelectControl from "./SelectControl";
import AnimatedNumber from "./AnimatedNumber";
import Hint from "./Hint";
import CatalogueCard from "./CatalogueCard";
import FilterChip from "./FilterChip";
import useFavorites from "./useFavorites";
import useOfferClock from "./useOfferClock";

const OfferMap = dynamic(() => import("./OfferMap"), { ssr: false, loading: () => <div className="map-loading" role="status">Загружаем карту Астаны…</div> });

export default function Catalogue({ offers, initialNow }: { offers: Offer[]; initialNow: number }) {
  const [filters, setFilters] = useQueryStates(catalogueParsers, { history: "push", shallow: true });
  const [favorites, toggleFavorite] = useFavorites();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const now = useOfferClock(initialNow);
  const available = offers.filter(offer => Date.parse(offer.endsAt) > now && offer.quantityLeft > 0);
  const results = filterOffers(offers, filters, favorites, now);
  const suggestions = filterOffers(offers, { ...filters, q: "" }, favorites, now);
  const hasSearchFilters = filters.category !== "all" || !!filters.district || filters.max !== PRICE_LIMIT || filters.favorites || filters.soon;
  const update = (value: Partial<CatalogueFilters>) => { void setFilters(value as Partial<typeof filters>); };
  const reset = () => { void setFilters({ q: null, category: null, district: null, max: null, sort: null, favorites: null, soon: null }); };
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category !== "all") params.set("category", filters.category);
  if (filters.district) params.set("district", filters.district);
  if (filters.max !== PRICE_LIMIT) params.set("max", String(filters.max));
  if (filters.sort !== "recommended") params.set("sort", filters.sort);
  if (filters.favorites) params.set("favorites", "true");
  if (filters.soon) params.set("soon", "true");
  if (filters.view !== "list") params.set("view", filters.view);
  const returnTo = `/offers${params.size ? `?${params}` : ""}`;
  const hrefFor = (offer: Offer) => `/offers/${offer.id}?returnTo=${encodeURIComponent(returnTo)}`;
  const chips = [
    ...(filters.q ? [{ key: "q", label: `Поиск: ${filters.q}`, clear: () => update({ q: "" }) }] : []),
    ...(filters.category !== "all" ? [{ key: "category", label: catalogueCategories.find(item => item.id === filters.category)?.label ?? filters.category, clear: () => update({ category: "all" }) }] : []),
    ...(filters.district ? [{ key: "district", label: filters.district, clear: () => update({ district: "" }) }] : []),
    ...(filters.max !== PRICE_LIMIT ? [{ key: "max", label: `До ${Math.max(0, Math.min(PRICE_LIMIT, filters.max)).toLocaleString("ru-RU")} ₸`, clear: () => update({ max: PRICE_LIMIT }) }] : []),
    ...(filters.soon ? [{ key: "soon", label: "В течение 2 часов", clear: () => update({ soon: false }) }] : []),
    ...(filters.favorites ? [{ key: "favorites", label: "Избранное", clear: () => update({ favorites: false }) }] : []),
  ];
  const panel = <FilterPanel filters={filters} offers={available} onChange={update} onReset={reset} />;

  return <>
    <Header onFavorites={() => update({ favorites: !filters.favorites })} favoritesOnly={filters.favorites} favoriteCount={favorites.length} />
    <main id="main" className="catalogue-page page-container">
      <nav className="breadcrumbs" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span aria-hidden="true">/</span><span aria-current="page">Предложения</span></nav>
      <div className="catalogue-heading"><div><h1>{filters.favorites ? "Ваше избранное" : "Вкусное в Астане"}</h1><p>{filters.favorites ? "Сохранённые блюда, к которым хочется вернуться." : "Любимые блюда по приятной цене. Выбирайте и забирайте сами."}</p></div><span className="catalogue-location"><MapPin size={18} aria-hidden="true" />Астана · самовывоз</span></div>
      <OfferSearch offers={suggestions} query={filters.q} hasFilters={hasSearchFilters} onSearch={q => update({ q })} />
      <CatalogueCategories offers={available} selected={filters.category} onSelect={category => update({ category })} />
      <div className="quick-filters" aria-label="Быстрые фильтры">
        <button aria-pressed={filters.max === 1500} onClick={() => update({ max: filters.max === 1500 ? PRICE_LIMIT : 1500 })}>До 1 500 ₸</button>
        <button aria-pressed={filters.soon} onClick={() => update({ soon: !filters.soon })}>Закончатся за 2 часа</button>
        <button aria-pressed={filters.favorites} onClick={() => update({ favorites: !filters.favorites })}><Heart size={16} aria-hidden="true" />Избранное</button>
      </div>
      <div className="catalogue-layout">
        <aside className="catalogue-sidebar" aria-label="Фильтры предложений"><h2>Фильтры</h2>{panel}</aside>
        <section className="catalogue-results" aria-labelledby="catalogue-results-title">
          <div className="catalogue-toolbar">
            <h2 id="catalogue-results-title" className="result-count"><span role="status">Найдено: <AnimatedNumber value={results.length} /></span></h2>
            <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen} handleOnly autoFocus shouldScaleBackground={false}>
              <Drawer.Trigger className="button button-outline mobile-filter-trigger"><SlidersHorizontal size={18} />Фильтры{chips.length > 0 ? ` · ${chips.length}` : ""}</Drawer.Trigger>
              <Drawer.Portal><Drawer.Overlay className="filter-overlay vaul-filter-overlay" /><Drawer.Content className="filter-drawer vaul-filter-drawer">
                <div className="drawer-handle-area"><Drawer.Handle className="drawer-handle" aria-label="Потяните вниз, чтобы закрыть фильтры" /></div>
                <div className="drawer-heading"><Drawer.Title>Фильтры</Drawer.Title><Drawer.Close className="icon-button" aria-label="Закрыть фильтры"><X size={20} /></Drawer.Close></div>
                <Drawer.Description className="drawer-description">Выберите бюджет, район и время. Результаты обновляются сразу.</Drawer.Description>
                <div className="drawer-body">{panel}</div>
                <div className="drawer-footer"><Drawer.Close className="button button-primary">Показать предложения · {results.length}</Drawer.Close></div>
              </Drawer.Content></Drawer.Portal>
            </Drawer.Root>
            <div className="catalogue-sort"><SelectControl label="Сортировка" value={filters.sort} onValueChange={sort => update({ sort: sort as CatalogueFilters["sort"] })} options={sortOptions} icon={<ArrowDownUp size={16} />} /></div>
            <div className="view-switch" aria-label="Вид предложений"><Hint label="Показать карточки"><button aria-label="Список предложений" aria-pressed={filters.view === "list"} onClick={() => void setFilters({ view: "list" })}>{filters.view === "list" && <motion.span className="view-switch-indicator" layoutId="catalogue-view-indicator" transition={layoutTransition} />}<LayoutGrid size={19} /></button></Hint><Hint label="Посмотреть на карте"><button aria-label="Предложения на карте" aria-pressed={filters.view === "map"} onClick={() => void setFilters({ view: "map" })}>{filters.view === "map" && <motion.span className="view-switch-indicator" layoutId="catalogue-view-indicator" transition={layoutTransition} />}<Map size={19} /></button></Hint></div>
          </div>
          {chips.length > 0 && <div className="active-filters" aria-label="Применённые фильтры"><AnimatePresence initial={false} mode="popLayout">{chips.map(chip => <FilterChip key={chip.key} label={chip.label} onRemove={chip.clear} />)}</AnimatePresence><button className="text-link clear-filters" onClick={reset}>Сбросить все</button></div>}
          <p className="demo-note catalogue-demo-note"><span>Демо-каталог</span> Цены, адреса и наличие — примеры. Заказ пока недоступен.</p>
          {filters.favorites && <p className="favorites-note">Избранное хранится только в этом браузере.</p>}
          {results.length === 0 ? <div className="catalogue-empty">{filters.favorites && !favorites.length ? <Heart size={32} aria-hidden="true" /> : <SearchX size={32} aria-hidden="true" />}<h3>{!available.length ? "На сегодня предложения закончились" : filters.favorites && !favorites.length ? "Здесь будет ваше любимое" : "Ничего не нашлось"}</h3><p>{!available.length ? "Сроки этих демонстрационных предложений истекли." : filters.favorites && !favorites.length ? "Нажмите на сердечко рядом с блюдом — оно сохранится здесь, в этом браузере." : filters.q ? `По запросу «${filters.q}» с выбранными фильтрами нет предложений. Попробуйте убрать одно из условий.` : "Попробуйте увеличить бюджет или выбрать другой район."}</p>{available.length > 0 && <button className="button button-primary" onClick={reset}>Посмотреть все предложения</button>}</div> : filters.view === "map" ? <OfferMap offers={results} hrefFor={hrefFor} /> :
            <div className="catalogue-grid"><AnimatePresence initial={false} mode="popLayout">{results.map(offer => <CatalogueCard key={offer.id} offer={offer} favorite={favorites.includes(offer.id)} onFavorite={() => toggleFavorite(offer.id)} href={hrefFor(offer)} />)}</AnimatePresence></div>}
        </section>
      </div>
    </main><Footer />
  </>;
}
