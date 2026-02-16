"use client";

import { useState } from "react";
import Link from "next/link";
import {
    FileText,
    MapPin,
    ArrowLeft,
    Send,
    Tablet,
    Activity,
    User,
    Mail,
    Phone,
    CheckCircle2
} from "lucide-react";

export default function RequestTabletsPage() {
    const [requestData, setRequestData] = useState({
        requesterName: "",
        email: "",
        phone: "",
        activity: "",
        quantity: "",
        counties: [] as string[],
        type: "",
        notes: ""
    });

    const [submitted, setSubmitted] = useState(false);
    const [allCountiesSelected, setAllCountiesSelected] = useState(false);

    const activities = [
        "2024 Kenya Population and Housing Census",
        "Continuous Household Surveys (KCHSP)",
        "Integrated Household Budget Surveys (KIHBS 2025/26)",
        "Labour Force Surveys",
        "Agriculture and Livestock Surveys",
        "Building and Construction Surveys",
        "Industrial Production and Enterprise Surveys",
        "2025 Remittances Household Survey (RHS)",
        "Child Labour Survey",
        "Integrated Time Use Survey"
    ];

    const counties = [
        "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi", "Kitale",
        "Garissa", "Kakamega", "Nyeri", "Meru", "Machakos", "Kiambu", "Kajiado", "Narok",
        "Uasin Gishu", "Bungoma", "Migori", "Kericho", "Embu", "Nyandarua", "Murang'a"
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Tablet request submitted:", requestData);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-xl">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-3">Request Submitted!</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Your tablet request has been submitted successfully. Our admin team will review it and provide feedback on availability shortly.
                    </p>
                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="block px-6 py-3 bg-gradient-to-r from-knbs-800 to-knbs-900 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-knbs-900/30 transition-all"
                        >
                            Back to Home
                        </Link>
                        <button
                            onClick={() => {
                                setSubmitted(false);
                                setRequestData({
                                    requesterName: "",
                                    email: "",
                                    phone: "",
                                    activity: "",
                                    quantity: "",
                                    counties: [],
                                    type: "",
                                    notes: ""
                                });
                            }}
                            className="block w-full px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-bold transition-colors"
                        >
                            Submit Another Request
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-knbs-800 to-knbs-900 rounded-xl flex items-center justify-center shadow-lg shadow-knbs-900/20">
                            <Tablet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-gray-900 dark:text-gray-100">TabletTrack</h1>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Tablet Request Form</p>
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

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Page Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-2">Request Tablets</h2>
                    <p className="text-gray-600 dark:text-gray-400">Submit your tablet preparation request for KNBS surveys and activities.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Requester Information */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <User className="w-5 h-5 text-knbs-600 dark:text-knbs-400" />
                                Your Information
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Full Name *</label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        required
                                        value={requestData.requesterName}
                                        onChange={(e) => setRequestData({ ...requestData, requesterName: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500"
                                        placeholder="Your name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Email *</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        required
                                        value={requestData.email}
                                        onChange={(e) => setRequestData({ ...requestData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500"
                                        placeholder="your.email@knbs.go.ke"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Phone *</label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="tel"
                                        required
                                        value={requestData.phone}
                                        onChange={(e) => setRequestData({ ...requestData, phone: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500"
                                        placeholder="+254 700 000 000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Request Details */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-knbs-600 dark:text-knbs-400" />
                                Request Details
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Activity/Survey *</label>
                                <div className="relative">
                                    <Activity className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <select
                                        required
                                        value={requestData.activity}
                                        onChange={(e) => setRequestData({ ...requestData, activity: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500"
                                    >
                                        <option value="">Select activity</option>
                                        {activities.map((activity) => (
                                            <option key={activity} value={activity}>{activity}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Quantity Needed *</label>
                                <div className="relative">
                                    <Tablet className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={requestData.quantity}
                                        onChange={(e) => setRequestData({ ...requestData, quantity: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500"
                                        placeholder="Number of tablets"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Request Type *</label>
                                <select
                                    required
                                    value={requestData.type}
                                    onChange={(e) => {
                                        setRequestData({ ...requestData, type: e.target.value, counties: [] });
                                        setAllCountiesSelected(false);
                                    }}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500"
                                >
                                    <option value="">Select type</option>
                                    <option value="main">Main</option>
                                    <option value="pilot">Pilot</option>
                                    <option value="listing">Listing</option>
                                    <option value="mobilization">Mobilization</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Counties Covered *</label>

                                {requestData.type === "main" ? (
                                    // For Main survey type - show "All 47 Counties" option
                                    <div className="space-y-3">
                                        <div
                                            onClick={() => {
                                                setAllCountiesSelected(!allCountiesSelected);
                                                setRequestData({ ...requestData, counties: !allCountiesSelected ? ["All 47 Counties"] : [] });
                                            }}
                                            className={cn(
                                                "p-4 border-2 rounded-xl cursor-pointer transition-all",
                                                allCountiesSelected
                                                    ? "border-knbs-500 bg-knbs-50 dark:bg-knbs-950/20"
                                                    : "border-gray-200 dark:border-gray-800 hover:border-knbs-300 dark:hover:border-knbs-700"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                                                    allCountiesSelected
                                                        ? "border-knbs-500 bg-knbs-500"
                                                        : "border-gray-300 dark:border-gray-600"
                                                )}>
                                                    {allCountiesSelected && (
                                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-gray-100">All 47 Counties</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Nationwide coverage for main survey</p>
                                                </div>
                                            </div>
                                        </div>
                                        {allCountiesSelected && (
                                            <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl">
                                                <p className="text-sm font-bold text-green-900 dark:text-green-400 flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    All 47 counties selected for nationwide coverage
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : requestData.type ? (
                                    // For other survey types - show multi-select
                                    <div className="relative">
                                        <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-3 pointer-events-none" />
                                        <select
                                            required
                                            multiple
                                            value={requestData.counties}
                                            onChange={(e) => setRequestData({ ...requestData, counties: Array.from(e.target.selectedOptions, option => option.value) })}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500 h-32"
                                        >
                                            {counties.map((county) => (
                                                <option key={county} value={county}>{county}</option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Hold Ctrl/Cmd to select multiple counties. Selected: {requestData.counties.length}
                                        </p>
                                    </div>
                                ) : (
                                    // Before type is selected
                                    <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Please select a request type first</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Additional Notes</label>
                                <textarea
                                    value={requestData.notes}
                                    onChange={(e) => setRequestData({ ...requestData, notes: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500"
                                    placeholder="Any special requirements, urgency, or additional information..."
                                />
                            </div>
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
                            className="px-8 py-3 bg-gradient-to-r from-knbs-800 to-knbs-900 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-knbs-900/30 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Helper function for conditional classnames
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
