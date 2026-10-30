import { ExternalLink, Star } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { getDashboardRecipePath, Path } from "@/config/paths";

import { formatNumber, formatPercent } from "./utils";

type RankedRecipe = {
  id: number;
  title: string;
  slug: string;
  value: string;
};

type RatingsData = {
  count: number;
  average: number;
  distribution: { score: number; count: number }[];
  lowestRated: {
    id: number;
    title: string;
    slug: string;
    average: number;
    count: number;
  }[];
  mostDiscussed: {
    id: number;
    title: string;
    slug: string;
    comments: number;
  }[];
};

const averageFormat = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const formatAverage = (value: number) => averageFormat.format(value);

const pluralize = (count: number, noun: string) =>
  `${formatNumber(count)} ${noun}${count === 1 ? "" : "s"}`;

const RatingsKpiTile = ({ count, average }: RatingsData) => (
  <Card className="gap-1 py-5">
    <CardContent className="space-y-1 px-5">
      <p className="text-muted-foreground text-sm font-medium">
        Ratings
        <span className="font-normal"> · all time</span>
      </p>
      <p className="flex items-center gap-1.5 text-3xl font-semibold tabular-nums">
        {count > 0 ? formatAverage(average) : "—"}
        <Star className="fill-warning text-warning size-6" aria-hidden />
        <span className="sr-only">out of 5</span>
      </p>
      <p className="text-muted-foreground text-xs">
        {count > 0 ? `from ${pluralize(count, "rating")}` : "No ratings yet"}
      </p>
    </CardContent>
  </Card>
);

const RatingDistribution = ({ count, distribution }: RatingsData) => (
  <Card>
    <CardHeader>
      <CardTitle>Rating distribution</CardTitle>
      <CardDescription>All-time ratings by stars</CardDescription>
    </CardHeader>
    <CardContent className="text-sm">
      {count === 0 ? (
        <p className="text-muted-foreground">No ratings yet.</p>
      ) : (
        <ul className="space-y-2.5">
          {distribution.map((entry) => {
            const share = entry.count / count;

            return (
              <li key={entry.score} className="flex items-center gap-3">
                <span className="flex w-8 shrink-0 items-center gap-0.5 text-xs font-medium tabular-nums">
                  {entry.score}
                  <Star className="fill-warning text-warning size-3" />
                  <span className="sr-only">stars</span>
                </span>
                <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${share * 100}%` }}
                  />
                </div>
                <span className="text-muted-foreground w-20 shrink-0 text-right text-xs tabular-nums">
                  {formatNumber(entry.count)} · {formatPercent(share)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </CardContent>
  </Card>
);

const RankedRecipeList = ({
  title,
  description,
  emptyText,
  items,
}: {
  title: string;
  description: string;
  emptyText: string;
  items: RankedRecipe[];
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="text-sm">
      {items.length === 0 ? (
        <p className="text-muted-foreground">{emptyText}</p>
      ) : (
        <ol className="space-y-3">
          {items.map((item, idx) => (
            <li key={item.id} className="flex items-baseline gap-2">
              <span className="text-muted-foreground w-4 shrink-0 text-xs tabular-nums">
                {idx + 1}
              </span>
              <Link
                href={getDashboardRecipePath(item.id)}
                className="min-w-0 flex-1 truncate font-medium hover:underline"
              >
                {item.title}
              </Link>
              <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                {item.value}
              </span>
              <Link
                href={`${Path.RECIPE}/${item.slug}`}
                target="_blank"
                rel="noopener"
                aria-label={`View ${item.title} on site`}
                className="text-muted-foreground hover:text-foreground shrink-0 self-center"
              >
                <ExternalLink className="size-3.5" />
              </Link>
            </li>
          ))}
        </ol>
      )}
    </CardContent>
  </Card>
);

export const RatingsInsights = ({ ratings }: { ratings: RatingsData }) => (
  <div className="grid gap-6 lg:grid-cols-3">
    <div className="space-y-6">
      <RatingsKpiTile {...ratings} />
      <RatingDistribution {...ratings} />
    </div>
    <RankedRecipeList
      title="Needs attention (low ratings)"
      description="Average of 3★ or less, with at least 3 ratings"
      emptyText={
        ratings.count === 0 ? "No ratings yet." : "No low-rated recipes."
      }
      items={ratings.lowestRated.map((recipe) => ({
        ...recipe,
        value: `${formatAverage(recipe.average)}★ · ${pluralize(recipe.count, "rating")}`,
      }))}
    />
    <RankedRecipeList
      title="Most discussed"
      description="Most comments in the last 30 days"
      emptyText="No comments in the last 30 days."
      items={ratings.mostDiscussed.map((recipe) => ({
        ...recipe,
        value: pluralize(recipe.comments, "comment"),
      }))}
    />
  </div>
);
