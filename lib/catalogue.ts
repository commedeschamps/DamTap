import { sortOffers, type Offer, type OfferCategory, type OfferSort } from "../data/offers";

export const catalogueCategories: { id: OfferCategory; label: string }[] = [
  { id: "ready", label: "Готовая еда" }, { id: "bakery", label: "Выпечка" },
  { id: "fruits", label: "Фрукты и овощи" }, { id: "dairy", label: "Молочные продукты" },
  { id: "meat", label: "Мясо и рыба" }, { id: "groceries", label: "Бакалея" },
  { id: "drinks", label: "Напитки" },
];
export const sortOptions: { value: OfferSort; label: string; description: string }[] = [
  { value: "recommended", label: "По умолчанию", description: "Все предложения в исходном порядке" },
  { value: "price", label: "Сначала дешевле", description: "От меньшей цены к большей" }, { value: "ending", label: "Скоро закончатся", description: "По времени окончания предложения" },
  { value: "discount", label: "Больше скидка", description: "От большей скидки к меньшей" },
];
export const PRICE_LIMIT = 3000;
export type CatalogueFilters = {
  q: string; category: string; district: string; max: number;
  sort: OfferSort; favorites: boolean; soon: boolean;
};
export function filterOffers(offers: Offer[], filters: CatalogueFilters, favorites: string[], now: number) {
  const price = Math.min(PRICE_LIMIT, Math.max(0, filters.max));
  return sortOffers(offers.filter(offer => {
    const end = Date.parse(offer.endsAt);
    return end > now && offer.quantityLeft > 0 &&
      (!filters.favorites || favorites.includes(offer.id)) &&
      (filters.category === "all" || offer.category === filters.category) &&
      (!filters.district || offer.district === filters.district) &&
      offer.price <= price &&
      (!filters.soon || end - now <= 2 * 3_600_000) &&
      matchesOfferQuery(offer, filters.q);
  }), filters.sort);
}

export function matchesOfferQuery(offer: Offer, query: string) {
  return `${offer.title} ${offer.venue} ${offer.district} ${offer.address} Астана`.toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru"));
}

export function categoryCounts(offers: Offer[]) {
  return catalogueCategories.map(category => ({ ...category, count: offers.filter(offer => offer.category === category.id).length }));
}

// Only return to our catalogue; never accept a caller-provided external URL.
export function catalogueReturnPath(value: string | null | undefined) {
  if (!value) return "/offers";
  try {
    const url = new URL(value, "https://damtap.local");
    return url.origin === "https://damtap.local" && url.pathname === "/offers" ? `${url.pathname}${url.search}` : "/offers";
  } catch { return "/offers"; }
}
