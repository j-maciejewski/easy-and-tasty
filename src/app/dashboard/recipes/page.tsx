"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
	Pagination,
	PaginationButton,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { getPaginationTiles } from "@/utils";
import { ChevronDown, ChevronUp, Columns3, Menu, Plus, X } from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useCategories } from "../_context";
import { useCuisines } from "../_context/CuisinesProvider";

export default function RecipesDashboard() {
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
	const { categories } = useCategories();
	const { cuisines } = useCuisines();

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
			setPage(1);
		}, 300);

		return () => {
			clearTimeout(handler);
		};
	}, [searchTerm]);

	const clearSearch = () => {
		setSearchTerm("");
		setDebouncedSearchTerm("");
	};

	const [sortField, setSortField] = useState<string | undefined>(undefined);
	const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
	const [resultsPerQuery, setResultsPerQuery] = useState(10);
	const [page, setPage] = useState(1);

	const updateResultsPerQuery = (value: number) => {
		setResultsPerQuery(value);
		setPage(1);
	};

	const {
		data: recipes,
		isLoading,
		error,
	} = api.protected.recipe.getRecipes.useQuery({
		title: debouncedSearchTerm,
		orderBy: sortField,
		orderDir: sortDir,
		page,
		limit: resultsPerQuery,
	});

	const paginationConfig = useMemo(
		() =>
			recipes?.pagination
				? {
						previousDisabled: recipes.pagination.currentPage === 1,
						tiles: getPaginationTiles(
							recipes.pagination.currentPage,
							recipes.pagination.pagesCount,
						),
						nextDisabled:
							recipes.pagination.currentPage === recipes.pagination.pagesCount,
					}
				: null,
		[recipes?.pagination],
	);

	const toggleSort = (field: string) => {
		if (sortField === field) {
			if (sortDir === "asc") setSortDir("desc");
			else {
				setSortDir("asc");
				setSortField(undefined);
			}
			setPage(1);
			return;
		}

		setSortField(field);
		setSortDir("asc");
		setPage(1);
	};

	const [columns, setColumns] = useState<
		{
			label: string;
			render: (
				recipe: NonNullable<typeof recipes>["results"][number],
			) => ReactNode;
			sortKey?: string;
			hidden?: boolean;
		}[]
	>([
		{
			label: "Title",
			sortKey: "title",
			render: (recipe) => recipe.title,
		},
		{
			label: "Categories",
			render: (recipe) => (
				<div className="inline-flex gap-2">
					{recipe.categoryIds.map((id) => (
						<Badge key={id} variant="outline">
							{categories.get(id)?.name}
						</Badge>
					))}
				</div>
			),
		},
		{
			label: "Cuisines",
			render: (recipe) => (
				<div className="inline-flex gap-2">
					{recipe.cuisineIds.map((id) => (
						<Badge key={id} variant="outline">
							{cuisines.get(id)?.name}
						</Badge>
					))}
				</div>
			),
		},
		{
			label: "Rating",
			sortKey: "avg_rating",
			render: (recipe) => recipe.avgRating,
		},
		{
			label: "Comments",
			render: () => "0",
		},
		{
			label: "Votes",
			render: (recipe) => recipe.ratingsCount,
			sortKey: "ratings_count",
			hidden: true,
		},
		{
			label: "Created At",
			render: (recipe) => new Date(recipe.createdAt).toLocaleString(),
			hidden: true,
		},
		{
			label: "Updated At",
			render: (recipe) =>
				recipe.updatedAt ? new Date(recipe.updatedAt).toLocaleString() : null,
			hidden: true,
		},
		{
			label: "Actions",
			render: () => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<Menu className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem>View Recipe</DropdownMenuItem>
						<DropdownMenuItem>Edit Recipe</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-red-600">
							Delete Recipe
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
		},
	]);

	const updateColumnsVisibility = (
		updatedColumns: (typeof columns)[number]["label"][],
	) => {
		setColumns(
			columns.map((column) => ({
				...column,
				hidden: !updatedColumns.includes(column.label),
			})),
		);
	};

	return (
		<>
			{error ? (
				<div>{JSON.stringify(error)}</div>
			) : (
				<main className="flex-1 overflow-y-auto overflow-x-hidden">
					<div className="container mx-auto px-6 py-8">
						<div className="mb-6 flex flex-col items-center justify-between md:flex-row">
							<div className="mb-4 w-full md:mb-0 md:w-1/3">
								<Input
									type="search"
									placeholder="Search recipes..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full"
								/>
							</div>

							<div className="flex gap-4">
								<MultiSelect
									options={columns.map((column) => ({
										label: column.label,
										value: column.label,
									}))}
									onValueChange={updateColumnsVisibility}
									defaultValue={columns
										.filter((column) => !column.hidden)
										.map((column) => column.label)}
									placeholder="Select frameworks"
									variant="inverted"
									maxCount={3}
									SimplifiedViewIcon={Columns3}
								/>
								{/* <Button
									className="border bg-background p-1 px-4"
									variant="outline"
								>
									<Filter className="mr-2 h-5" /> Filters
								</Button> */}
								<Button className="relative aspect-square" variant="secondary">
									<Plus className="absolute size-5 stroke-2 text-foreground" />
								</Button>
							</div>
						</div>
						<div className="mb-6 empty:hidden">
							{debouncedSearchTerm && (
								<Badge
									variant="outline"
									className="cursor-pointer"
									tabIndex={0}
									onClick={clearSearch}
								>
									Query: {debouncedSearchTerm}{" "}
									<X className="h-4 text-red-600" />
								</Badge>
							)}
						</div>

						{isLoading ? (
							<Table>
								<TableHeader>
									<TableRow>
										{columns
											.filter((column) => !column.hidden)
											.map((column) => (
												<TableCell key={column.label}>{column.label}</TableCell>
											))}
									</TableRow>
								</TableHeader>
								<TableBody>
									{Array.from(Array(10).keys()).map((idx) => (
										<TableRow key={idx}>
											{columns
												.filter((column) => !column.hidden)
												.map((column) => (
													<TableCell key={column.label}>
														<Skeleton className="h-[20px] w-[200px] rounded-full" />
													</TableCell>
												))}
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : recipes?.results?.length !== undefined &&
							recipes?.results?.length > 0 ? (
							<>
								<Table>
									<TableHeader>
										<TableRow>
											{columns
												.filter((column) => !column.hidden)
												.map((column) => (
													<TableHead
														key={column.label}
														className={cn(
															"select-none",
															column.sortKey &&
																"cursor-pointer hover:bg-gray-200/50",
														)}
														{...(column.sortKey
															? {
																	onClick: () =>
																		toggleSort(column.sortKey as string),
																}
															: {})}
													>
														<span className="flex justify-between">
															{column.label}
															{column.sortKey &&
																sortField === column.sortKey &&
																(sortDir === "asc" ? (
																	<ChevronUp />
																) : (
																	<ChevronDown />
																))}
														</span>
													</TableHead>
												))}
										</TableRow>
									</TableHeader>
									<TableBody>
										{recipes?.results?.map((recipe) => (
											<TableRow key={recipe.id}>
												{columns
													.filter((column) => !column.hidden)
													.map((column) => (
														<TableCell
															key={column.label}
															className="font-medium"
														>
															{column.render(recipe)}
														</TableCell>
													))}
											</TableRow>
										))}
									</TableBody>
								</Table>
								<div className="mt-4 flex items-center justify-between">
									<span className="text-nowrap font-semibold text-muted-foreground text-sm">
										Total results: {recipes.pagination?.hitsCount}
									</span>
									<Select
										value={`${resultsPerQuery}`}
										onValueChange={(value) =>
											updateResultsPerQuery(Number(value))
										}
									>
										<SelectTrigger className="mr-4 ml-auto w-[180px]">
											<SelectValue>
												Results shown: {resultsPerQuery}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={"10"}>10</SelectItem>
											<SelectItem value={"20"}>20</SelectItem>
											<SelectItem value={"50"}>50</SelectItem>
										</SelectContent>
									</Select>
									{paginationConfig &&
										recipes.pagination &&
										recipes.pagination.pagesCount !== 1 && (
											<Pagination className="mx-0 w-fit rounded-lg border">
												<PaginationContent className="gap-0 [&>li:not(:first-child)]:border-l-2">
													<PaginationItem
														disabled={paginationConfig.previousDisabled}
													>
														<PaginationPrevious
															className="rounded-r-none"
															onClick={() =>
																setPage(
																	(
																		recipes.pagination as NonNullable<
																			typeof recipes.pagination
																		>
																	).currentPage - 1,
																)
															}
														/>
													</PaginationItem>
													{paginationConfig.tiles.map((number) => (
														<PaginationItem key={number}>
															{number !== null ? (
																<PaginationButton
																	className="rounded-none"
																	onClick={() => setPage(number)}
																	isActive={page === number}
																>
																	{number}
																</PaginationButton>
															) : (
																<PaginationEllipsis />
															)}
														</PaginationItem>
													))}
													<PaginationItem
														disabled={paginationConfig.nextDisabled}
													>
														<PaginationNext
															className="rounded-l-none"
															onClick={() =>
																setPage(
																	(
																		recipes.pagination as NonNullable<
																			typeof recipes.pagination
																		>
																	).currentPage + 1,
																)
															}
														/>
													</PaginationItem>
												</PaginationContent>
											</Pagination>
										)}
								</div>
							</>
						) : (
							"No recipes"
						)}
					</div>
				</main>
			)}
		</>
	);
}
