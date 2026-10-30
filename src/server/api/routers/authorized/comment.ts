import { asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { z } from "zod";

import { authorizedProcedure, createTRPCRouter } from "@/server/api/trpc";
import {
  article_comment_likes,
  article_comments,
  articles,
  comment_likes,
  comments,
  recipes,
  users,
} from "@/server/db/schema";

const commentTypeSchema = z.enum(["recipe", "article"]);

const commentSources = {
  recipe: {
    comments,
    likes: comment_likes,
    likeCommentId: comment_likes.commentId,
    target: recipes,
    targetId: comments.recipeId,
  },
  article: {
    comments: article_comments,
    likes: article_comment_likes,
    likeCommentId: article_comment_likes.articleCommentId,
    target: articles,
    targetId: article_comments.articleId,
  },
};

export const authorizedCommentRouter = createTRPCRouter({
  getComments: authorizedProcedure
    .input(
      z.object({
        type: commentTypeSchema,
        query: z.string().optional(),
        orderBy: z.string().optional().default("createdAt"),
        orderDir: z.enum(["desc", "asc"]).optional().default("desc"),
        page: z.number().optional().default(1),
        limit: z.number().optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const source = commentSources[input.type];

      const where = input.query
        ? or(
            ilike(source.comments.text, `%${input.query}%`),
            ilike(source.target.title, `%${input.query}%`),
            ilike(users.name, `%${input.query}%`),
          )
        : undefined;

      const likesCount = sql<number>`CAST(COUNT(${source.likes.id}) as int)`;

      const sortableColumns = {
        createdAt: source.comments.createdAt,
        text: source.comments.text,
        target: source.target.title,
        author: users.name,
        likes: likesCount,
      };
      const sortColumn =
        sortableColumns[input.orderBy as keyof typeof sortableColumns] ??
        source.comments.createdAt;

      const [results, totalResults] = await Promise.all([
        ctx.db
          .select({
            id: source.comments.id,
            text: source.comments.text,
            createdAt: source.comments.createdAt,
            likes: likesCount,
            target: {
              id: source.target.id,
              title: source.target.title,
              slug: source.target.slug,
            },
            user: {
              id: users.id,
              name: users.name,
            },
          })
          .from(source.comments)
          .innerJoin(source.target, eq(source.targetId, source.target.id))
          .innerJoin(users, eq(source.comments.userId, users.id))
          .leftJoin(source.likes, eq(source.likeCommentId, source.comments.id))
          .where(where)
          .groupBy(source.comments.id, source.target.id, users.id)
          .orderBy(
            input.orderDir === "desc" ? desc(sortColumn) : asc(sortColumn),
            desc(source.comments.id),
          )
          .offset((input.page - 1) * input.limit)
          .limit(input.limit),
        ctx.db
          .select({ total: sql<number>`CAST(COUNT(*) as int)` })
          .from(source.comments)
          .innerJoin(source.target, eq(source.targetId, source.target.id))
          .innerJoin(users, eq(source.comments.userId, users.id))
          .where(where),
      ]);

      const total = totalResults[0]?.total ?? 0;

      return {
        results,
        pagination: {
          hitsCount: total,
          currentPage: input.page,
          pagesCount: Math.ceil(total / input.limit),
        },
      };
    }),

  deleteComments: authorizedProcedure
    .input(
      z.object({
        type: commentTypeSchema,
        ids: z.number().positive().array().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const source = commentSources[input.type];

      return ctx.db.transaction(async (tx) => {
        await tx
          .delete(source.likes)
          .where(inArray(source.likeCommentId, input.ids));

        const deleted = await tx
          .delete(source.comments)
          .where(inArray(source.comments.id, input.ids))
          .returning({ id: source.comments.id });

        return { count: deleted.length };
      });
    }),

  deleteCommentsByUser: authorizedProcedure
    .input(
      z.object({
        type: commentTypeSchema,
        userId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const source = commentSources[input.type];

      return ctx.db.transaction(async (tx) => {
        await tx
          .delete(source.likes)
          .where(
            inArray(
              source.likeCommentId,
              tx
                .select({ id: source.comments.id })
                .from(source.comments)
                .where(eq(source.comments.userId, input.userId)),
            ),
          );

        const deleted = await tx
          .delete(source.comments)
          .where(eq(source.comments.userId, input.userId))
          .returning({ id: source.comments.id });

        return { count: deleted.length };
      });
    }),
});
