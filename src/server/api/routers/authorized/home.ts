import { eq } from "drizzle-orm";

import { defaultHomeSections, homeSectionsSchema } from "@/constants";
import { authorizedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { config } from "@/server/db/schema";

export const authorizedHomeRouter = createTRPCRouter({
  getSections: authorizedProcedure.query(async ({ ctx }) => {
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

  updateSections: authorizedProcedure
    .input(homeSectionsSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(config)
        .values({ configType: "home_page", data: input })
        .onConflictDoUpdate({
          target: config.configType,
          set: { data: input },
        });
    }),
});
