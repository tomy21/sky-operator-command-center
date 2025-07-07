"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    credentialCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Validasi form
      if (!formData.username || !formData.password || !formData.credentialCode) {
        setError("Semua field harus diisi");
        setIsLoading(false);
        return;
      }

      // TODO: Implementasikan RegisterAuth function
      // const response = await RegisterAuth({
      //   username: formData.username,
      //   password: formData.password,
      //   credentialCode: formData.credentialCode,
      // });

      // Sementara simulasi sukses
      console.log("Register data:", formData);
      
      // Redirect ke login setelah berhasil register
      router.push("/login?registerSuccess=1");
      
    } catch (error) {
      console.error("Register error:", error);
      let errorMessage = "Terjadi kesalahan saat registrasi";

      if (error instanceof Error) {
        const message = error.message.toLowerCase();

        if (message.includes("username")) {
          errorMessage = "Username sudah digunakan";
        } else if (message.includes("credential")) {
          errorMessage = "Kode kredensial tidak valid";
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {isLoading ? (
        <div className="text-center py-4 p-6">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 blink-smooth mt-4">
            Memproses registrasi...
          </p>
        </div>
      ) : (
        <div
          id="card-register"
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
              Command Center Register
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Daftar sebagai user baru OCC
            </p>
          </div>
          
          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
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
                  autoComplete="new-password"
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

              <div>
                <label htmlFor="credentialCode" className="sr-only">
                  Credential Number
                </label>
                <input
                  id="credentialCode"
                  name="credentialCode"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Credential Number"
                  value={formData.credentialCode}
                  onChange={(e) =>
                    setFormData({ ...formData, credentialCode: e.target.value })
                  }
                />
              </div>
              
              <Link href={"/login"} className="text-sm text-blue-500 underline">
                Sudah punya akun? Login di sini
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}