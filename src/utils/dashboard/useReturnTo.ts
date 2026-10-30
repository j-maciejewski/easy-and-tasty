"use client";

import { usePathname, useSearchParams } from "next/navigation";

const RETURN_TO_PARAM = "returnTo";

export const getReturnTo = (
  searchParams: URLSearchParams,
  fallback: string,
) => {
  const returnTo = searchParams.get(RETURN_TO_PARAM);

  if (
    returnTo &&
    (returnTo === fallback || returnTo.startsWith(`${fallback}?`))
  )
    return returnTo;

  return fallback;
};

export const withReturnTo = (href: string, returnTo: string) =>
  `${href}?${new URLSearchParams({ [RETURN_TO_PARAM]: returnTo })}`;

export const useReturnTo = (fallback: string) => {
  const searchParams = useSearchParams();

  return getReturnTo(searchParams, fallback);
};

export const useWithReturnTo = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (href: string) => {
    const search = searchParams.toString();
    const current = search ? `${pathname}?${search}` : pathname;

    return withReturnTo(href, current);
  };
};
