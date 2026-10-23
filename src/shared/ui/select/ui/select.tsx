"use client";

import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useOptionalI18n } from "@/src/shared/lib/i18n";
import { cn } from "@/src/shared/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  options: ReadonlyArray<SelectOption>;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
  selectSize?: "sm" | "md" | "lg";
  menuVariant?: "default" | "cards";

  emptyTitle?: string;
  emptyDescription?: string;

  name?: string;
  id?: string;
  "aria-label"?: string;
  renderOption?: (option: SelectOption, selected: boolean) => ReactNode;
}

function getInitialActiveIndex(
  options: ReadonlyArray<SelectOption>,
  value: string
): number | null {
  const selectedIndex = options.findIndex(
    (option) => option.value === value && !option.disabled
  );

  if (selectedIndex >= 0) {
    return selectedIndex;
  }

  const firstEnabledIndex = options.findIndex((option) => !option.disabled);
  return firstEnabledIndex >= 0 ? firstEnabledIndex : null;
}

const triggerSizeClasses: Record<
  NonNullable<SelectProps["selectSize"]>,
  string
> = {
  sm: "h-14 p-3 text-base leading-[1.5]",
  md: "h-14 p-3 text-base leading-[1.5]",
  lg: "h-14 p-3 text-base leading-[1.5]",
};

