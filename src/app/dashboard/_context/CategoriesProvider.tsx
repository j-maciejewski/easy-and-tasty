"use client";
import { ReactNode, createContext, useMemo } from "react";

interface ICategoriesContext {
  categories: Map<
    number,
    {
      id: number;
      name: string;
      description: string;
      slug: string;
      featuredRecipeId: number | null;
    }
  >;
}

const CategoriesContext = createContext<ICategoriesContext | null>(null);

const CategoriesProvider = async ({
  categories,
  ...rest
}: {
  children: ReactNode;
  categories: {
    id: number;
    name: string;
    description: string;
    slug: string;
    featuredRecipeId: number | null;
  }[];
}) => {
  const value = useMemo(
    () => ({
      categories: new Map(
        categories.map((category) => [category.id, category]),
      ),
    }),
    [categories],
  );

  return <CategoriesContext value={value} {...rest} />;
};

export { CategoriesProvider, CategoriesContext };
