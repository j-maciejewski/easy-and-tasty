import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui";

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
    <Link href={`/${article.slug}`}>
      <Card className="card m-px gap-0 overflow-hidden py-0 transition-colors duration-200 hover:bg-gray-100">
        {article.image && (
          <div className="overflow-hidden">
            <Image
              src={article.image}
              width={400}
              height={225}
              alt={article.title}
              className="aspect-video w-full object-cover"
            />
          </div>
        )}
        <CardContent className="p-3">
          <p className="line-clamp-2 font-semibold text-lg leading-tight">
            {article.title}
          </p>
          <p className="mt-1 text-foreground/70 text-xs">{formattedDate}</p>
        </CardContent>
      </Card>
    </Link>
  );
};
