import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { Path } from "./config";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({ req: request });

  if (
    pathname.toLowerCase().startsWith("/dashboard") &&
    (!token || token.role === "viewer")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    [Path.LOGIN, Path.SIGN_UP, Path.FORGOT_PASSWORD].includes(
      pathname.toLowerCase() as Path,
    ) &&
    token
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
