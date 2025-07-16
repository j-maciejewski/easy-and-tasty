import {
  LayoutDashboardIcon as Dashboard,
  Heart,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const AvatarDropdown = ({ user }: { user: Session["user"] }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            {user.image && (
              <Image
                src={user.image}
                className="aspect-square h-full w-full"
                width={40}
                height={40}
                alt="user avatar"
              />
            )}
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm leading-none">{user.name}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.role !== "viewer" && (
          <Link href="/dashboard">
            <DropdownMenuItem className="cursor-pointer">
              <Dashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuItem className="cursor-pointer">
          <Heart className="mr-2 h-4 w-4" />
          <span>Liked Recipes</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
