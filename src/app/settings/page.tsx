"use client";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";
import {
    User,
    Bell,
    Shield,
    Globe,
    Database,
    Smartphone,
    ChevronRight,
    Save,
    Lock,
    Eye,
    Settings,
    Sun,
    Moon,
    Monitor,
    Check
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        // next-themes recommends gating theme-dependent UI until mounted.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const sections = [
        { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
        { id: "appearance", label: "Appearance", icon: <Eye className="w-4 h-4" /> },
        { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
        { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
        { id: "system", label: "System Guard", icon: <Database className="w-4 h-4" /> },
    ];

    const themes = [
        { id: "light", label: "Light Mode", icon: <Sun className="w-5 h-5" />, desc: "Clean and bright for daytime use" },
        { id: "dark", label: "Dark Mode", icon: <Moon className="w-5 h-5" />, desc: "Easy on the eyes in low light" },
        { id: "system", label: "System Preference", icon: <Monitor className="w-5 h-5" />, desc: "Automatically sync with your device" },
    ];

    return (
        <Layout>
            <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">System Settings</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage your account preferences and global system configuration.</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 space-y-1.5">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveTab(section.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all duration-300",
                                        activeTab === section.id
                                            ? "bg-knbs-50 dark:bg-knbs-950/20 text-knbs-700 dark:text-knbs-400 shadow-sm shadow-knbs-500/5 translate-x-1"
                                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "p-2 rounded-xl transition-all duration-300",
                                            activeTab === section.id ? "bg-white dark:bg-gray-800 text-knbs-600 dark:text-knbs-400 shadow-sm" : "bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                                        )}>
                                            {section.icon}
                                        </div>
                                        {section.label}
                                    </div>
                                    <ChevronRight className={cn("w-4 h-4 transition-all duration-300 text-gray-300 dark:text-gray-600", activeTab === section.id && "rotate-90 text-knbs-500 dark:text-knbs-400")} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden transition-all duration-500">
                            {/* Content Header */}
                            <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-950/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 capitalize tracking-tight">{activeTab}</h2>
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Configuration & Preferences</p>
                                </div>
                                <button className="px-5 py-2.5 bg-gradient-to-r from-knbs-500 to-knbs-600 text-white rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-knbs-500/20 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2 group">
                                    <Save className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                    Save Changes
                                </button>
                            </div>

                            {/* Content Body */}
                            <div className="p-8">
                                {activeTab === 'profile' && (
                                    <div className="space-y-8 animate-in fade-in duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <input type="text" defaultValue="Admin User" className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-gray-100 font-bold focus:outline-none focus:ring-4 focus:ring-knbs-500/5 focus:border-knbs-500 transition-all" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                                        <Globe className="w-4 h-4" />
                                                    </div>
                                                    <input type="email" defaultValue="admin@knbs.gov.ke" className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-gray-100 font-bold focus:outline-none focus:ring-4 focus:ring-knbs-500/5 focus:border-knbs-500 transition-all" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Department</label>
                                            <div className="relative">
                                                <select className="w-full p-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-gray-100 font-bold focus:outline-none focus:ring-4 focus:ring-knbs-500/5 focus:border-knbs-500 transition-all appearance-none cursor-pointer">
                                                    <option>Operations & Logistics</option>
                                                    <option>Field Enumeration</option>
                                                    <option>Data Quality Assurance</option>
                                                </select>
                                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 rotate-90 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'appearance' && (
                                    <div className="space-y-6 animate-in fade-in duration-500">
                                        <div className="bg-knbs-50/50 dark:bg-knbs-950/20 p-6 rounded-2xl border border-knbs-100 dark:border-knbs-900 mb-8">
                                            <h3 className="text-sm font-bold text-knbs-900 dark:text-knbs-400 mb-1">Theme Preferences</h3>
                                            <p className="text-xs text-knbs-600 dark:text-knbs-500 font-medium">Choose how TabletTrack looks on your screen.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {themes.map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setTheme(t.id)}
                                                    className={cn(
                                                        "relative flex flex-col items-center p-6 rounded-[2rem] border-2 transition-all duration-300 group",
                                                        theme === t.id
                                                            ? "bg-white dark:bg-gray-800 border-knbs-500 dark:border-knbs-400 shadow-xl shadow-knbs-500/10 scale-[1.02]"
                                                            : "bg-gray-50/50 dark:bg-gray-950 border-transparent hover:bg-white dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "h-16 w-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300",
                                                        theme === t.id ? "bg-knbs-500 text-white shadow-lg shadow-knbs-500/20 rotate-6" : "bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 group-hover:scale-110"
                                                    )}>
                                                        {t.icon}
                                                    </div>
                                                    <p className={cn("text-sm font-black mb-1 transition-colors", theme === t.id ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100")}>{t.label}</p>
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold text-center leading-tight px-2">{t.desc}</p>

                                                    {theme === t.id && (
                                                        <div className="absolute top-4 right-4 bg-knbs-500 text-white p-1 rounded-lg animate-in zoom-in duration-300">
                                                            <Check className="w-3 h-3" strokeWidth={4} />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {['notifications', 'security', 'system'].includes(activeTab) && (
                                    <div className="py-20 text-center animate-in fade-in duration-500">
                                        <div className="h-20 w-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                                            <Settings className="w-10 h-10 animate-[spin_4s_linear_infinite]" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Under Technical Review</h3>
                                        <p className="text-sm text-gray-400 font-bold mt-2 max-w-xs mx-auto uppercase tracking-widest leading-loose">
                                            This module is currently being optimized for global deployment.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Security Tip Contextual Footer */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-8 text-white shadow-xl shadow-gray-200/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-knbs-500 rounded-full -mr-32 -mt-32 blur-[100px] opacity-20 group-hover:scale-110 transition-transform duration-700"></div>

                            <div className="relative z-10 flex items-start sm:items-center gap-6">
                                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-inner border border-white/10 shrink-0">
                                    <Lock className="w-6 h-6 text-knbs-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold tracking-tight">Security & Governance</h4>
                                    <p className="text-sm text-gray-400 mt-2 font-medium leading-relaxed max-w-2xl">
                                        TabletTrack enforces strict data compliance. Ensure your browser profile is correctly linked to your KNBS identity for automatic theme synchronization.
                                    </p>
                                </div>
                                <Link href="#" className="hidden md:flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 hover:bg-white text-white hover:text-gray-900 transition-all shrink-0">
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
