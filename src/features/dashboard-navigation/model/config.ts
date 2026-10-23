export type DashboardNavItemKey =
  | "overview"
  | "infrastructure"
  | "security"
  | "operations"
  | "integrations"
  | "audit"
  | "profile";

export type DashboardNavItem = {
  key: DashboardNavItemKey;
  href: string;
  fallbackLabel: string;
  matchPaths?: string[];
};

export const dashboardNavigation: DashboardNavItem[] = [
  {
    key: "overview",
    href: "/overview",
    fallbackLabel: "Overview",
  },
  {
    key: "profile",
    href: "/profile",
    fallbackLabel: "Profile",
  },
] as const;
