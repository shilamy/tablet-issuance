"use client";

import Layout from "@/components/Layout";
import { Shield, Users, Database, Key, Server, Settings, Activity } from "lucide-react";

export default function AdminPage() {
    const controls = [
        { label: "User Management", desc: "Manage system access and roles", icon: <Users className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
        { label: "Database Tools", desc: "Optimize and backup system data", icon: <Database className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
        { label: "Security Logs", desc: "Audit high-level system changes", icon: <Shield className="w-5 h-5 text-rose-600" />, bg: "bg-rose-50" },
        { label: "API Configuration", desc: "Manage external data integrations", icon: <Key className="w-5 h-5 text-purple-600" />, bg: "bg-purple-50" },
    ];

    return (
        <Layout>
            <div className="space-y-8 p-4 md:p-6 lg:p-8">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-900 p-3 rounded-2xl">
                        <Shield className="w-8 h-8 text-knbs-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Administrative Console</h1>
                        <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-widest bg-gray-100 inline-block px-2 py-0.5 rounded">Core System Access</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {controls.map((control, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer group">
                            <div className={`${control.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-6`}>
                                {control.icon}
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">{control.label}</h3>
                            <p className="text-gray-400 text-xs">{control.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">Infrastructure Health</h3>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tighter">All Systems Operational</span>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="space-y-2">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Active Servers</p>
                                <p className="text-3xl font-black text-gray-900">04 <span className="text-sm font-normal text-gray-300">/ 04</span></p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Memory Usage</p>
                                <p className="text-3xl font-black text-gray-900">42%</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Global Uptime</p>
                                <p className="text-3xl font-black text-gray-900">99.98%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
