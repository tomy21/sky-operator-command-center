/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// decode JWT payload (tanpa verify)
function parseJwt(token: string): any | null {
  try {
    const base64Payload = token.split(".")[1];
    const payload = Buffer.from(base64Payload, "base64").toString();
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // =========================
  // 1️⃣ CEK TOKEN EXPIRED
  // =========================
  if (token) {
    const payload = parseJwt(token);

    if (!payload?.exp) {
      // token rusak → hapus & login
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("token");
      return res;
    }

    const isExpired = Date.now() >= payload.exp * 1000;

    if (isExpired) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("token");
      return res;
    }
  }

  // =========================
  // 2️⃣ BLOK DASHBOARD
  // =========================
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // =========================
  // 3️⃣ SUDAH LOGIN → JANGAN KE LOGIN
  // =========================
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
