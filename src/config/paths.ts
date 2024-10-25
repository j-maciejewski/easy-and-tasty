export enum Path {
	// App
	HOME = "/",
	CUISINES = "/cuisines",
	CATEGORIES = "/categories",
	ABOUT = "/about",
	BLOG = "/blog",
	RECIPE = "/recipe",

	// Auth
	LOGIN = "/login",
	SIGN_UP = "/sign-up",
	RESET_PASSWORD = "/reset-password",

	// Dashboard
	DASHBOARD = "/dashboard",
	DASHBOARD_RECIPES = "/dashboard/recipes",
	DASHBOARD_CUISINES = "/dashboard/cuisines",
	DASHBOARD_CATEGORIES = "/dashboard/categories",
	DASHBOARD_BLOG = "/dashboard/blog",
	DASHBOARD_USERS = "/dashboard/users",
	DASHBOARD_PAGES = "/dashboard/pages",
	DASHBOARD_NAVIGATION = "/dashboard/navigation",
}

export const getCuisinePath = (slug: string) => `${Path.CUISINES}/${slug}`;

export const getCategoryPath = (slug: string) => `${Path.CATEGORIES}/${slug}`;

export const getRecipePath = (slug: string) => `${Path.RECIPE}/${slug}`;
