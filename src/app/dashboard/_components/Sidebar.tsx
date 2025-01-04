import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  Sidebar as SidebarWrapper,
} from "@/components/ui/sidebar";
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
import Link from "next/link";
import { FC } from "react";

const items: (
  | { label: string; url: string; icon: FC }
  | { label: string; icon: FC; links: { label: string; url: string }[] }
)[] = [
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
    links: [
      {
        label: "Navigation",
        url: Path.DASHBOARD_NAVIGATION,
      },
    ],
  },
];

export const Sidebar = () => {
  return (
    <SidebarWrapper>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="my-5 h-auto font-semibold text-2xl text-foreground">
            <ChefHat className="!size-7 mt-1 mr-2" />
            easy and tasty
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                "url" in item ? (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <Collapsible
                    key={item.label}
                    defaultOpen
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.links.map((link) => (
                            <SidebarMenuButton key={link.label} asChild>
                              <Link href={link.url}>
                                <span>{link.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User2 /> Log out
              <LogOut className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarWrapper>
  );
};
