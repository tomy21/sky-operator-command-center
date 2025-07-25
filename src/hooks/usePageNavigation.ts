"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface UsePageNavigationReturn {
    isLoading: boolean;
    loadingText: string;
    progress: number;
    navigateTo: (href: string, label?: string) => Promise<void>;
    isNavigating: boolean;
}

export const usePageNavigation = (): UsePageNavigationReturn => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Memuat halaman...");
    const [progress, setProgress] = useState(0);
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setProgress(90);
            const timer = setTimeout(() => {
                setProgress(100);
                setTimeout(() => {
                    setIsLoading(false);
                    setIsNavigating(false);
                    setProgress(0);
                }, 200);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [pathname, isLoading]);

    const simulateProgress = useCallback(() => {
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.random() * 15;
            if (currentProgress >= 85) {
                setProgress(85);
                clearInterval(interval);
            } else {
                setProgress(currentProgress);
            }
        }, 150);

        return () => clearInterval(interval);
    }, []);

    const getLoadingTextByPath = (href: string, label?: string): string => {
        if (label) return `Memuat ${label}...`;

        switch (href) {
            case "/":
                return "Memuat Dashboard...";
            case "/location":
                return "Memuat Data Lokasi...";
            case "/master":
                return "Memuat Master Data...";
            case "/reports":
                return "Memuat Laporan...";
            default:
                return "Memuat halaman...";
        }
    };

    const navigateTo = useCallback(async (href: string, label?: string): Promise<void> => {
        if (pathname === href) return;

        setIsNavigating(true);
        setIsLoading(true);
        setProgress(0);
        setLoadingText(getLoadingTextByPath(href, label));

        const cleanup = simulateProgress();

        try {
            await new Promise(resolve => setTimeout(resolve, 100));

            router.push(href);

        } catch (error) {
            console.error("Navigation error:", error);
            setIsLoading(false);
            setIsNavigating(false);
            setProgress(0);
        } finally {
            cleanup();
        }
    }, [pathname, router, simulateProgress]);

    return {
        isLoading,
        loadingText,
        progress,
        navigateTo,
        isNavigating,
    };
};