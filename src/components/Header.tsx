// components/Header.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Search,
  User,
  Menu,
  ChevronDown,
  LogOut,
  Settings,
  X
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const router = useRouter();

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    router.push("/auth/logout");
  };

  const notifications = [
    { id: 1, text: "Tablet A12 needs maintenance", time: "10 min ago", read: false },
    { id: 2, text: "New contract requires approval", time: "25 min ago", read: false },
    { id: 3, text: "Daily issuance report is ready", time: "1 hour ago", read: true },
    { id: 4, text: "5 tablets due for return today", time: "2 hours ago", read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side: Logo and Mobile Menu */}
          <div className="flex items-center">
            <button
              className="lg:hidden p-2 -ml-2 mr-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link href="/dashboard" className="flex items-center space-x-3 group transition-all duration-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-knbs-500 to-knbs-600 text-white shadow-lg shadow-knbs-500/20 group-hover:scale-105 transition-transform">
                <div className="h-6 w-6">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                  </svg>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">TabletTrack</h1>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-knbs-500 -mt-0.5">KNBS System</p>
              </div>
            </Link>

            {/* Desktop Search */}
            <div className="hidden lg:block ml-10 relative group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-knbs-500 transition-colors">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="search"
                placeholder="Search tablets, participants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-knbs-500/20 focus:border-knbs-500 text-sm transition-all dark:text-gray-100 dark:placeholder-gray-500"
              />
            </div>
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                className={cn(
                  "relative p-2 text-gray-600 dark:text-gray-400 hover:text-knbs-600 dark:hover:text-knbs-400 rounded-xl hover:bg-knbs-50 dark:hover:bg-knbs-950/30 transition-all",
                  isNotificationsOpen && "bg-knbs-50 dark:bg-knbs-950/30 text-knbs-600 dark:text-knbs-400"
                )}
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                  <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">Notifications</h3>
                    <span className="px-2 py-0.5 bg-knbs-100 text-knbs-700 text-[10px] font-bold rounded-full uppercase tracking-wider">{unreadCount} New</span>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors border-l-4",
                            notification.read
                              ? "border-transparent"
                              : "border-knbs-500 bg-knbs-50/30 dark:bg-knbs-950/10"
                          )}
                        >
                          <p className="text-sm text-gray-900 dark:text-gray-100 leading-tight font-medium">{notification.text}</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 flex items-center">
                            <span className="w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full mr-2"></span>
                            {notification.time}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center bg-gray-50">
                        <Bell className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No new notifications</p>
                      </div>
                    )}
                  </div>

                  <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                    <Link
                      href="/notifications"
                      className="text-sm text-knbs-600 hover:text-knbs-700 font-bold block text-center transition-colors"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                className={cn(
                  "group flex items-center space-x-2 p-1.5 rounded-xl transition-all",
                  isProfileMenuOpen ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-knbs-100 to-knbs-200 dark:from-knbs-900 dark:to-knbs-800 text-knbs-700 dark:text-knbs-300 ring-2 ring-white dark:ring-gray-900 shadow-sm group-hover:shadow-md transition-all">
                  <User className="h-4.5 w-4.5" />
                </div>
                <div className="hidden md:block text-left mr-1">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none">Admin User</p>
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mt-1.5">Administrator</p>
                </div>
                <ChevronDown className={cn(
                  "hidden md:block h-3.5 w-3.5 text-gray-500 dark:text-gray-400 transition-transform duration-300",
                  isProfileMenuOpen && "rotate-180"
                )} />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                  <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-12 w-12 rounded-xl bg-knbs-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                        AU
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Admin User</p>
                        <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">admin@knbs.gov.ke</p>
                      </div>
                    </div>
                    <div className="flex items-center text-[10px] font-bold text-knbs-700 dark:text-knbs-400 uppercase tracking-widest bg-knbs-100/50 dark:bg-knbs-950/50 w-fit px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-knbs-500 rounded-full mr-2 animate-pulse"></span>
                      Online now
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/auth/profile"
                      className="flex items-center px-5 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-knbs-50 dark:hover:bg-knbs-950/30 hover:text-knbs-700 dark:hover:text-knbs-400 transition-colors group"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User className="mr-3 h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-knbs-500 dark:group-hover:text-knbs-400 transition-colors" />
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-5 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-knbs-50 dark:hover:bg-knbs-950/30 hover:text-knbs-700 dark:hover:text-knbs-400 transition-colors group"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Settings className="mr-3 h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-knbs-500 dark:group-hover:text-knbs-400 transition-colors" />
                      Settings
                    </Link>
                  </div>

                  <div className="px-2 pb-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100/50 group-hover:bg-red-100 mr-3 transition-colors">
                        <LogOut className="h-4 w-4" />
                      </div>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}