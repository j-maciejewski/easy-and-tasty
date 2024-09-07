import { authedProcedure, createTRPCRouter } from "@/server/api/trpc";

export const authedUserRouter = createTRPCRouter({
	getUser: authedProcedure.query(({ ctx }) => {
		return ctx.db.query.users.findFirst({
			orderBy: (users, { desc }) => [desc(users.createdAt)],
		});
	}),

	// TODO: Add profile customization routes
});
