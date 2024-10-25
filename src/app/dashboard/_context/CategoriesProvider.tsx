"use client";
import { ReactNode, createContext, useContext, useMemo } from "react";

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

	return <CategoriesContext.Provider value={value} {...rest} />;
};

const useCategories = () => {
	const context = useContext(CategoriesContext);

	if (context === undefined) {
		throw new Error("useCategories must be used within a CategoriesProvider");
	}

	return context;
};

const CategoriesContext = createContext<ICategoriesContext | undefined>(
	undefined,
);

export { CategoriesProvider, useCategories };
