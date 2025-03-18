"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, createContext, useMemo, useState } from "react";

interface IPaginationContext {
  pagination: {
    itemsPerPage: number;
    currentPage: number;
    totalItemsCount: number;
  };
  handleChangePage: (page: number) => void;
  handleChangeLimit: (limit: number) => void;
  setTotalItemsCount: (count: number) => void;
}

const PaginationContext = createContext<IPaginationContext | null>(null);

const PaginationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  const itemsPerPage = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : 10;
  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  const handleChangePage = (page: number) => {
    if (page === currentPage) return;

    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());

    router.push(`?${newParams.toString()}`);
  };

  const handleChangeLimit = (limit: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("limit", limit.toString());
    newParams.set("page", "1");

    router.push(`?${newParams.toString()}`);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const context: IPaginationContext = useMemo(
    () => ({
      pagination: {
        itemsPerPage,
        currentPage,
        totalItemsCount,
      },
      handleChangePage,
      handleChangeLimit,
      setTotalItemsCount,
    }),
    [itemsPerPage, currentPage, totalItemsCount],
  );

  return <PaginationContext value={context}>{children}</PaginationContext>;
};

export { PaginationProvider, PaginationContext };
