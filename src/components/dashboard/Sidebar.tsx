"use client";

import {
  Book,
  ChartPie,
  ChefHat,
  Earth,
  FileText,
  Ham,
  Home,
  Inbox,
  LogOut,
  Settings,
  User2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FC } from "react";

import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarWrapper,
} from "@/components/ui";
import { Path } from "@/config";

import { LinkSpinner } from "./LinkSpinner";

const items: { label: string; url: string; icon: FC }[] = [
  {
    label: "Summary",
    url: Path.DASHBOARD,
    icon: ChartPie,
  },
  {
    label: "Recipes",
    url: Path.DASHBOARD_RECIPES,
    icon: Book,
  },
  {
    label: "Home",
    url: Path.DASHBOARD_HOME,
    icon: Home,
  },
  {
    label: "Pages",
    url: Path.DASHBOARD_PAGES,
    icon: FileText,
  },
  {
    label: "Categories",
    url: Path.DASHBOARD_CATEGORIES,
    icon: Ham,
  },
  {
    label: "Cuisines",
    url: Path.DASHBOARD_CUISINES,
    icon: Earth,
  },
  {
    label: "Users",
    url: Path.DASHBOARD_USERS,
    icon: Users,
  },
  {
    label: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    label: "Settings",
    icon: Settings,
    url: Path.DASHBOARD_SETTINGS,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <SidebarWrapper collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <Link href={Path.HOME}>
            <SidebarMenuButton
              size="lg"
              className="pointer-events-none font-semibold text-2xl"
            >
              <ChefHat className="ml-1 size-6!" />
              <span>easy and tasty</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.label}</span>
                      <LinkSpinner className="ml-auto" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <User2 /> Log out
              <LogOut className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarWrapper>
  );
};
