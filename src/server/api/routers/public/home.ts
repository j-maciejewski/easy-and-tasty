import { eq } from "drizzle-orm";

import { defaultHomeSections, homeSectionsSchema } from "@/constants";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { config } from "@/server/db/schema";

export const publicHomeRouter = createTRPCRouter({
  getSections: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.query.config.findFirst({
      columns: {
        data: true,
      },
      where: eq(config.configType, "home_page"),
    });

    const parsed = homeSectionsSchema.safeParse(data?.data);

    if (!parsed.success) return defaultHomeSections;

    return parsed.data;
  }),
});
