import {
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
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
	Navigation,
	Pen,
	Settings,
	User2,
	Users,
} from "lucide-react";

const items = [
	{
		title: "Summary",
		url: Path.DASHBOARD,
		icon: ChartPie,
	},
	{
		title: "Recipes",
		url: Path.DASHBOARD_RECIPES,
		icon: Book,
	},
	{
		title: "Categories",
		url: Path.DASHBOARD_CATEGORIES,
		icon: Ham,
	},
	{
		title: "Cuisines",
		url: Path.DASHBOARD_CUISINES,
		icon: Earth,
	},
	{
		title: "Blog",
		url: Path.DASHBOARD_BLOG,
		icon: Pen,
	},
	{
		title: "Users",
		url: Path.DASHBOARD_USERS,
		icon: Users,
	},
	{
		title: "Pages",
		url: Path.DASHBOARD_PAGES,
		icon: FileText,
	},
	{
		title: "Navigation",
		url: Path.DASHBOARD_NAVIGATION,
		icon: Navigation,
	},
	{
		title: "Inbox",
		url: "#",
		icon: Inbox,
	},
	{
		title: "Settings",
		url: "#",
		icon: Settings,
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
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
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
