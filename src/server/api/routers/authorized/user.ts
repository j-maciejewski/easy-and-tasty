import { asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";

import { authorizedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { users } from "@/server/db/schema";

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
});
