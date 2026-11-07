"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { MotionConfig } from "motion/react";
import { layoutTransition } from "@/lib/motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Toaster } from "sonner";
import { Check, X } from "lucide-react";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <NuqsAdapter><MotionConfig reducedMotion="user" transition={layoutTransition}><Tooltip.Provider delayDuration={400} skipDelayDuration={150}>{children}<Toaster theme="light" position="bottom-right" duration={5000} visibleToasts={3} closeButton offset={24} mobileOffset={{ bottom: "calc(6.5rem + env(safe-area-inset-bottom))", left: 16, right: 16 }} containerAriaLabel="Уведомления" icons={{ success: <Check size={18} />, close: <X size={16} /> }} toastOptions={{ unstyled: true, closeButtonAriaLabel: "Закрыть уведомление", classNames: { toast: "damtap-toast", title: "toast-title", description: "toast-description", actionButton: "toast-action", closeButton: "toast-close", content: "toast-content", icon: "toast-icon" } }} /></Tooltip.Provider></MotionConfig></NuqsAdapter>;
}
