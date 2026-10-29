"use client";

import { Star } from "lucide-react";
import { Fragment } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";

interface RatingProps {
  rating: number;
}

const EmptyStar = <Star className="size-4 fill-border stroke-0 text-border" />;

const FilledStar = (
  <Star className="size-4 fill-saffron stroke-0 text-saffron" />
);

export const Rating = ({ rating }: RatingProps) => {
  const scorePercent = Number.isFinite(rating) ? (rating / 5) * 100 : 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative my-auto w-fit">
          <div className="flex h-full gap-px">
            {[...Array(5).keys()].map((idx) => (
              <Fragment key={idx}>{EmptyStar}</Fragment>
            ))}
          </div>
          {!!scorePercent && (
            <div
              className="absolute top-0 flex h-full gap-px overflow-hidden"
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
