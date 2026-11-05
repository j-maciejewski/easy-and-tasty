"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";

import { api } from "@/trpc/react";
import { useBroadcastChannel } from "@/utils";

interface ICategoriesContext {
  categories: Map<number, CategoryWithCount>;
  categoriesLoading: boolean;
  refreshCategories: () => void;
}

const CategoriesContext = createContext<ICategoriesContext | null>(null);

const CategoriesProvider = ({
  categories: initialCategories,
  ...rest
}: {
  children: ReactNode;
  categories: CategoryWithCount[];
}) => {
  const [categories, setCategories] = useState(initialCategories);
  const { isFetching, refetch } =
    api.authorized.category.getCategories.useQuery(undefined, {
      enabled: false,
    });

  const broadcast = useBroadcastChannel<CategoryWithCount>(
    "categories-sync",
    setCategories,
  );

  const refreshCategories = async () => {
    console.log("Refreshing categories...");
    const result = await refetch();

    if (result.data) {
      handleUpdateCategories(result.data);
    }
  };

  const handleUpdateCategories = useCallback(
    (categories: CategoryWithCount[]) => {
      setCategories(categories);
      broadcast(categories);
    },
    [broadcast],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  const value = useMemo(
    () => ({
      categories: new Map(
        categories.map((category) => [category.id, category]),
      ),
      categoriesLoading: isFetching,
      refreshCategories,
    }),
    [categories, isFetching],
  );

  return <CategoriesContext value={value} {...rest} />;
};

export { CategoriesContext, CategoriesProvider };
