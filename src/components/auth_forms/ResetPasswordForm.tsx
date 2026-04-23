import { Button, Label, Separator } from "@/components/ui";

import { AuthFormWrapper } from "./AuthFormWrapper";
import { AuthInput } from "./AuthInput";
import { AuthLink } from "./AuthLink";
import { AuthFormProps, VIEWS } from "./types";

export const ResetPasswordForm = ({ setView, type }: AuthFormProps) => {
  return (
    <AuthFormWrapper
      type={type}
      title="Forgot your password?"
      titleClassName="text-xl"
      description="Enter the email address linked to your account."
    >
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
          Send reset link
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
    </AuthFormWrapper>
  );
};
