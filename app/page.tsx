import HomeExperience from "@/components/HomeExperience";
import { getSessionOfferSnapshot } from "@/lib/server-offers";

// Сроки едины для главной, каталога и деталей в рамках сессии браузера.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { offers, initialNow } = await getSessionOfferSnapshot();
  return <HomeExperience offers={offers} initialNow={initialNow} />;
}
