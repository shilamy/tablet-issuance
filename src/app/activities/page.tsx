"use client";

import Layout from "@/components/Layout";
import {
    Activity,
    Search,
    Filter,
    Calendar,
    Users,
    Tablet,
    Clock,
    BarChart3,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    PlayCircle,
    ChevronRight,
    MapPin,
    FileText
} from "lucide-react";
import { useState } from "react";

export default function ActivitiesPage() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const surveys = [
        {
            id: 1,
            name: "2024 Kenya Population and Housing Census",
            shortName: "Census 2024",
            description: "Comprehensive enumeration of population, housing units, and socio-economic characteristics across all 47 counties.",
            status: "active",
            period: "Aug 2024 - Dec 2024",
            tabletsAssigned: 2847,
            tabletsActive: 2654,
            coverage: "All 47 Counties",
            category: "demographic"
        },
        {
            id: 2,
            name: "Continuous Household Surveys (KCHSP)",
            shortName: "KCHSP",
            description: "Provides quarterly data on employment, household consumption, housing, and household characteristics. Addresses data gaps in poverty and labor indicators.",
            status: "active",
            period: "Ongoing - Quarterly",
            tabletsAssigned: 856,
            tabletsActive: 823,
            coverage: "All Counties",
            category: "household"
        },
        {
            id: 3,
            name: "Integrated Household Budget Surveys 2025/26",
            shortName: "KIHBS 2025/26",
            description: "Detailed data collection on household income, expenditure, and living standards across Kenya.",
            status: "planned",
            period: "Q2 2025 - Q1 2026",
            tabletsAssigned: 0,
            tabletsActive: 0,
            coverage: "All Counties",
            category: "household"
        },
        {
            id: 4,
            name: "Labour Force Surveys",
            shortName: "LFS",
            description: "Collects data on employment, unemployment, underemployment, and labor market dynamics. Now integrated with KCHSP for ongoing labor data.",
            status: "active",
            period: "Integrated with KCHSP",
            tabletsAssigned: 856,
            tabletsActive: 823,
            coverage: "All Counties",
            category: "economic"
        },
        {
            id: 5,
            name: "Agriculture and Livestock Surveys",
            shortName: "Agri Survey",
            description: "Assess production, productivity, and challenges in the agricultural sector, supporting food security and rural development policies.",
            status: "active",
            period: "Jan 2025 - Jun 2025",
            tabletsAssigned: 1245,
            tabletsActive: 1198,
            coverage: "Rural Counties",
            category: "agriculture"
        },
        {
            id: 6,
            name: "Building and Construction Surveys",
            shortName: "Construction Survey",
            description: "Track trends in construction activity, input prices, and sector performance across major urban centers.",
            status: "active",
            period: "Quarterly",
            tabletsAssigned: 234,
            tabletsActive: 221,
            coverage: "Urban Centers",
            category: "economic"
        },
        {
            id: 7,
            name: "Industrial Production and Enterprise Surveys",
            shortName: "Industrial Survey",
            description: "Measures output, investment, and business performance across manufacturing and industrial sectors.",
            status: "active",
            period: "Annual",
            tabletsAssigned: 412,
            tabletsActive: 398,
            coverage: "Industrial Zones",
            category: "economic"
        },
        {
            id: 8,
            name: "2025 Remittances Household Survey (RHS)",
            shortName: "RHS 2025",
            description: "Evaluate access to financial services and remittance flows across Kenyan households.",
            status: "planned",
            period: "Q3 2025",
            tabletsAssigned: 0,
            tabletsActive: 0,
            coverage: "Selected Counties",
            category: "financial"
        },
        {
            id: 9,
            name: "Child Labour Survey",
            shortName: "Child Labour",
            description: "Focuses on identifying and monitoring child labor trends across Kenya to inform policy interventions.",
            status: "completed",
            period: "Completed 2024",
            tabletsAssigned: 0,
            tabletsActive: 0,
            coverage: "All Counties",
            category: "social"
        },
        {
            id: 10,
            name: "Integrated Time Use Survey",
            shortName: "Time Use",
            description: "Proposed survey to measure how individuals allocate time across various activities including work, care, and leisure.",
            status: "planned",
            period: "TBD 2026",
            tabletsAssigned: 0,
            tabletsActive: 0,
            coverage: "All Counties",
            category: "social"
        }
    ];

    const filteredSurveys = surveys.filter(survey => {
        const matchesFilter = activeFilter === "all" || survey.status === activeFilter;
        const matchesSearch = survey.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            survey.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            survey.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: surveys.length,
        active: surveys.filter(s => s.status === "active").length,
        planned: surveys.filter(s => s.status === "planned").length,
        totalTablets: surveys.reduce((sum, s) => sum + s.tabletsAssigned, 0),
        activeTablets: surveys.reduce((sum, s) => sum + s.tabletsActive, 0)
    };

    return (
        <Layout>
            <div className="space-y-8 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Survey Activities</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Track ongoing KNBS surveys and tablet deployments across Kenya.</p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Total Surveys</p>
                                <p className="text-3xl font-black text-gray-900 dark:text-gray-100 mt-2">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-knbs-50 dark:bg-knbs-950/20 rounded-xl flex items-center justify-center">
                                <Activity className="w-6 h-6 text-knbs-600 dark:text-knbs-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Active Now</p>
                                <p className="text-3xl font-black text-green-600 dark:text-green-400 mt-2">{stats.active}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-50 dark:bg-green-950/20 rounded-xl flex items-center justify-center">
                                <PlayCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Planned</p>
                                <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">{stats.planned}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 rounded-xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Tablets Deployed</p>
                                <p className="text-3xl font-black text-gray-900 dark:text-gray-100 mt-2">{stats.totalTablets.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/20 rounded-xl flex items-center justify-center">
                                <Tablet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Active Tablets</p>
                                <p className="text-3xl font-black text-gray-900 dark:text-gray-100 mt-2">{stats.activeTablets.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {["all", "active", "planned", "completed"].map((filter) => (
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

                    <div className="relative w-full sm:w-auto">
                        <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search surveys..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-knbs-500 dark:focus:ring-knbs-400 w-full sm:w-80 shadow-sm text-gray-900 dark:text-gray-100"
                        />
                    </div>
                </div>

                {/* Survey Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredSurveys.map((survey) => (
                        <div
                            key={survey.id}
                            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                        >
                            {/* Card Header */}
                            <div className={cn(
                                "p-6 border-b border-gray-100 dark:border-gray-800",
                                survey.status === "active" ? "bg-green-50/50 dark:bg-green-950/10" :
                                    survey.status === "planned" ? "bg-blue-50/50 dark:bg-blue-950/10" : "bg-gray-50/50 dark:bg-gray-950/10"
                            )}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-black text-gray-900 dark:text-gray-100">{survey.shortName}</h3>
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                                survey.status === "active" ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400" :
                                                    survey.status === "planned" ? "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400" :
                                                        "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                            )}>
                                                {survey.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{survey.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Period</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                            {survey.period}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Coverage</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                            {survey.coverage}
                                        </p>
                                    </div>
                                </div>

                                {survey.tabletsAssigned > 0 && (
                                    <div className="bg-gray-50 dark:bg-gray-950/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-xs font-bold text-gray-600 dark:text-gray-400">Tablet Deployment</p>
                                            <p className="text-xs font-black text-gray-900 dark:text-gray-100">
                                                {survey.tabletsActive} / {survey.tabletsAssigned} Active
                                            </p>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-knbs-500 to-knbs-600 h-full rounded-full transition-all duration-500"
                                                style={{ width: `${(survey.tabletsActive / survey.tabletsAssigned) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {survey.tabletsAssigned === 0 && (
                                    <div className="bg-gray-50 dark:bg-gray-950/50 rounded-xl p-4 border border-dashed border-gray-200 dark:border-gray-700 text-center">
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500">No tablets assigned yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Card Footer */}
                            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-950/30 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <button className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-knbs-600 dark:hover:text-knbs-400 uppercase tracking-widest transition-colors flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    View Details
                                </button>
                                {survey.status === "active" && (
                                    <button className="px-4 py-2 bg-knbs-500 hover:bg-knbs-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 group-hover:shadow-lg group-hover:shadow-knbs-500/20">
                                        <Tablet className="w-4 h-4" />
                                        Manage Tablets
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredSurveys.length === 0 && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">No surveys found</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}

// Simple Helper
function cn(...classes: (string | undefined | null | boolean)[]) {
    return classes.filter(Boolean).join(" ");
}
