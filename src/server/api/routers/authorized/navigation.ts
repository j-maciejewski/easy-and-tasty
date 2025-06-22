import { eq } from "drizzle-orm";
import z from "zod";

import { authorizedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { config } from "@/server/db/schema";

export const authorizedNavigationRouter = createTRPCRouter({
  getNavigation: authorizedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.query.config.findFirst({
      columns: {
        data: true,
      },
      where: eq(config.configType, "header_navigation"),
    });

    return (
      (data?.data as {
        label: string;
        href?: string;
        sublinks: { label: string; href: string }[];
      }[]) ?? []
    );
  }),

  updateNavigation: authorizedProcedure
    .input(
      z.array(
        z.object({
          label: z.string(),
          href: z.string().optional(),
          sublinks: z
            .array(z.object({ label: z.string(), href: z.string() }))
            .optional(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(config)
        .values({ configType: "header_navigation", data: input })
        .onConflictDoUpdate({
          target: config.configType,
          set: { data: input },
        });
    }),
});
