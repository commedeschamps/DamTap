export type Offer = {
  id: string;
  title: string;
  venue: string;
  image: string;
  distanceKm: number;
  /** Цена в тенге. */
  price: number;
  oldPrice: number;
  /** Дата окончания предложения в формате ISO 8601. */
  endsAt: string;
  quantityLeft: number;
  allergens: string[];
};

export type OfferSort = "recommended" | "distance" | "price" | "ending" | "discount";

export function sortOffers(offers: Offer[], sort: OfferSort): Offer[] {
  const sorted = [...offers];
  switch (sort) {
    case "distance": return sorted.sort((a, b) => a.distanceKm - b.distanceKm);
    case "price": return sorted.sort((a, b) => a.price - b.price);
    case "ending": return sorted.sort((a, b) => Date.parse(a.endsAt) - Date.parse(b.endsAt));
    case "discount": return sorted.sort((a, b) => (a.oldPrice > 0 ? a.price / a.oldPrice : 1) - (b.oldPrice > 0 ? b.price / b.oldPrice : 1));
    default: return sorted;
  }
}

const startedAt = Date.now();
const durationHours = [2.3, 5.7, 3.5, 1.2, 4.1, 2, 3.5, 1];
const expiresIn = (hours: number) => new Date(startedAt + hours * 3_600_000).toISOString();

export const offers: Offer[] = [
  { id: "1", title: "Круассан с шоколадом", venue: "Пекарня Le Pain", image: "/images/food-1.webp", distanceKm: 0.8, price: 750, oldPrice: 1900, endsAt: expiresIn(durationHours[0]), quantityLeft: 4, allergens: ["Глютен", "Молоко", "Яйца", "Орехи"] },
  { id: "2", title: "Боул с курицей и киноа", venue: "Green Kitchen", image: "/images/food-2.webp", distanceKm: 1.2, price: 1200, oldPrice: 2400, endsAt: expiresIn(durationHours[1]), quantityLeft: 5, allergens: ["Соя", "Кунжут"] },
  { id: "3", title: "Том ям (остаток порций)", venue: "Sapa Asian Food", image: "/images/food-3.webp", distanceKm: 0.6, price: 1500, oldPrice: 2500, endsAt: expiresIn(durationHours[2]), quantityLeft: 3, allergens: ["Ракообразные", "Рыба", "Молоко"] },
  { id: "4", title: "Сет роллов (вечерний)", venue: "Sushi Time", image: "/images/food-4.webp", distanceKm: 1.5, price: 2200, oldPrice: 4400, endsAt: expiresIn(durationHours[3]), quantityLeft: 2, allergens: ["Рыба", "Молоко", "Соя", "Глютен"] },
  { id: "5", title: "Торт «Красный бархат»", venue: "Sweet Day", image: "/images/food-5.webp", distanceKm: 0.9, price: 1000, oldPrice: 2500, endsAt: expiresIn(durationHours[4]), quantityLeft: 6, allergens: ["Глютен", "Молоко", "Яйца"] },
  { id: "6", title: "Самса с говядиной, 4 шт.", venue: "Пекарня «Дастархан»", image: "/images/food-1.webp", distanceKm: 0.6, price: 1000, oldPrice: 2000, endsAt: expiresIn(durationHours[5]), quantityLeft: 7, allergens: ["Глютен", "Яйца", "Кунжут"] },
  { id: "7", title: "Овощной салат с киноа", venue: "Кафе «Росток»", image: "/images/food-2.webp", distanceKm: 2.4, price: 1300, oldPrice: 2600, endsAt: expiresIn(durationHours[6]), quantityLeft: 4, allergens: ["Горчица"] },
  { id: "8", title: "Суп с морепродуктами", venue: "Кафе «Лемонграсс»", image: "/images/food-3.webp", distanceKm: 1.8, price: 1700, oldPrice: 3400, endsAt: expiresIn(durationHours[7]), quantityLeft: 3, allergens: ["Рыба", "Ракообразные"] },
];

/** На каждом открытии страницы демо-предложения получают актуальные сроки. */
export function getOffers(now = Date.now()): Offer[] {
  return offers.map((offer, index) => ({
    ...offer,
    endsAt: new Date(now + durationHours[index] * 3_600_000).toISOString(),
  }));
}
