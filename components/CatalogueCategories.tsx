"use client";

import Image from "next/image";
import { ChevronDown, LayoutGrid } from "lucide-react";
import type { Offer } from "@/data/offers";
import { categoryCounts } from "@/lib/catalogue";

export default function CatalogueCategories({ offers, selected, onSelect }: { offers: Offer[]; selected: string; onSelect: (category: string) => void }) {
  const categories = categoryCounts(offers);
  const available = categories.filter(category => category.count > 0 || category.id === selected);
  const unavailable = categories.filter(category => category.count === 0 && category.id !== selected);
  return <div className="catalogue-category-section">
    <nav className="catalogue-categories" aria-label="Категории предложений">
      <button className="catalogue-category" aria-pressed={selected === "all"} onClick={() => onSelect("all")}><LayoutGrid size={24} aria-hidden="true" /><span>Все предложения<small>{offers.length}</small></span></button>
      {available.map(category => <button key={category.id} className="catalogue-category" aria-pressed={selected === category.id} onClick={() => onSelect(category.id)}><Image src={`/images/category-${category.id}.webp`} width={52} height={52} alt="" /><span>{category.label}<small>{category.count}</small></span></button>)}
    </nav>
    {unavailable.length > 0 && <details className="unavailable-categories"><summary>Другие категории<ChevronDown size={14} aria-hidden="true" /></summary><p>Пока без предложений: {unavailable.map(category => category.label.toLocaleLowerCase("ru")).join(", ")}.</p></details>}
  </div>;
}
