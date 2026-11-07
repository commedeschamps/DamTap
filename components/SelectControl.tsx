"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import type { ReactNode } from "react";

type Option = { value: string; label: string; description?: string };
type Props = {
  value: string;
  onValueChange: (value: string) => void;
  options: readonly Option[];
  label: string;
  id?: string;
  icon?: ReactNode;
  className?: string;
};
const emptyValue = "__damtap_all__";

export default function SelectControl({ value, onValueChange, options, label, id, icon, className = "" }: Props) {
  const selected = options.find(option => option.value === value);
  return <Select.Root value={value || emptyValue} onValueChange={next => onValueChange(next === emptyValue ? "" : next)}>
    <Select.Trigger id={id} className={`select-trigger ${className}`} aria-label={label}>
      {icon && <span className="select-leading-icon" aria-hidden="true">{icon}</span>}
      <Select.Value className="select-value">{selected?.label ?? label}</Select.Value>
      <Select.Icon className="select-chevron"><ChevronDown size={16} /></Select.Icon>
    </Select.Trigger>
    <Select.Portal><Select.Content className="select-popover" position="popper" sideOffset={6} collisionPadding={12}>
      <Select.ScrollUpButton className="select-scroll"><ChevronUp size={16} /></Select.ScrollUpButton>
      <Select.Viewport className="select-viewport"><Select.Group><Select.Label className="select-group-label">{label}</Select.Label>
        {options.map(option => <Select.Item key={option.value} value={option.value || emptyValue} className="select-option" textValue={option.label}>
          <span className="select-option-copy"><Select.ItemText>{option.label}</Select.ItemText>{option.description && <small>{option.description}</small>}</span>
          <Select.ItemIndicator className="select-check"><Check size={16} /></Select.ItemIndicator>
        </Select.Item>)}
      </Select.Group></Select.Viewport>
      <Select.ScrollDownButton className="select-scroll"><ChevronDown size={16} /></Select.ScrollDownButton>
    </Select.Content></Select.Portal>
  </Select.Root>;
}
