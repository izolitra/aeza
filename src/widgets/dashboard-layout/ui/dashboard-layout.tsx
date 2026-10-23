"use client";

import type { ComponentType, ReactNode } from "react";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  dashboardNavigation,
  type DashboardNavItem,
} from "@/src/features/dashboard-navigation";
import { useAuth } from "@/src/features/auth/model/use-auth";
import type { Locale } from "@/src/shared/config";
import { cn } from "@/src/shared/lib/cn";
import { getSiteCopy, useI18n, withLocalePath } from "@/src/shared/lib/i18n";
import { ConsolePage } from "@/src/shared/ui";
import { DashboardSidebarLanguageSwitch } from "@/src/shared/ui/lang-switch";
import {
  ActivityIcon,
  GridIcon,
  HomeIcon,
  MenuIcon,
  ServerIcon,
  SettingsIcon,
  ShieldIcon,
  TerminalIcon,
  UserIcon,
} from "../icons";

type DashboardLayoutProps = {
  locale: Locale;
  children: ReactNode;
};

type NavItem = DashboardNavItem & {
  icon?: ComponentType<{ className?: string }>;
};

type DashboardSidebarProps = {
  locale: Locale;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

const SIDEBAR_CONTENT_WIDTH = 230;
const SIDEBAR_EXPANDED_WIDTH = SIDEBAR_CONTENT_WIDTH + 24 + 12;
const BOTTOM_SWITCH_WIDTH = 78;

export function DashboardLayout({ locale, children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dictionary } = useI18n();

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="flex min-h-screen">
        <div
          style={{ width: SIDEBAR_EXPANDED_WIDTH }}
          className="hidden shrink-0 lg:block"
          aria-hidden="true"
        />

        <DashboardSidebar
          locale={locale}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <main className="relative min-h-screen min-w-0 flex-1 overflow-y-auto">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label={dictionary.navigation.expandSidebar}
            className="fixed left-4 top-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-elevated)] text-[color:var(--foreground)] shadow-[0_10px_30px_rgba(0,0,0,0.25)] lg:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <DashboardPageContainer>{children}</DashboardPageContainer>
        </main>
      </div>
    </div>
  );
}

