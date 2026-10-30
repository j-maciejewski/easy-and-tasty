import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { Path } from "./config";

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const previewToken = searchParams.get("preview");

  if (
    previewToken &&
    !pathname.toLowerCase().startsWith("/dashboard") &&
    !request.cookies.has("__prerender_bypass")
  ) {
    const previewUrl = new URL("/api/preview", request.url);
    previewUrl.searchParams.set("token", previewToken);
    previewUrl.searchParams.set("path", pathname);
    return NextResponse.redirect(previewUrl);
  }

  const token = await getToken({ req: request });

  if (
    pathname.toLowerCase().startsWith("/dashboard") &&
    (!token || token.role === "viewer")
  ) {
    const redirectUrl =
      pathname.toLowerCase() === "/dashboard"
        ? "/login"
        : `/login?from=${encodeURIComponent(pathname + request.nextUrl.search)}`;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (
    [Path.LOGIN, Path.SIGN_UP, Path.RESET_PASSWORD].includes(
      pathname.toLowerCase() as Path,
    ) &&
    token
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon|mock/|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico)$).*)",
  ],
};
