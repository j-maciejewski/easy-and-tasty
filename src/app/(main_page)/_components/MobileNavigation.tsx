"use client";

import clsx from "clsx";
import { ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { forwardRef, HTMLAttributes, useState } from "react";

import { Button } from "@/components/ui";

const NavigationGroup = forwardRef<
  HTMLLIElement,
  HTMLAttributes<HTMLLIElement> & {
    label: string;
    sublinks: { label: string; href: string }[];
  }
>(({ className, label, sublinks, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <li
        key={label}
        className="relative border-t hover:bg-gray-100"
        {...props}
        ref={ref}
      >
        <Button
          variant="link"
          className="block aspect-square h-12 w-full px-4 py-3 text-left font-normal text-base hover:no-underline"
          onClick={() => setIsOpen(!isOpen)}
        >
          {label}
        </Button>
        <ChevronDown
          className={clsx(
            "pointer-events-none absolute top-[50%] right-[1.375rem] size-5 translate-y-[-50%] p-0 transition-all duration-300",
            isOpen ? "rotate-180" : "rotate-0",
          )}
        />
      </li>
      <li className="[&:last-child]:border-b">
        <ul
          className={clsx(
            "flex flex-col overflow-hidden transition-all duration-300",
            isOpen ? "h-[calc-size(auto,_size)]" : "h-0",
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
});

export const MobileNavigation = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    navigation: Navigation;
    handleClose: () => void;
  }
>(({ className, navigation, handleClose, ...props }, ref) => {
  return (
    <nav
      className="slide-in-from-right fixed top-0 right-0 left-0 z-[100] flex h-full w-full animate-in flex-col bg-white duration-300"
      role="dialog"
      {...props}
      ref={ref}
    >
      <div className="relative flex h-16 min-h-16 items-center justify-between px-4 shadow">
        <h6 className="font-semibold text-lg">Navigation</h6>
        <Button
          onClick={handleClose}
          type="button"
          variant="link"
          className="absolute top-[50%] right-3 aspect-square h-10 translate-y-[-50%] p-0"
        >
          <X className="size-5" />
        </Button>
      </div>
      <ul className="flex grow flex-col overflow-auto">
        {navigation.map((link, idx) =>
          link.href ? (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: explanation
              key={idx}
              className="relative border-t hover:bg-gray-100 [&:last-child]:border-b"
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
          ),
        )}
      </ul>
    </nav>
  );
});
