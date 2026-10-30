import { eq } from "drizzle-orm";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { AuthFormWrapper } from "@/components/auth_forms";
import { Alert, AlertDescription, Button } from "@/components/ui";
import { Path } from "@/config";
import { consumeToken } from "@/server/auth/tokens";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>;
}

const verifyEmail = async (token?: string) => {
  if (!token) return false;

  const email = await consumeToken("verify-email", token);
  if (!email) return false;

  await db
    .update(users)
    .set({ emailVerified: new Date(), updatedAt: new Date() })
    .where(eq(users.email, email));

  return true;
};

export default async function ({ searchParams }: VerifyEmailPageProps) {
  const { token } = await searchParams;
  const verified = await verifyEmail(token);

  return (
    <AuthFormWrapper
      type="page"
      title={verified ? "Email confirmed" : "Link expired"}
      titleClassName="text-xl"
      description={
        verified
          ? "Thanks for confirming your email address."
          : "We couldn't confirm your email address."
      }
    >
      {verified ? (
        <Alert className="mb-4 border-green-500 text-green-500">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>Your account is ready to use.</AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This confirmation link is invalid or has expired. Try signing in to
            get a new one.
          </AlertDescription>
        </Alert>
      )}
      <Button asChild className="w-full font-semibold">
        <Link href={Path.LOGIN}>Continue to log in</Link>
      </Button>
    </AuthFormWrapper>
  );
}
