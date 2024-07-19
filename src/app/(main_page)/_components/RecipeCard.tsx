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

namespace RecipeCard {
	export interface Props {
		recipe: {
			id: number;
			title: string;
			rating: number;
			time: number;
			difficulty: string;
			image: string;
			slug: string;
		};
	}
}

export const RecipeCard = ({ recipe }: RecipeCard.Props) => {
	return (
		<div className="relative group/card">
			<Tooltip>
				<TooltipTrigger className="absolute right-2 top-2 z-10" asChild>
					<button
						type="button"
						className="size-10 rounded-full bg-white justify-center items-center hidden group-hover/card:flex"
					>
						<Heart className="text-red-700 stroke-[2.5]" />
					</button>
				</TooltipTrigger>
				<TooltipContent>Save recipe</TooltipContent>
			</Tooltip>

			<Card className="max-xl:min-w-[200px] max-w-[400px] w-full flex flex-col h-full shadow">
				<CardContent className="p-0 overflow-hidden rounded-t-lg">
					<Link href={`/recipe/${recipe.slug}`}>
						<Image
							src={`/mock/meals/${recipe.image}`}
							width={400}
							height={600}
							alt="recipe"
							loading="lazy"
							className="rounded-t-lg max-h-[300px] object-cover w-full transition ease-in-out hover:scale-[1.05]"
						/>
					</Link>
				</CardContent>
				<CardHeader className="p-4 grow">
					<CardTitle className="text-lg">
						<Link
							href={`/recipe/${recipe.slug}`}
							className="hover:text-green-600"
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
