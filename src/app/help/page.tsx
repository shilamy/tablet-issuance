"use client";

import Layout from "@/components/Layout";
import { HelpCircle, Search, MessageSquare, Book, FileQuestion } from "lucide-react";

export default function HelpPage() {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-12 space-y-12">
                <div className="text-center">
                    <div className="bg-knbs-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <HelpCircle className="w-10 h-10 text-knbs-600" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">How can we help?</h1>
                    <p className="text-gray-500 mt-4 text-lg">Browse our knowledge base or reach out to system administrators.</p>
                </div>

                <div className="relative">
                    <Search className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search for guides, troubleshooting... "
                        className="w-full pl-14 pr-6 py-5 bg-white border border-gray-200 rounded-2xl text-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-knbs-500/10 focus:border-knbs-500 transition-all font-medium"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-knbs-200 hover:shadow-lg transition-all cursor-pointer group">
                        <Book className="w-8 h-8 text-blue-500 mb-6" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">User Manual</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Comprehensive documentation for enumerators and supervisors on tablet management.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-knbs-200 hover:shadow-lg transition-all cursor-pointer group">
                        <FileQuestion className="w-8 h-8 text-emerald-500 mb-6" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Troubleshooting</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Common issues with QR scanning, data sync, and device connectivity fixes.</p>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-4 overflow-hidden relative">
                    <div className="relative z-10">
                        <h4 className="text-2xl font-bold mb-2">Still need support?</h4>
                        <p className="text-gray-400">Our technical team is available 24/7 for critical system issues.</p>
                    </div>
                    <button className="px-8 py-4 bg-knbs-500 hover:bg-knbs-600 rounded-xl font-bold transition-all shadow-lg relative z-10">
                        Contact Support Team
                    </button>
                    <MessageSquare className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5" />
                </div>
            </div>
        </Layout>
    );
}
