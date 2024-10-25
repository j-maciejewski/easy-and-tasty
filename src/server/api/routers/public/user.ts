import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { z } from "zod";

export const publicUserRouter = createTRPCRouter({
	getUser: publicProcedure.query(({ ctx }) => {
		return ctx.db.query.users.findFirst({
			orderBy: (users, { desc }) => [desc(users.createdAt)],
		});
	}),

	createUser: publicProcedure
		.input(
			z.object({
				firstName: z.string().min(1),
				lastName: z.string().min(1),
				email: z.string().email(),
				password: z.string().min(1),
				descrption: z.string().min(1).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(users).values({
				firstName: input.firstName,
				lastName: input.lastName,
				email: input.email,
				password: input.password,
			});
		}),

	validateUser: publicProcedure
		.input(
			z.object({
				firstName: z.string().min(1),
				lastName: z.string().min(1),
				email: z.string().email(),
				password: z.string().min(1),
				descrption: z.string().min(1).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(users).values({
				firstName: input.firstName,
				lastName: input.lastName,
				email: input.email,
				password: input.password,
			});
		}),
});
