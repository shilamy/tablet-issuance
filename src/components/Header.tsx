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
  Settings
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

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

  const notifications = [
    { id: 1, text: "Tablet A12 needs maintenance", time: "10 min ago", read: false },
    { id: 2, text: "New contract requires approval", time: "25 min ago", read: false },
    { id: 3, text: "Daily issuance report is ready", time: "1 hour ago", read: true },
    { id: 4, text: "5 tablets due for return today", time: "2 hours ago", read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side: Logo and Mobile Menu */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-knbs-500 text-white">
                <div className="h-6 w-6">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TabletTrack</h1>
                <p className="text-xs text-gray-500">KNBS System</p>
              </div>
            </Link>

            {/* Desktop Search */}
            <div className="hidden lg:block ml-10 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search tablets, participants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-knbs-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Button */}
            <button className="lg:hidden p-2 text-gray-600 hover:text-gray-900">
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <p className="text-xs text-gray-500">{unreadCount} unread</p>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4",
                          notification.read 
                            ? "border-transparent" 
                            : "border-knbs-500 bg-knbs-50"
                        )}
                      >
                        <p className="text-sm text-gray-900">{notification.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="px-4 py-2 border-t border-gray-100">
                    <Link
                      href="/notifications"
                      className="text-sm text-knbs-600 hover:text-knbs-700 font-medium block text-center"
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
                className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-100"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-knbs-100 text-knbs-700">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronDown className="hidden md:block h-4 w-4 text-gray-500" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">admin@knbs.gov.ke</p>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User className="mr-3 h-4 w-4" />
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={() => {
                        console.log("Logging out...");
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
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