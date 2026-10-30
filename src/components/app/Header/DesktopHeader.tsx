"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui";
import { Path } from "@/config";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.png";

import { AccountMenu } from "./AccountMenu";
import { Searchbar } from "./Searchbar";

// Overrides the shadcn link/trigger fills with a text link and an underline
// that grows from the centre on hover and stays put for the current page.
const navItemClassName =
  "font-display text-foreground/75 relative flex h-10 flex-row items-center rounded-lg bg-transparent px-3 py-0 text-[0.9375rem] font-medium hover:bg-transparent hover:text-foreground focus:bg-transparent focus:text-foreground data-[active=true]:bg-transparent data-[active=true]:text-primary data-[active=true]:hover:bg-transparent data-[active=true]:focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-foreground data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent after:bg-primary after:absolute after:inset-x-3 after:bottom-0.5 after:h-0.5 after:scale-x-0 after:rounded-full after:transition-transform after:duration-200 hover:after:scale-x-100 data-[active=true]:after:scale-x-100 data-[state=open]:after:scale-x-100 motion-reduce:after:transition-none";

interface DesktopHeaderProps {
  navigation: HeaderNavigation;
}

export const DesktopHeader = ({ navigation }: DesktopHeaderProps) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const isActive = (href?: string) =>
    !!href &&
    (href === Path.HOME ? pathname === href : pathname.startsWith(href));

  useEffect(() => {
    const controller = new AbortController();
    const handleScroll = () => setIsScrolled(window.scrollY > 8);

    handleScroll();
    window.addEventListener("scroll", handleScroll, {
      signal: controller.signal,
      passive: true,
    });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <header
      data-is-scrolled={isScrolled}
      className={cn(
        "bg-card/90 supports-[backdrop-filter]:bg-card/75 fixed inset-x-0 top-0 z-50 border-b backdrop-blur-lg backdrop-saturate-150 transition-[border-color,box-shadow] duration-300 print:hidden",
        isScrolled
          ? "border-border/70 shadow-[0_10px_30px_-18px_rgb(42_33_28/0.35)]"
          : "border-transparent",
      )}
    >
      <div className="width-content mx-auto flex flex-wrap items-center gap-x-6 px-4 lg:flex-nowrap">
        <Link
          href={Path.HOME}
          className="focus-visible:ring-ring/50 flex h-18 shrink-0 items-center rounded-lg outline-none focus-visible:ring-[3px]"
        >
          <Image
            src={logo}
            alt="Easy and Tasty logo"
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <nav
          aria-label="Main navigation"
          className="border-border/70 order-last flex h-12 w-full justify-center border-t lg:order-none lg:h-auto lg:w-auto lg:justify-start lg:border-0"
        >
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-1">
              {navigation.map((link, idx) => (
                <NavigationMenuItem key={idx}>
                  {link.href ? (
                    <NavigationMenuLink
                      asChild
                      active={isActive(link.href)}
                      className={navItemClassName}
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger
                        data-active={link.sublinks?.some((sublink) =>
                          isActive(sublink.href),
                        )}
                        className={navItemClassName}
                      >
                        {link.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="group-data-[viewport=false]/navigation-menu:border-border/70 w-60! p-2 group-data-[viewport=false]/navigation-menu:mt-2 group-data-[viewport=false]/navigation-menu:rounded-2xl group-data-[viewport=false]/navigation-menu:shadow-[0_18px_40px_-20px_rgb(42_33_28/0.4)]">
                        {link.sublinks?.map((sublink, _idx) => (
                          <NavigationMenuLink
                            asChild
                            key={_idx}
                            active={isActive(sublink.href)}
                            className="hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:hover:bg-primary/10 data-[active=true]:focus:bg-primary/10 rounded-xl px-3 py-2.5 font-medium"
                          >
                            <Link href={sublink.href}>{sublink.label}</Link>
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

        <div className="ml-auto flex h-18 items-center gap-3">
          <Searchbar />
          <AccountMenu />
        </div>
      </div>
    </header>
  );
};