export function Select({
  value,
  onChange,
  options,
  placeholder,
  className,
  triggerClassName,
  disabled = false,
  selectSize = "md",
  menuVariant = "default",
  emptyTitle,
  emptyDescription,
  name,
  id,
  renderOption,
  ...props
}: SelectProps) {
  const i18n = useOptionalI18n();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const GAP = 6;

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const resolvedPlaceholder =
    placeholder ?? i18n?.dictionary.select.placeholder ?? "Select a value";
  const resolvedEmptyTitle =
    emptyTitle ?? i18n?.dictionary.select.emptyTitle ?? "Nothing found";
  const resolvedEmptyDescription =
    emptyDescription ??
    i18n?.dictionary.select.emptyDescription ??
    "Try changing the query or choosing another option.";

  const selectedOption =
    options.find((option) => option.value === value) ?? null;

  const initialActiveIndex = getInitialActiveIndex(options, value);

  function getScrollParents(node: Element | null): Array<Element | Window> {
    const parents: Array<Element | Window> = [];
    let current: Element | null = node;

    while (current && current !== document.body) {
      const styles = getComputedStyle(current);
      const overflow = `${styles.overflow}${styles.overflowY}${styles.overflowX}`;
      if (/(auto|scroll|overlay)/.test(overflow)) {
        parents.push(current);
      }
      current = current.parentElement;
    }

    parents.push(window);
    return parents;
  }

  const updatePosition = () => {
    const trigger = buttonRef.current;
    if (!trigger) return;

    const triggerRect = trigger.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    const top = triggerRect.bottom + scrollY + GAP - (menuVariant === "cards" ? 13 : 0);
    const menuWidth = listRef.current?.offsetWidth ?? (menuVariant === "cards" ? 168 : 180);
    const left = menuVariant === "cards"
      ? triggerRect.right - 16 - 12 - menuWidth / 2 + scrollX
      : triggerRect.left + scrollX;

    setPosition({
      top: Math.round(top),
      left: Math.round(left),
    });
  };

  const closeAndFocusTrigger = () => {
    setActiveIndex(null);
    setOpen(false);
    requestAnimationFrame(() => {
      buttonRef.current?.focus();
    });
  };

  const handleSelect = (nextValue: string) => {
    onChange({ target: { value: nextValue } });
    closeAndFocusTrigger();
  };

  const handleToggle = () => {
    if (disabled) return;

    updatePosition();
    setOpen((prev) => {
      const next = !prev;
      setActiveIndex(next ? initialActiveIndex : null);
      return next;
    });
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "ArrowDown" ||
      event.key === "ArrowUp"
    ) {
      event.preventDefault();
      updatePosition();
      setActiveIndex(initialActiveIndex);
      setOpen(true);
      requestAnimationFrame(() => {
        if (initialActiveIndex != null) {
          optionRefs.current[initialActiveIndex]?.focus({ preventScroll: true });
        }
      });
    }
  };

  const handleOptionKeyDown =
    (index: number, option: SelectOption) =>
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = Math.min(options.length - 1, index + 1);
        setActiveIndex(nextIndex);
        optionRefs.current[nextIndex]?.focus({ preventScroll: true });
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        const nextIndex = Math.max(0, index - 1);
        setActiveIndex(nextIndex);
        optionRefs.current[nextIndex]?.focus({ preventScroll: true });
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!option.disabled) {
          handleSelect(option.value);
        }
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeAndFocusTrigger();
      }
    };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!rootRef.current) return;

      const clickedInsideTrigger = rootRef.current.contains(target);
      const clickedInsideDropdown = listRef.current?.contains(target);

      if (!clickedInsideTrigger && !clickedInsideDropdown) {
        setActiveIndex(null);
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(() => {
      updatePosition();
    });

    const scrollParents = getScrollParents(buttonRef.current);
    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    scrollParents.forEach((parent) => {
      parent.addEventListener("scroll", handleScroll as EventListener, {
        passive: true,
      });
    });

    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(frame);
      scrollParents.forEach((parent) => {
        parent.removeEventListener("scroll", handleScroll as EventListener);
      });
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(() => {
      updatePosition();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [open, options.length]);

  const dropdownAnimation = {
    initial: { opacity: 0, scale: 0.98, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98, y: 8 },
    origin: "center top",
  };

  const dropdown =
    typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            {open ? (
              <motion.div
                ref={listRef}
                role="listbox"
                aria-label={props["aria-label"] ?? resolvedPlaceholder}
                initial={{
                  ...dropdownAnimation.initial,
                  x: position.left,
                  y: position.top + 8,
                }}
                animate={{
                  ...dropdownAnimation.animate,
                  x: position.left,
                  y: position.top,
                }}
                exit={{
                  ...dropdownAnimation.exit,
                  x: position.left,
                  y: position.top + 8,
                }}
                transition={{
                  duration: 0.18,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "max-content",
                  minWidth: menuVariant === "cards" ? 168 : 180,
                  maxWidth: menuVariant === "cards" ? 220 : 300,
                  maxHeight: menuVariant === "cards" ? 200 : undefined,
                  zIndex: menuVariant === "cards" ? 1002 : 1000,
                  transformOrigin: dropdownAnimation.origin,
                }}
                className={cn(
                  "flex max-h-full flex-col overflow-hidden [list-style:none]",
                  menuVariant === "cards"
                    ? "rounded-2xl border border-[rgb(31,31,31)] bg-[rgb(26,26,26)] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.28)]"
                    : "rounded-xl border border-[rgb(51,51,51)] bg-[rgb(18,18,18)] shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
                )}
              >
                <div className={cn("overflow-auto", menuVariant === "cards" ? "max-h-[200px]" : "max-h-60")}>
                  {options.length === 0 ? (
                    <div className="px-4 py-6">
                      <div className="flex min-h-[136px] flex-col items-center justify-center gap-2 text-center">
                        <div className="text-base font-medium text-white">
                          {resolvedEmptyTitle}
                        </div>

                        <div className="max-w-[26rem] text-base text-[color:var(--muted-foreground)]">
                          {resolvedEmptyDescription}
                        </div>

                      </div>
                    </div>
                  ) : (
                    options.map((option, index) => {
                      const isSelected = option.value === value;
                      const isDisabled = !!option.disabled;

                      return (
                        <button
                          key={option.value}
                          ref={(element) => {
                            optionRefs.current[index] = element;
                          }}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          disabled={isDisabled}
                          onClick={() => {
                            if (!isDisabled) {
                              handleSelect(option.value);
                            }
                          }}
                          onKeyDown={handleOptionKeyDown(index, option)}
                          className={cn(
                            "group flex w-full items-center text-left text-base text-white transition-[transform,background,color] duration-200 ease-in-out focus:outline-none",
                            menuVariant === "cards"
                              ? "min-h-10 rounded-xl bg-transparent p-2 [transform:none] focus:bg-[#333333] hover:bg-[#333333]"
                              : "bg-[rgb(18,18,18)] px-4 py-1.5",
                            isDisabled
                              ? "pointer-events-none cursor-not-allowed opacity-50 text-[rgba(255,255,255,0.45)]"
                              : "pointer-events-auto cursor-pointer",
                            menuVariant === "default" && index === 0 && "pt-3",
                            menuVariant === "default" && index === options.length - 1 && "pb-3",
                            isSelected && (menuVariant === "cards"
                              ? "!bg-[#333333] !text-white"
                              : "!bg-[#FAFAFA] !text-[#09090B]")
                          )}
                        >
                          <span className={cn(
                            "flex w-full origin-left items-center gap-2 truncate transition-transform duration-200 ease-in-out",
                            menuVariant === "default" && "justify-between group-hover:scale-[1.05]"
                          )}>
                            {menuVariant === "cards" ? (
                              <SelectedCheckIcon active={isSelected} />
                            ) : null}
                            <span className="min-w-0 truncate">
                              {renderOption
                                ? renderOption(option, isSelected)
                                : option.label}
                            </span>
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      {name ? <input type="hidden" name={name} value={value} /> : null}

      <button
        ref={buttonRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={
          props["aria-label"] ??
          (selectedOption ? selectedOption.label : resolvedPlaceholder)
        }
        onClick={handleToggle}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          menuVariant === "cards"
            ? "relative block h-full min-h-[66px] w-full rounded-2xl bg-[rgb(26,26,26)] p-4 text-left text-white outline-none [outline-offset:-1px] transition-[background-color,color,opacity] duration-200"
            : "flex w-full items-center justify-between gap-2 rounded-xl border-0 bg-[#1f1f1f] p-3 text-white transition-colors",
          "font-medium [font-family:inherit] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          menuVariant === "default" && "hover:bg-[rgba(255,255,255,0.06)]",
          menuVariant === "default" && triggerSizeClasses[selectSize],
          menuVariant === "default" && open && "bg-[rgba(255,255,255,0.06)]",
          triggerClassName
        )}
      >
        {menuVariant === "cards" ? (
          <span className="grid w-full grid-rows-[auto_auto] gap-2">
            <span className="flex w-full items-start justify-between">
              {selectedOption?.icon ? <span>{selectedOption.icon}</span> : <span />}
              {selectedOption ? <SelectedCheckIcon absolute /> : null}
            </span>
            <span className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-left text-base leading-6 text-inherit [user-select:none]">
              <span className="flex min-w-0 flex-col">
                <span className="truncate">
                  {selectedOption?.label ?? resolvedPlaceholder}
                </span>
                {selectedOption?.description ? (
                  <span className="block min-w-0 max-w-full flex-[1_1_auto] overflow-hidden whitespace-normal break-normal [overflow-wrap:anywhere] text-base leading-6 text-white">
                    {selectedOption.description}
                  </span>
                ) : null}
              </span>
              <ChevronDownIcon
                className={cn("h-6 w-6 shrink-0 text-white", open && "[&>svg]:rotate-180")}
              />
            </span>
          </span>
        ) : (
          <>
            <span className="truncate text-left text-white">
              {selectedOption ? selectedOption.label : resolvedPlaceholder}
            </span>
            <ChevronDownIcon
              className={cn("h-4 w-4 shrink-0 text-white", open && "[&>svg]:rotate-180")}
            />
          </>
        )}
      </button>

      {dropdown}
    </div>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center", className)} aria-hidden="true">
      <svg className="h-full w-full origin-center transition-transform duration-200" width="16" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.8536 6.74801C13.0488 6.94327 13.0488 7.25985 12.8536 7.45512L9.20711 11.1016C8.81658 11.4921 8.18342 11.4921 7.79289 11.1016L4.14645 7.45512C3.95118 7.25985 3.95118 6.94327 4.14645 6.74801C4.34171 6.55275 4.65829 6.55275 4.85355 6.74801L8.14645 10.0409C8.34171 10.2362 8.65829 10.2362 8.85355 10.0409L12.1464 6.74801C12.3417 6.55275 12.6583 6.55275 12.8536 6.74801Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

function SelectedCheckIcon({
  active = true,
  absolute = false,
}: {
  active?: boolean;
  absolute?: boolean;
}) {
  return (
    <span className={cn(
      "inline-flex h-6 w-6 shrink-0 items-center justify-center [transform:none]",
      active ? "text-[rgb(22,185,207)]" : "text-[#4D4D4D]",
      absolute && "absolute right-4 top-4"
    )} aria-hidden="true">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="16" height="16" rx="8" fill="currentColor" />
        {active ? (
          <path
            d="M5.15527 8.56852L6.86194 10.2752L10.8442 6.29297"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
      </svg>
    </span>
  );
}
