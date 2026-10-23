import HomeExperience from "@/components/HomeExperience";
import type { Offer } from "@/data/offers";

// Availability and expiry dates come from the database on each request.
export const dynamic = "force-dynamic";

export default async function Home() {
  let offers: Offer[] = [];
  let apiError: string | null = null;
  try {
    const backend = (process.env.BACKEND_URL || "http://127.0.0.1:8080").replace(/\/+$/, "");
    const response = await fetch(`${backend}/api/offers`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`Catalog returned ${response.status}`);
    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) throw new Error("Invalid catalog response");
    offers = payload as Offer[];
  } catch {
    apiError = "Каталог временно недоступен. Попробуйте обновить страницу позже.";
  }
  return <HomeExperience offers={offers} apiError={apiError} />;
}
