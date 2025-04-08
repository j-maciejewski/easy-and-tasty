"use client";

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
import {
  Book,
  ChartPie,
  ChefHat,
  Earth,
  FileText,
  Ham,
  Inbox,
  LogOut,
  Settings,
  User2,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

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
              <ChefHat className="!size-6 ml-1" />
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
            <SidebarMenuButton onClick={() => signOut({ callbackUrl: "/" })}>
              <User2 /> Log out
              <LogOut className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarWrapper>
  );
};
