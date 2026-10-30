"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui";

import {
  chartConfig,
  formatDay,
  formatNumber,
  type Metric,
  type TrendPoint,
} from "./utils";

type TrendChartProps = {
  title: string;
  description: string;
  variant: "area" | "bar";
  metrics: Metric[];
  data: TrendPoint[];
  className?: string;
};

export const TrendChart = ({
  title,
  description,
  variant,
  metrics,
  data,
  className,
}: TrendChartProps) => {
  const chartData = data.map((entry) => ({
    ...entry,
    label: formatDay(entry.day),
  }));
  const hasActivity = data.some((entry) =>
    metrics.some((metric) => (entry[metric] ?? 0) > 0),
  );

  const axes = [
    <CartesianGrid key="grid" vertical={false} />,
    <XAxis
      key="x"
      dataKey="label"
      tickLine={false}
      axisLine={false}
      minTickGap={28}
    />,
    <YAxis
      key="y"
      allowDecimals={false}
      tickLine={false}
      axisLine={false}
      width={40}
      tickFormatter={formatNumber}
    />,
    <ChartTooltip key="tooltip" content={<ChartTooltipContent />} />,
    ...(metrics.length > 1
      ? [<ChartLegend key="legend" content={<ChartLegendContent />} />]
      : []),
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasActivity ? (
          <div className="text-muted-foreground flex h-72 items-center justify-center rounded-xl border border-dashed text-sm">
            No activity recorded in the last 30 days yet.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-72 w-full"
          >
            {variant === "area" ? (
              <AreaChart data={chartData}>
                {axes}
                {metrics.map((metric) => (
                  <Area
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    stroke={`var(--color-${metric})`}
                    fill={`var(--color-${metric})`}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            ) : (
              <BarChart data={chartData}>
                {axes}
                {metrics.map((metric, idx) => (
                  <Bar
                    key={metric}
                    dataKey={metric}
                    stackId="trend"
                    fill={`var(--color-${metric})`}
                    radius={idx === metrics.length - 1 ? [3, 3, 0, 0] : 0}
                  />
                ))}
              </BarChart>
            )}
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
