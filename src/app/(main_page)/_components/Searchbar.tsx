"use client";

import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { LoaderCircle, Search } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

export const Searchbar = () => {
	const [query, setQuery] = useState("");
	const [debouncedValue, setDebouncedValue] = useState<string>(query);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(query);
		}, 300);

		return () => {
			clearTimeout(handler);
		};
	}, [query]);

	const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
		setQuery(evt.target.value);
	};
	const { data, error, isLoading } =
		api.public.recipe.getRecipesByQuery.useQuery(debouncedValue, {
			enabled: debouncedValue.length >= 3,
		});

	const SearchResults = useMemo(() => {
		if (isLoading || query !== debouncedValue) {
			return (
				<LoaderCircle className="text-gray-500 mx-auto my-2 animate-spin" />
			);
		}

		if (data !== undefined && data.length === 0) {
			return <div className="py-2 px-4 italic">No results</div>;
		}

		if (error) {
			return <div className="py-2 px-4 italic">An error occured</div>;
		}

		return (
			<>
				{data?.map((recipe) => (
					<Link
						key={recipe.id}
						href={`/recipe/${recipe.slug}`}
						className="text-sm font-semibold [&:not(:last-child)>div]:border-b"
					>
						<div className="p-3 hover:bg-gray-100">{recipe.title}</div>
					</Link>
				))}
			</>
		);
	}, [isLoading, data, error, query, debouncedValue]);

	return (
		<div className="relative max-sm:w-full mr-4">
			<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Search recipes..."
				className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[360px] h-fit peer/input focus-visible:ring-primary/75"
				value={query}
				onChange={handleChange}
			/>
			{query.length >= 3 && (
				<div className="absolute top-full w-full z-50 hidden peer-focus/input:block hover:block">
					<div className="mt-2 bg-white max-h-64 overflow-auto border rounded-lg">
						{SearchResults}
					</div>
				</div>
			)}
		</div>
	);
};
