"use client";

import { forwardRef, InputHTMLAttributes, useId } from "react";
import { cn } from "@/src/shared/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: "sm" | "md" | "lg";
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
}

const sizeClasses: Record<NonNullable<InputProps["inputSize"]>, string> = {
  sm: "min-h-[56px] h-full px-0 pt-[26px] pb-2 text-lg leading-6",
  md: "min-h-[56px] h-full px-0 pt-[26px] pb-2 text-lg leading-6",
  lg: "min-h-[56px] h-full px-0 pt-[26px] pb-2 text-lg leading-6",
};

const labelPositionClasses: Record<
  NonNullable<InputProps["inputSize"]>,
  string
> = {
  sm: "left-0 right-0 top-[6px]",
  md: "left-0 right-0 top-[6px]",
  lg: "left-0 right-0 top-[6px]",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    containerClassName,
    inputSize = "md",
    label,
    helperText,
    error,
    id,
    disabled,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const describedBy = error
    ? `${inputId}-error`
    : helperText
      ? `${inputId}-helper`
      : undefined;

  return (
    <div className={cn("w-full", containerClassName)}>
      <div className="rounded-[16px] bg-[rgb(37,37,37)] px-4 py-0">
        <div className="relative">
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          placeholder=" "
          className={cn(
            "peer relative flex w-full flex-auto min-w-0 self-stretch box-border items-center gap-2 rounded-none border-0 border-none bg-none bg-[rgb(37,37,37)] m-0 text-[#bbbbbb] outline-none shadow-none transition-[border-color,background-color,color] duration-200 hover:text-[rgb(102,102,102)] [--ui-kit-input-background:#252525]",
            "placeholder:[font-family:inherit] placeholder:[font-style:inherit] placeholder:[font-variant:inherit] placeholder:[font-weight:inherit] placeholder:[font-stretch:inherit] placeholder:[line-height:inherit] placeholder:text-lg placeholder:text-ellipsis placeholder:text-inherit",
            label && "placeholder:text-transparent focus:placeholder:text-inherit",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "focus:shadow-[0_0_0_1px_var(--status-danger-border),0_0_0_2px_rgba(153,27,27,0.08)]",
            sizeClasses[inputSize],
            className
          )}
          {...props}
        />

        {label ? (
          <label
            htmlFor={inputId}
            className={cn(
              "pointer-events-none absolute z-10 left-0 right-0 origin-[0] translate-y-0 overflow-hidden whitespace-nowrap text-ellipsis bg-transparent px-0 text-xs leading-[1.5] text-[#666] transition-[top,transform,font-size,color] duration-200",
              labelPositionClasses[inputSize],
              "peer-[&:placeholder-shown:not(:focus)]:top-4 peer-[&:placeholder-shown:not(:focus)]:text-lg peer-[&:placeholder-shown:not(:focus)]:text-[#8a8a8f]",
            )}
          >
            {label}
          </label>
        ) : null}
        </div>
      </div>

      {error ? (
        <p
          id={`${inputId}-error`}
          className="pt-2 text-sm text-[var(--status-danger-fg)]"
        >
          {error}
        </p>
      ) : helperText ? (
        <p
          id={`${inputId}-helper`}
          className="pt-2 text-sm text-[var(--muted-foreground)]"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
