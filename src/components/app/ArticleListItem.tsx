import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui";

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
    <Link href={`/${article.slug}`}>
      <Card className="card m-px gap-0 overflow-hidden py-0 transition-colors duration-200 hover:bg-gray-100">
        <div className="flex items-stretch">
          <div className="aspect-square w-25 shrink-0 overflow-hidden bg-muted/40">
            {article.image && (
              <Image
                src={article.image}
                width={400}
                height={400}
                alt={article.title}
                loading="lazy"
                className="h-full object-cover"
              />
            )}
          </div>
          <CardContent className="flex min-w-0 grow flex-col justify-center p-3">
            <p className="line-clamp-2 font-semibold text-base leading-tight">
              {article.title}
            </p>
            <p className="mt-1 text-foreground/70 text-xs">
              Added {formattedDate}
            </p>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};
