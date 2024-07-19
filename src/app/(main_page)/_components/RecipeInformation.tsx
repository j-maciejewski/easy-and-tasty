import { GaugeHigh, GaugeLow, GaugeMedium } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Timer } from "lucide-react";
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

export const RecipeInformation = ({ recipe }: RecipeInformation.Props) => {
	return (
		<div className="flex justify-center items-center">
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
		</div>
	);
};
