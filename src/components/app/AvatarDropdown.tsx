import {
  Bookmark,
  LayoutDashboardIcon as Dashboard,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const itemClassName =
  "focus:bg-muted focus:text-foreground gap-3 rounded-xl px-3 py-2.5 font-medium";

interface AvatarDropdownProps {
  user: Session["user"];
}

export const AvatarDropdown = ({ user }: AvatarDropdownProps) => {
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:ring-primary/30 hover:ring-primary/20 relative size-10 rounded-full p-0 ring-0 transition-shadow hover:ring-4 data-[state=open]:ring-4"
          aria-label="Open user menu"
        >
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary/10 text-primary font-display font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="border-border/70 w-64 rounded-2xl p-2 shadow-[0_18px_40px_-20px_rgb(42_33_28/0.4)]"
        align="end"
        sideOffset={8}
        forceMount
      >
        <DropdownMenuLabel className="flex items-center gap-3 px-3 py-2.5 font-normal">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary/10 text-primary font-display font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="font-display truncate text-sm leading-none font-semibold">
              {user.name}
            </p>
            <p className="text-muted-foreground truncate text-xs leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-1 my-1.5" />
        {user.role !== "viewer" && (
          <DropdownMenuItem asChild className={itemClassName}>
            <Link href="/dashboard">
              <Dashboard />
              Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild className={itemClassName}>
          <Link href="/bookmarks">
            <Bookmark />
            Saved recipes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="mx-1 my-1.5" />
        <DropdownMenuItem
          variant="destructive"
          className={itemClassName}
          onClick={() => signOut()}
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
