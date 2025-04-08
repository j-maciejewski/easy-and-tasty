"use client";

import Link from "next/link";

import { register } from "@/actions/auth";
import { Google } from "@/components/icons";
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Separator,
} from "@/components/ui";
import logo from "@/public/logo.png";
import { AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { AuthInput } from "../_components/AuthInput";

export default function () {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [state, formAction] = useFormState(register, undefined);

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
    <Card className="mx-auto min-w-[350px] max-w-sm">
      <CardHeader>
        <Link href="/">
          <Image src={logo} alt="logo" className="mx-auto mb-2" height={40} />
        </Link>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
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
        <Separator className="my-4" />
        <Button
          type="button"
          variant="outline"
          className="flex w-full items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <Google className="h-5 w-5" />
          Sign up with Google
        </Button>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
