"use client";
import { ReactNode, createContext, useContext, useMemo } from "react";

interface ICuisinesContext {
	cuisines: Map<
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

const CuisinesProvider = async ({
	cuisines,
	...rest
}: {
	children: ReactNode;
	cuisines: {
		id: number;
		name: string;
		description: string;
		slug: string;
		featuredRecipeId: number | null;
	}[];
}) => {
	const value = useMemo(
		() => ({
			cuisines: new Map(cuisines.map((cuisine) => [cuisine.id, cuisine])),
		}),
		[cuisines],
	);

	return <CuisinesContext.Provider value={value} {...rest} />;
};

const useCuisines = () => {
	const context = useContext(CuisinesContext);

	if (context === undefined) {
		throw new Error("useCuisines must be used within a CuisinesProvider");
	}

	return context;
};

const CuisinesContext = createContext<ICuisinesContext | undefined>(undefined);

export { CuisinesProvider, useCuisines };
