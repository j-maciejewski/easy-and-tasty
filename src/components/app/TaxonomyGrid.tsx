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
            className="group flex h-full flex-col rounded-2xl bg-card p-5 transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <span className="font-display font-semibold text-xl tracking-tight">
              {name}
            </span>
            {description && (
              <span className="mt-1.5 line-clamp-2 text-muted-foreground text-sm group-hover:text-primary-foreground/85">
                {description}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
};
