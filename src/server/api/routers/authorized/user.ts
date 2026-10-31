import { TRPCError } from "@trpc/server";
import { asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { z } from "zod";

import { authorizedProcedure, createTRPCRouter } from "@/server/api/trpc";
import type { db } from "@/server/db";
import {
  article_comment_likes,
  article_comments,
  comment_likes,
  comments,
  events,
  recipe_bookmarks,
  recipe_ratings,
  roleEnum,
  users,
  verificationTokens,
} from "@/server/db/schema";

const userColumns = {
  id: users.id,
  name: users.name,
  email: users.email,
  role: users.role,
  emailVerified: users.emailVerified,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

const sortableColumns = {
  name: users.name,
  email: users.email,
  role: users.role,
  emailVerified: users.emailVerified,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

const getTargetUser = async (tx: Transaction, id: string) => {
  const [user] = await tx
    .select({ id: users.id, role: users.role, email: users.email })
    .from(users)
    .where(eq(users.id, id));

  if (!user) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
  }

  return user;
};

const assertNotLastEditor = async (tx: Transaction, id: string) => {
  const editors = await tx
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, "editor"))
    .for("update");

  if (!editors.some((editor) => editor.id !== id)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "At least one editor must remain.",
    });
  }
};

export const authorizedUserRouter = createTRPCRouter({
  getUsers: authorizedProcedure
    .input(
      z.object({
        query: z.string().optional(),
        orderBy: z.string().optional().default("createdAt"),
        orderDir: z.enum(["desc", "asc"]).optional().default("desc"),
        page: z.number().optional().default(1),
        limit: z.number().optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = input.query
        ? or(
            ilike(users.name, `%${input.query}%`),
            ilike(users.email, `%${input.query}%`),
          )
        : undefined;

      const sortColumn =
        sortableColumns[input.orderBy as keyof typeof sortableColumns] ??
        users.createdAt;

      const [results, totalResults] = await Promise.all([
        ctx.db
          .select(userColumns)
          .from(users)
          .where(where)
          .orderBy(
            input.orderDir === "desc" ? desc(sortColumn) : asc(sortColumn),
            asc(users.id),
          )
          .offset((input.page - 1) * input.limit)
          .limit(input.limit),
        ctx.db
          .select({ total: sql<number>`CAST(COUNT(*) as int)` })
          .from(users)
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

  getCurrentUser: authorizedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findFirst({
      columns: {
        id: true,
        email: true,
        name: true,
        role: true,
        preferences: true,
      },
      where: (users, { eq }) => eq(users.id, ctx.user.id),
    });
  }),

  updateUserPreferences: authorizedProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ preferences: JSON.stringify({ dashboard: input }) })
        .where(eq(users.id, ctx.user.id));
    }),

  setUserRole: authorizedProcedure
    .input(
      z.object({ id: z.string().min(1), role: z.enum(roleEnum.enumValues) }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.id === ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't change your own role.",
        });
      }

      await ctx.db.transaction(async (tx) => {
        const user = await getTargetUser(tx, input.id);

        if (user.role === input.role) return;
        if (user.role === "editor") await assertNotLastEditor(tx, input.id);

        await tx
          .update(users)
          .set({ role: input.role, updatedAt: new Date() })
          .where(eq(users.id, input.id));
      });
    }),

  deleteUser: authorizedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input: id }) => {
      if (id === ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't delete your own account.",
        });
      }

      await ctx.db.transaction(async (tx) => {
        const user = await getTargetUser(tx, id);

        if (user.role === "editor") await assertNotLastEditor(tx, id);

        const userCommentIds = tx
          .select({ id: comments.id })
          .from(comments)
          .where(eq(comments.userId, id));
        const userArticleCommentIds = tx
          .select({ id: article_comments.id })
          .from(article_comments)
          .where(eq(article_comments.userId, id));

        await tx
          .delete(comment_likes)
          .where(
            or(
              eq(comment_likes.userId, id),
              inArray(comment_likes.commentId, userCommentIds),
            ),
          );
        await tx
          .delete(article_comment_likes)
          .where(
            or(
              eq(article_comment_likes.userId, id),
              inArray(
                article_comment_likes.articleCommentId,
                userArticleCommentIds,
              ),
            ),
          );
        await tx.delete(comments).where(eq(comments.userId, id));
        await tx
          .delete(article_comments)
          .where(eq(article_comments.userId, id));
        await tx.delete(recipe_ratings).where(eq(recipe_ratings.userId, id));
        await tx
          .delete(recipe_bookmarks)
          .where(eq(recipe_bookmarks.userId, id));
        await tx
          .update(events)
          .set({ userId: null })
          .where(eq(events.userId, id));
        await tx
          .delete(verificationTokens)
          .where(eq(verificationTokens.identifier, user.email));
        await tx.delete(users).where(eq(users.id, id));
      });
    }),
});
