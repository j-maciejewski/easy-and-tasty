import "server-only";

import { createHash, createHmac } from "node:crypto";

import { env } from "@/env";

export const EVENT_DEDUPE_WINDOW_MINUTES = 30;
export const EVENT_RETENTION_DAYS = 90;

const BOT_PATTERN =
  /bot|crawl|spider|slurp|archiver|facebookexternalhit|embedly|preview|headless|lighthouse|pagespeed|pingdom|uptime|monitor|curl|wget|python-requests|axios|node-fetch|go-http-client|java\//i;

export const isBot = (userAgent: string | null) =>
  !userAgent || BOT_PATTERN.test(userAgent);

// The salt changes every UTC day, so the same visitor gets a different hash
// tomorrow and the stored hash can't be reversed into an IP address.
const getDailySalt = () =>
  createHmac("sha256", env.NEXTAUTH_SECRET ?? "easy-and-tasty-dev")
    .update(new Date().toISOString().slice(0, 10))
    .digest("hex");

export const getVisitorHash = (headers: Headers) => {
  const ipAddress =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip")?.trim() ??
    "";
  const userAgent = headers.get("user-agent") ?? "";

  return createHash("sha256")
    .update(`${getDailySalt()}|${ipAddress}|${userAgent}`)
    .digest("hex");
};

// Keeps only the host of an external referrer; same-site navigation counts
// as no source.
export const getReferrerHost = (referrer: string | undefined) => {
  if (!referrer) return null;

  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    const appHost = new URL(env.APP_URL).hostname.replace(/^www\./, "");

    return host && host !== appHost ? host : null;
  } catch {
    return null;
  }
};
