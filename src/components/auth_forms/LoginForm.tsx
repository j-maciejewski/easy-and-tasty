"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

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

export const LoginForm = ({ setView, type }: AuthFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCallbackUrl = type === "page" ? Path.POST_LOGIN : Path.HOME;
  const callbackUrl =
    searchParams.get("from") ||
    searchParams.get("callbackUrl") ||
    defaultCallbackUrl;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const registered = searchParams.get("registered") === "true";

  const handleCredentialsLogIn = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (_error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <AuthFormWrapper
      type={type}
      title="Log in"
      titleClassName="text-2xl"
      description="Enter your details to sign in to your account."
    >
      {registered && (
        <Alert className="mb-4 border-green-500 text-green-500">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Account created successfully. You can now sign in.
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form className="grid gap-4" onSubmit={handleCredentialsLogIn}>
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
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <AuthLink
              text="Forgot password?"
              className="ml-auto inline-block text-sm underline"
              {...(type === "modal"
                ? { callback: () => setView!(VIEWS.FORGOT_PASSWORD) }
                : { href: "/reset-password" })}
            />
          </div>
          <AuthInput name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full font-semibold">
          Log in
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
        Don't have an account?{" "}
        <AuthLink
          text="Sign up"
          {...(type === "modal"
            ? { callback: () => setView!(VIEWS.REGISTER) }
            : { href: "/sign-up" })}
        />
      </div>
    </AuthFormWrapper>
  );
};
