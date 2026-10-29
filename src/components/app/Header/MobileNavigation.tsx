"use client";

import clsx from "clsx";
import { ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui";

interface NavigationGroupProps {
  label: string;
  sublinks: { label: string; href: string }[];
}

const NavigationGroup = ({ label, sublinks }: NavigationGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <li className="hover:bg-accent relative border-t">
        <Button
          variant="ghost"
          className="font-display block aspect-square h-13 w-full rounded-none px-4 py-3.5 text-left text-lg font-medium hover:no-underline"
          onClick={() => setIsOpen(!isOpen)}
        >
          {label}
        </Button>
        <ChevronDown
          className={clsx(
            "pointer-events-none absolute top-[50%] right-5.5 size-5 translate-y-[-50%] p-0 transition-all duration-300",
            isOpen ? "rotate-180" : "rotate-0",
          )}
        />
      </li>
      <li className="last:border-b">
        <ul
          className={clsx(
            "flex flex-col overflow-hidden transition-all duration-300",
            isOpen ? "h-[calc-size(auto,size)]" : "h-0",
          )}
        >
          {sublinks.map((sublink) => (
            <li
              key={sublink.href}
              className="hover:bg-accent relative border-t"
            >
              <Link
                href={sublink.href}
                className="block h-full w-full py-3 pr-4 pl-8"
              >
                {sublink.label}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    </>
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
  return (
    <nav
      className="slide-in-from-right animate-in bg-card fixed top-0 right-0 left-0 z-100 flex h-full w-full flex-col duration-300"
      role="dialog"
      aria-label="Navigation menu"
    >
      <div className="relative flex h-16 min-h-16 items-center justify-between border-b px-4">
        <h2 className="font-display text-xl font-semibold">Menu</h2>
        <Button
          onClick={handleClose}
          type="button"
          variant="ghost"
          className="absolute top-[50%] right-3 aspect-square size-10 translate-y-[-50%] p-0"
          aria-label="Close navigation menu"
        >
          <X className="absolute size-5" />
        </Button>
      </div>
      <ul className="flex grow flex-col overflow-auto">
        {navigation.map((link, idx) =>
          link.href ? (
            <li
              key={idx}
              className="hover:bg-accent relative border-t last:border-b"
            >
              <Link
                href={link.href}
                className="font-display block h-full w-full px-4 py-3.5 text-lg font-medium"
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
            />
          ),
        )}
      </ul>
    </nav>
  );
};
