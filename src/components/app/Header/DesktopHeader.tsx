"use client";

import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { VisuallyHidden } from "radix-ui";
import { useEffect, useState } from "react";

import { AvatarDropdown } from "@/components/app";
import { AuthModal } from "@/components/auth_forms";
import {
  Avatar,
  AvatarFallback,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
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

import { Searchbar } from "./Searchbar";

interface DesktopHeaderProps {
  navigation: Navigation;
}

export const DesktopHeader = ({ navigation }: DesktopHeaderProps) => {
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
      { signal: controller.signal }
    );

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className={"fixed top-0 left-0 z-50 w-full bg-white shadow-lg"}>
      <header data-is-scrolled={isScrolled}>
        <div
          className={`width-content mx-auto flex items-center justify-between px-4 py-2 transition-all duration-300 ${
            isScrolled ? "h-[65px]" : "h-20"
          }`}
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
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <User className="size-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DialogTrigger>
              <DialogContent className="all- w-fit p-0 *:data-[slot=card]:border-none">
                <VisuallyHidden.Root>
                  <DialogTitle>Authentication Modal</DialogTitle>
                </VisuallyHidden.Root>
                <AuthModal />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </header>
      <nav
        className={`transition-all duration-300 ${
          isScrolled ? "h-0 overflow-hidden opacity-0" : "h-12 opacity-100"
        } width-content mx-auto flex items-center justify-between text-black`}
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
                    <NavigationMenuContent className="w-[200px]!">
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
};
