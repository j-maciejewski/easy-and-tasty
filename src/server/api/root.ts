import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import {
	commentLikeRouter,
	commentRouter,
	ratingRouter,
	recipeLikeRouter,
	recipeRouter,
	recipeTagRouter,
	tagRouter,
	userRouter,
} from "./routers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	tag: tagRouter,
	user: userRouter,
	recipe: recipeRouter,
	comment: commentRouter,
	commentLike: commentLikeRouter,
	recipeLike: recipeLikeRouter,
	recipeTag: recipeTagRouter,
	rating: ratingRouter,
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
