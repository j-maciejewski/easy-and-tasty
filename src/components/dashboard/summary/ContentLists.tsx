import { ChartNoAxesColumn } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

import { formatDateTime, formatNumber } from "./utils";

type TopContentItem = {
  id: number;
  title: string;
  href: string;
  statsHref?: string;
  views: number;
};

type ActivityItem = {
  id: number;
  title: string;
  href: string;
  author: string;
  date: Date | string;
  text?: string;
};

export const TopContentList = ({
  title,
  items,
}: {
  title: string;
  items: TopContentItem[];
}) => {
  const maxViews = Math.max(1, ...items.map((item) => item.views));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {items.length === 0 ? (
          <p className="text-muted-foreground">No views in the last 30 days.</p>
        ) : (
          <ol className="space-y-3">
            {items.map((item, idx) => (
              <li key={item.id} className="space-y-1.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-muted-foreground w-4 shrink-0 text-xs tabular-nums">
                    {idx + 1}
                  </span>
                  <Link
                    href={item.href}
                    className="min-w-0 flex-1 truncate font-medium hover:underline"
                  >
                    {item.title}
                  </Link>
                  <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                    {formatNumber(item.views)}
                  </span>
                  {item.statsHref && (
                    <Link
                      href={item.statsHref}
                      aria-label={`Stats for ${item.title}`}
                      className="text-muted-foreground hover:text-foreground shrink-0 self-center"
                    >
                      <ChartNoAxesColumn className="size-3.5" />
                    </Link>
                  )}
                </div>
                <div className="bg-muted ml-6 h-1 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-[oklch(0.7_0.14_205)] dark:bg-[oklch(0.76_0.12_210)]"
                    style={{ width: `${(item.views / maxViews) * 100}%` }}
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

export const ActivityList = ({
  title,
  emptyText,
  items,
}: {
  title: string;
  emptyText: string;
  items: ActivityItem[];
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm">
      {items.length === 0 ? (
        <p className="text-muted-foreground">{emptyText}</p>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            className="space-y-1 border-b pb-3 last:border-0 last:pb-0"
          >
            {item.text && (
              <p className="text-muted-foreground line-clamp-2 break-words">
                {item.text}
              </p>
            )}
            <div className="flex items-center justify-between gap-2 text-xs">
              <Link
                href={item.href}
                className="truncate font-medium hover:underline"
              >
                {item.title}
              </Link>
              <span className="text-muted-foreground shrink-0">
                {formatDateTime(item.date)}
              </span>
            </div>
            <p className="text-muted-foreground truncate text-xs">
              {item.author}
            </p>
          </div>
        ))
      )}
    </CardContent>
  </Card>
);
