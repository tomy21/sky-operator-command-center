import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logout sukses" });

  res.cookies.set("token", "", {
    httpOnly: true,
    secure: false, // true kalau HTTPS
    sameSite: "lax",
    path: "/", // HARUS sama dengan saat login
    maxAge: 0, // ⬅️ KUNCI UTAMA
  });

  return res;
}
