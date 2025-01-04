import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const protectedUserRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findMany({
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });
  }),
});
