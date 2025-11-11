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
      <li className="relative border-t hover:bg-gray-100">
        <Button
          variant="ghost"
          className="block aspect-square h-12 w-full px-4 py-3 text-left font-normal text-base hover:no-underline"
          onClick={() => setIsOpen(!isOpen)}
        >
          {label}
        </Button>
        <ChevronDown
          className={clsx(
            "pointer-events-none absolute top-[50%] right-5.5 size-5 translate-y-[-50%] p-0 transition-all duration-300",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </li>
      <li className="[&:last-child]:border-b">
        <ul
          className={clsx(
            "flex flex-col overflow-hidden transition-all duration-300",
            isOpen ? "h-[calc-size(auto,_size)]" : "h-0"
          )}
        >
          {sublinks.map((sublink) => (
            <li
              key={sublink.href}
              className="relative border-t hover:bg-gray-100"
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
  navigation: Navigation;
  handleClose: () => void;
}

export const MobileNavigation = ({
  navigation,
  handleClose,
}: MobileNavigationProps) => {
  return (
    <nav
      className="slide-in-from-right fixed top-0 right-0 left-0 z-100 flex h-full w-full animate-in flex-col bg-white duration-300"
      role="dialog"
    >
      <div className="relative flex h-16 min-h-16 items-center justify-between px-4 shadow">
        <h6 className="font-semibold text-lg">Navigation</h6>
        <Button
          onClick={handleClose}
          type="button"
          variant="ghost"
          className="absolute top-[50%] right-3 aspect-square size-10 translate-y-[-50%] p-0"
        >
          <X className="absolute size-5" />
        </Button>
      </div>
      <ul className="flex grow flex-col overflow-auto">
        {navigation.map((link, idx) =>
          link.href ? (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: explanation
              key={idx}
              className="relative border-t last:border-b hover:bg-gray-100"
            >
              <Link
                href={link.href}
                className="block h-full w-full px-4 py-3"
                onClick={handleClose}
              >
                {link.label}
              </Link>
            </li>
          ) : (
            <NavigationGroup
              // biome-ignore lint/suspicious/noArrayIndexKey: explanation
              key={idx}
              label={link.label}
              sublinks={link.sublinks!}
            />
          )
        )}
      </ul>
    </nav>
  );
};
