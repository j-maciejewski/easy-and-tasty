import { GaugeHigh, GaugeLow, GaugeMedium } from "@/components/icons";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Timer } from "lucide-react";
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
		};
	}
}

const getDifficultyIcon = (difficulty: string) => {
	if (difficulty === "easy") return <GaugeLow className="text-green-600" />;
	if (difficulty === "medium")
		return <GaugeMedium className="text-yellow-600" />;
	return <GaugeHigh className="text-red-600" />;
};

export const RecipeCard = ({ recipe }: RecipeCard.Props) => {
	return (
		<Link href={"/"}>
			<Card className="min-w-[200px] max-w-[400px] w-full flex flex-col h-full">
				<CardContent className="p-0 overflow-hidden rounded-t-lg">
					<Image
						src={`/${recipe.image}`}
						width={400}
						height={600}
						alt="cake"
						className="rounded-t-lg max-h-[300px] object-cover w-full transition ease-in-out hover:scale-[1.05]"
					/>
				</CardContent>
				<CardHeader className="p-4 grow">
					<CardTitle className="text-lg">{recipe.title}</CardTitle>
				</CardHeader>
				<CardFooter className="p-4 pt-0 justify-center">
					<Timer className="mr-1" />
					<span className="text-gray-600">{recipe.time}</span>
					<Separator orientation="vertical" className="h-4 mx-2" />
					{getDifficultyIcon(recipe.difficulty)}
					<Separator orientation="vertical" className="h-4 mx-2" />
					<Rating rating={recipe.rating} />
				</CardFooter>
			</Card>
		</Link>
	);
};
