"use client";

import Image from "next/image";
import { Command } from "cmdk";
import * as Popover from "@radix-ui/react-popover";
import { ArrowUpLeft, Search, Store, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { Offer } from "@/data/offers";
import { matchesOfferQuery } from "@/lib/catalogue";
import { formatPrice } from "./OfferCard";

type Props = { offers: Offer[]; query: string; hasFilters: boolean; onSearch: (query: string) => void };

export default function OfferSearch({ offers, query, hasFilters, onSearch }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ source: query, value: query });
  if (draft.source !== query) setDraft({ source: query, value: query });
  const value = draft.source === query ? draft.value : query;
  const input = useRef<HTMLInputElement>(null);
  const anchor = useRef<HTMLFormElement>(null);
  const resultsId = useId();

  useEffect(() => {
    function keyboard(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
      if (document.querySelector('[role="dialog"][data-state="open"]')) return;
      event.preventDefault();
      input.current?.focus();
      setOpen(true);
    }
    window.addEventListener("keydown", keyboard);
    if (window.location.hash === "#catalogue-search") input.current?.focus();
    return () => window.removeEventListener("keydown", keyboard);
  }, []);

  function select(next: string) {
    setDraft({ source: query, value: next });
    onSearch(next);
    setOpen(false);
  }
  const normalized = value.trim().toLocaleLowerCase("ru");
  const matching = offers.filter(offer => matchesOfferQuery(offer, value));
  const suggestions = matching.slice(0, 4);
  const venues = [...new Set(matching.map(offer => offer.venue))].filter(venue => normalized && venue.toLocaleLowerCase("ru").includes(normalized)).slice(0, 3);

  return <Command label="Блюдо, заведение или адрес" shouldFilter={false} loop vimBindings={false} className="offer-search">
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Anchor asChild>
        <form ref={anchor} id="catalogue-search" className="catalogue-search" role="search" onKeyDown={event => { if (event.target !== input.current) event.stopPropagation(); }} onSubmit={event => { event.preventDefault(); select(value.trim()); }}>
          <Search size={22} aria-hidden="true" />
          <Command.Input asChild ref={input} value={value} onValueChange={next => { setDraft({ source: query, value: next }); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={event => {
            if (event.key === "Home" || event.key === "End") event.stopPropagation();
            if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
            if ((event.key === "ArrowDown" || event.key === "ArrowUp") && !open) { event.preventDefault(); setOpen(true); }
            if (event.key === "Enter" && !open && !event.nativeEvent.isComposing) { event.preventDefault(); select(value.trim()); }
          }} placeholder="Блюдо, заведение или адрес" autoComplete="off" enterKeyHint="search"><input role="combobox" aria-expanded={open} aria-controls={open ? resultsId : undefined} /></Command.Input>
          {value ? <button type="button" className="icon-button search-clear" aria-label="Очистить поиск" onClick={() => { input.current?.focus(); select(""); }}><X size={18} /></button> : <kbd className="search-shortcut">⌘ / Ctrl K</kbd>}
          <button className="button button-primary" type="submit">Найти</button>
        </form>
      </Popover.Anchor>
      <Popover.Portal><Popover.Content className="offer-search-popover" side="bottom" align="start" sideOffset={8} collisionPadding={16} onOpenAutoFocus={event => event.preventDefault()} onCloseAutoFocus={event => event.preventDefault()} onInteractOutside={event => { if (anchor.current?.contains(event.target as Node)) event.preventDefault(); }} aria-label="Подсказки поиска">
        <Command.List asChild className="command-results" label="Подсказки поиска"><div id={resultsId}>
          <Command.Item value="search-query" onSelect={() => select(value.trim())} className="command-search-all"><Search size={18} aria-hidden="true" /><span>{normalized ? `Искать «${value.trim()}»` : hasFilters ? "Показать предложения с этими фильтрами" : "Показать все предложения"}</span><ArrowUpLeft size={16} aria-hidden="true" /></Command.Item>
          {!matching.length && <p className="command-no-matches">{hasFilters ? "С этими фильтрами подсказок нет. Попробуйте другое название или измените фильтры." : "Подсказок нет. Попробуйте название блюда, заведения или района."}</p>}
          {suggestions.length > 0 && <Command.Group heading={hasFilters ? "Подходят под ваши фильтры" : normalized ? "Блюда" : "Можно попробовать"}>{suggestions.map(offer => <Command.Item key={offer.id} value={`offer-${offer.id}`} onSelect={() => select(offer.title)} className="command-offer"><Image src={offer.image} alt="" width={48} height={48} /><span><strong>{offer.title}</strong><small>{offer.venue}</small></span><b>{formatPrice(offer.price)}</b></Command.Item>)}</Command.Group>}
          {venues.length > 0 && <Command.Group heading="Заведения">{venues.map(venue => <Command.Item key={venue} value={`venue-${venue}`} onSelect={() => select(venue)} className="command-venue"><Store size={18} aria-hidden="true" /><span>{venue}</span><ArrowUpLeft size={16} aria-hidden="true" /></Command.Item>)}</Command.Group>}
        </div></Command.List>
        <div className="command-footer"><span>↑ ↓ выбрать · Enter искать</span><span>Esc закрыть</span></div>
      </Popover.Content></Popover.Portal>
    </Popover.Root>
  </Command>;
}
