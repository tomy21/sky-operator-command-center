import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  // Daftar path yang perlu proteksi
  const protectedPaths = [
    "/dashboard",
    "/location",
    "/master",
    "/reports",
    "/change-password",

  ];

  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("token")?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/login") && token) {
    const redirectTo = request.nextUrl.searchParams.get("redirect") || "/";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }
  // (Opsional) Validasi token di sini jika ingin validasi signature/expired di middleware
  // Jika ingin validasi lebih lanjut, lakukan di server component atau API route

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/location/:path*",
    "/master/:path*",
    "/reports/:path*",
  ],
};
