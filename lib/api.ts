export type Reservation = {
  id: string;
  offerId: string;
  title: string;
  venue: string;
  address: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  quantityLeft: number;
  pickupStartsAt: string;
  endsAt: string;
  createdAt: string;
};

export type PartnerReceipt = { id: string; createdAt: string };

// Browser requests stay on the Next.js origin; rewrites forward them to Spring.
export async function postApi<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new Error("Не удалось связаться с сервером. Попробуйте позже.");
  }
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok || payload === null) {
    const detail = payload && typeof payload === "object" && "detail" in payload ? payload.detail : null;
    throw new Error(typeof detail === "string" ? detail : "Сервис временно недоступен. Попробуйте позже.");
  }
  return payload as T;
}
