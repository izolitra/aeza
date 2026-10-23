"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/src/shared/lib/cn";

export type TabItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  ariaLabel: string;
}

export function Tabs({
  items,
  value,
  onValueChange,
  ariaLabel,
  className,
  ...props
}: TabsProps) {
  return (
    <div
      {...props}
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-[100px] bg-[rgb(31,31,31)] p-0.5",
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            disabled={item.disabled}
            onClick={() => onValueChange(item.value)}
            className={cn(
              "h-8 cursor-pointer rounded-[100px] px-4 py-2 text-xs font-bold leading-4 text-white transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              isActive
                ? "bg-[rgb(88,87,87)]"
                : "bg-transparent hover:bg-[#121212]"
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
