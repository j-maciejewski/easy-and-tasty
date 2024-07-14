import { GaugeHigh, GaugeLow, GaugeMedium } from "@/components/icons";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heart, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "./Rating";

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

const getDifficulty = (difficulty: string) => {
	const [text, Icon] = (() => {
		if (difficulty === "easy")
			return ["Easy", <GaugeLow key="easy" className="text-green-600" />];
		if (difficulty === "medium")
			return ["Medium", <GaugeMedium key="easy" className="text-yellow-600" />];
		return ["Hard", <GaugeHigh key="hard" className="text-red-600" />];
	})();

	return (
		<>
			<TooltipTrigger>{Icon}</TooltipTrigger>
			<TooltipContent>{text}</TooltipContent>
		</>
	);
};

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

			<Card className="min-w-[200px] max-w-[400px] w-full flex flex-col h-full shadow">
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
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex text-gray-600">
								<Timer className="mr-1" />
								<span className="font-semibold">{recipe.time}</span>
							</div>
						</TooltipTrigger>
						<TooltipContent>{recipe.time} minutes</TooltipContent>
					</Tooltip>
					<Separator orientation="vertical" className="h-4 mx-2" />
					<Tooltip>{getDifficulty(recipe.difficulty)}</Tooltip>
					<Separator orientation="vertical" className="h-4 mx-2" />
					<Rating rating={recipe.rating} />
				</CardFooter>
			</Card>
		</div>
	);
};
