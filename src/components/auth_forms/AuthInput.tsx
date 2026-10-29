"use client";

import { use } from "react";

import { Input } from "@/components/ui";
import { AuthData, AuthDataContext } from "@/context";
import { cn } from "@/lib/utils";

export const AuthInput = ({
  className,
  type,
  ...props
}: React.ComponentProps<typeof Input>) => {
  const { authData, handleChangeAuthData } = use(AuthDataContext)!;

  return (
    <Input
      type={type}
      className={cn(
        "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      value={authData[props.name as keyof AuthData]}
      onChange={handleChangeAuthData}
      {...props}
    />
  );
};
