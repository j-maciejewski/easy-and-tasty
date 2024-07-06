import { DevInput } from "@/app/_components/dev-input";
import { api } from "@/trpc/server";

export default async function () {
	return <>{/* <CrudShowcase /> */}</>;
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
