"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { HiOutlineBars3 } from "react-icons/hi2";
import {
  DashboardIcon,
  GearIcon,
  LocationIcon,
  LogoutIcon,
  MasterIcon,
  ReportsIcon,
} from "@/public/icons/Icons";
// import PageLoader from "@/components/PageLoader";
import { usePageNavigation } from "@/hooks/usePageNavigation";

export default function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { navigateTo, isNavigating } = usePageNavigation();

  const menuItems = [
    { href: "/", label: "Dashboard", icon: DashboardIcon },
    { href: "/location", label: "Lokasi", icon: LocationIcon },
    { href: "/master", label: "Master", icon: MasterIcon },
    { href: "/reports", label: "Laporan", icon: ReportsIcon },
    { href: "/config", label: "Config", icon: GearIcon },
  ];

  useEffect(() => {
    setMounted(true); // ✅ hanya setelah client render
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const checkScreenSize = () => {
      const isMobileView = window.innerWidth < 768; // md breakpoint
      setIsMobile(isMobileView);

      if (isMobileView) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, [mounted]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    // Show logout loading
    await navigateTo("/login", "Keluar");
    window.location.href = "/login";
  };

  const handleNavigation = async (
    href: string,
    label: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();

    // Auto close sidebar on mobile when clicking menu item
    if (isMobile && isOpen) {
      setIsOpen(false);
    }

    await navigateTo(href, label);
  };

  const isActiveStrict = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    if (pathname.startsWith(href)) {
      const nextChar = pathname[href.length];
      return nextChar === "/" || nextChar === undefined;
    }

    return false;
  };

  return (
    <>
      {/* Page Loader */}
      {/* <PageLoader isLoading={isLoading} loadingText={loadingText} /> */}

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-2xl bg-opacity-50 z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } h-full transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 relative ${
          isMobile ? "fixed left-0 top-0 z-50 md:relative" : ""
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="flex flex-col items-center py-6 px-4 relative">
            {/* Logo */}
            <div className="flex justify-center items-center mb-3">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={isOpen ? 50 : 35}
                height={isOpen ? 50 : 35}
                className="dark:invert transition-all duration-300 ease-in-out"
              />
            </div>

            {/* Title - dengan animasi fade */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isOpen ? "opacity-100 max-h-10" : "opacity-0 max-h-0"
              }`}
            >
              <h1 className="text-xl font-bold text-gray-800 dark:text-white text-center whitespace-nowrap">
                Sky Command
              </h1>
            </div>

            {/* Toggle Button */}
            <button
              onClick={toggleSidebar}
              className={`
                cursor-pointer absolute -right-12 top-3 w-10 h-10 flex items-center justify-center
                bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700
                rounded-md shadow-md transition-all duration-300
                hover:bg-gray-100 dark:hover:bg-gray-700
                focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600
                active:scale-95
                ${isMobile && !isOpen ? "hidden" : ""}
              `}
              aria-label={isOpen ? "Tutup sidebar" : "Buka sidebar"}
            >
              <span
                className={`
                  transition-transform duration-300
                  ${isOpen ? "rotate-0" : "rotate-90"}
                  text-black dark:text-white
                `}
              >
                <HiOutlineBars3 size={26} />
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 mx-4 mb-4"></div>

          {/* Navigation */}
          <nav className="flex-1 px-3">
            {menuItems.map((item) => {
              const itemIsActive = isActiveStrict(item.href);
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavigation(item.href, item.label, e)}
                  className={`
                    flex items-center px-3 py-3 mb-2 rounded-lg text-gray-600 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200
                    hover:scale-[1.02] active:scale-[0.98]
                    ${
                      itemIsActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                        : ""
                    }
                    ${!isOpen ? "justify-center" : ""}
                    ${isNavigating ? "pointer-events-none opacity-60" : ""}
                  `}
                  title={!isOpen ? item.label : ""}
                >
                  <IconComponent
                    className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                      !isOpen ? "w-6 h-6" : ""
                    } ${isNavigating ? "animate-pulse" : ""}`}
                  />

                  {/* Label dengan animasi slide */}
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "opacity-100 max-w-full ml-3"
                        : "opacity-0 max-w-0 ml-0"
                    }`}
                  >
                    <span className="font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>

                  {/* Loading indicator */}
                  {isNavigating && itemIsActive && (
                    <div className="ml-auto">
                      <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Collapsed state indicator */}
          {!isOpen && !isMobile && (
            <div className="px-2 pb-4">
              <div className="flex justify-center">
                <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full opacity-50"></div>
              </div>
            </div>
          )}

          {/* Logout menu item (sticky at bottom) */}
          <div className="mt-auto px-3 pb-4">
            <button
              onClick={handleLogout}
              disabled={isNavigating}
              className={`
              cursor-pointer flex items-center w-full px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300
              hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400
              transition-all duration-200 font-medium
              ${!isOpen ? "justify-center" : ""}
              ${isNavigating ? "pointer-events-none opacity-60" : ""}
            `}
            >
              <LogoutIcon
                className={`w-5 h-5 flex-shrink-0 ${!isOpen ? "w-6 h-6" : ""} ${
                  isNavigating ? "animate-pulse" : ""
                }`}
              />
              <span
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "opacity-100 max-w-full ml-3"
                    : "opacity-0 max-w-0 ml-0"
                }`}
              >
                Logout
              </span>
            </button>
          </div>

          {/* Footer space */}
          <div className="p-4"></div>
        </div>
      </div>

      {/* Mobile collapsed sidebar */}
      {isMobile && !isOpen && (
        <div className="fixed top-0 left-0 w-16 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col">
          {/* Mobile toggle button */}
          <div className="flex justify-center items-center py-6 px-4">
            <button
              onClick={() => setIsOpen(true)}
              className="cursor-pointer w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 transition-all duration-200 hover:scale-105 shadow-md"
              aria-label="Buka sidebar"
            >
              <HiOutlineBars3 size={20} />
            </button>
          </div>

          {/* Mobile navigation icons only */}
          <nav className="flex-1 px-2">
            {menuItems.map((item) => {
              const itemIsActive = isActiveStrict(item.href);
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavigation(item.href, item.label, e)}
                  className={`
                    flex items-center justify-center px-2 py-3 mb-2 rounded-lg text-gray-600 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200
                    hover:scale-[1.02] active:scale-[0.98]
                    ${
                      itemIsActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                        : ""
                    }
                    ${isNavigating ? "pointer-events-none opacity-60" : ""}
                  `}
                  title={item.label}
                >
                  <IconComponent
                    className={`w-6 h-6 ${isNavigating ? "animate-pulse" : ""}`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Logout for collapsed mobile */}
          <div className="px-2 pb-4 mt-auto">
            <button
              onClick={handleLogout}
              disabled={isNavigating}
              className={`cursor-pointer flex items-center justify-center w-full px-2 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 font-medium ${
                isNavigating ? "pointer-events-none opacity-60" : ""
              }`}
              title="Logout"
            >
              <LogoutIcon
                className={`w-6 h-6 ${isNavigating ? "animate-pulse" : ""}`}
              />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
