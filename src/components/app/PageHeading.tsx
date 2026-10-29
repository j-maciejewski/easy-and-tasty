import clsx from "clsx";
import { ReactNode } from "react";

interface PageHeadingProps {
  title: string;
  description?: string | null;
  children?: ReactNode;
  className?: string;
}

export const PageHeading = ({
  title,
  description,
  children,
  className,
}: PageHeadingProps) => {
  return (
    <div
      className={clsx(
        "mb-8 flex flex-wrap items-end justify-between gap-4 border-b pb-6",
        className,
      )}
    >
      <div className="max-w-2xl">
        <h1 className="font-display font-semibold text-4xl tracking-tight md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-lg text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
};
