"use client";

import { AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useActionState, useEffect, useState } from "react";

import { register } from "@/actions/auth";
import { Google } from "@/components/icons";
import {
  Alert,
  AlertDescription,
  Button,
  Label,
  Separator,
} from "@/components/ui";
import { Path } from "@/config";

import { AuthFormWrapper } from "./AuthFormWrapper";
import { AuthInput } from "./AuthInput";
import { AuthLink } from "./AuthLink";
import { AuthFormProps, VIEWS } from "./types";

export const SignUpForm = ({ setView, type }: AuthFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCallbackUrl = type === "page" ? Path.POST_LOGIN : Path.HOME;
  const callbackUrl =
    searchParams.get("from") ||
    searchParams.get("callbackUrl") ||
    defaultCallbackUrl;
  const [state, formAction] = useActionState(register, undefined);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, _setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (state?.success) router.push("/login?registered=true");
  }, [state?.success, router.push]);

  return (
    <AuthFormWrapper
      type={type}
      title="Sign up"
      titleClassName="text-xl"
      description="Enter your details to create your account."
    >
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form className="grid gap-4" action={formAction}>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <AuthInput name="name" placeholder="Max" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <AuthInput
            name="email"
            type="email"
            placeholder="max@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <AuthInput name="password" type="password" />
        </div>
        <Button type="submit" className="w-full font-semibold">
          Create an account
        </Button>
      </form>
      <div className="my-4 flex items-center gap-3 text-muted-foreground text-xs tracking-wide">
        <Separator className="flex-1" />
        <span>or</span>
        <Separator className="flex-1" />
      </div>
      <Button
        type="button"
        variant="outline"
        className="flex w-full items-center justify-center gap-2"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <Google className="h-5 w-5" />
        Continue with Google
      </Button>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <AuthLink
          text="Log in"
          {...(type === "modal"
            ? { callback: () => setView!(VIEWS.LOGIN) }
            : { href: "/login" })}
        />
      </div>
    </AuthFormWrapper>
  );
};
