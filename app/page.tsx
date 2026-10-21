import HomeExperience from "@/components/HomeExperience";
import { getOffers } from "@/data/offers";

// Демо-таймеры начинаются при открытии страницы, а не во время сборки.
export const dynamic = "force-dynamic";

export default function Home() {
  return <HomeExperience offers={getOffers()} />;
}
