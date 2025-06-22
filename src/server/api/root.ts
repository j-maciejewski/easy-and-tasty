import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

import {
  authenticatedCommentRouter,
  authenticatedRecipeRouter,
  authenticatedUserRouter,
} from "./routers/authenticated";
import {
  authorizedCategoryRouter,
  authorizedCuisineRouter,
  authorizedNavigationRouter,
  authorizedPageRouter,
  authorizedRecipeRouter,
  authorizedSeoRouter,
  authorizedUserRouter,
} from "./routers/authorized";
import {
  publicCategoryRouter,
  publicCuisineRouter,
  publicNavigationRouter,
  publicPageRouter,
  publicRecipeRouter,
  publicSeoRouter,
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
    page: publicPageRouter,
    seo: publicSeoRouter,
  },
  authenticated: {
    comment: authenticatedCommentRouter,
    recipe: authenticatedRecipeRouter,
    user: authenticatedUserRouter,
  },
  authorized: {
    category: authorizedCategoryRouter,
    cuisine: authorizedCuisineRouter,
    recipe: authorizedRecipeRouter,
    user: authorizedUserRouter,
    navigation: authorizedNavigationRouter,
    page: authorizedPageRouter,
    seo: authorizedSeoRouter,
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
