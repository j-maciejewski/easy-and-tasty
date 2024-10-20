import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { recipeImageSrcParser } from "../_utils";
import { RecipeInformation } from "./RecipeInformation";

namespace RecipeCard {
	export interface Props {
		recipe: Omit<Recipe, "content" | "createdAt" | "updatedAt"> &
			RecipeRatingOptions;
	}
}

export const RecipeCard = ({ recipe }: RecipeCard.Props) => {
	return (
		<div className="group/card relative rounded-lg shadow-sm transition ease-in-out hover:bg-primary/75">
			<Tooltip>
				<TooltipTrigger className="absolute top-2 right-2 z-10" asChild>
					<button
						type="button"
						className="hidden size-10 items-center justify-center rounded-full bg-white group-hover/card:lg:flex"
					>
						<Heart className="stroke-[2.5] text-red-700" />
					</button>
				</TooltipTrigger>
				<TooltipContent>Save recipe</TooltipContent>
			</Tooltip>

			<Link href={`/recipe/${recipe.slug}`}>
				<Card className="hover:-translate-x-1 hover:-translate-y-1 flex h-full w-full max-w-[500px] flex-col overflow-hidden transition ease-in-out max-xl:min-w-[200px]">
					<CardContent className="p-0">
						<Image
							src={recipeImageSrcParser(recipe.image)}
							width={400}
							height={600}
							alt={recipe.title}
							loading="lazy"
							className="max-h-[300px] min-h-[300px] w-full rounded-t-lg object-cover"
						/>
					</CardContent>
					<CardHeader className="grow justify-center p-4 pb-2">
						<CardTitle className="text-center text-lg tracking-normal">
							{recipe.title}
						</CardTitle>
					</CardHeader>
					<CardFooter className="justify-center p-4 pt-0">
						<RecipeInformation recipe={recipe} />
					</CardFooter>
				</Card>
			</Link>
		</div>
	);
};
