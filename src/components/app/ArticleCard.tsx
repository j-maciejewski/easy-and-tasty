import Link from "next/link";

import { getImageTransitionName } from "@/lib/utils";

import { RetryImage } from "./RetryImage";
import { SharedImage, SharedImageScope } from "./SharedImage";

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
    <SharedImageScope>
      <Link
        href={`/${article.slug}`}
        className="group block rounded-2xl outline-offset-4"
      >
        <SharedImage name={getImageTransitionName(article.slug)}>
          <div className="bg-muted aspect-video overflow-hidden rounded-2xl">
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
        </SharedImage>
        <h3 className="font-display decoration-primary mt-3 line-clamp-2 text-xl leading-snug font-semibold decoration-2 underline-offset-4 group-hover:underline">
          {article.title}
        </h3>
        <time
          dateTime={new Date(article.createdAt).toISOString()}
          className="text-muted-foreground mt-1 block text-sm"
        >
          {formattedDate}
        </time>
      </Link>
    </SharedImageScope>
  );
};
