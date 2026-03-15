import clsx from "clsx";

import { ArticleCard } from "./ArticleCard";
import { ArticleListItem } from "./ArticleListItem";

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
  return (
    <div className={clsx("@container text-sm", className)}>
      {heading && <h3 className="font-semibold text-xl">{heading}</h3>}
      {subheading && <p className="mt-2 text-sm">{subheading}</p>}
      {variant === "cards" ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="mt-4 @max-lg:flex @lg:grid @lg:grid-cols-2 @max-lg:flex-col gap-3">
          {articles.map((article) => (
            <ArticleListItem key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};
