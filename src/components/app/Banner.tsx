import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import { merienda } from "@/app/fonts";

interface BannerProps {
  className?: string;
  title: string;
  text?: string;
  image: string;
  href: string;
}

export const Banner = ({
  className,
  title,
  text,
  image,
  href,
}: BannerProps) => {
  return (
    <div className={clsx("w-full text-foreground", className)}>
      <Link href={href} className="relative block">
        <Image
          src={image}
          alt={"test"}
          width={2000}
          height={500}
          className="w-full object-cover max-md:h-48 md:h-120"
        />
        <div className="absolute bottom-5 left-[50%] max-w-160 translate-x-[-50%] bg-secondary/90 p-3 md:w-[calc(100%-2rem)]">
          <div className="flex flex-col items-center p-3 ring ring-primary">
            <span
              className={clsx(
                "text-center font-semibold text-2xl",
                merienda.className,
              )}
            >
              {title}
            </span>
            {text && (
              <span className="mt-2 text-justify text-base max-md:hidden">
                {text}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};
