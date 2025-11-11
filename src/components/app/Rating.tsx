import { Star } from "lucide-react";
import { Fragment } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";

interface RatingProps {
  rating: number;
}

const EmptyStar = (
  <Star className="size-4 fill-gray-300 stroke-[1.75] text-gray-500" />
);

const FilledStar = <Star className="size-4 fill-yellow-300 text-yellow-300" />;

export const Rating = ({ rating }: RatingProps) => {
  const scorePercent = (rating / 5) * 100;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative my-auto w-fit">
          <div className="flex h-full gap-px">
            {[...Array(5).keys()].map((idx) => (
              <Fragment key={idx}>{EmptyStar}</Fragment>
            ))}
          </div>
          {!!rating && (
            <div
              className="absolute top-0 h-full gap-px overflow-hidden"
              style={{ display: "-webkit-box", width: `${scorePercent}%` }}
            >
              {[...Array(5).keys()].map((idx) => (
                <Fragment key={idx}>{FilledStar}</Fragment>
              ))}
            </div>
          )}
        </div>
      </TooltipTrigger>
      {!!rating && <TooltipContent>{`Rating: ${rating}`}</TooltipContent>}
    </Tooltip>
  );
};
