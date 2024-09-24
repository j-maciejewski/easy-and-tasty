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
import { RecipeInformation } from "./RecipeInformation";
import SampleImage from "@/public/mock/meals/sample-image.jpg";

namespace RecipeCard {
	export interface Props {
		recipe: Omit<Recipe, "content" | "createdAt" | "updatedAt"> &
			RecipeRatingOptions;
	}
}

export const RecipeCard = ({ recipe }: RecipeCard.Props) => {
	return (
		<div className="relative group/card">
			<Tooltip>
				<TooltipTrigger className="absolute right-2 top-2 z-10" asChild>
					<button
						type="button"
						className="size-10 rounded-full bg-white justify-center items-center hidden group-hover/card:lg:flex"
					>
						<Heart className="text-red-700 stroke-[2.5]" />
					</button>
				</TooltipTrigger>
				<TooltipContent>Save recipe</TooltipContent>
			</Tooltip>

			<Card className="max-xl:min-w-[200px] max-w-[500px] w-full flex flex-col h-full shadow">
				<CardContent className="p-0 rounded-t-lg hover:bg-primary/50 transition ease-in-out">
					<Link href={`/recipe/${recipe.slug}`}>
						<Image
							src={recipe.image ? `/mock/meals/${recipe.image}` : SampleImage}
							width={400}
							height={600}
							alt={recipe.title}
							loading="lazy"
							className="rounded-t-lg min-h-[300px] max-h-[300px] object-cover w-full transition ease-in-out hover:-translate-x-1 hover:-translate-y-1"
						/>
					</Link>
				</CardContent>
				<CardHeader className="p-4 pb-2 grow justify-center">
					<CardTitle className="text-lg text-center">
						<Link
							href={`/recipe/${recipe.slug}`}
							className="hover:text-primary/95"
						>
							{recipe.title}
						</Link>
					</CardTitle>
				</CardHeader>
				<CardFooter className="p-4 pt-0 justify-center">
					<RecipeInformation recipe={recipe} />
				</CardFooter>
			</Card>
		</div>
	);
};
