import { and, eq, gte, isNotNull, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import {
  EVENT_DEDUPE_WINDOW_MINUTES,
  getReferrerHost,
  getVisitorHash,
  isBot,
} from "@/server/analytics";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { articles, type EventMeta, events, recipes } from "@/server/db/schema";

const entitySchema = z.object({
  entityType: z.enum(["recipe", "article"]),
  entityId: z.number().int().positive(),
});

const utmValue = z.string().trim().max(128).optional();

const trackEventSchema = z.discriminatedUnion("type", [
  entitySchema.extend({
    type: z.literal("view"),
    referrer: z.string().max(2048).optional(),
    utmSource: utmValue,
    utmMedium: utmValue,
    utmCampaign: utmValue,
  }),
  entitySchema.extend({ type: z.enum(["engaged", "print", "copy"]) }),
  entitySchema.extend({
    type: z.literal("share"),
    channel: z.enum(["copy_link", "facebook", "twitter"]),
  }),
  z.object({
    type: z.literal("search"),
    term: z
      .string()
      .trim()
      .toLowerCase()
      .transform((term) => term.replace(/\s+/g, " "))
      .pipe(z.string().min(3).max(100)),
    resultCount: z.number().int().min(0),
  }),
]);

export const publicEventRouter = createTRPCRouter({
  track: publicProcedure
    .input(trackEventSchema)
    .mutation(async ({ ctx, input }) => {
      if (isBot(ctx.headers.get("user-agent"))) return;

      const entity =
        input.type === "search"
          ? null
          : { entityType: input.entityType, entityId: input.entityId };

      if (entity) {
        const table = entity.entityType === "recipe" ? recipes : articles;
        const [published] = await ctx.db
          .select({ id: table.id })
          .from(table)
          .where(
            and(eq(table.id, entity.entityId), isNotNull(table.publishedAt)),
          )
          .limit(1);

        if (!published) return;
      }

      const session = await getServerSession(authOptions);
      const userId = session?.user.id ?? null;
      const visitorHash = getVisitorHash(ctx.headers);

      let source: string | null = null;
      let meta: EventMeta | null = null;

      if (input.type === "view") {
        source = input.utmSource || getReferrerHost(input.referrer);
        meta =
          input.utmMedium || input.utmCampaign
            ? { utmMedium: input.utmMedium, utmCampaign: input.utmCampaign }
            : null;
      } else if (input.type === "share") {
        meta = { channel: input.channel };
      } else if (input.type === "search") {
        meta = { term: input.term, resultCount: input.resultCount };
      }

      const dedupeSince = new Date(
        Date.now() - EVENT_DEDUPE_WINDOW_MINUTES * 60 * 1000,
      );

      // Only the meta keys that identify an event take part in deduping, so
      // a repeated search with a different result count is still a repeat
      const dedupeMeta =
        input.type === "share"
          ? sql`${events.meta}->>'channel' = ${input.channel}`
          : input.type === "search"
            ? sql`${events.meta}->>'term' = ${input.term}`
            : undefined;

      const [recentEvent] = await ctx.db
        .select({ id: events.id })
        .from(events)
        .where(
          and(
            eq(events.type, input.type),
            sql`${events.entityType} IS NOT DISTINCT FROM ${entity?.entityType ?? null}`,
            sql`${events.entityId} IS NOT DISTINCT FROM ${entity?.entityId ?? null}`,
            userId
              ? eq(events.userId, userId)
              : eq(events.visitorHash, visitorHash),
            gte(events.createdAt, dedupeSince),
            dedupeMeta,
          ),
        )
        .limit(1);

      if (recentEvent) return;

      await ctx.db.insert(events).values({
        type: input.type,
        entityType: entity?.entityType ?? null,
        entityId: entity?.entityId ?? null,
        userId,
        visitorHash,
        source,
        meta,
      });
    }),
});
