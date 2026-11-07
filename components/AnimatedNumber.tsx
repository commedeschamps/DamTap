"use client";

import NumberFlow from "@number-flow/react";

export default function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  return <span className="animated-number"><span className="sr-only">{value.toLocaleString("ru-RU")}{suffix}</span><NumberFlow value={value} suffix={suffix} locales="ru-RU" format={{ maximumFractionDigits: 0 }} transformTiming={{ duration: 360, easing: "cubic-bezier(.16, 1, .3, 1)" }} spinTiming={{ duration: 360, easing: "cubic-bezier(.16, 1, .3, 1)" }} respectMotionPreference aria-hidden="true" /></span>;
}
