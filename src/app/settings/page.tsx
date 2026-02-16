"use client";

import Layout from "@/components/Layout";
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
    Settings
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    const sections = [
        { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
        { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
        { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
        { id: "system", label: "System Guard", icon: <Database className="w-4 h-4" /> },
    ];

    return (
        <Layout>
            <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Settings</h1>
                    <p className="text-gray-500 mt-2">Manage your account preferences and global system configuration.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full lg:w-64 space-y-2">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveTab(section.id)}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all",
                                    activeTab === section.id
                                        ? "bg-knbs-50 text-knbs-600 border-l-4 border-knbs-500 shadow-sm"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {section.icon}
                                    {section.label}
                                </div>
                                <ChevronRight className={cn("w-4 h-4 transition-transform", activeTab === section.id && "rotate-90")} />
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-900 capitalize">{activeTab} Configuration</h2>
                                <button className="px-4 py-2 bg-knbs-600 text-white rounded-lg text-sm font-bold hover:bg-knbs-700 flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>

                            <div className="p-8 space-y-8 text-gray-400 italic">
                                {/* Form Placeholders */}
                                {activeTab === 'profile' && (
                                    <div className="space-y-6 not-italic">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                                                <input type="text" defaultValue="Admin User" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                                <input type="email" defaultValue="admin@knbs.gov.ke" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Department</label>
                                            <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none appearance-none">
                                                <option>Operations & Logistics</option>
                                                <option>Field Enumeration</option>
                                                <option>Data Quality Assurance</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                                {activeTab !== 'profile' && <p>This section is under maintenance. Settings will be available in the next system update.</p>}
                            </div>
                        </div>

                        {/* Quick Tips */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex items-start gap-4">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Lock className="w-5 h-5 text-knbs-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Security Recommendation</h4>
                                <p className="text-sm text-gray-500 mt-1">We recommend enabling two-factor authentication (2FA) for all administrative accounts to protect sensitive participant data.</p>
                            </div>
                        </div>
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
