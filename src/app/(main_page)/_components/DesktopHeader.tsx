"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { Path } from "@/config";
import logo from "@/public/logo.png";
import clsx from "clsx";
import { User, User2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes, forwardRef, useEffect, useState } from "react";
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="rounded-full focus:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
                >
                  <Avatar>
                    {session.data.user?.image && (
                      <AvatarImage src={session.data.user.image} />
                    )}
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Liked recipes</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                {session.data.user?.role !== "viewer" && (
                  <Link href="/dashboard">
                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-red-600"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
      <div
        className={`transition-all duration-300 ${isScrolled ? "h-0 overflow-hidden opacity-0" : "h-12 opacity-100"} ~md:~max-w-[60rem]/[80rem] mx-auto flex items-center justify-between text-black`}
      >
        <ul className="flex h-fit w-full flex-wrap gap-8 whitespace-nowrap px-4 text-sm tracking-wider ">
          {navigation.links.map((link, idx) =>
            "href" in link ? (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={idx}
                className="font-semibold uppercase"
              >
                <Link
                  href={link.href}
                  className="relative transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:text-primary/95 hover:after:w-full"
                >
                  {link.label}
                </Link>
              </li>
            ) : (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <li key={idx} className="group relative">
                <span className="relative cursor-default font-semibold uppercase">
                  {link.label}
                </span>
                <ul className="invisible absolute top-[110%] left-0 z-50 min-w-[200px] overflow-hidden rounded-md border bg-white opacity-0 shadow-inner transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  {link.sublinks.map((sublink) => (
                    <li
                      key={sublink.href}
                      className="[&:not(:last-child)>a]:border-b"
                    >
                      <Link
                        href={sublink.href}
                        className="block px-4 py-3 text-sm hover:bg-gray-50"
                      >
                        {sublink.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
});
