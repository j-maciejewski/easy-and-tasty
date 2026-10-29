import Link from "next/link";

interface TaxonomyGridProps {
  items: { name: string; slug: string; description: string }[];
  basePath: "/categories" | "/cuisines";
}

export const TaxonomyGrid = ({ items, basePath }: TaxonomyGridProps) => {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ name, slug, description }) => (
        <li key={slug}>
          <Link
            href={`${basePath}/${slug}`}
            className="group bg-card hover:bg-primary hover:text-primary-foreground flex h-full flex-col rounded-2xl p-5 transition-colors"
          >
            <span className="font-display text-xl font-semibold tracking-tight">
              {name}
            </span>
            {description && (
              <span className="text-muted-foreground group-hover:text-primary-foreground/85 mt-1.5 line-clamp-2 text-sm">
                {description}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
};
