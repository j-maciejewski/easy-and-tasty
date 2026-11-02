import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { BookmarkButton } from "./BookmarkButton";
import { PrintButton } from "./PrintButton";
import { ShareDialog, type ShareDialogProps } from "./ShareDialog";

interface BreadcrumbsProps {
  paths: Array<{
    label: string;
    href?: string;
    active?: boolean;
  }>;
  shareConfig?: ShareDialogProps["shareConfig"];
  recipeId?: number;
  printable?: boolean;
}

export const Breadcrumbs = ({
  paths,
  shareConfig,
  recipeId,
  printable,
}: BreadcrumbsProps) => {
  if (paths.length === 0) return null;

  return (
    <div className="mb-6 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 print:hidden">
      <nav aria-label="Breadcrumb" className="max-w-full min-w-0">
        <ol className="text-muted-foreground flex items-center gap-1 text-sm">
          <li className="shrink-0">
            <Link href="/" className="hover:text-foreground whitespace-nowrap">
              Home
            </Link>
          </li>
          {paths.map((path) => (
            <li
              key={path.label}
              className={cn(
                "flex items-center gap-1",
                path.href ? "shrink-0" : "min-w-0",
              )}
            >
              <ChevronRight className="size-3.5 shrink-0" aria-hidden />
              {path.href ? (
                <Link
                  href={path.href}
                  className="hover:text-foreground whitespace-nowrap"
                >
                  {path.label}
                </Link>
              ) : (
                <span
                  className="text-foreground truncate"
                  aria-current={path.active ? "page" : undefined}
                >
                  {path.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <div className="-ml-2 flex shrink-0 items-center gap-1 sm:ml-0">
        {recipeId && <BookmarkButton recipeId={recipeId} className="size-9" />}
        {printable && shareConfig && <PrintButton type={shareConfig.type} />}
        {shareConfig && <ShareDialog shareConfig={shareConfig} />}
      </div>
    </div>
  );
};
