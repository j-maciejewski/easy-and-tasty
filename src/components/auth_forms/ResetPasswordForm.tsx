"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useActionState } from "react";

import { requestPasswordReset } from "@/actions/auth";
import {
  Alert,
  AlertDescription,
  Button,
  Label,
  Separator,
} from "@/components/ui";

import { AuthFormWrapper } from "./AuthFormWrapper";
import { AuthInput } from "./AuthInput";
import { AuthLink } from "./AuthLink";
import { AuthFormProps, VIEWS } from "./types";

export const ResetPasswordForm = ({ setView, type }: AuthFormProps) => {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    undefined,
  );
  const error = state?.errors?._form?.[0] ?? state?.errors?.email?.[0];

  return (
    <AuthFormWrapper
      type={type}
      title="Forgot your password?"
      titleClassName="text-xl"
      description="Enter the email address linked to your account."
    >
      {state?.success && (
        <Alert className="mb-4 border-green-500 text-green-500">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            If an account exists for this email, you'll receive a reset link
            shortly.
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form className="grid gap-4" action={formAction}>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <AuthInput
            name="email"
            type="email"
            placeholder="max@example.com"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full font-semibold"
          disabled={isPending}
        >
          Send reset link
        </Button>
      </form>
      <div className="mt-4 flex items-center space-x-4 text-center text-sm">
        <div className="grow">
          <AuthLink
            text="Log in"
            {...(type === "modal"
              ? { callback: () => setView!(VIEWS.LOGIN) }
              : { href: "/login" })}
          />
        </div>
        <Separator orientation="vertical" className="h-4! w-px" />
        <div className="grow">
          <AuthLink
            text="Sign up"
            {...(type === "modal"
              ? { callback: () => setView!(VIEWS.REGISTER) }
              : { href: "/sign-up" })}
          />
        </div>
      </div>
    </AuthFormWrapper>
  );
};
