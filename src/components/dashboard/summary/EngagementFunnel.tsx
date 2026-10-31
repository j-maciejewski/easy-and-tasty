import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { formatNumber, formatPercent } from "./utils";

export type EventTotals = {
  views: number;
  engaged: number;
  prints: number;
  shares: number;
  copies: number;
};

const perHundredFormat = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
});

export const EngagementFunnel = ({
  totals,
  conversions,
  description = "Share of views, last 30 days",
}: {
  totals: EventTotals;
  conversions: { label: string; count: number }[];
  description?: string;
}) => {
  const steps = [
    { label: "Engaged (read or stayed 30s+)", count: totals.engaged },
    { label: "Printed", count: totals.prints },
    { label: "Shared", count: totals.shares },
    { label: "Copied text", count: totals.copies },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-baseline justify-between">
          <span className="font-medium">Views</span>
          <span className="tabular-nums">{formatNumber(totals.views)}</span>
        </div>
        <ul className="space-y-2.5">
          {steps.map((step) => {
            const share = totals.views ? step.count / totals.views : 0;

            return (
              <li key={step.label} className="space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-muted-foreground truncate">
                    {step.label}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums">
                    {formatNumber(step.count)} · {formatPercent(share)}
                  </span>
                </div>
                <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${Math.min(share, 1) * 100}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
        {conversions.length > 0 && (
          <dl className="grid grid-cols-2 gap-3 border-t pt-4">
            {conversions.map((conversion) => (
              <div key={conversion.label}>
                <dt className="text-muted-foreground text-xs">
                  {conversion.label} per 100 views
                </dt>
                <dd className="text-lg font-semibold tabular-nums">
                  {totals.views
                    ? perHundredFormat.format(
                        (conversion.count / totals.views) * 100,
                      )
                    : "—"}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </CardContent>
    </Card>
  );
};
