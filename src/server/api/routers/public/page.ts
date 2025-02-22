import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { pages } from "@/server/db/schema";
import { and, ilike, isNotNull } from "drizzle-orm";
import { z } from "zod";

const MOCK_PAGES = [
  {
    id: 1,
    title: "Christmas recipes",
    slug: "christmas-recipes",
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  },
  {
    id: 2,
    title: "Easter recipes",
    slug: "easter-recipes",
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: null,
  },
];

export const publicPageRouter = createTRPCRouter({
  getPage: publicProcedure
    .input(z.string())
    .query(({ ctx, input: pageSlug }) => {
      return ctx.db.query.pages.findFirst({
        orderBy: (pages, { desc }) => [desc(pages.createdAt)],
        where: and(ilike(pages.slug, pageSlug), isNotNull(pages.publishedAt)),
      });
    }),

  getPages: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.pages.findMany({
      orderBy: (pages, { desc }) => [desc(pages.createdAt)],
      where: isNotNull(pages.publishedAt),
    });
  }),
});
