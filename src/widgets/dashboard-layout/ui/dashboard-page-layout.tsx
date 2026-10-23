import type { ReactNode } from "react";
import { cn } from "@/src/shared/lib/cn";

type DashboardPageLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  header?: ReactNode;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
};

export function DashboardPageLayout({
  children,
  title,
  description,
  header,
  className,
  contentClassName,
  titleClassName,
}: DashboardPageLayoutProps) {
  return (
    <section
      className={cn(
        "w-full overflow-visible rounded-[16px] bg-[color:var(--surface)] p-[clamp(16px,4vw,64px)]",
        className
      )}
    >
      <header>
        {header ?? (
          <div>
            {title ? (
              <h1
                className={cn(
                  titleClassName ??
                    "text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl"
                )}
              >
                {title}
              </h1>
            ) : null}
            {description ? (
              <p className="mt-3 text-base text-[color:var(--muted-foreground)]">
                {description}
              </p>
            ) : null}
          </div>
        )}
      </header>

      <div className={cn("", contentClassName)}>
        {children}
      </div>
    </section>
  );
}
