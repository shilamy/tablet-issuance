"use client";

import Layout from "@/components/Layout";
import {
    Activity,
    Search,
    Filter,
    Calendar,
    User,
    Tablet,
    Clock,
    MoreVertical,
    CheckCircle,
    AlertCircle
} from "lucide-react";

export default function ActivitiesPage() {
    const activities = [
        { title: "Tablet Assignment", user: "Admin", device: "KNBS-TB-001", time: "10 mins ago", type: "assignment" },
        { title: "Maintenance Alert", user: "System", device: "KNBS-TB-042", time: "25 mins ago", type: "alert" },
        { title: "Return Registered", user: "Field Officer A", device: "KNBS-TB-012", time: "1 hour ago", type: "return" },
        { title: "Contract Updated", user: "Supervisor", device: "N/A", time: "2 hours ago", type: "assignment" },
        { title: "Bulk Sync", user: "System", device: "Global", time: "4 hours ago", type: "assignment" },
    ];

    return (
        <Layout>
            <div className="space-y-8 p-4 md:p-6 lg:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Activities</h1>
                        <p className="text-gray-500 mt-2">Comprehensive audit log of all system events and user actions.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-gray-600 shadow-sm">
                            <Filter className="w-5 h-5" />
                        </button>
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search logs..."
                                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-knbs-500 w-64 shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Real-time Stream</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase">
                            <span>Filter: All Events</span>
                            <span>Period: Today</span>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="space-y-8 relative">
                            {/* Timeline Line */}
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100"></div>

                            {activities.map((activity, i) => (
                                <div key={i} className="flex gap-6 relative z-10">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                        activity.type === 'assignment' ? "bg-blue-50 text-blue-600" :
                                            activity.type === 'alert' ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                                    )}>
                                        {activity.type === 'assignment' ? <Activity className="w-5 h-5" /> :
                                            activity.type === 'alert' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                    </div>

                                    <div className="flex-1 bg-gray-50/50 border border-gray-100 rounded-2xl p-5 hover:bg-white hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-gray-900">{activity.title}</h4>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                                                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {activity.user}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1 font-mono">{activity.device}</span>
                                                </div>
                                            </div>
                                            <div className="text-[10px] font-black text-gray-300 uppercase flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {activity.time}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
                        <button className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest">Load More History</button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// Simple Helper
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
