import Link from "next/link";

import { getImageTransitionName } from "@/lib/utils";

import { RetryImage } from "./RetryImage";
import { SharedImage, SharedImageScope } from "./SharedImage";

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
    <SharedImageScope>
      <Link
        href={`/${article.slug}`}
        className="group hover:bg-card flex items-center gap-3 rounded-2xl p-2 transition-colors"
      >
        <SharedImage name={getImageTransitionName(article.slug)}>
          <div className="bg-muted size-20 shrink-0 overflow-hidden rounded-xl">
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
        </SharedImage>
        <div className="min-w-0">
          <h3 className="font-display group-hover:text-primary line-clamp-2 text-base leading-snug font-semibold">
            {article.title}
          </h3>
          <time
            dateTime={new Date(article.createdAt).toISOString()}
            className="text-muted-foreground mt-1 block text-xs"
          >
            {formattedDate}
          </time>
        </div>
      </Link>
    </SharedImageScope>
  );
};
