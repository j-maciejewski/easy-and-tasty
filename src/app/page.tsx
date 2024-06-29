import { DevInput } from "@/app/_components/dev-input";
import { api } from "@/trpc/server";

export default async function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
				<h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
					<span className="text-[hsl(115,60%,60%)]">easy and tasty</span>
				</h1>

				{/* <CrudShowcase /> */}
			</div>
		</main>
	);
}

async function CrudShowcase() {
	const results = await api.recipe.getRecipes();

	return (
		<div className="w-full max-w-xs">
			{results ? (
				<p className="truncate">results: {JSON.stringify(results)}</p>
			) : (
				<p>no results</p>
			)}

			<DevInput />
		</div>
	);
}
