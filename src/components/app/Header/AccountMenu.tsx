"use client";

import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import { VisuallyHidden } from "radix-ui";

import { AvatarDropdown } from "@/components/app";
import { AuthModal } from "@/components/auth_forms";
import {
  Avatar,
  AvatarFallback,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";

export const AccountMenu = () => {
  const session = useSession();

  if (session.status === "loading") {
    return <div className="bg-muted size-10 animate-pulse rounded-full" />;
  }

  if (session.status === "authenticated") {
    return <AvatarDropdown user={session.data.user} />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="hover:ring-primary/20 data-[state=open]:ring-primary/30 relative size-10 rounded-full p-0 ring-0 transition-shadow hover:ring-4 data-[state=open]:ring-4"
          aria-label="Open authentication dialog"
        >
          <Avatar className="size-10">
            <AvatarFallback>
              <User className="size-4.5" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit p-0 *:data-[slot=card]:border-none">
        <VisuallyHidden.Root>
          <DialogTitle>Authentication Modal</DialogTitle>
        </VisuallyHidden.Root>
        <AuthModal />
      </DialogContent>
    </Dialog>
  );
};