export function DashboardSidebar({
  locale,
  mobileOpen,
  onCloseMobile,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { dictionary } = useI18n();
  const uiCopy = getSiteCopy(locale);
  const { user } = useAuth();

  const items = useMemo<NavItem[]>(
    () =>
      dashboardNavigation.map((item) => ({
        ...item,
        icon: getSidebarIcon(item),
      })),
    []
  );

  const username = getSidebarUsername(user);

  return (
    <>
      <motion.div
        initial={false}
        animate={{ opacity: mobileOpen ? 1 : 0 }}
        transition={{ duration: 0.18 }}
        onClick={onCloseMobile}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      />

      <aside
        style={{ width: SIDEBAR_EXPANDED_WIDTH }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 h-screen bg-[color:var(--background)] lg:z-40",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden py-6 pl-6 pr-3">
          <div
            className="mb-8 h-[107px] w-[230px] shrink-0 overflow-hidden rounded-[24px] border border-[#282828]"
            title={`@${username}`}
          >
            <div className="grid h-full grid-rows-[49px_56px]">
              <div className="flex min-w-0 items-center justify-between border-b border-[#282828] p-3">
                <span className="truncate text-lg font-normal italic leading-6 text-[#FFFFFF]">
                  @{username}
                </span>
                <span className="shrink-0 text-[#FFFFFF]">
                  <NotificationIcon />
                </span>
              </div>

              <div className="flex min-w-0 items-center justify-between p-3">
                <div className="min-w-0 max-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-bold leading-8 text-[#FFFFFF]">
                  ₽ 99.99
                </div>

                <button
                  type="button"
                  className="shrink-0 -skew-x-[10deg] rounded-[4px] bg-[color:var(--balance-action-bg)] px-2 py-0.5 text-xl font-semibold italic leading-7 text-[#FFFFFF]"
                  aria-label="Пополнить баланс"
                >
                  б+
                </button>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <nav>
              {items.map((item) => {
                const href = withLocalePath(locale, item.href);
                const matchPaths =
                  item.matchPaths && item.matchPaths.length > 0
                    ? item.matchPaths
                    : [item.href];
                const isActive = matchPaths.some((path) => {
                  const localizedPath = withLocalePath(locale, path);
                  return (
                    pathname === localizedPath ||
                    pathname.startsWith(`${localizedPath}/`)
                  );
                });
                const Icon = item.icon;
                const navItem =
                  (
                    dictionary.navigation as Record<
                      string,
                      { label?: string; description?: string } | undefined
                    >
                  )[item.key] ?? {};
                const fallbackLabel =
                  uiCopy.navigation[
                    item.key as keyof typeof uiCopy.navigation
                  ] ?? item.fallbackLabel;

                return (
                  <SidebarNavItem
                    key={item.href}
                    href={href}
                    label={navItem.label ?? fallbackLabel}
                    Icon={Icon}
                    isActive={isActive}
                    onClick={onCloseMobile}
                  />
                );
              })}
            </nav>
          </div>

          <div className="mt-4 shrink-0">
            <div
              className="mx-auto overflow-visible"
              style={{ width: `${BOTTOM_SWITCH_WIDTH}px` }}
            >
              <DashboardSidebarLanguageSwitch
                locale={locale}
                collapsed={false}
                onClick={onCloseMobile}
              />
            </div>

            <div className="mb-[30px] mt-4">
              <SidebarNavItem
                href={withLocalePath(locale, "/profile")}
                label={locale === "ru" ? "Настройки" : "Settings"}
                Icon={SettingsIcon}
                isActive={
                  pathname === withLocalePath(locale, "/profile") ||
                  pathname.startsWith(`${withLocalePath(locale, "/profile")}/`)
                }
                onClick={onCloseMobile}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl border border-[color:var(--button-secondary-border)] bg-[color:var(--button-secondary-bg)] px-4 text-sm font-medium text-[color:var(--button-secondary-fg)] transition-colors hover:bg-[color:var(--button-secondary-bg-hover)] lg:hidden"
          >
            {dictionary.common.close}
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarNavItem({
  href,
  label,
  Icon,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  Icon?: ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group block h-12 w-[230px] rounded-[16px] p-3 text-[#BBBBBB] transition-colors duration-200",
        isActive
          ? "bg-[#FFFFFF1A] text-[#FFFFFF]"
          : "bg-transparent hover:bg-[#FFFFFF26] hover:text-[#FFFFFF]"
      )}
    >
      <div className="flex h-6 items-center justify-between gap-3">
        <div className="min-w-0 overflow-hidden">
          <div className="max-w-[180px] overflow-hidden whitespace-nowrap">
            <span className="block truncate text-base font-medium leading-5 text-current transition-colors duration-200 first-letter:uppercase">
              {label}
            </span>
          </div>
        </div>

        <div className="flex h-6 w-6 shrink-0 items-center justify-center">
          {Icon ? (
            <Icon
              className={cn(
                "h-6 w-6 shrink-0 transition-colors duration-200",
                isActive
                  ? "text-current"
                  : "text-[#616161] group-hover:text-[#FFFFFF]"
              )}
            />
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export function DashboardPageContainer({ children }: { children: ReactNode }) {
  return <ConsolePage>{children}</ConsolePage>;
}

export function PageHeader({
  title,
  description,
  action,
  breadcrumbs,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}) {
  const { locale } = useI18n();
  const uiCopy = getSiteCopy(locale);

  return (
    <header className="space-y-4">
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav aria-label={uiCopy.navigation.breadcrumb}>
          <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-[color:var(--muted-foreground)]">
            {breadcrumbs.map((item, index) => (
              <li
                key={`${item.label}-${index}`}
                className="flex items-center gap-2"
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-[color:var(--foreground)]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[color:var(--foreground)]">
                    {item.label}
                  </span>
                )}

                {index < breadcrumbs.length - 1 ? (
                  <span className="text-[color:var(--border-strong)]">/</span>
                ) : null}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl space-y-2">
          <h1 className="text-[28px] font-semibold tracking-tight text-[color:var(--foreground)]">
            {title}
          </h1>

          {description ? (
            <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
              {description}
            </p>
          ) : null}
        </div>

        {action ? (
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            {action}
          </div>
        ) : null}
      </div>
    </header>
  );
}

export function Section({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "min-w-0 border-t border-[color:var(--border)] py-5",
        className
      )}
    >
      {children}
    </section>
  );
}

function NotificationIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <path
        d="M17 9H17.75V9H17ZM12 4V4.75C14.3472 4.75 16.25 6.65279 16.25 9H17H17.75C17.75 5.82436 15.1756 3.25 12 3.25V4ZM17 9H16.25V11.76H17H17.75V9H17ZM18.1752 13.9365L17.6318 14.4535C18.0156 14.8568 18.25 15.3998 18.25 16H19H19.75C19.75 14.9995 19.3568 14.0903 18.7185 13.4195L18.1752 13.9365ZM18 17V16.25H6V17V17.75H18V17ZM5 16H5.75C5.75 15.3998 5.98436 14.8568 6.36817 14.4535L5.82484 13.9365L5.2815 13.4195C4.64319 14.0903 4.25 14.9995 4.25 16H5ZM7 11.76H7.75V9H7H6.25V11.76H7ZM7 9H7.75C7.75 6.65279 9.65279 4.75 12 4.75V4V3.25C8.82436 3.25 6.25 5.82436 6.25 9H7ZM6 17V16.25C5.86193 16.25 5.75 16.1381 5.75 16H5H4.25C4.25 16.9665 5.0335 17.75 6 17.75V17ZM19 16H18.25C18.25 16.1381 18.1381 16.25 18 16.25V17V17.75C18.9665 17.75 19.75 16.9665 19.75 16H19ZM5.82484 13.9365L6.36817 14.4535C6.93465 13.8581 7.75 12.942 7.75 11.76H7H6.25C6.25 12.2727 5.88327 12.787 5.2815 13.4195L5.82484 13.9365ZM17 11.76H16.25C16.25 12.942 17.0654 13.8581 17.6318 14.4535L18.1752 13.9365L18.7185 13.4195C18.1167 12.787 17.75 12.2727 17.75 11.76H17Z"
        fill="currentColor"
      />
      <path
        d="M13.7976 19.8767C13.6312 20.2179 13.3712 20.5046 13.048 20.7035C12.7247 20.9023 12.3516 21.0051 11.9721 20.9998C11.5926 20.9945 11.2224 20.8813 10.9049 20.6735C10.5873 20.4657 10.3354 20.1718 10.1786 19.8262"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3V4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getSidebarIcon(item: Pick<NavItem, "key">) {
  switch (item.key) {
    case "overview":
      return HomeIcon;
    case "infrastructure":
      return ServerIcon;
    case "security":
      return ShieldIcon;
    case "operations":
      return TerminalIcon;
    case "integrations":
      return GridIcon;
    case "audit":
      return ActivityIcon;
    case "profile":
      return UserIcon;
    default:
      return undefined;
  }
}

function getSidebarUsername(
  user:
    | {
        username?: string | null;
        login?: string | null;
        displayName?: string | null;
        email?: string | null;
      }
    | null
    | undefined
) {
  const rawValue =
    user?.username ??
    user?.login ??
    user?.displayName ??
    user?.email?.split("@")[0] ??
    "admin";

  return rawValue.trim().replace(/^@+/, "").replace(/\s+/g, "").toLowerCase();
}
