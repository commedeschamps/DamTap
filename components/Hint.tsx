"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import type { ReactElement } from "react";

export default function Hint({ label, children }: { label: string; children: ReactElement }) {
  return <Tooltip.Root><Tooltip.Trigger asChild>{children}</Tooltip.Trigger><Tooltip.Portal><Tooltip.Content className="control-tooltip" sideOffset={8} collisionPadding={12}>{label}<Tooltip.Arrow className="control-tooltip-arrow" /></Tooltip.Content></Tooltip.Portal></Tooltip.Root>;
}
