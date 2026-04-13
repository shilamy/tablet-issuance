import { usePathname, useRouter } from "next/navigation";
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
  Activity,
  Shield
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Participants", href: "/participants", icon: Users },
  { name: "Tablets", href: "/tablets", icon: Tablet },
  { name: "Contracts", href: "/contracts", icon: FileText },
  { name: "Issuance", href: "/issuance", icon: Package },
  { name: "Reports", href: "/reports", icon: BarChart },
  { name: "Activities", href: "/activities", icon: Activity },
];

const bottomItems = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "System Logs", href: "/logs", icon: Activity },
  { name: "Help & Support", href: "/help", icon: HelpCircle },
  { name: "Admin", href: "/admin", icon: Shield },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/auth/logout");
  };

  return (
    <aside className="hidden lg:block w-72 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 shadow-[1px_0_0_rgb(0,0,0,0.02)] transition-all duration-300">
      <div className="sticky top-16 h-[calc(100vh-4rem)] flex flex-col">

        {/* Navigation Section */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 mb-6">
              <img 
                src="/logo-KNBS.png" 
                alt="KNBS Logo" 
                className="h-12 w-12 object-contain mx-auto rounded-xl shadow-lg shadow-knbs-400/30 mb-3"
              />
              <p className="text-center text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Tablet Issuance System</p>
            </div>
            <div className="flex-1 space-y-8 overflow-y-auto">
              <div>
                <p className="px-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">
                  Main Dashboard
                </p>
            <nav className="space-y-1.5">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-r from-knbs-50 to-knbs-100/50 dark:from-knbs-950/20 dark:to-knbs-900/20 text-knbs-700 dark:text-knbs-400 shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100"
                    )}
                  >
                    <div className="flex items-center">
                      <div className={cn(
                        "p-2 rounded-xl transition-all duration-300 mr-3",
                        isActive
                          ? "bg-white dark:bg-gray-800 text-knbs-600 dark:text-knbs-400 shadow-sm scale-110"
                          : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="tracking-tight">{item.name}</span>
                    </div>
                    {isActive ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-knbs-500 shadow-[0_0_10px_rgba(30,58,138,0.5)]"></div>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">
              System Control
            </p>
            <nav className="space-y-1.5">
              {bottomItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300",
                      isActive
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-xl transition-all duration-300 mr-3",
                      isActive
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                        : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="tracking-tight">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[8px] font-bold text-gray-500 overflow-hidden">
                    {i === 3 ? "+8" : <div className="w-full h-full bg-knbs-100 dark:bg-knbs-900" />}
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full ring-1 ring-green-100">Live</span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/30 transition-all text-sm font-bold group"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Sign Out
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between px-2">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">v2.1.0 Premium</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-knbs-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
