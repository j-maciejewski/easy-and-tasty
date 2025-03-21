import Link from "next/link";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
} from "@/components/ui";
import logo from "@/public/logo.png";
import Image from "next/image";
import { AuthInput } from "../_components/AuthInput";

export default function () {
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
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <AuthInput name="firstName" placeholder="Max" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <AuthInput name="lastName" placeholder="Robinson" required />
            </div>
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
          <Button
            type="submit"
            variant="secondary"
            className="w-full font-semibold"
          >
            Create an account
          </Button>
        </div>
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
