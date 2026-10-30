import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { draftMode } from "next/headers";

import { env } from "@/env";

export type PreviewType = "recipe" | "article";

export type PreviewPayload = {
  type: PreviewType;
  id: number;
  exp: number;
};

export const PREVIEW_PARAM = "preview";
export const PREVIEW_TTL_SECONDS = 7 * 24 * 60 * 60;

const getSecret = () => {
  if (!env.NEXTAUTH_SECRET) {
    throw new Error("NEXTAUTH_SECRET is required to sign preview links");
  }

  return env.NEXTAUTH_SECRET;
};

const sign = (data: string) =>
  createHmac("sha256", getSecret()).update(`preview:${data}`).digest();

export const createPreviewToken = (
  { type, id }: Pick<PreviewPayload, "type" | "id">,
  now = Date.now(),
) => {
  const payload: PreviewPayload = {
    type,
    id,
    exp: Math.floor(now / 1000) + PREVIEW_TTL_SECONDS,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");

  return `${data}.${sign(data).toString("base64url")}`;
};

export const verifyPreviewToken = (
  token: string | null | undefined,
  now = Date.now(),
): PreviewPayload | null => {
  if (!token || token.length > 512) return null;

  const [data, signature, ...rest] = token.split(".");
  if (!data || !signature || rest.length > 0) return null;

  const expected = sign(data);
  const actual = Buffer.from(signature, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf8"),
    ) as Partial<PreviewPayload>;

    if (
      (payload.type !== "recipe" && payload.type !== "article") ||
      !Number.isInteger(payload.id) ||
      typeof payload.exp !== "number" ||
      payload.exp * 1000 <= now
    ) {
      return null;
    }

    return payload as PreviewPayload;
  } catch {
    return null;
  }
};

export const getPreviewPath = (
  type: PreviewType,
  slug: string,
  token: string,
) =>
  `${type === "recipe" ? `/recipe/${slug}` : `/${slug}`}?${PREVIEW_PARAM}=${encodeURIComponent(token)}`;

// Only touches searchParams while Draft Mode is on, so the static/ISR
// rendering of regular visits is left untouched.
export const getPagePreview = async (
  searchParams: Promise<Record<string, string | string[] | undefined>>,
  type: PreviewType,
) => {
  if (!(await draftMode()).isEnabled) return null;

  const token = (await searchParams)[PREVIEW_PARAM];
  const payload = verifyPreviewToken(typeof token === "string" ? token : null);

  return payload?.type === type ? { ...payload, token: token as string } : null;
};
