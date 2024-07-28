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
		recipe: {
			id: number;
			title: string;
			rating: number;
			time: number;
			difficulty: string;
			image: string;
			servings: number;
			slug: string;
		};
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
		<div className="flex justify-center items-center text-gray-600 font-semibold flex-wrap gap-y-2">
			{withServings && (
				<>
					<Drumstick />
					<span className="ml-2 tracking-normal whitespace-nowrap">
						{`${recipe.servings} servings`}
					</span>
					<Separator orientation="vertical" className="h-4 mx-2" />
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
			<Separator orientation="vertical" className="h-4 mx-2" />
			<Tooltip>{getDifficulty(recipe.difficulty)}</Tooltip>
			{withText && (
				<span className="ml-2 tracking-normal capitalize">
					{recipe.difficulty}
				</span>
			)}
			<Separator orientation="vertical" className="h-4 mx-2" />
			<div className="flex justify-center items-center">
				<Rating rating={recipe.rating} />
				{withText && (
					<span className="ml-2 tracking-normal whitespace-nowrap">
						{`${recipe.rating} / 5 (15 reviews)`}
					</span>
				)}
			</div>
		</div>
	);
};
