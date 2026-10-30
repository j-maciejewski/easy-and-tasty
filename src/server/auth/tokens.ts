import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { and, eq, like } from "drizzle-orm";

import { db } from "@/server/db";
import { verificationTokens } from "@/server/db/schema";

export type TokenPurpose = "verify-email" | "reset-password";

const TOKEN_TTL: Record<TokenPurpose, number> = {
  "verify-email": 24 * 60 * 60 * 1000,
  "reset-password": 60 * 60 * 1000,
};

// Minimum time between two emails of the same kind to the same address
const RESEND_COOLDOWN = 60 * 1000;

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const getIdentifier = (purpose: TokenPurpose, email: string) =>
  `${purpose}:${email}`;

/**
 * Creates a new single-use token, replacing any previous one for the same email and purpose.
 * Returns null when a token was issued within the cooldown window.
 */
export async function createToken(purpose: TokenPurpose, email: string) {
  const identifier = getIdentifier(purpose, email);

  const [existing] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.identifier, identifier));

  if (
    existing &&
    existing.expires.getTime() - TOKEN_TTL[purpose] + RESEND_COOLDOWN >
      Date.now()
  ) {
    return null;
  }

  const token = randomBytes(32).toString("hex");

  await db.transaction(async (tx) => {
    await tx
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, identifier));
    await tx.insert(verificationTokens).values({
      identifier,
      token: hashToken(token),
      expires: new Date(Date.now() + TOKEN_TTL[purpose]),
    });
  });

  return token;
}

/**
 * Deletes the token and returns the email it was issued for, or null if it is invalid or expired.
 */
export async function consumeToken(purpose: TokenPurpose, token: string) {
  const [row] = await db
    .delete(verificationTokens)
    .where(
      and(
        eq(verificationTokens.token, hashToken(token)),
        like(verificationTokens.identifier, `${purpose}:%`),
      ),
    )
    .returning();

  if (!row || row.expires.getTime() < Date.now()) {
    return null;
  }

  return row.identifier.slice(purpose.length + 1);
}
