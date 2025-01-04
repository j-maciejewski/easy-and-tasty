import { Path } from "@/config";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const publicNavigationRouter = createTRPCRouter({
  getNavigation: publicProcedure.query(() => {
    return {
      links: [
        {
          label: "Popular",
          sublinks: [
            {
              label: "Spaghetti Carbonara",
              href: "/recipe/spaghetti-carbonara",
            },
            {
              label: "Hungarian Goulash",
              href: "/recipe/hungarian-goulash",
            },
            {
              label: "Pancakes",
              href: "/recipe/pancakes",
            },
          ],
        },
        {
          label: "Ocasions",
          sublinks: [
            {
              label: "Christmas",
              href: "/christmas-recipes",
            },
            {
              label: "Valentine's Day",
              href: "/valentines-day-recipes",
            },
            {
              label: "Easter",
              href: "/easter-recipes",
            },
          ],
        },
        {
          label: "Categories",
          href: Path.CATEGORIES,
        },
        {
          label: "Cuisines",
          href: Path.CUISINES,
        },
        {
          label: "About Us",
          href: "about-us",
        },
      ],
    };
  }),
});
