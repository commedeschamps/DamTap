import "server-only";
import { headers } from "next/headers";
import { getOffers } from "@/data/offers";
import { DEMO_SESSION_HEADER, demoSessionStart } from "./demo-session";

export async function getSessionOfferSnapshot() {
  const requestHeaders = await headers();
  const initialNow = Date.now();
  const startedAt = demoSessionStart(requestHeaders.get(DEMO_SESSION_HEADER), initialNow);
  return { offers: getOffers(startedAt), initialNow };
}
