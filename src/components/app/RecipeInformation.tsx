import clsx from "clsx";
import { Timer, Users } from "lucide-react";

import { getDifficultyIcon } from "@/utils";

import { Rating } from "./Rating";

interface RecipeInformationProps {
  recipe: Pick<Recipe, "difficulty" | "servings" | "time"> &
    RecipeRatingOptions;
  className?: string;
}

export const RecipeInformation = ({
  className,
  recipe,
}: RecipeInformationProps) => {
  const items = [
    {
      label: "Time",
      icon: <Timer className="size-5" aria-hidden />,
      value: `${recipe.time} min`,
    },
    {
      label: "Serves",
      icon: <Users className="size-5" aria-hidden />,
      value: recipe.servings,
    },
    {
      label: "Difficulty",
      icon: getDifficultyIcon(recipe.difficulty),
      value: <span className="capitalize">{recipe.difficulty}</span>,
    },
    {
      label:
        recipe.ratingsCount === 0
          ? "Not rated yet"
          : `${recipe.ratingsCount} ${recipe.ratingsCount === 1 ? "rating" : "ratings"}`,
      icon: <Rating rating={recipe.avgRating} />,
      value: recipe.ratingsCount === 0 ? null : `${recipe.avgRating} / 5`,
    },
  ];

  return (
    <dl
      className={clsx(
        "bg-border grid grid-cols-2 gap-px overflow-hidden rounded-2xl sm:grid-cols-4",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="bg-card flex flex-col gap-1 p-4">
          <dt className="text-muted-foreground text-xs">{item.label}</dt>
          <dd className="font-display flex items-center gap-2 text-lg font-semibold">
            <span className="text-primary">{item.icon}</span>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
};
