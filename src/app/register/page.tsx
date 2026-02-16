"use client";

import { useState } from "react";
import Link from "next/link";
import {
    User,
    Mail,
    Phone,
    IdCard,
    MapPin,
    Briefcase,
    Tablet,
    CheckCircle2,
    ArrowLeft,
    Activity,
    Search,
    Filter
} from "lucide-react";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        idNumber: "",
        phone: "",
        email: "",
        role: "",
        activity: "",
        county: "",
        selectedTablet: ""
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Mock available tablets
    const tablets = [
        { id: "KNBS-TB-0001", model: "Samsung Galaxy Tab A8", status: "available", specs: "10.5\" | 4GB RAM | 64GB" },
        { id: "KNBS-TB-0002", model: "Samsung Galaxy Tab A8", status: "available", specs: "10.5\" | 4GB RAM | 64GB" },
        { id: "KNBS-TB-0015", model: "Samsung Galaxy Tab S7", status: "available", specs: "11\" | 6GB RAM | 128GB" },
        { id: "KNBS-TB-0023", model: "Samsung Galaxy Tab A8", status: "available", specs: "10.5\" | 4GB RAM | 64GB" },
        { id: "KNBS-TB-0034", model: "Samsung Galaxy Tab S7", status: "available", specs: "11\" | 6GB RAM | 128GB" },
        { id: "KNBS-TB-0045", model: "Samsung Galaxy Tab A8", status: "available", specs: "10.5\" | 4GB RAM | 64GB" },
        { id: "KNBS-TB-0056", model: "Lenovo Tab M10", status: "available", specs: "10.1\" | 4GB RAM | 64GB" },
        { id: "KNBS-TB-0067", model: "Samsung Galaxy Tab A8", status: "available", specs: "10.5\" | 4GB RAM | 64GB" },
    ];

    const activities = [
        "2024 Kenya Population and Housing Census",
        "Continuous Household Surveys (KCHSP)",
        "Integrated Household Budget Surveys (KIHBS 2025/26)",
        "Labour Force Surveys",
        "Agriculture and Livestock Surveys",
        "Building and Construction Surveys",
        "Industrial Production and Enterprise Surveys",
        "2025 Remittances Household Survey (RHS)"
    ];

    const counties = [
        "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi", "Kitale",
        "Garissa", "Kakamega", "Nyeri", "Meru", "Machakos", "Kiambu", "Kajiado", "Narok"
    ];

    const filteredTablets = tablets.filter(tablet => {
        const matchesSearch = tablet.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tablet.model.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log("Registration submitted:", formData);
        alert("Registration submitted successfully! Your request is pending admin approval.");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-knbs-500 to-knbs-600 rounded-xl flex items-center justify-center shadow-lg shadow-knbs-500/20">
                            <Tablet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-gray-900 dark:text-gray-100">TabletTrack</h1>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Field Staff Registration</p>
                        </div>
                    </div>
                    <Link
                        href="/"
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm font-bold transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Page Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-2">Field Staff Registration</h2>
                    <p className="text-gray-600 dark:text-gray-400">Register as a Supervisor or Research Assistant and select your tablet assignment.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Details */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <User className="w-5 h-5 text-knbs-600 dark:text-knbs-400" />
                                Personal Details
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Full Name *</label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500 dark:focus:ring-knbs-400 transition-all"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">ID Number *</label>
                                <div className="relative">
                                    <IdCard className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.idNumber}
                                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500 dark:focus:ring-knbs-400 transition-all"
                                        placeholder="Enter your ID number"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Phone Number *</label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500 dark:focus:ring-knbs-400 transition-all"
                                        placeholder="+254 700 000 000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Email Address *</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500 dark:focus:ring-knbs-400 transition-all"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Details */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-knbs-600 dark:text-knbs-400" />
                                Assignment Details
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Role *</label>
                                <select
                                    required
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500 dark:focus:ring-knbs-400 transition-all"
                                >
                                    <option value="">Select your role</option>
                                    <option value="supervisor">Supervisor</option>
                                    <option value="research_assistant">Research Assistant</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Activity/Survey *</label>
                                <select
                                    required
                                    value={formData.activity}
                                    onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500 dark:focus:ring-knbs-400 transition-all"
                                >
                                    <option value="">Select activity</option>
                                    {activities.map((activity) => (
                                        <option key={activity} value={activity}>{activity}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">County Assignment *</label>
                                <div className="relative">
                                    <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <select
                                        required
                                        value={formData.county}
                                        onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500 dark:focus:ring-knbs-400 transition-all"
                                    >
                                        <option value="">Select county</option>
                                        {counties.map((county) => (
                                            <option key={county} value={county}>{county}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tablet Selection */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    <Tablet className="w-5 h-5 text-knbs-600 dark:text-knbs-400" />
                                    Select Tablet
                                </h3>
                                <div className="relative">
                                    <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Search tablets..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-knbs-500 dark:focus:ring-knbs-400"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                                {filteredTablets.map((tablet) => (
                                    <button
                                        key={tablet.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, selectedTablet: tablet.id })}
                                        className={cn(
                                            "relative p-4 rounded-xl border-2 transition-all text-left group",
                                            formData.selectedTablet === tablet.id
                                                ? "border-knbs-500 bg-knbs-50 dark:bg-knbs-950/20 shadow-lg shadow-knbs-500/10"
                                                : "border-gray-200 dark:border-gray-800 hover:border-knbs-300 dark:hover:border-knbs-700 bg-white dark:bg-gray-950"
                                        )}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                                <Tablet className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            {formData.selectedTablet === tablet.id && (
                                                <div className="w-6 h-6 bg-knbs-500 rounded-full flex items-center justify-center">
                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">{tablet.id}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{tablet.model}</p>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-500 font-mono">{tablet.specs}</p>
                                    </button>
                                ))}
                            </div>
                            {formData.selectedTablet && (
                                <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl">
                                    <p className="text-sm font-bold text-green-900 dark:text-green-400 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Selected: {formData.selectedTablet}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-bold transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={!formData.selectedTablet}
                            className="px-8 py-3 bg-gradient-to-r from-knbs-500 to-knbs-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-knbs-500/30 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
                        >
                            Submit Registration
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Helper function
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
