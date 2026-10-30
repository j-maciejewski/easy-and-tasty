"use client";

import clsx from "clsx";
import { ChevronDown, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui";
import logo from "@/public/logo.png";

const linkClassName =
  "font-display hover:bg-muted focus-visible:ring-ring/50 flex w-full items-center rounded-2xl px-4 py-3 text-2xl font-semibold tracking-tight outline-none focus-visible:ring-[3px]";

interface NavigationGroupProps {
  label: string;
  sublinks: { label: string; href: string }[];
  handleClose: () => void;
}

const NavigationGroup = ({
  label,
  sublinks,
  handleClose,
}: NavigationGroupProps) => {
  const pathname = usePathname();
  const hasActiveSublink = sublinks.some((sublink) =>
    pathname.startsWith(sublink.href),
  );
  const [isOpen, setIsOpen] = useState(hasActiveSublink);

  return (
    <li>
      <button
        type="button"
        className={clsx(
          linkClassName,
          "justify-between text-left",
          hasActiveSublink && "text-primary",
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {label}
        <ChevronDown
          className={clsx(
            "text-muted-foreground size-5 transition-transform duration-300 motion-reduce:transition-none",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <ul
        className={clsx(
          "border-border ml-8 flex flex-col overflow-hidden border-l transition-all duration-300 motion-reduce:transition-none",
          isOpen ? "my-1 h-[calc-size(auto,size)]" : "h-0",
        )}
      >
        {sublinks.map((sublink) => {
          const isActive = pathname.startsWith(sublink.href);

          return (
            <li key={sublink.href}>
              <Link
                href={sublink.href}
                className={clsx(
                  "-ml-px block border-l-2 py-2.5 pr-4 pl-5 text-base",
                  isActive
                    ? "border-primary text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground border-transparent",
                )}
                aria-current={isActive ? "page" : undefined}
                tabIndex={isOpen ? undefined : -1}
                onClick={handleClose}
              >
                {sublink.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </li>
  );
};

interface MobileNavigationProps {
  navigation: HeaderNavigation;
  handleClose: () => void;
}

export const MobileNavigation = ({
  navigation,
  handleClose,
}: MobileNavigationProps) => {
  const pathname = usePathname();

  return (
    <nav
      className="slide-in-from-right animate-in bg-card fixed top-0 right-0 left-0 z-100 flex h-full w-full flex-col duration-300"
      role="dialog"
      aria-label="Navigation menu"
    >
      <div className="flex h-16 min-h-16 items-center justify-between px-4">
        <Image src={logo} alt="Easy and Tasty logo" className="h-7 w-auto" />
        <Button
          onClick={handleClose}
          type="button"
          variant="ghost"
          className="bg-muted relative size-10 rounded-full p-0"
          aria-label="Close navigation menu"
        >
          <X className="absolute size-5" />
        </Button>
      </div>
      <ul className="flex grow flex-col gap-1 overflow-auto px-2 pt-4 pb-8">
        {navigation.map((link, idx) =>
          link.href ? (
            <li key={idx}>
              <Link
                href={link.href}
                className={clsx(
                  linkClassName,
                  pathname === link.href && "text-primary",
                )}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={handleClose}
              >
                {link.label}
              </Link>
            </li>
          ) : (
            <NavigationGroup
              key={idx}
              label={link.label}
              sublinks={link.sublinks!}
              handleClose={handleClose}
            />
          ),
        )}
      </ul>
    </nav>
  );
};
