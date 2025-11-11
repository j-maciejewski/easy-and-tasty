import Image from "next/image";
import Link from "next/link";

import {
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

import { AuthInput } from "./AuthInput";
import { AuthLink } from "./AuthLink";
import { AuthFormProps, VIEWS } from "./types";

export const ResetPasswordForm = ({ setView, type }: AuthFormProps) => {
  return (
    <Card className="mx-auto min-w-[350px] max-w-sm">
      <CardHeader>
        <Link href="/">
          <Image src={logo} alt="logo" className="mx-auto mb-2" height={40} />
        </Link>
        <CardTitle className="text-xl">Reset password</CardTitle>
        <CardDescription>Enter the email of your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <AuthInput
              name="email"
              type="email"
              placeholder="max@example.com"
              required
            />
          </div>
          <Button type="submit" className="w-full font-semibold">
            Reset password
          </Button>
        </div>
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
      </CardContent>
    </Card>
  );
};
