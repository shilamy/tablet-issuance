// components/Sidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import { 
  Home,
  Users,
  Tablet,
  FileText,
  Package,
  BarChart,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Building2,
  Activity,
  Shield
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: <Home className="w-5 h-5" /> },
  { name: "Participants", href: "/participants", icon: <Users className="w-5 h-5" /> },
  { name: "Tablets", href: "/tablets", icon: <Tablet className="w-5 h-5" /> },
  { name: "Contracts", href: "/contracts", icon: <FileText className="w-5 h-5" /> },
  { name: "Issuance", href: "/issuance", icon: <Package className="w-5 h-5" /> },
  { name: "Reports", href: "/reports", icon: <BarChart className="w-5 h-5" /> },
  { name: "Activities", href: "/activities", icon: <Activity className="w-5 h-5" /> },
];

const bottomItems = [
  { name: "Settings", href: "/settings", icon: <Settings className="w-5 h-5" /> },
  { name: "Help & Support", href: "/help", icon: <HelpCircle className="w-5 h-5" /> },
  { name: "Admin", href: "/admin", icon: <Shield className="w-5 h-5" /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <div className="sticky top-16 h-[calc(100vh-4rem)] flex flex-col">
 
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Main Navigation
          </p>
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-knbs-50 to-knbs-100 text-knbs-700 border-l-4 border-knbs-500"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1"
                )}
              >
                <div className="flex items-center">
                  <span className={cn("mr-3 transition-colors", isActive ? "text-knbs-600" : "text-gray-400 group-hover:text-gray-600")}>
                    {item.icon}
                  </span>
                  {item.name}
                </div>
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-knbs-500" />
                )}
              </Link>
            );
          })}
        </nav>

     
{/* Horizontal Icon-only Bottom section */}
<div className="p-3 border-t border-gray-100">
  <div className="flex items-center justify-between">
    {/* System icons in a row */}
    <div className="flex items-center space-x-1">
      {bottomItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-colors relative group"
          title={item.name}
        >
          {item.icon}
          {/* Tooltip on hover */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
            {item.name}
            {/* Tooltip arrow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-b-0 border-t-gray-800 border-l-transparent border-r-transparent"></div>
          </span>
        </Link>
      ))}
    </div>
    
    {/* Logout button on the right */}
    <button
      onClick={() => console.log("Logging out...")}
      className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors relative group"
      title="Sign Out"
    >
      <LogOut className="w-4 h-4" />
      {/* Tooltip for logout */}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
        Sign Out
        {/* Tooltip arrow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-b-0 border-t-gray-800 border-l-transparent border-r-transparent"></div>
      </span>
    </button>
  </div>
  
  {/* Version info centered below */}
  <div className="mt-2 pt-2 border-t border-gray-100">
    <p className="text-[9px] text-gray-400 text-center">v2.1.0 • KNBS</p>
  </div>
</div>
      </div>
    </aside>
  );
}