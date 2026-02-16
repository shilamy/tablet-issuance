// components/Layout.tsx
"use client";

import { ReactNode } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Header />

      <div className="flex">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}