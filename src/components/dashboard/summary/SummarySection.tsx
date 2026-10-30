"use client";

import type { ReactNode } from "react";

import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

import { KpiTile } from "./KpiTile";
import { TrendChart } from "./TrendChart";
import {
  formatNumber,
  type Metric,
  type TrendPoint,
  type WindowCounts,
} from "./utils";

type SummarySectionProps = {
  noun: string;
  content: { total: number; published: number; drafts: number };
  totals: Partial<Record<Metric, WindowCounts>>;
  trend: TrendPoint[];
  engagementMetrics: Metric[];
  children: ReactNode;
};

const kpiGridCols: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

export const SummarySection = ({
  noun,
  content,
  totals,
  trend,
  engagementMetrics,
  children,
}: SummarySectionProps) => {
  const kpis = (["views", ...engagementMetrics] as Metric[]).flatMap(
    (metric) => {
      const counts = totals[metric];
      return counts ? [{ metric, counts }] : [];
    },
  );
  const contentTiles = [
    { label: `Total ${noun}`, value: content.total },
    { label: "Published", value: content.published },
    { label: "Drafts", value: content.drafts },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {contentTiles.map((tile) => (
          <Card key={tile.label} className="gap-1 px-5 py-4">
            <p className="text-muted-foreground text-xs font-medium">
              {tile.label}
            </p>
            <p className="text-xl font-semibold tabular-nums">
              {formatNumber(tile.value)}
            </p>
          </Card>
        ))}
      </div>

      <div className={cn("grid gap-4", kpiGridCols[kpis.length])}>
        {kpis.map(({ metric, counts }) => (
          <KpiTile key={metric} metric={metric} counts={counts} trend={trend} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <TrendChart
          className="lg:col-span-3"
          title="Views"
          description="Daily views over the last 30 days"
          variant="area"
          metrics={["views"]}
          data={trend}
        />
        <TrendChart
          className="lg:col-span-2"
          title="Engagement"
          description={`Daily ${engagementMetrics.join(" and ")}`}
          variant="bar"
          metrics={engagementMetrics}
          data={trend}
        />
      </div>

      <div
        className={cn(
          "grid gap-6",
          engagementMetrics.length > 1 ? "lg:grid-cols-3" : "lg:grid-cols-2",
        )}
      >
        {children}
      </div>
    </div>
  );
};
