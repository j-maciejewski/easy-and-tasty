"use client";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { resetPassword } from "@/actions/auth";
import { Alert, AlertDescription, Button, Label } from "@/components/ui";
import { Path } from "@/config";

import { AuthFormWrapper } from "./AuthFormWrapper";
import { AuthInput } from "./AuthInput";
import { AuthLink } from "./AuthLink";

interface NewPasswordFormProps {
  token: string;
}

export const NewPasswordForm = ({ token }: NewPasswordFormProps) => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    resetPassword,
    undefined,
  );
  const formError = state?.errors?._form?.[0];
  const passwordErrors = state?.errors?.password;

  useEffect(() => {
    if (state?.success) router.push(`${Path.LOGIN}?reset=true`);
  }, [state?.success, router.push]);

  return (
    <AuthFormWrapper
      type="page"
      title="Set a new password"
      titleClassName="text-xl"
      description="Choose a new password for your account."
    >
      {formError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {formError}{" "}
            <AuthLink text="Request a new link" href={Path.RESET_PASSWORD} />
          </AlertDescription>
        </Alert>
      )}
      <form className="grid gap-4" action={formAction}>
        <input type="hidden" name="token" value={token} />
        <div className="grid gap-2">
          <Label htmlFor="password">New password</Label>
          <AuthInput name="password" type="password" required />
          {passwordErrors?.map((message) => (
            <p key={message} className="text-destructive text-sm">
              {message}
            </p>
          ))}
        </div>
        <Button
          type="submit"
          className="w-full font-semibold"
          disabled={isPending}
        >
          Update password
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        <AuthLink text="Back to log in" href={Path.LOGIN} />
      </div>
    </AuthFormWrapper>
  );
};
