import { draftMode } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { PREVIEW_PARAM, verifyPreviewToken } from "@/lib/preview";

const getSafeUrl = (path: unknown, request: NextRequest) => {
  const url = new URL(
    typeof path === "string" && path.startsWith("/") ? path : "/",
    request.url,
  );

  return url.origin === request.nextUrl.origin
    ? url
    : new URL("/", request.url);
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get("token");
  const url = getSafeUrl(searchParams.get("path"), request);

  url.searchParams.delete(PREVIEW_PARAM);

  if (token && verifyPreviewToken(token)) {
    (await draftMode()).enable();
    url.searchParams.set(PREVIEW_PARAM, token);
  }

  return NextResponse.redirect(url);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const url = getSafeUrl(formData.get("path"), request);

  (await draftMode()).disable();

  return NextResponse.redirect(url, 303);
}
