import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes, forwardRef } from "react";

export const Banner = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    title: string;
    text?: string;
    image: string;
    href: string;
  }
>(({ className, title, text, image, href, ...props }, ref) => {
  return (
    <div className={clsx("w-full", className)} {...props} ref={ref}>
      <Link href={href} className="relative block">
        <Image
          src={image}
          alt={"test"}
          width={2000}
          height={2000}
          className="w-full object-cover max-md:h-48 md:h-[30rem]"
        />
        <div className="~bottom-2/5 absolute left-[50%] max-w-[40rem] translate-x-[-50%] bg-secondary/90 p-3 md:w-[calc(100%-2rem)]">
          <div className="flex flex-col items-center p-3 ring ring-primary">
            <span className="~text-lg/2xl text-center font-semibold">
              {title}
            </span>
            {text && (
              <span className="~text-sm/base mt-2 text-justify max-md:hidden">
                {text}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
});
