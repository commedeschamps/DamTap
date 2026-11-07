export const DEMO_SESSION_COOKIE = "damtap-demo-start";
export const DEMO_SESSION_HEADER = "x-damtap-demo-start";

/** Preserve a session's deadlines, including expired ones; reject invalid clocks. */
export function demoSessionStart(value: string | null | undefined, now: number) {
  if (!value || !/^\d{13}$/.test(value)) return now;
  const start = Number(value);
  return Number.isSafeInteger(start) && start <= now ? start : now;
}
