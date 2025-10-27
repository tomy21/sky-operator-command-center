// components/SessionWatcher.jsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SessionWatcher() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      const userId = localStorage.getItem("id");

      if (!userId) {
        localStorage.clear();
        router.push("/login");
        return;
      }

      // 🔹 Panggil backend untuk cek apakah user masih valid
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${userId}`
        );
        const data = await res.json();

        const lastLogin = data.user?.lastActive;
        if (!res.ok || !data.user) {
          // Jika user tidak ditemukan di DB → logout paksa
          localStorage.clear();
          router.push("/login");
          return;
        }

        // 🔹 Cek apakah login sudah lebih dari 24 jam
        if (lastLogin) {
          const diffHours =
            (new Date().getTime() - new Date(lastLogin).getTime()) /
            (1000 * 60 * 60);

          if (diffHours > 24) {
            localStorage.clear();
            alert("Sesi Anda telah berakhir, silakan login kembali.");
            router.push("/login");
          }
        }
      } catch (err) {
        console.error("Gagal memanggil API:", err);
      }
    }, 3600000); // cek setiap 1 menit

    return () => clearInterval(interval);
  }, [router]);

  return null;
}
