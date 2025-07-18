"use client";
import { createContext, ReactNode, useMemo } from "react";

interface ICuisinesContext {
  cuisines: Map<
    number,
    {
      id: number;
      name: string;
      description: string;
      slug: string;
    }
  >;
}

const CuisinesContext = createContext<ICuisinesContext | null>(null);

const CuisinesProvider = ({
  cuisines,
  ...rest
}: {
  children: ReactNode;
  cuisines: {
    id: number;
    name: string;
    description: string;
    slug: string;
  }[];
}) => {
  const value = useMemo(
    () => ({
      cuisines: new Map(cuisines.map((cuisine) => [cuisine.id, cuisine])),
    }),
    [cuisines],
  );

  return <CuisinesContext value={value} {...rest} />;
};

export { CuisinesProvider, CuisinesContext };
