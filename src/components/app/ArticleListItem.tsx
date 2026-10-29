import Link from "next/link";

import { RetryImage } from "./RetryImage";

export namespace ArticleListItem {
  export interface Article {
    id: number;
    slug: string;
    title: string;
    image: string | null;
    createdAt: Date;
  }

  export interface Props {
    article: Article;
  }
}

export const ArticleListItem = ({ article }: ArticleListItem.Props) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(article.createdAt));

  return (
    <Link
      href={`/${article.slug}`}
      className="group flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-card"
    >
      <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
        {article.image && (
          <RetryImage
            src={article.image}
            width={160}
            height={160}
            alt={article.title}
            loading="lazy"
            className="size-full object-cover"
          />
        )}
      </div>
      <div className="min-w-0">
        <h3 className="line-clamp-2 font-display font-semibold text-base leading-snug group-hover:text-primary">
          {article.title}
        </h3>
        <time
          dateTime={new Date(article.createdAt).toISOString()}
          className="mt-1 block text-muted-foreground text-xs"
        >
          {formattedDate}
        </time>
      </div>
    </Link>
  );
};
