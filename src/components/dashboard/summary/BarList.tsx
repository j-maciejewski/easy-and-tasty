import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { formatNumber } from "./utils";

export type BarListItem = {
  key: string | number;
  label: string;
  value: number;
  href?: string;
  detail?: string;
};

export const BarList = ({
  title,
  description,
  emptyText,
  items,
}: {
  title: string;
  description?: string;
  emptyText: string;
  items: BarListItem[];
}) => {
  const maxValue = Math.max(1, ...items.map((item) => item.value));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="text-sm">
        {items.length === 0 ? (
          <p className="text-muted-foreground">{emptyText}</p>
        ) : (
          <ol className="space-y-3">
            {items.map((item) => (
              <li key={item.key} className="space-y-1.5">
                <div className="flex items-baseline gap-2">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="min-w-0 flex-1 truncate font-medium hover:underline"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {item.label}
                    </span>
                  )}
                  <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                    {item.detail ?? formatNumber(item.value)}
                  </span>
                </div>
                <div className="bg-muted h-1 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-[oklch(0.7_0.14_205)] dark:bg-[oklch(0.76_0.12_210)]"
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
};
