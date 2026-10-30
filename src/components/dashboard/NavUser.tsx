"use client";

import { ChevronsUpDown, ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Skeleton,
  useSidebar,
} from "@/components/ui";
import { Path } from "@/config";
import { api } from "@/trpc/react";

const getInitials = (value: string) =>
  value
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export const NavUser = () => {
  const { isMobile } = useSidebar();
  const { data: user, isLoading } =
    api.authorized.user.getCurrentUser.useQuery();

  const displayName = user?.name || user?.email || "User";

  const userInfo = (
    <>
      <Avatar className="size-8 rounded-lg">
        <AvatarFallback className="bg-primary text-primary-foreground rounded-lg text-xs font-semibold">
          {getInitials(displayName)}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{displayName}</span>
        {user?.role && (
          <span className="text-muted-foreground truncate text-xs capitalize">
            {user.role}
          </span>
        )}
      </div>
    </>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={displayName}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Skeleton className="size-8 shrink-0 rounded-lg" />
                  <Skeleton className="h-4 flex-1" />
                </>
              ) : (
                userInfo
              )}
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5">
                {userInfo}
              </div>
              {user?.email && user.name && (
                <p className="text-muted-foreground truncate px-1 pb-1.5 text-xs">
                  {user.email}
                </p>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={Path.HOME} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                View site
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => signOut({ callbackUrl: Path.LOGIN })}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
