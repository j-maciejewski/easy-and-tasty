import clsx from "clsx";

import { ArticleCard } from "./ArticleCard";
import { ArticleListItem } from "./ArticleListItem";
import { SectionHeading } from "./SectionHeading";

interface ArticlesListProps {
  articles: ArticleListItem.Article[];
  heading?: string;
  subheading?: string;
  className?: string;
  variant?: "list" | "cards";
}

export const ArticlesList = ({
  articles,
  className,
  heading,
  subheading,
  variant = "list",
}: ArticlesListProps) => {
  if (!articles.length) {
    return <div className={clsx("@container", className)} />;
  }

  return (
    <div className={clsx("@container", className)}>
      <SectionHeading heading={heading} subheading={subheading} />
      {variant === "cards" ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="-mx-2 @max-lg:flex @lg:grid @lg:grid-cols-2 @max-lg:flex-col gap-1">
          {articles.map((article) => (
            <ArticleListItem key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};
