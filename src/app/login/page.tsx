"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { LoginAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { Eye, EyeOff } from "lucide-react";
import ThreeDotsLoader from "@/components/ThreeDotsLoader";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setUser } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const registerSuccess = urlParams.get("registerSuccess");
      const loginSuccess = urlParams.get("loginSuccess");

      if (registerSuccess === "1") {
        setSuccessMessage(
          "Registrasi berhasil! Silakan login dengan akun baru Anda."
        );
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }

      if (loginSuccess === "1") {
        setSuccessMessage("Login berhasil! Anda akan diarahkan ke dashboard.");
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }

      if (registerSuccess === "1" || loginSuccess === "1") {
        const timer = setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await LoginAuth({
        identifier: formData.username,
        password: formData.password,
        remember: true,
      });
      console.log(response.data);
      setUser({ username: response.data.username });
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("id", response.data.id);
      if (response.data.id) {
        localStorage.setItem("admin_user_number", response.data.id.toString());
      }
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      if (response.data.role) {
        localStorage.setItem("role", response.data.role);
      }

      router.push("/?loginSuccess=1");
      window.dispatchEvent(new Event("loginSuccess"));
    } catch (error) {
      console.error("Login error", error);
      let errorMessage = "Terjadi kesalahan saat login";

      if (error instanceof Error) {
        const message = error.message.toLowerCase();

        if (message.includes("credential")) {
          errorMessage = "Username atau kata sandi salah";
        } else if (message.includes("server")) {
          errorMessage = "Terjadi kesalahan saat menghubungi server";
        } else {
          errorMessage = "Terjadi kesalahan saat menghubungi server";
        }
      } else {
        errorMessage = "Terjadi kesalahan saat menghubungi server";
      }

      setError(errorMessage);
      setIsLoading(false);
    } finally {
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {isLoading ? (
        <ThreeDotsLoader />
      ) : (
        <div
          id="card-login"
          className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        >
          <div className="text-center">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto w-auto dark:invert"
            />
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Command Center Login
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Masuk ke Dashboard OCC
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400 border border-green-500/20">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
              {error}
            </div>
          )}

          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors duration-200"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  style={{
                    WebkitBoxShadow: "0 0 0 30px transparent inset",
                    transition: "background-color 5000s ease-in-out 0s",
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 z-20"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {/* <Link href={"/register"} className="text-sm text-blue-500 underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                Register / Tambahkan user baru
              </Link> */}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
