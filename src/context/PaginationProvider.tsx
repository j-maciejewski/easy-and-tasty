"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, ReactNode, useMemo, useState } from "react";

interface IPaginationContext {
  pagination: {
    itemsPerPage: number;
    currentPage: number;
    totalItemsCount: number;
  };
  sort: {
    key: string | null;
    order: "asc" | "desc";
  };
  handleChangePage: (page: number) => void;
  handleChangeLimit: (limit: number) => void;
  handleChangeSort: (key: string) => void;
  setTotalItemsCount: (count: number) => void;
}

const PaginationContext = createContext<IPaginationContext | null>(null);

const PaginationProvider = ({ children }: { children: ReactNode }) => {
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  const itemsPerPage = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : 10;
  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  const sortKey = searchParams.get("sortKey") ?? null;
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") ?? "asc";

  const handleChangePage = (page: number) => {
    if (page === currentPage) return;

    const newParams = new URLSearchParams(searchParams);
    if (page === 1) {
      newParams.delete("page");
    } else {
      newParams.set("page", page.toString());
    }

    router.push(`?${newParams.toString()}`);
  };

  const handleChangeLimit = (limit: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("page");

    if (limit === 10) {
      newParams.delete("limit");
    } else {
      newParams.set("limit", limit.toString());
    }

    router.push(`?${newParams.toString()}`);
  };

  const handleChangeSort = (key: string) => {
    const newParams = new URLSearchParams(searchParams);

    newParams.delete("page");

    if (sortKey === key) {
      if (sortOrder === "asc") {
        newParams.set("sortOrder", "desc");
      } else {
        newParams.delete("sortKey");
        newParams.delete("sortOrder");
      }
    } else {
      newParams.set("sortKey", key);
    }

    router.push(`?${newParams.toString()}`);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  const context: IPaginationContext = useMemo(
    () => ({
      pagination: {
        itemsPerPage,
        currentPage,
        totalItemsCount,
      },
      sort: {
        key: sortKey,
        order: sortOrder,
      },
      handleChangePage,
      handleChangeLimit,
      handleChangeSort,
      setTotalItemsCount,
    }),
    [itemsPerPage, currentPage, totalItemsCount, sortKey, sortOrder],
  );

  return <PaginationContext value={context}>{children}</PaginationContext>;
};

export { PaginationProvider, PaginationContext };
