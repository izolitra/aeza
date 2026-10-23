"use client";

import {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";
import { motion } from "motion/react";
import { cn } from "@/src/shared/lib/cn";

export function Table({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn("w-full caption-bottom border-collapse text-sm", className)}
      {...props}
    />
  );
}

export function TableHeader({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("border-b border-[rgb(31_31_31)]", className)}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  );
}

export function TableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b border-[rgb(31_31_31)] transition-colors hover:bg-[color:var(--surface)]",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-4 py-2 text-left align-middle text-[20px] font-medium leading-normal tracking-[0.025em] text-[#626262]",
        "[&_button]:text-[#626262] [&_button]:transition-colors",
        "[&_button:hover]:text-white",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "px-4 py-2 align-middle text-[20px] font-medium leading-normal tracking-[0.025em] text-white",
        className
      )}
      {...props}
    />
  );
}

export function TableSortButton({
  children,
  active = false,
  direction = "desc",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  direction?: "asc" | "desc";
}) {
  return (
    <button
      type="button"
      className={cn(
        "group inline-flex items-center gap-2 text-left text-inherit transition-transform active:translate-y-px",
        active && "!text-white",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <TableSortIcon active={active} direction={direction} />
    </button>
  );
}

export function TableSortIcon({
  active,
  direction,
  className,
}: {
  active: boolean;
  direction: "asc" | "desc";
  className?: string;
}) {
  if (!active) return null;

  return (
    <motion.svg
      width="10"
      height="10"
      viewBox="0 0 4 6"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      initial={false}
      animate={{ rotate: direction === "asc" ? -90 : 90, opacity: 1 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={cn("shrink-0 text-white", className)}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.739405 0.253344C0.930642 0.0541385 1.24716 0.0476791 1.44636 0.238917L3.57064 2.27822C3.9806 2.67178 3.9806 3.32744 3.57064 3.721L1.44636 5.7603C1.24716 5.95154 0.930642 5.94508 0.739404 5.74588C0.548167 5.54667 0.554626 5.23015 0.753832 5.03892L2.50239 3.3603C2.70736 3.16352 2.70736 2.8357 2.50239 2.63892L0.753832 0.960304C0.554627 0.769066 0.548167 0.45255 0.739405 0.253344Z"
      />
    </motion.svg>
  );
}
