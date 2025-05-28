import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";

export const authenticatedUserRouter = createTRPCRouter({
  getUser: authenticatedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findFirst({
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });
  }),
});
