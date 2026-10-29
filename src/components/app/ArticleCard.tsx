import Link from "next/link";

import { RetryImage } from "./RetryImage";

export namespace ArticleCard {
  export interface Props {
    article: {
      id: number;
      slug: string;
      title: string;
      image: string | null;
      createdAt: Date;
    };
  }
}

export const ArticleCard = ({ article }: ArticleCard.Props) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(article.createdAt));

  return (
    <Link
      href={`/${article.slug}`}
      className="group block rounded-2xl outline-offset-4"
    >
      <div className="aspect-video overflow-hidden rounded-2xl bg-muted">
        {article.image && (
          <RetryImage
            src={article.image}
            width={640}
            height={360}
            alt={article.title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        )}
      </div>
      <h3 className="mt-3 line-clamp-2 font-display font-semibold text-xl leading-snug decoration-2 decoration-primary underline-offset-4 group-hover:underline">
        {article.title}
      </h3>
      <time
        dateTime={new Date(article.createdAt).toISOString()}
        className="mt-1 block text-muted-foreground text-sm"
      >
        {formattedDate}
      </time>
    </Link>
  );
};
