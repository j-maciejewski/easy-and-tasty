export enum Path {
  // App
  HOME = "/",
  ARTICLES = "/articles",
  CUISINES = "/cuisines",
  CATEGORIES = "/categories",
  RECIPE = "/recipe",

  // Auth
  LOGIN = "/login",
  SIGN_UP = "/sign-up",
  RESET_PASSWORD = "/reset-password",
  POST_LOGIN = "/post-login",

  // Dashboard
  DASHBOARD = "/dashboard",
  DASHBOARD_RECIPES = "/dashboard/recipes",
  DASHBOARD_CUISINES = "/dashboard/cuisines",
  DASHBOARD_CATEGORIES = "/dashboard/categories",
  DASHBOARD_USERS = "/dashboard/users",
  DASHBOARD_ARTICLES = "/dashboard/articles",
  DASHBOARD_NAVIGATION = "/dashboard/navigation",
  DASHBOARD_COMMENTS = "/dashboard/comments",
  DASHBOARD_MEDIA = "/dashboard/media",
}

export const getDashboardRecipePath = (id: number | "new") =>
  `${Path.DASHBOARD_RECIPES}/${id}`;

export const getDashboardArticlePath = (id: number | "new") =>
  `${Path.DASHBOARD_ARTICLES}/${id}`;
