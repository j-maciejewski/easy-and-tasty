import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import {
  authedCommentRouter,
  authedRecipeRouter,
  authedUserRouter,
} from "./routers/authed";
import {
  protectedCategoryRouter,
  protectedCuisineRouter,
  protectedRecipeRouter,
  protectedUserRouter,
} from "./routers/protected";
import {
  publicCategoryRouter,
  publicCuisineRouter,
  publicNavigationRouter,
  publicRecipeRouter,
  publicUserRouter,
} from "./routers/public";
import { seedRouter } from "./routers/seed";

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
    navigation: publicNavigationRouter,
  },
  authed: {
    comment: authedCommentRouter,
    recipe: authedRecipeRouter,
    user: authedUserRouter,
  },
  protected: {
    category: protectedCategoryRouter,
    cuisine: protectedCuisineRouter,
    recipe: protectedRecipeRouter,
    user: protectedUserRouter,
  },
  seeder: seedRouter,
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
