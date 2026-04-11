import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  article_comment_likes,
  article_comments,
  comment_likes,
  comments,
  users,
} from "@/server/db/schema";

export const publicCommentRouter = createTRPCRouter({
  getCommentsByRecipeId: publicProcedure
    .input(
      z.object({
        recipeId: z.number().positive(),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({
          id: comments.id,
          text: comments.text,
          createdAt: comments.createdAt,
          updatedAt: comments.updatedAt,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
          likesCount: sql<number>`CAST(COUNT(DISTINCT ${comment_likes.id}) as int)`,
          isLikedByUser: input.userId
            ? sql<boolean>`CAST(COUNT(DISTINCT CASE WHEN ${comment_likes.userId} = ${input.userId} THEN 1 END) as int) > 0`
            : sql<boolean>`false`,
        })
        .from(comments)
        .where(eq(comments.recipeId, input.recipeId))
        .leftJoin(users, eq(users.id, comments.userId))
        .leftJoin(comment_likes, eq(comment_likes.commentId, comments.id))
        .groupBy(comments.id, users.id, users.name, users.email)
        .orderBy(desc(comments.createdAt));
    }),

  getCommentsByArticleId: publicProcedure
    .input(
      z.object({
        articleId: z.number().positive(),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({
          id: article_comments.id,
          text: article_comments.text,
          createdAt: article_comments.createdAt,
          updatedAt: article_comments.updatedAt,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
          likesCount: sql<number>`CAST(COUNT(DISTINCT ${article_comment_likes.id}) as int)`,
          isLikedByUser: input.userId
            ? sql<boolean>`CAST(COUNT(DISTINCT CASE WHEN ${article_comment_likes.userId} = ${input.userId} THEN 1 END) as int) > 0`
            : sql<boolean>`false`,
        })
        .from(article_comments)
        .where(eq(article_comments.articleId, input.articleId))
        .leftJoin(users, eq(users.id, article_comments.userId))
        .leftJoin(
          article_comment_likes,
          eq(article_comment_likes.articleCommentId, article_comments.id),
        )
        .groupBy(article_comments.id, users.id, users.name, users.email)
        .orderBy(desc(article_comments.createdAt));
    }),
});
