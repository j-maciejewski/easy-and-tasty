import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

import {
  authenticatedCommentRouter,
  authenticatedRecipeRouter,
  authenticatedUserRouter,
} from "./routers/authenticated";
import {
  authorizedArticleRouter,
  authorizedCategoryRouter,
  authorizedCuisineRouter,
  authorizedHomeRouter,
  authorizedNavigationRouter,
  authorizedRecipeRouter,
  authorizedSeoRouter,
  authorizedUserRouter,
} from "./routers/authorized";
import {
  publicArticleRouter,
  publicCategoryRouter,
  publicCommentRouter,
  publicCuisineRouter,
  publicHomeRouter,
  publicNavigationRouter,
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
    comment: publicCommentRouter,
    navigation: publicNavigationRouter,
    home: publicHomeRouter,
    article: publicArticleRouter,
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
    home: authorizedHomeRouter,
    article: authorizedArticleRouter,
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
