import { HTMLAttributes } from "react";
import { cn } from "@/src/shared/lib/cn";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger";
}

const variantDotClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-[#a3a3a3]",
  success: "bg-[#22c55e]",
  warning: "bg-[#f59e0b]",
  danger: "bg-[#ef4444]",
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[20px] font-medium leading-normal text-white",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn("h-[9px] w-[9px] shrink-0 rounded-full", variantDotClasses[variant])}
      />
      <span>{children}</span>
    </span>
  );
}

