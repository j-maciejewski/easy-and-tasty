import { authorizedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const authorizedUserRouter = createTRPCRouter({
  getUsers: authorizedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findMany({
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });
  }),

  getCurrentUser: authorizedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findFirst({
      columns: {
        id: true,
        email: true,
        name: true,
        image: true,
        preferences: true,
      },
      where: (users, { eq }) => eq(users.id, ctx.user.id),
    });
  }),

  updateUserPreferences: authorizedProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ preferences: JSON.stringify({ dashboard: input }) })
        .where(eq(users.id, ctx.user.id));
    }),
});
