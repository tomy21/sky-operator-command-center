// components/SimplePageLoader.tsx
"use client";
import { useEffect, useState } from "react";

interface SimplePageLoaderProps {
  isLoading: boolean;
  loadingText?: string;
}

export default function SimplePageLoader({
  isLoading,
  loadingText = "Memuat...",
}: SimplePageLoaderProps) {
  const [dots, setDots] = useState("");

  // Animated dots
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Reset dots when not loading
  useEffect(() => {
    if (!isLoading) {
      setDots("");
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="text-center">
        {/* Simple spinner */}
        <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>

        {/* Loading text */}
        <p className="text-gray-600 dark:text-gray-300 font-medium">
          {loadingText}
          <span className="inline-block w-6 text-left">{dots}</span>
        </p>
      </div>
    </div>
  );
}
