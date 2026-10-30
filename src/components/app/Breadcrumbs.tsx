import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { BookmarkButton } from "./BookmarkButton";
import { PrintButton } from "./PrintButton";
import { ShareDialog } from "./ShareDialog";

interface BreadcrumbsProps {
  paths: Array<{
    label: string;
    href?: string;
    active?: boolean;
  }>;
  shareConfig?: {
    path: string;
    text: string;
    type: "recipe" | "article";
  };
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
    <div className="mb-6 flex items-center justify-between gap-4 print:hidden">
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="text-muted-foreground flex items-center gap-1 text-sm">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          {paths.map((path) => (
            <li key={path.label} className="flex min-w-0 items-center gap-1">
              <ChevronRight className="size-3.5 shrink-0" aria-hidden />
              {path.href ? (
                <Link href={path.href} className="hover:text-foreground">
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
      <div className="flex shrink-0 items-center gap-1">
        {recipeId && <BookmarkButton recipeId={recipeId} className="size-9" />}
        {printable && shareConfig && <PrintButton type={shareConfig.type} />}
        {shareConfig && <ShareDialog shareConfig={shareConfig} />}
      </div>
    </div>
  );
};
