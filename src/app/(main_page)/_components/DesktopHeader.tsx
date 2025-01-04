import { Button } from "@/components/ui/button";
import { Path } from "@/config";
import logo from "@/public/logo2.png";
import clsx from "clsx";
import { User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes, forwardRef } from "react";
import { Searchbar } from "./Searchbar";

export const DesktopHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { navigation: Navigation }
>(({ className, navigation, ...props }, ref) => {
  return (
    <div
      className={clsx("w-full bg-white shadow-lg", className)}
      {...props}
      ref={ref}
    >
      <header>
        <div className="~md:~max-w-[60rem]/[80rem] mx-auto flex h-[80px] items-center justify-between px-4 py-3">
          <div>
            <Link href={Path.HOME}>
              <Image src={logo} alt="logo" height={40} priority />
            </Link>
          </div>
          <Searchbar />
          <div className="invisible flex items-center gap-4">
            <Button asChild variant="link">
              <Link href="/login" className="font-semibold">
                <User2 className="mr-2 size-5" />
                Sign in
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="~md:~max-w-[60rem]/[80rem] mx-auto flex items-center justify-between px-4 pt-2 pb-4 text-black [&_a:hover]:hover:text-primary/95">
        <ul className="flex h-fit w-full flex-wrap gap-8 whitespace-nowrap text-sm tracking-wider">
          {navigation.links.map((link, idx) =>
            "href" in link ? (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={idx}
                className="font-bold uppercase after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                <Link
                  href={link.href}
                  className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </Link>
              </li>
            ) : (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <li key={idx} className="group relative">
                <span className="relative font-bold uppercase after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                  {link.label}
                </span>
                <ul className="invisible absolute top-full left-0 z-50 min-w-[200px] rounded-md bg-white py-2 opacity-0 shadow shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  {link.sublinks.map((sublink) => (
                    <li key={sublink.href}>
                      <Link
                        href={sublink.href}
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
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
