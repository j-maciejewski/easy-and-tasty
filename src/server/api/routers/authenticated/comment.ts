import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { comment_likes, comments } from "@/server/db/schema";

export const authenticatedCommentRouter = createTRPCRouter({
  addComment: authenticatedProcedure
    .input(
      z.object({
        text: z.string().min(1).max(256),
        recipeId: z.number().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(comments).values({
        text: input.text,
        recipeId: input.recipeId,
        userId: ctx.user.id,
      });
    }),

  editComment: authenticatedProcedure
    .input(
      z.object({
        commentId: z.number().positive(),
        text: z.string().min(1).max(256),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(comments)
        .set({
          text: input.text,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(comments.id, input.commentId),
            eq(comments.userId, ctx.user.id),
          ),
        );
    }),

  deleteComment: authenticatedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input: commentId }) => {
      await ctx.db
        .delete(comments)
        .where(
          and(eq(comments.id, commentId), eq(comments.userId, ctx.user.id)),
        );
    }),

  likeComment: authenticatedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input: commentId }) => {
      await ctx.db.insert(comment_likes).values({
        commentId,
        userId: ctx.user.id,
      });
    }),

  unlikeComment: authenticatedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input: commentId }) => {
      await ctx.db
        .delete(comment_likes)
        .where(
          and(
            eq(comment_likes.commentId, commentId),
            eq(comment_likes.userId, ctx.user.id),
          ),
        );
    }),
});
