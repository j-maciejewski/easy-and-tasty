export enum Path {
  // App
  HOME = "/",
  CUISINES = "/cuisines",
  CATEGORIES = "/categories",
  RECIPE = "/recipe",

  // Auth
  LOGIN = "/login",
  SIGN_UP = "/sign-up",
  RESET_PASSWORD = "/reset-password",

  // Dashboard
  DASHBOARD = "/dashboard",
  DASHBOARD_RECIPES = "/dashboard/recipes",
  DASHBOARD_NEW_RECIPE = "/dashboard/recipes/new",
  DASHBOARD_CUISINES = "/dashboard/cuisines",
  DASHBOARD_CATEGORIES = "/dashboard/categories",
  DASHBOARD_USERS = "/dashboard/users",
  DASHBOARD_PAGES = "/dashboard/pages",
  DASHBOARD_ADD_PAGE = "/dashboard/pages/new",
  DASHBOARD_NAVIGATION = "/dashboard/settings/navigation",
}

export const getCuisinePath = (slug: string) => `${Path.CUISINES}/${slug}`;

export const getCategoryPath = (slug: string) => `${Path.CATEGORIES}/${slug}`;

export const getRecipePath = (slug: string) => `${Path.RECIPE}/${slug}`;
