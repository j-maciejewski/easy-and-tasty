"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Area, AreaChart } from "recharts";

import { Card, CardContent, ChartContainer } from "@/components/ui";
import { cn } from "@/lib/utils";

import {
  chartConfig,
  formatNumber,
  formatPercent,
  type Metric,
  type TrendPoint,
  type WindowCounts,
} from "./utils";

type KpiTileProps = {
  metric: Metric;
  counts: WindowCounts;
  trend: TrendPoint[];
};

const Delta = ({
  current,
  previous,
}: {
  current: number;
  previous: number;
}) => {
  if (previous === 0) {
    return (
      <span className="text-muted-foreground text-xs">
        {current > 0 ? "New this period" : "No change"}
      </span>
    );
  }

  const change = (current - previous) / previous;
  const Icon = change >= 0 ? ArrowUp : ArrowDown;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        change > 0 && "text-success",
        change < 0 && "text-destructive",
        change === 0 && "text-muted-foreground",
      )}
    >
      {change !== 0 && <Icon className="size-3" />}
      {formatPercent(Math.abs(change))}
      <span className="text-muted-foreground font-normal">vs prev. 30d</span>
    </span>
  );
};

export const KpiTile = ({ metric, counts, trend }: KpiTileProps) => (
  <Card className="gap-3 py-5">
    <CardContent className="space-y-1 px-5">
      <p className="text-muted-foreground text-sm font-medium">
        {chartConfig[metric].label}
        <span className="font-normal"> · last 30 days</span>
      </p>
      <p className="text-3xl font-semibold tabular-nums">
        {formatNumber(counts.last30d)}
      </p>
      <Delta current={counts.last30d} previous={counts.prev30d} />
    </CardContent>
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-12 w-full"
      aria-hidden
    >
      <AreaChart data={trend} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <Area
          type="monotone"
          dataKey={metric}
          stroke={`var(--color-${metric})`}
          fill={`var(--color-${metric})`}
          fillOpacity={0.15}
          strokeWidth={1.5}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
    <p className="text-muted-foreground px-5 text-xs tabular-nums">
      24h: {formatNumber(counts.last24h)} · 7d: {formatNumber(counts.last7d)}
    </p>
  </Card>
);
