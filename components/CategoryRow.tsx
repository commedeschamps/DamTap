"use client";

import Image from "next/image";
import type { Offer, OfferCategory } from "@/data/offers";

export { catalogueCategories as categories } from "@/lib/catalogue";
import { categoryCounts } from "@/lib/catalogue";

export default function CategoryRow({ offers, selected, onSelect }: { offers: Offer[]; selected: OfferCategory | "all"; onSelect: (id: OfferCategory | "all") => void }) {
  const categories = categoryCounts(offers);
  return (
    <nav className="categories page-container" aria-label="Категории продуктов">
      {categories.map(({ id, label, count }) => (
        <button key={id} className="category" disabled={count === 0} aria-pressed={selected === id} onClick={() => onSelect(selected === id ? "all" : id)}>
          <span className="category-art"><Image src={`/images/category-${id}.webp`} alt="" width={88} height={88} /></span><span>{label}</span>{count === 0 && <small>Пока нет</small>}
        </button>
      ))}
      <button className="category category-all" aria-pressed={selected === "all"} onClick={() => onSelect("all")}><span className="category-art"><Image src="/images/leaves-tl.webp" width={75} height={75} alt="" /></span><span>Все категории</span></button>
    </nav>
  );
}
