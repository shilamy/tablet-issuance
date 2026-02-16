"use client";

import Layout from "@/components/Layout";
import {
    BarChart3,
    FileText,
    Download,
    Search,
    Filter,
    Calendar,
    ChevronRight,
    Tablet,
    Users,
    Package,
    TrendingUp,
    Clock
} from "lucide-react";
import Link from "next/link";

export default function ReportsPage() {
    const reports = [
        { title: "Daily Issuance", description: "Standard daily tablet assignment log", icon: <Tablet className="w-5 h-5" />, color: "bg-blue-50 text-blue-600" },
        { title: "Participant Activity", description: "Detailed tracking of enumerator performance", icon: <Users className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-600" },
        { title: "Inventory Status", description: "Summary of device health and availability", icon: <Package className="w-5 h-5" />, color: "bg-orange-50 text-orange-600" },
        { title: "Performance Metrics", description: "Strategic overview of system efficiency", icon: <TrendingUp className="w-5 h-5" />, color: "bg-purple-50 text-purple-600" },
    ];

    return (
        <Layout>
            <div className="space-y-8 p-4 md:p-6 lg:p-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Reports</h1>
                    <p className="text-gray-500 mt-2">Generate and download comprehensive data reports for the system.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {reports.map((report, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group">
                            <div className={`${report.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6`}>
                                {report.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{report.title}</h3>
                            <p className="text-gray-500 text-sm mb-6">{report.description}</p>
                            <button className="w-full flex items-center justify-between text-sm font-bold text-knbs-600 hover:text-knbs-700">
                                Generate Report
                                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-lg font-bold text-gray-900">Recently Generated</h3>
                        <div className="flex items-center gap-3">
                            <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600">
                                <Filter className="w-4 h-4" />
                            </button>
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search reports..."
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-knbs-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <FileText className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">RP-{2024}-{i.toString().padStart(4, '0')}</div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2 hours ago</span>
                                            <span>•</span>
                                            <span>PDF Format</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">
                                        View
                                    </button>
                                    <button className="p-2 bg-knbs-50 text-knbs-600 rounded-lg hover:bg-knbs-100">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
