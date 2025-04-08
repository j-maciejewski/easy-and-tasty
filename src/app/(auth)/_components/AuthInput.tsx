"use client";

import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { use } from "react";
import { AuthData, AuthDataContext } from "../_context/AuthDataProvider";

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
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      value={authData[props.name as keyof AuthData]}
      onChange={handleChangeAuthData}
      {...props}
    />
  );
};
