"use client";

import Layout from "@/components/Layout";
import {
    Activity,
    Search,
    Filter,
    Download,
    User,
    Tablet,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    Settings,
    LogOut,
    LogIn,
    RefreshCw,
    Package,
    FileText,
    Shield
} from "lucide-react";
import { useState } from "react";

export default function LogsPage() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const logs = [
        {
            id: 1,
            type: "assignment",
            title: "Tablet Assignment",
            description: "Assigned KNBS-TB-2847 to Field Officer John Kamau for Census 2024",
            user: "Admin User",
            device: "KNBS-TB-2847",
            timestamp: "2026-02-16 14:23:15",
            timeAgo: "2 mins ago",
            status: "success"
        },
        {
            id: 2,
            type: "alert",
            title: "Low Battery Alert",
            description: "Device KNBS-TB-0156 reported battery level below 15%",
            user: "System",
            device: "KNBS-TB-0156",
            timestamp: "2026-02-16 14:15:42",
            timeAgo: "10 mins ago",
            status: "warning"
        },
        {
            id: 3,
            type: "return",
            title: "Tablet Return Registered",
            description: "Field Officer Mary Wanjiku returned KNBS-TB-1234 after KCHSP completion",
            user: "Field Officer Mary Wanjiku",
            device: "KNBS-TB-1234",
            timestamp: "2026-02-16 13:45:28",
            timeAgo: "40 mins ago",
            status: "success"
        },
        {
            id: 4,
            type: "maintenance",
            title: "Maintenance Scheduled",
            description: "Routine maintenance scheduled for 15 tablets in Nairobi region",
            user: "IT Support",
            device: "Multiple Devices",
            timestamp: "2026-02-16 12:30:00",
            timeAgo: "2 hours ago",
            status: "info"
        },
        {
            id: 5,
            type: "sync",
            title: "Data Synchronization",
            description: "Bulk data sync completed for 234 tablets - Census 2024 dataset",
            user: "System",
            device: "Global",
            timestamp: "2026-02-16 11:00:15",
            timeAgo: "3 hours ago",
            status: "success"
        },
        {
            id: 6,
            type: "error",
            title: "Sync Failure",
            description: "Failed to sync data from KNBS-TB-0892 - Network timeout",
            user: "System",
            device: "KNBS-TB-0892",
            timestamp: "2026-02-16 10:15:33",
            timeAgo: "4 hours ago",
            status: "error"
        },
        {
            id: 7,
            type: "login",
            title: "User Login",
            description: "Supervisor Peter Ochieng logged into the system",
            user: "Supervisor Peter Ochieng",
            device: "Web Portal",
            timestamp: "2026-02-16 09:00:00",
            timeAgo: "5 hours ago",
            status: "success"
        },
        {
            id: 8,
            type: "update",
            title: "Contract Updated",
            description: "Contract CNT-2024-156 updated with new tablet allocation",
            user: "Admin User",
            device: "N/A",
            timestamp: "2026-02-16 08:30:12",
            timeAgo: "6 hours ago",
            status: "info"
        },
        {
            id: 9,
            type: "assignment",
            title: "Bulk Tablet Assignment",
            description: "Assigned 45 tablets to KIHBS 2025/26 survey team",
            user: "Admin User",
            device: "Multiple Devices",
            timestamp: "2026-02-15 16:45:00",
            timeAgo: "Yesterday",
            status: "success"
        },
        {
            id: 10,
            type: "security",
            title: "Security Audit",
            description: "System security audit completed - No issues detected",
            user: "System",
            device: "System-wide",
            timestamp: "2026-02-15 14:00:00",
            timeAgo: "Yesterday",
            status: "success"
        }
    ];

    const filteredLogs = logs.filter(log => {
        const matchesFilter = activeFilter === "all" || log.type === activeFilter;
        const matchesSearch = log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.device.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getIcon = (type: string) => {
        switch (type) {
            case "assignment": return <Package className="w-5 h-5" />;
            case "alert": return <AlertCircle className="w-5 h-5" />;
            case "return": return <CheckCircle className="w-5 h-5" />;
            case "maintenance": return <Settings className="w-5 h-5" />;
            case "sync": return <RefreshCw className="w-5 h-5" />;
            case "error": return <XCircle className="w-5 h-5" />;
            case "login": return <LogIn className="w-5 h-5" />;
            case "logout": return <LogOut className="w-5 h-5" />;
            case "update": return <FileText className="w-5 h-5" />;
            case "security": return <Shield className="w-5 h-5" />;
            default: return <Activity className="w-5 h-5" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "success": return "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400";
            case "warning": return "bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400";
            case "error": return "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400";
            case "info": return "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400";
            default: return "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
        }
    };

    return (
        <Layout>
            <div className="space-y-8 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">System Logs</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Comprehensive audit trail of all system events and user actions.</p>
                    </div>
                    <button className="px-5 py-2.5 bg-knbs-500 hover:bg-knbs-600 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-knbs-500/20">
                        <Download className="w-4 h-4" />
                        Export Logs
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {["all", "assignment", "alert", "return", "maintenance", "sync", "error", "security"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-bold transition-all capitalize",
                                    activeFilter === filter
                                        ? "bg-knbs-500 text-white shadow-lg shadow-knbs-500/20"
                                        : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-knbs-500 dark:hover:border-knbs-400"
                                )}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full lg:w-auto">
                        <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-knbs-500 dark:focus:ring-knbs-400 w-full lg:w-80 shadow-sm text-gray-900 dark:text-gray-100"
                        />
                    </div>
                </div>

                {/* Logs Container */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-950/30">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Real-time Stream</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">
                            <span>Filter: {activeFilter === "all" ? "All Events" : activeFilter}</span>
                            <span>•</span>
                            <span>Period: Today</span>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="p-8">
                        <div className="space-y-6 relative">
                            {/* Timeline Line */}
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-800"></div>

                            {filteredLogs.map((log) => (
                                <div key={log.id} className="flex gap-6 relative z-10">
                                    {/* Icon */}
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                        getStatusColor(log.status)
                                    )}>
                                        {getIcon(log.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 bg-gray-50/50 dark:bg-gray-950/30 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md transition-all group">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="font-bold text-gray-900 dark:text-gray-100">{log.title}</h4>
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                                        log.status === "success" ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400" :
                                                            log.status === "warning" ? "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400" :
                                                                log.status === "error" ? "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400" :
                                                                    "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                                                    )}>
                                                        {log.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{log.description}</p>
                                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        {log.user}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1 font-mono">
                                                        <Tablet className="w-3 h-3" />
                                                        {log.device}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="font-mono text-[10px]">{log.timestamp}</span>
                                                </div>
                                            </div>
                                            <div className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase flex items-center gap-1 shrink-0">
                                                <Clock className="w-3 h-3" />
                                                {log.timeAgo}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-950/30 border-t border-gray-100 dark:border-gray-800 flex justify-center">
                        <button className="text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 uppercase tracking-widest transition-colors">
                            Load More History
                        </button>
                    </div>
                </div>

                {filteredLogs.length === 0 && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">No logs found</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}

// Simple Helper
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
