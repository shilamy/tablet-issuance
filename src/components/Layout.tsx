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
    <div className="min-h-screen bg-white bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-knbs-50/30 via-white to-white dark:from-gray-950 dark:via-gray-900 dark:to-knbs-950/20 transition-colors duration-300">
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