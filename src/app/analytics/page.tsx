"use client";

import Layout from "@/components/Layout";
import {
    BarChart3,
    TrendingUp,
    Users,
    Tablet,
    Clock,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Download,
    Calendar
} from "lucide-react";

export default function AnalyticsPage() {
    const primaryStats = [
        { label: "Completion Rate", value: "94.2%", trend: "+2.5%", isUp: true, icon: <Zap className="w-5 h-5" />, color: "bg-orange-50 text-orange-600" },
        { label: "Active Field Work", value: "856", description: "Units currently active", trend: "+12", isUp: true, icon: <Users className="w-5 h-5" />, color: "bg-blue-50 text-blue-600" },
        { label: "Sync Latency", value: "1.2s", description: "Average data delay", trend: "-0.4s", isUp: true, icon: <Clock className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-600" },
        { label: "Device Down-time", value: "0.8%", trend: "+0.1%", isUp: false, icon: <Tablet className="w-5 h-5" />, color: "bg-rose-50 text-rose-600" },
    ];

    return (
        <Layout>
            <div className="space-y-8 p-4 md:p-6 lg:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Analytics</h1>
                        <p className="text-gray-500 mt-2">Historical trends and real-time operational metrics.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm">
                            <Calendar className="w-4 h-4" />
                            Last 30 Days
                        </button>
                        <button className="px-4 py-2.5 bg-knbs-600 text-white rounded-xl text-sm font-bold hover:bg-knbs-700 flex items-center gap-2 shadow-md">
                            <Download className="w-4 h-4" />
                            Export Data
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {primaryStats.map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${stat.color} p-3 rounded-xl`}>
                                    {stat.icon}
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                                    stat.isUp ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                                )}>
                                    {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {stat.trend}
                                </div>
                            </div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h3>
                            {stat.description && <p className="text-gray-400 text-xs mt-2 italic">{stat.description}</p>}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm min-h-[400px]">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-lg font-bold text-gray-900">Distribution Trends</h3>
                            <div className="flex items-center bg-gray-50 rounded-lg p-1">
                                <button className="px-3 py-1.5 text-xs font-bold text-knbs-600 bg-white rounded shadow-sm">Line</button>
                                <button className="px-3 py-1.5 text-xs font-bold text-gray-500 rounded">Bar</button>
                            </div>
                        </div>

                        <div className="h-64 flex items-end justify-between gap-4 grayscale opacity-30 mt-auto">
                            {[40, 60, 45, 90, 65, 80, 55, 75, 50, 85].map((h, i) => (
                                <div key={i} className="bg-gray-200 w-full rounded-t-lg transition-all hover:bg-knbs-400" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-8">Performance Distribution</h3>
                        <div className="space-y-6">
                            {[
                                { label: "Household Survey", value: 85, color: "bg-blue-500" },
                                { label: "Agricultural Census", value: 64, color: "bg-emerald-500" },
                                { label: "Business Survey", value: 42, color: "bg-orange-500" },
                                { label: "Staff Training", value: 92, color: "bg-purple-500" },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-gray-700">{item.label}</span>
                                        <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.value}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// Simple Helper
function cn(...classes: (string | undefined | null | boolean)[]) {
    return classes.filter(Boolean).join(" ");
}
