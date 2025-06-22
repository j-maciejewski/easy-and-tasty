"use client";

import clsx from "clsx";
import { User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { forwardRef, HTMLAttributes, useEffect, useState } from "react";

import {
  Button,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui";
import { Path } from "@/config";
import logo from "@/public/logo.png";

import { AvatarDropdown } from "./AvatarDropdown";
import { Searchbar } from "./Searchbar";

export const DesktopHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { navigation: Navigation }
>(({ className, navigation, ...props }, ref) => {
  const session = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 75) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  }, []);
  return (
    <div
      className={clsx(
        "fixed top-0 left-0 z-[50] w-full bg-white shadow-lg",
        className,
      )}
      {...props}
      ref={ref}
    >
      <header data-is-scrolled={isScrolled}>
        <div
          className={`~md:~max-w-[60rem]/[80rem] mx-auto flex items-center justify-between px-4 py-2 transition-all duration-300 ${isScrolled ? "h-[65px]" : "h-[80px]"}`}
        >
          <div>
            <Link href={Path.HOME}>
              <Image src={logo} alt="logo" height={35} priority />
            </Link>
          </div>
          <Searchbar />
          {session.status === "loading" && <div className="invisible" />}

          {session?.status === "authenticated" && (
            <AvatarDropdown user={session.data.user} />
          )}
          {session?.status === "unauthenticated" && (
            <div className="flex items-center gap-4">
              <Button asChild variant="link">
                <Link href="/login" className="font-semibold">
                  <User2 className="mr-2 size-5" />
                  Sign in
                </Link>
              </Button>
            </div>
          )}
        </div>
      </header>
      <nav
        className={`transition-all duration-300 ${isScrolled ? "h-0 overflow-hidden opacity-0" : "h-12 opacity-100"} ~md:~max-w-[60rem]/[80rem] mx-auto flex items-center justify-between text-black`}
      >
        <NavigationMenu viewport={false}>
          <NavigationMenuList className="flex h-fit w-full flex-wrap gap-3 whitespace-nowrap px-4 text-sm tracking-wider">
            {navigation.map((link, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: explanation
              <NavigationMenuItem key={idx}>
                {link.href ? (
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </NavigationMenuLink>
                ) : (
                  <>
                    <NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
                    <NavigationMenuContent className="!w-[200px]">
                      {link.sublinks?.map((sublink, _idx) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: explanation
                        <NavigationMenuLink asChild key={_idx}>
                          {sublink.href ? (
                            <Link href={sublink.href}>{sublink.label}</Link>
                          ) : (
                            <span className="cursor-pointer">
                              {sublink.label}
                            </span>
                          )}
                        </NavigationMenuLink>
                      ))}
                    </NavigationMenuContent>
                  </>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </div>
  );
});
