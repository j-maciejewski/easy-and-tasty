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

interface ICuisinesContext {
  cuisines: Map<number, Cuisine>;
  cuisinesLoading: boolean;
  refreshCuisines: () => void;
}

const CuisinesContext = createContext<ICuisinesContext | null>(null);

const CuisinesProvider = ({
  cuisines: initialCuisines,
  ...rest
}: {
  children: ReactNode;
  cuisines: Cuisine[];
}) => {
  const [cuisines, setCuisines] = useState(initialCuisines);
  const { isFetching, refetch } = api.authorized.cuisine.getCuisines.useQuery(
    undefined,
    {
      enabled: false,
    },
  );

  const broadcast = useBroadcastChannel<Cuisine>("cuisines-sync", setCuisines);

  const refreshCuisines = async () => {
    console.log("Refreshing cuisines...");
    const result = await refetch();

    if (result.data) {
      handleUpdateCuisines(result.data);
    }
  };

  const handleUpdateCuisines = useCallback(
    (cuisines: Cuisine[]) => {
      setCuisines(cuisines);
      broadcast(cuisines);
    },
    [broadcast],
  );

  const value = useMemo(
    () => ({
      cuisines: new Map(cuisines.map((cuisine) => [cuisine.id, cuisine])),
      cuisinesLoading: isFetching,
      refreshCuisines,
    }),
    [cuisines, isFetching],
  );

  return <CuisinesContext value={value} {...rest} />;
};

export { CuisinesProvider, CuisinesContext };
