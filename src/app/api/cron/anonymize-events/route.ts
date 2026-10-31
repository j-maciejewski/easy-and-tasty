import { timingSafeEqual } from "node:crypto";
import { and, isNotNull, lt, or } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/env";
import { EVENT_RETENTION_DAYS } from "@/server/analytics";
import { db } from "@/server/db";
import { events } from "@/server/db/schema";

const isAuthorized = (request: NextRequest) => {
  if (!env.CRON_SECRET) return false;

  const expected = Buffer.from(`Bearer ${env.CRON_SECRET}`);
  const received = Buffer.from(request.headers.get("authorization") ?? "");

  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
};

// Keeps old events for aggregate counts but removes anything that ties them
// to a visitor or account.
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(
    Date.now() - EVENT_RETENTION_DAYS * 24 * 60 * 60 * 1000,
  );

  const anonymized = await db
    .update(events)
    .set({ userId: null, visitorHash: null })
    .where(
      and(
        lt(events.createdAt, cutoff),
        or(isNotNull(events.userId), isNotNull(events.visitorHash)),
      ),
    )
    .returning({ id: events.id });

  return NextResponse.json({ anonymized: anonymized.length });
}
