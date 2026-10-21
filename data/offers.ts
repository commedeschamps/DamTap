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

const startedAt = Date.now();
const expiresIn = (hours: number): string =>
  new Date(startedAt + hours * 60 * 60 * 1000).toISOString();

// Сроки отсчитываются от загрузки модуля, без фиксированных календарных дат.
export const offers: Offer[] = [
  { id: "1", title: "Круассаны с миндалём, 3 шт.", venue: "Пекарня «Тёплый хлеб»", image: "/images/food-1.webp", distanceKm: 0.4, price: 1200, oldPrice: 2400, endsAt: expiresIn(2), quantityLeft: 4, allergens: ["Глютен", "Молоко", "Яйца", "Миндаль"] },
  { id: "2", title: "Боул с курицей и овощами", venue: "Кафе «Зелёная тарелка»", image: "/images/food-2.webp", distanceKm: 1.2, price: 1600, oldPrice: 3200, endsAt: expiresIn(3), quantityLeft: 5, allergens: ["Соя", "Кунжут"] },
  { id: "3", title: "Том ям с креветками", venue: "Кафе «Лемонграсс»", image: "/images/food-3.webp", distanceKm: 2.1, price: 1900, oldPrice: 3800, endsAt: expiresIn(1.5), quantityLeft: 3, allergens: ["Ракообразные", "Рыба", "Молоко"] },
  { id: "4", title: "Роллы «Филадельфия», 8 шт.", venue: "Суши-бар «Рис»", image: "/images/food-4.webp", distanceKm: 0.8, price: 1800, oldPrice: 3600, endsAt: expiresIn(2.5), quantityLeft: 2, allergens: ["Рыба", "Молоко", "Соя", "Глютен"] },
  { id: "5", title: "Шоколадный торт, 2 кусочка", venue: "Кондитерская «Облако»", image: "/images/food-5.webp", distanceKm: 1.5, price: 1400, oldPrice: 2800, endsAt: expiresIn(4), quantityLeft: 6, allergens: ["Глютен", "Молоко", "Яйца"] },
  { id: "6", title: "Самса с говядиной, 4 шт.", venue: "Пекарня «Дастархан»", image: "/images/food-6.webp", distanceKm: 0.6, price: 1000, oldPrice: 2000, endsAt: expiresIn(2), quantityLeft: 7, allergens: ["Глютен", "Яйца", "Кунжут"] },
  { id: "7", title: "Овощной салат с киноа", venue: "Кафе «Росток»", image: "/images/food-7.webp", distanceKm: 2.4, price: 1300, oldPrice: 2600, endsAt: expiresIn(3.5), quantityLeft: 4, allergens: ["Горчица"] },
  { id: "8", title: "Пицца «Маргарита»", venue: "Пиццерия «Соседи»", image: "/images/food-8.webp", distanceKm: 1.8, price: 1700, oldPrice: 3400, endsAt: expiresIn(1), quantityLeft: 3, allergens: ["Глютен", "Молоко"] },
];
