"use client";

import {
  Book,
  ChartPie,
  ChefHat,
  Earth,
  FileText,
  Ham,
  Navigation,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarWrapper,
} from "@/components/ui";
import { Path } from "@/config";

import { LinkSpinner } from "./LinkSpinner";
import { NavUser } from "./NavUser";

interface SidebarItem {
  label: string;
  url: string;
  icon: FC;
  exact?: boolean;
}

const groups: { label: string; items: SidebarItem[] }[] = [
  {
    label: "Overview",
    items: [
      { label: "Summary", url: Path.DASHBOARD, icon: ChartPie, exact: true },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Recipes", url: Path.DASHBOARD_RECIPES, icon: Book },
      { label: "Articles", url: Path.DASHBOARD_ARTICLES, icon: FileText },
    ],
  },
  {
    label: "Taxonomy",
    items: [
      { label: "Categories", url: Path.DASHBOARD_CATEGORIES, icon: Ham },
      { label: "Cuisines", url: Path.DASHBOARD_CUISINES, icon: Earth },
    ],
  },
  {
    label: "Site",
    items: [
      {
        label: "Navigation",
        url: Path.DASHBOARD_NAVIGATION,
        icon: Navigation,
      },
      { label: "Users", url: Path.DASHBOARD_USERS, icon: Users },
    ],
  },
];

const isItemActive = (pathname: string, { url, exact }: SidebarItem) =>
  exact ? pathname === url : pathname === url || pathname.startsWith(`${url}/`);

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <SidebarWrapper collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="Go to site"
              className="text-2xl font-semibold"
            >
              <Link href={Path.HOME}>
                <ChefHat className="ml-1 size-6!" />
                <span>easy and tasty</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      isActive={isItemActive(pathname, item)}
                    >
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
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </SidebarWrapper>
  );
};
