"use client";

import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";

export namespace MultiSelect {
  export interface Props<T> {
    label?: string;
    options: { label: string; value: T; checked: boolean }[];
    toggleOption: (value: T) => void;
    children?: React.ReactNode;
  }
}

export const MultiSelect = <T extends string | number | (string | number)>({
  label,
  options,
  children,
  toggleOption,
}: MultiSelect.Props<T>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {label && (
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {options.map((option, idx) => (
          <DropdownMenuCheckboxItem
            // biome-ignore lint/suspicious/noArrayIndexKey: explanation
            key={idx}
            checked={option.checked}
            onCheckedChange={() => toggleOption(option.value)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
