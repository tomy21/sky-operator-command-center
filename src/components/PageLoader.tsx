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

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setDots("");
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="text-center py-4 p-6">
        <div className="three-body">
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 blink-smooth mt-4">
          {loadingText} {dots}
        </p>
      </div>
    </div>
  );
}
