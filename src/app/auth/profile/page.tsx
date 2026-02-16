"use client";

import Layout from "@/components/Layout";
import { User, Mail, Shield, Smartphone, Bell, Clock, Edit2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function ProfilePage() {
    const { user } = useAuth();

    const profileData = {
        name: "Admin User",
        role: "System Administrator",
        email: user?.email || "admin@knbs.gov.ke",
        lastLogin: "Today, 08:45 AM",
        permissions: ["Manage Users", "Issue Tablets", "View Reports", "System Settings"],
        recentActivity: [
            { id: 1, action: "Issued Tablet T-105", time: "2 hours ago" },
            { id: 2, action: "Approved new contract", time: "5 hours ago" },
            { id: 3, action: "Modified participant profile", time: "Yesterday" }
        ]
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Profile Header */}
                <div className="relative overflow-hidden bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-knbs-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>

                    <div className="relative flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-knbs-500 to-knbs-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-knbs-500/20">
                                AU
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl border border-gray-200 shadow-lg text-gray-600 hover:text-knbs-600 transition-colors">
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                            <p className="text-knbs-600 font-semibold mt-1 uppercase tracking-wider text-sm">{profileData.role}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-sm">{profileData.email}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">Last active: {profileData.lastLogin}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Permissions & Stats */}
                    <div className="md:col-span-1 space-y-8">
                        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                <Shield className="w-5 h-5 text-knbs-500" />
                                <span>Permissions</span>
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {profileData.permissions.map((perm, i) => (
                                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                                        {perm}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl shadow-gray-200">
                            <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
                                <Smartphone className="w-5 h-5 text-knbs-400" />
                                <span>Active Tablets</span>
                            </h2>
                            <p className="text-4xl font-black">12</p>
                            <p className="text-gray-400 text-xs mt-2 font-medium">Currently under your management</p>
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 h-full">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                                <Bell className="w-5 h-5 text-knbs-500" />
                                <span>Recent Activity</span>
                            </h2>

                            <div className="space-y-6">
                                {profileData.recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-start space-x-4">
                                        <div className="p-2 bg-knbs-50 text-knbs-600 rounded-lg">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{activity.action}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-8 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                                View All Activity
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
