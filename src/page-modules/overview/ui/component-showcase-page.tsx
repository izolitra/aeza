"use client";

import { type ReactNode, useState } from "react";
import { useI18n } from "@/src/shared/lib/i18n";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  FormControl,
  FormError,
  FormField,
  Input,
  Select,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSortButton,
  Tabs,
  useToast,
} from "@/src/shared/ui";
import { DateTimePicker } from "@/src/shared/ui/date-picker";
import { DashboardPageLayout } from "@/src/widgets/dashboard-layout";

const selectOptions = [
  { value: "development", label: "Development" },
  { value: "staging", label: "Staging" },
  { value: "production", label: "Production" },
] as const;

const cardSelectOptions = [
  {
    value: "windows",
    label: "Windows 11",
    icon: <WindowsIcon />,
  },
  {
    value: "ubuntu",
    label: "Ubuntu 26.04",
    description: "General purpose server",
  },
  {
    value: "debian",
    label: "Debian 13",
    description: "Stable and lightweight",
  },
  {
    value: "alpine",
    label: "Alpine Linux",
    description: "Small container image",
  },
] as const;

export function ComponentShowcasePage() {
  const { locale } = useI18n();
  const { showToast } = useToast();
  const isRussian = locale === "ru";
  const [search, setSearch] = useState("");
  const [environment, setEnvironment] = useState("staging");
  const [cardEnvironment, setCardEnvironment] = useState("windows");
  const [enabled, setEnabled] = useState(true);
  const [dateTime, setDateTime] = useState("2026-09-28T12:30");
  const [sortColumn, setSortColumn] = useState<"component" | "type" | "status" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab] = useState("overview");
  const showcaseRows: Array<[string, string, string]> = [
    ["Button", "Action", "Ready"],
    ["Select", "Form", "Interactive"],
    ["Toast", "Feedback", "Ready"],
  ];

  const copy = isRussian
    ? {
        title: "панель",
        subtitle: "Showcase компонентов интерфейса",
        actions: "Кнопки",
        tabs: "Вкладки",
        tabsLabel: "Раздел showcase",
        statuses: "Статусы и загрузка",
        fields: "Поля и элементы форм",
        feedback: "Состояния и уведомления",
        data: "Таблица",
        normalInput: "новый api-ключ",
        inputHint: "Подсказка под полем",
        errorInput: "Поле с ошибкой",
        inputError: "Пример сообщения об ошибке",
        search: "Поиск компонентов",
        environment: "Окружение",
        cardSelect: "Карточный dropdown",
        switch: "Mock-режим включён",
        date: "Дата и время",
        emptyTitle: "Здесь пока ничего нет",
        emptyDescription: "EmptyState показывает пустое состояние и действие.",
        emptyAction: "Добавить запись",
        toast: "Показать toast",
        toastTitle: "Компонент работает",
        toastDescription: "Это локальное демонстрационное уведомление.",
        formLabel: "Значение",
        formControlPlaceholder: "Введите значение",
        formError: "FormError: демонстрационная ошибка формы",
      }
    : {
        title: "Dashboard",
        subtitle: "Interface component showcase",
        actions: "Buttons",
        tabs: "Tabs",
        tabsLabel: "Showcase section",
        statuses: "Statuses and loading",
        fields: "Fields and form controls",
        feedback: "States and notifications",
        data: "Table",
        normalInput: "Default input",
        inputHint: "Helper text below the field",
        errorInput: "Input with error",
        inputError: "Example validation error",
        search: "Search components",
        environment: "Environment",
        cardSelect: "Card dropdown",
        switch: "Mock mode enabled",
        date: "Date and time",
        emptyTitle: "Nothing here yet",
        emptyDescription: "EmptyState presents an empty result and an action.",
        emptyAction: "Add record",
        toast: "Show toast",
        toastTitle: "Component works",
        toastDescription: "This is a local demonstration notification.",
        formLabel: "Value",
        formControlPlaceholder: "Enter a value",
        formError: "FormError: demonstration form error",
      };

  return (
    <DashboardPageLayout
      title={copy.title}
      description={copy.subtitle}
      titleClassName="inline-block -skew-x-[10deg] text-left text-[67px] font-bold leading-[1.2] text-white lowercase opacity-20"
    >
      <div className="divide-y divide-[color:var(--border)]">
        <ShowcaseSection title={copy.actions} componentName="Button">
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
          </div>
        </ShowcaseSection>

        <ShowcaseSection title={copy.tabs} componentName="Tabs">
          <Tabs
            items={[
              { value: "overview", label: isRussian ? "Обзор" : "Overview" },
              { value: "activity", label: isRussian ? "Активность" : "Activity" },
              { value: "settings", label: isRussian ? "Настройки" : "Settings" },
            ]}
            value={activeTab}
            onValueChange={setActiveTab}
            ariaLabel={copy.tabsLabel}
          />
        </ShowcaseSection>

        <ShowcaseSection title={copy.statuses} componentName="Badge · Spinner">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
            </div>
            <div className="flex items-center gap-8">
              <LabeledPreview label="sm">
                <Spinner size="sm" />
              </LabeledPreview>
              <LabeledPreview label="md">
                <Spinner size="md" />
              </LabeledPreview>
              <LabeledPreview label="lg">
                <Spinner size="lg" />
              </LabeledPreview>
            </div>
          </div>
        </ShowcaseSection>

        <ShowcaseSection
          title={copy.fields}
          componentName="Input · Select · Switch · DateTimePicker · FormField"
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <Input
              label={copy.normalInput}
              helperText={copy.inputHint}
              defaultValue="Mock value"
            />
            <Input
              label={copy.errorInput}
              error={copy.inputError}
              defaultValue="Invalid value"
            />

            <FormField>
              <FormControl>
                <Input
                  id="showcase-control"
                  label={copy.formLabel}
                  placeholder={copy.formControlPlaceholder}
                />
              </FormControl>
              <FormError message={copy.formError} />
            </FormField>

            <div className="space-y-2">
              <Select
                value={environment}
                onChange={(event) => setEnvironment(event.target.value)}
                options={selectOptions}
                placeholder={copy.environment}
                aria-label={copy.environment}
              />
            </div>

            <div className="space-y-2">
              <PreviewLabel>{copy.cardSelect}</PreviewLabel>
              <Select
                value={cardEnvironment}
                onChange={(event) => setCardEnvironment(event.target.value)}
                options={cardSelectOptions}
                placeholder={copy.environment}
                aria-label={copy.cardSelect}
                menuVariant="cards"
              />
            </div>

            <div className="flex min-h-20 items-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-5">
              <Switch
                checked={enabled}
                onCheckedChange={setEnabled}
                switchLabel={copy.switch}
              />
            </div>

            <DateTimePicker
              label={copy.date}
              value={dateTime}
              onChange={setDateTime}
              helperText={dateTime || "—"}
              containerClassName="lg:col-span-2"
            />
          </div>
        </ShowcaseSection>

        <ShowcaseSection
          title={copy.feedback}
          componentName="EmptyState · ToastProvider"
        >
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
            <EmptyState
              title={copy.emptyTitle}
              description={copy.emptyDescription}
              action={<Button variant="secondary">{copy.emptyAction}</Button>}
            />
            <Button
              onClick={() =>
                showToast({
                  title: copy.toastTitle,
                  description: copy.toastDescription,
                  variant: "success",
                })
              }
            >
              {copy.toast}
            </Button>
          </div>
        </ShowcaseSection>

        <ShowcaseSection
          title={copy.data}
          componentName="Table · TableSortButton"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <TableSortButton
                      active={sortColumn === "component"}
                      direction={sortDirection}
                      className={sortColumn === "component" ? "text-white" : undefined}
                      onClick={() => cycleSort("component", sortColumn, sortDirection, setSortColumn, setSortDirection)}
                    >
                      Component
                    </TableSortButton>
                  </TableHead>
                  <TableHead>
                    <TableSortButton
                      active={sortColumn === "type"}
                      direction={sortDirection}
                      className={sortColumn === "type" ? "text-white" : undefined}
                      onClick={() => cycleSort("type", sortColumn, sortDirection, setSortColumn, setSortDirection)}
                    >Type</TableSortButton>
                  </TableHead>
                  <TableHead>
                    <TableSortButton
                      active={sortColumn === "status"}
                      direction={sortDirection}
                      className={sortColumn === "status" ? "text-white" : undefined}
                      onClick={() => cycleSort("status", sortColumn, sortDirection, setSortColumn, setSortDirection)}
                    >Status</TableSortButton>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {showcaseRows.slice().sort((left, right) => {
                    if (!sortColumn) return 0;
                    const index = { component: 0, type: 1, status: 2 }[sortColumn];
                    const comparison = left[index].localeCompare(right[index]);
                    return sortDirection === "asc" ? comparison : -comparison;
                  })
                  .map(([name, type, status]) => (
                    <TableRow key={name}>
                      <TableCell className="font-medium text-[color:var(--foreground)]">
                        {name}
                      </TableCell>
                      <TableCell className="text-[color:var(--muted-foreground)]">
                        {type}
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">{status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </ShowcaseSection>

        <ShowcaseSection
          title="Card · ConsolePage"
          componentName="Layout primitives"
        >
          <Card className="rounded-2xl p-6">
            <p className="text-base text-[color:var(--muted-foreground)]">
              Card shown inside the dashboard&apos;s existing ConsolePage
              container.
            </p>
          </Card>
        </ShowcaseSection>
      </div>
    </DashboardPageLayout>
  );
}

function cycleSort(
  column: "component" | "type" | "status",
  currentColumn: "component" | "type" | "status" | null,
  currentDirection: "asc" | "desc",
  setColumn: (column: "component" | "type" | "status" | null) => void,
  setDirection: (direction: "asc" | "desc") => void
) {
  if (currentColumn !== column) {
    setColumn(column);
    setDirection("asc");
  } else if (currentDirection === "asc") {
    setDirection("desc");
  } else {
    setColumn(null);
    setDirection("asc");
  }
}

function ShowcaseSection({
  title,
  componentName,
  children,
}: {
  title: string;
  componentName: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-6 py-8 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-10">
      <div>
        <h2 className="text-xl font-medium text-[color:var(--foreground)]">
          {title}
        </h2>
        <p className="mt-2 font-mono text-xs leading-5 text-[color:var(--muted-foreground)]">
          {componentName}
        </p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function PreviewLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm font-medium text-[color:var(--muted-foreground)]">
      {children}
    </p>
  );
}

function LabeledPreview({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      {children}
      <PreviewLabel>{label}</PreviewLabel>
    </div>
  );
}

function WindowsIcon() {
  return (
    <span className="inline-flex h-6 w-6 flex-[0_0_auto] items-center justify-center">
      <svg
        width="24"
        height="24"
        viewBox="0 0 4875 4875"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="#0078D4"
          d="M0 0h2311v2310H0zm2564 0h2311v2310H2564zM0 2564h2311v2311H0zm2564 0h2311v2311H2564z"
        />
      </svg>
    </span>
  );
}
