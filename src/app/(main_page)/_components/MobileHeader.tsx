"use client";

import { Button } from "@/components/ui";
import { Path } from "@/config";
import { useScrollDirection } from "@/hooks";
import logo from "@/public/logo.png";
import clsx from "clsx";
import { Menu, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes, forwardRef, useEffect, useState } from "react";
import { MobileNavigation } from "./MobileNavigation";
import { MobileSearch } from "./MobileSearch";

export const MobileHeader = forwardRef<
  HTMLElement,
  HTMLAttributes<HTMLElement> & { navigation: Navigation }
>(({ className, navigation, ...props }, ref) => {
  const scrollDirection = useScrollDirection();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  useEffect(() => {
    if (isSearchOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (isNavigationOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isNavigationOpen]);

  useEffect(() => {
    const eventController = new AbortController();

    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth > 768) {
          setIsSearchOpen(false);
          setIsNavigationOpen(false);
        }
      },
      { signal: eventController.signal },
    );

    return () => eventController.abort();
  }, []);

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 z-[50] w-full md:hidden bg-white shadow transition-transform duration-300",
          scrollDirection === "down" ? "-translate-y-full" : "translate-y-0",
          className,
        )}
        {...props}
        ref={ref}
      >
        <div className="mx-auto flex h-16 max-w-[1000px] items-center justify-between px-4">
          <div>
            <Link href={Path.HOME}>
              <Image
                src={logo}
                alt="icon"
                className="mr-2 lg:hidden"
                height={35}
                priority
              />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button asChild variant="link">
						<Link href="/login" className="relative aspect-square">
							<User2 className="absolute size-5" />
						</Link>
					</Button> */}
            <Button
              variant="link"
              className="relative aspect-square"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="absolute size-5" />
            </Button>
            <Button
              variant="link"
              className="relative aspect-square"
              onClick={() => setIsNavigationOpen(true)}
            >
              <Menu className="absolute size-5" />
            </Button>
          </div>
        </div>
      </header>
      {isSearchOpen && (
        <MobileSearch handleClose={() => setIsSearchOpen(false)} />
      )}
      {isNavigationOpen && (
        <MobileNavigation
          navigation={navigation}
          handleClose={() => setIsNavigationOpen(false)}
        />
      )}
    </>
  );
});
