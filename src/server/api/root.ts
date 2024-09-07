import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import {
	publicCategoryRouter,
	publicCuisineRouter,
	publicRecipeRouter,
	publicUserRouter,
} from "./routers/public";
import {
	protectedCategoryRouter,
	protectedUserRouter,
	protectedRecipeRouter,
} from "./routers/protected";
import {
	authedCommentRouter,
	authedRecipeRouter,
	authedUserRouter,
} from "./routers/authed";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	public: {
		recipe: publicRecipeRouter,
		user: publicUserRouter,
		cuisine: publicCuisineRouter,
		category: publicCategoryRouter,
	},
	authed: {
		comment: authedCommentRouter,
		recipe: authedRecipeRouter,
		user: authedUserRouter,
	},
	protected: {
		category: protectedCategoryRouter,
		recipe: protectedRecipeRouter,
		user: protectedUserRouter,
	},
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
