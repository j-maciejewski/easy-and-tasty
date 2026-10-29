import clsx from "clsx";
import Link from "next/link";

import { RetryImage } from "./RetryImage";

interface BannerProps {
  className?: string;
  title: string;
  text?: string;
  image: string;
  href: string;
  priority?: boolean;
}

export const Banner = ({
  className,
  title,
  text,
  image,
  href,
  priority,
}: BannerProps) => {
  return (
    <div className={clsx("w-full", className)}>
      <Link href={href} className="group relative block">
        <RetryImage
          src={image}
          alt={title}
          width={2000}
          height={700}
          sizes="100vw"
          priority={priority}
          className="h-72 w-full object-cover md:h-[34rem]"
        />
        <div className="width-content mx-auto px-4 max-md:-mt-12 md:absolute md:inset-x-0 md:bottom-10">
          <div className="relative max-w-xl rounded-3xl bg-primary p-6 text-primary-foreground md:p-8">
            <span className="block font-bold font-display text-3xl leading-[1.05] tracking-tight md:text-5xl">
              {title}
            </span>
            {text && (
              <span className="mt-3 block text-base text-primary-foreground/90 max-md:line-clamp-3 md:text-lg">
                {text}
              </span>
            )}
            <span className="mt-5 inline-block font-semibold underline decoration-2 underline-offset-4 group-hover:decoration-4">
              Start cooking
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
