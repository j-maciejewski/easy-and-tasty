import { authorizedProcedure, createTRPCRouter } from "@/server/api/trpc";

export const authorizedNavigationRouter = createTRPCRouter({
  getNavigation: authorizedProcedure.query(() => {
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
              label: "Pierogi",
              href: "/recipe/pierogi",
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
          href: "/categories",
        },
        {
          label: "Cuisines",
          href: "/cuisines",
        },
      ],
    };
  }),
});
