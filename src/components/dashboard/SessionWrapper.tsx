"use client";

import { useSession } from "next-auth/react";

export const SessionWrapper = ({ children }: React.PropsWithChildren) => {
  const { status } = useSession();

  if (status !== "authenticated") return null;

  return children;
};
