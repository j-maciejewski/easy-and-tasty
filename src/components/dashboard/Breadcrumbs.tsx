"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment } from "react";

import { Path } from "@/config";
import { getReturnTo } from "@/utils";

const sectionLabels: Record<string, string> = {
  recipes: "Recipes",
  articles: "Articles",
  categories: "Categories",
  cuisines: "Cuisines",
  users: "Users",
  navigation: "Navigation",
  comments: "Comments",
  media: "Media",
  new: "New",
};

const getSegmentLabel = (segment: string, index: number) => {
  if (sectionLabels[segment]) return sectionLabels[segment];
  if (index > 0) return "Edit";

  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
};

const getCrumbs = (pathname: string, searchParams: URLSearchParams) => {
  const segments = pathname
    .replace(new RegExp(`^${Path.DASHBOARD}`), "")
    .split("/")
    .filter(Boolean);

  return [
    { label: "Dashboard", href: Path.DASHBOARD as string },
    ...segments.map((segment, index) => ({
      label: getSegmentLabel(segment, index),
      href: getReturnTo(
        searchParams,
        `${Path.DASHBOARD}/${segments.slice(0, index + 1).join("/")}`,
      ),
    })),
  ];
};

export const Breadcrumbs = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const crumbs = getCrumbs(pathname, searchParams);

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex items-center gap-1.5 text-lg font-semibold">
        {crumbs.map(({ label, href }, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <Fragment key={href}>
              {index > 0 && (
                <li role="presentation" aria-hidden="true">
                  <ChevronRight className="text-muted-foreground size-4" />
                </li>
              )}
              <li className="truncate">
                {isLast ? (
                  <span aria-current="page" className="text-foreground">
                    {label}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
