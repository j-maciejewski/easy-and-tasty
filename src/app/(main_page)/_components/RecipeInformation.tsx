import { GaugeHigh, GaugeLow, GaugeMedium } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Drumstick, Timer } from "lucide-react";
import { Rating } from "./Rating";

namespace RecipeInformation {
	export interface Props {
		recipe: Pick<Recipe, "difficulty" | "servings" | "time"> &
			RecipeRatingOptions;
		withText?: boolean;
		withServings?: boolean;
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

export const RecipeInformation = ({
	recipe,
	withText,
	withServings,
}: RecipeInformation.Props) => {
	return (
		<div className="flex flex-wrap items-center justify-center gap-y-2 font-semibold text-gray-600">
			{withServings && (
				<>
					<Drumstick />
					<span className="ml-2 whitespace-nowrap tracking-normal">
						{`${recipe.servings} servings`}
					</span>
					<Separator orientation="vertical" className="mx-2 h-4" />
				</>
			)}
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="flex">
						<Timer className="mr-1" />
						<span className="whitespace-nowrap">
							{recipe.time} {withText && "minutes"}
						</span>
					</div>
				</TooltipTrigger>
				<TooltipContent>{recipe.time} minutes</TooltipContent>
			</Tooltip>
			<Separator orientation="vertical" className="mx-2 h-4" />
			<Tooltip>{getDifficulty(recipe.difficulty)}</Tooltip>
			{withText && (
				<span className="ml-2 capitalize tracking-normal">
					{recipe.difficulty}
				</span>
			)}
			<Separator orientation="vertical" className="mx-2 h-4" />
			<div className="flex items-center justify-center">
				<Rating rating={recipe.avgRating} />
				{withText && (
					<span className="ml-2 whitespace-nowrap tracking-normal">
						{recipe.ratingsCount === 0
							? "Not rated"
							: `${recipe.avgRating} / 5 (${recipe.ratingsCount} reviews)`}
					</span>
				)}
			</div>
		</div>
	);
};
