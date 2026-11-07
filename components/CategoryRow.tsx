"use client";

import Image from "next/image";
import { ArrowRight, ChevronDown, LayoutGrid } from "lucide-react";
import type { Offer, OfferCategory } from "@/data/offers";
import { categoryCounts } from "@/lib/catalogue";

const countPlural = new Intl.PluralRules("ru");
const countWords = { one: "предложение", few: "предложения", many: "предложений", other: "предложения", zero: "предложений", two: "предложения" };

export { catalogueCategories as categories } from "@/lib/catalogue";

export default function CategoryRow({ offers, selected, onSelect }: { offers: Offer[]; selected: OfferCategory | "all"; onSelect: (id: OfferCategory | "all") => void }) {
  const categories = categoryCounts(offers);
  const available = categories.filter(category => category.count > 0);
  const unavailable = categories.filter(category => category.count === 0);
  return <section className="category-discovery page-container" aria-labelledby="category-title">
    <h2 id="category-title">Что вам по вкусу?</h2>
    <nav className="categories" aria-label="Категории продуктов">
      {available.map(({ id, label, count }) => <button key={id} className="category" aria-pressed={selected === id} onClick={() => onSelect(selected === id ? "all" : id)}>
        <Image src={`/images/category-${id}.webp`} alt="" width={80} height={80} />
        <span className="category-copy"><strong>{label}</strong><small>{count} {countWords[countPlural.select(count)]}</small></span><ArrowRight size={18} aria-hidden="true" />
      </button>)}
      <button className="category category-all" onClick={() => onSelect("all")}><span className="category-grid-icon"><LayoutGrid size={26} aria-hidden="true" /></span><span className="category-copy"><strong>Все предложения</strong><small>Подберите своё</small></span><ArrowRight size={18} aria-hidden="true" /></button>
    </nav>
    {unavailable.length > 0 && <details className="category-unavailable"><summary>Другие категории <ChevronDown size={15} aria-hidden="true" /></summary><p>Пока без предложений: {unavailable.map(category => category.label.toLocaleLowerCase("ru")).join(", ")}.</p></details>}
  </section>;
}
