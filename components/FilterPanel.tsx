"use client";

import * as Slider from "@radix-ui/react-slider";
import { useId, useState } from "react";
import { PRICE_LIMIT, type CatalogueFilters } from "@/lib/catalogue";
import type { Offer } from "@/data/offers";
import { formatPrice } from "./OfferCard";
import SelectControl from "./SelectControl";
import AnimatedNumber from "./AnimatedNumber";

type Props = {
  filters: CatalogueFilters;
  offers: Offer[];
  onChange: (value: Partial<CatalogueFilters>) => void;
  onReset: () => void;
};

function PriceSlider({ max, onChange }: { max: number; onChange: (value: number) => void }) {
  const [draft, setDraft] = useState({ source: max, value: max });
  if (draft.source !== max) setDraft({ source: max, value: max });
  const price = draft.source === max ? draft.value : max;
  return <div className="price-filter">
    <div className="filter-price-label"><span>Цена до</span><strong><AnimatedNumber value={price} suffix=" ₸" /></strong></div>
    <Slider.Root className="price-slider" min={0} max={PRICE_LIMIT} step={50} value={[price]} onValueChange={([value]) => setDraft({ source: max, value })} onValueCommit={([value]) => onChange(value)}>
      <Slider.Track className="price-slider-track"><Slider.Range className="price-slider-range" /></Slider.Track>
      <Slider.Thumb className="price-slider-thumb" aria-label="Максимальная цена" aria-valuetext={formatPrice(price)} />
    </Slider.Root>
    <div className="price-filter-scale"><span>0 ₸</span><span>{formatPrice(PRICE_LIMIT)}</span></div>
  </div>;
}

export default function FilterPanel({ filters, offers, onChange, onReset }: Props) {
  const id = useId();
  const districts = [...new Set(offers.map(offer => offer.district))];
  const max = Math.max(0, Math.min(PRICE_LIMIT, filters.max));
  return <div className="filter-panel">
    <fieldset><legend>Бюджет</legend><PriceSlider max={max} onChange={value => onChange({ max: value })} /></fieldset>
    <div className="district-filter"><label htmlFor={`${id}-district`}>Район</label><SelectControl id={`${id}-district`} label="Район" value={filters.district} onValueChange={district => onChange({ district })} options={[
      { value: "", label: "Все районы" },
      ...(!districts.includes(filters.district) && filters.district ? [{ value: filters.district, label: filters.district }] : []),
      ...districts.map(district => ({ value: district, label: district })),
    ]} /></div>
    <label className="filter-checkbox"><input type="checkbox" checked={filters.soon} onChange={event => onChange({ soon: event.target.checked })} /><span>Закончатся в течение 2 часов</span></label>
    <button className="text-link" onClick={onReset}>Сбросить фильтры</button>
  </div>;
}
