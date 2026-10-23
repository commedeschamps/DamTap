"use client";

import Image from "next/image";
import type { OfferCategory } from "@/data/offers";

export const categories: { id: OfferCategory; label: string }[] = [
  { id: "ready", label: "Готовая еда" }, { id: "bakery", label: "Выпечка" },
  { id: "fruits", label: "Фрукты и овощи" }, { id: "dairy", label: "Молочные продукты" },
  { id: "meat", label: "Мясо и рыба" }, { id: "groceries", label: "Бакалея" },
  { id: "drinks", label: "Напитки" },
];

export default function CategoryRow({ selected, onSelect }: { selected: OfferCategory | "all"; onSelect: (id: OfferCategory | "all") => void }) {
  return (
    <nav className="categories page-container" aria-label="Категории продуктов">
      {categories.map(({ id, label }) => (
        <button key={id} className="category" aria-pressed={selected === id} onClick={() => onSelect(selected === id ? "all" : id)}>
          <span className="category-art"><Image src={`/images/category-${id}.webp`} alt="" width={88} height={88} /></span><span>{label}</span>
        </button>
      ))}
      <button className="category category-all" aria-pressed={selected === "all"} onClick={() => onSelect("all")}><span className="category-art"><Image src="/images/leaves-tl.webp" width={75} height={75} alt="" /></span><span>Все категории</span></button>
    </nav>
  );
}
