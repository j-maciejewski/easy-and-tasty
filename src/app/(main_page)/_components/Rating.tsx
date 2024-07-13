import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Star } from "lucide-react";
import { Fragment } from "react";

namespace Rating {
	export interface Props {
		rating: number;
	}
}

const EmptyStar = (
	<Star className="size-4 text-gray-500 fill-gray-300 stroke-[1.75]" />
);

const FilledStar = <Star className="size-4 text-yellow-300 fill-yellow-300" />;

export const Rating = ({ rating }: Rating.Props) => {
	const scorePercent = (rating / 5) * 100;

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div className="relative">
					<div className="flex gap-[1px]">
						{[...Array(5).keys()].map((idx) => (
							<Fragment key={idx}>{EmptyStar}</Fragment>
						))}
					</div>
					{!!rating && (
						<div
							className="gap-[1px] absolute top-0 overflow-hidden"
							style={{ display: "-webkit-box", width: `${scorePercent}%` }}
						>
							{[...Array(5).keys()].map((idx) => (
								<Fragment key={idx}>{FilledStar}</Fragment>
							))}
						</div>
					)}
				</div>
			</TooltipTrigger>
			<TooltipContent>
				{rating ? `Rating: ${rating}` : "Dish not rated"}
			</TooltipContent>
		</Tooltip>
	);
};
