import { api } from "@/trpc/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs, RecipeInformation, SideBar } from "../../_components";
import Markdown from "markdown-to-jsx";

export default async function ({ params }: { params: { slug: string } }) {
	const recipe = await api.public.recipe.getRecipeBySlug(params.slug);

	if (!recipe) {
		notFound();
	}

	return (
		<>
			<div className="pt-6 xl:pr-8 overflow-hidden max-xl:px-[3vw] grow">
				<Breadcrumbs
					paths={[{ label: "Recipe" }, { label: recipe.title, active: true }]}
				/>
				<h2 className="text-3xl font-semibold text-center">{recipe.title}</h2>
				<div className="max-h-[700px] my-6 lg:px-12">
					<Image
						src={`/mock/meals/${recipe.image}`}
						width={400}
						height={600}
						alt="recipe"
						loading="lazy"
						className="rounded-lg max-sm:w-full min-h-full object-cover max-h-[700px] mx-auto w-full"
					/>
				</div>
				<RecipeInformation recipe={recipe} withText withServings />
				<article className="prose prose-slate max-w-full">
					<Markdown>{recipe.content}</Markdown>
				</article>
			</div>
			<SideBar />
		</>
	);
}
