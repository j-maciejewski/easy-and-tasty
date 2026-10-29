import clsx from "clsx";

interface SectionHeadingProps {
  heading?: string;
  subheading?: string;
  className?: string;
}

export const SectionHeading = ({
  heading,
  subheading,
  className,
}: SectionHeadingProps) => {
  if (!heading && !subheading) return null;

  return (
    <div className={clsx("mb-5 max-w-2xl", className)}>
      {heading && (
        <h2 className="font-display font-semibold text-2xl tracking-tight md:text-3xl">
          {heading}
        </h2>
      )}
      {subheading && (
        <p className="mt-1.5 text-base text-muted-foreground">{subheading}</p>
      )}
    </div>
  );
};
