"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Edit2,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Smartphone,
    Battery,
    Wifi,
    WifiOff,
    Clock,
    CheckCircle,
    AlertTriangle,
    Package,
    User,
    Shield,
    Activity,
    FileText,
    Tablet,
    History,
    TrendingUp,
    Download,
    Send,
    MoreVertical,
    XCircle
} from "lucide-react";
import { mockParticipants } from "@/data/mockdata";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";

export default function ParticipantDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const participantId = params?.participantsId as string;

    const participant = mockParticipants.find(p => p.id === participantId);

    if (!participant) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Participant Not Found</h2>
                    <p className="text-gray-500 mb-6">The participant you're looking for doesn't exist or has been removed.</p>
                    <Link
                        href="/participants"
                        className="px-4 py-2 bg-knbs-600 text-white rounded-lg hover:bg-knbs-700 transition-colors"
                    >
                        Back to Participants
                    </Link>
                </div>
            </Layout>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-100 text-green-800";
            case "inactive": return "bg-red-100 text-red-800";
            case "pending": return "bg-yellow-100 text-yellow-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getTabletStatusColor = (status?: string) => {
        switch (status) {
            case "active": return "bg-green-100 text-green-800";
            case "damaged": return "bg-red-100 text-red-800";
            case "returned": return "bg-blue-100 text-blue-800";
            case "lost": return "bg-red-100 text-red-800";
            case "maintenance": return "bg-yellow-100 text-yellow-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    // Calculate days until return
    const getDaysUntilReturn = () => {
        if (!participant.expectedReturnDate) return null;
        const returnDate = new Date(participant.expectedReturnDate);
        const today = new Date();
        const diffTime = returnDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysUntilReturn = getDaysUntilReturn();

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/participants"
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">{participant.name}</h1>
                                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium capitalize", getStatusColor(participant.status))}>
                                    {participant.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <span className="font-mono bg-gray-100 px-1.5 rounded">{participant.id}</span>
                                <span>•</span>
                                <span>{participant.role}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white">
                            <History className="w-4 h-4 mr-2" />
                            View History
                        </button>
                        <Link
                            href={`/participants/${participantId}/edit`}
                            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-knbs-600 text-white rounded-lg text-sm font-medium hover:bg-knbs-700 transition-colors shadow-sm"
                        >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium">Tablets Issued</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{participant.tabletsIssued}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Tablet className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium">Tablets Returned</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{participant.tabletsReturned}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium">Days Until Return</p>
                                <p className={cn("text-2xl font-bold mt-1",
                                    daysUntilReturn && daysUntilReturn < 0 ? "text-red-600" :
                                        daysUntilReturn && daysUntilReturn <= 7 ? "text-yellow-600" : "text-gray-900"
                                )}>
                                    {daysUntilReturn !== null ? (daysUntilReturn < 0 ? `${Math.abs(daysUntilReturn)} overdue` : daysUntilReturn) : 'N/A'}
                                </p>
                            </div>
                            <div className={cn("p-3 rounded-lg",
                                daysUntilReturn && daysUntilReturn < 0 ? "bg-red-100" :
                                    daysUntilReturn && daysUntilReturn <= 7 ? "bg-yellow-100" : "bg-gray-100"
                            )}>
                                <Calendar className={cn("w-5 h-5",
                                    daysUntilReturn && daysUntilReturn < 0 ? "text-red-600" :
                                        daysUntilReturn && daysUntilReturn <= 7 ? "text-yellow-600" : "text-gray-600"
                                )} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium">Battery Health</p>
                                <p className={cn("text-2xl font-bold mt-1",
                                    (participant.batteryHealth ?? 0) < 20 ? "text-red-600" :
                                        (participant.batteryHealth ?? 0) < 50 ? "text-yellow-600" : "text-green-600"
                                )}>
                                    {participant.batteryHealth ?? 0}%
                                </p>
                            </div>
                            <div className={cn("p-3 rounded-lg",
                                (participant.batteryHealth ?? 0) < 20 ? "bg-red-100" :
                                    (participant.batteryHealth ?? 0) < 50 ? "bg-yellow-100" : "bg-green-100"
                            )}>
                                <Battery className={cn("w-5 h-5",
                                    (participant.batteryHealth ?? 0) < 20 ? "text-red-600" :
                                        (participant.batteryHealth ?? 0) < 50 ? "text-yellow-600" : "text-green-600"
                                )} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile & Contact */}
                    <div className="space-y-6 lg:col-span-1">
                        {/* Profile Card */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-knbs-100 to-knbs-200 flex items-center justify-center border-2 border-white shadow-md">
                                        <span className="text-xl font-bold text-knbs-700">
                                            {participant.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">Contact Details</h3>
                                        <p className="text-sm text-gray-500">Primary contact info</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 font-medium uppercase">Email Address</p>
                                            <p className="text-sm text-gray-900 break-all">{participant.email}</p>
                                        </div>
                                        <button className="text-gray-400 hover:text-knbs-600 transition-colors" title="Send email">
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 font-medium uppercase">Phone Number</p>
                                            <p className="text-sm text-gray-900">{participant.phone}</p>
                                        </div>
                                        <button className="text-gray-400 hover:text-knbs-600 transition-colors" title="Call">
                                            <Phone className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 font-medium uppercase">Location</p>
                                            <p className="text-sm text-gray-900">{participant.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        <span>Last active: 2 hours ago</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-green-600 font-medium">Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Assignment Card */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-knbs-600" />
                                    Current Assignment
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="bg-gradient-to-br from-knbs-50 to-blue-50 p-4 rounded-lg border border-knbs-100">
                                    <p className="text-xs text-gray-500 uppercase mb-1 font-medium">Activity</p>
                                    <p className="text-base font-semibold text-gray-900">{participant.activity}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 uppercase mb-1 font-medium">Start Date</p>
                                        <p className="text-sm font-medium text-gray-900">{participant.issueDate || 'N/A'}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 uppercase mb-1 font-medium">End Date</p>
                                        <p className="text-sm font-medium text-gray-900">{participant.expectedReturnDate || 'N/A'}</p>
                                    </div>
                                </div>
                                {daysUntilReturn !== null && daysUntilReturn <= 7 && (
                                    <div className={cn("flex items-center gap-2 p-3 rounded-lg text-sm",
                                        daysUntilReturn < 0 ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
                                    )}>
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                        <span className="font-medium">
                                            {daysUntilReturn < 0
                                                ? `Return overdue by ${Math.abs(daysUntilReturn)} days`
                                                : `Return due in ${daysUntilReturn} days`}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Middle & Right Column - Device & Activity Log */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Device Status Card */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Tablet className="w-5 h-5 text-knbs-600" />
                                    Device Information
                                </h3>
                                {participant.tabletStatus && (
                                    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium capitalize", getTabletStatusColor(participant.tabletStatus))}>
                                        {participant.tabletStatus}
                                    </span>
                                )}
                            </div>

                            {participant.tabletSerial ? (
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase mb-1 font-medium">Device Model</p>
                                                <p className="text-lg font-semibold text-gray-900">{participant.tabletModel}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase mb-1 font-medium">Serial Number</p>
                                                <p className="text-base font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded-lg w-fit">
                                                    {participant.tabletSerial}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase mb-1 font-medium">Issue Date</p>
                                                <div className="flex items-center gap-2 text-sm text-gray-900">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span>{participant.issueDate || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Battery className={cn("w-5 h-5", (participant.batteryHealth ?? 0) < 20 ? "text-red-500" : (participant.batteryHealth ?? 0) < 50 ? "text-yellow-500" : "text-green-500")} />
                                                        <span className="text-sm font-medium text-gray-700">Battery Health</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900">{participant.batteryHealth}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className={cn("h-2.5 rounded-full transition-all",
                                                            (participant.batteryHealth ?? 0) < 20 ? "bg-red-500" :
                                                                (participant.batteryHealth ?? 0) < 50 ? "bg-yellow-500" : "bg-green-500"
                                                        )}
                                                        style={{ width: `${participant.batteryHealth}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {participant.wifiConnected ? (
                                                            <Wifi className="w-5 h-5 text-green-500" />
                                                        ) : (
                                                            <WifiOff className="w-5 h-5 text-gray-400" />
                                                        )}
                                                        <span className="text-sm font-medium text-gray-700">Connectivity</span>
                                                    </div>
                                                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", participant.wifiConnected ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600")}>
                                                        {participant.wifiConnected ? "Online" : "Offline"}
                                                    </span>
                                                </div>
                                                {participant.wifiConnected && (
                                                    <div className="mt-2 text-xs text-gray-500">
                                                        Last sync: 15 minutes ago
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <p className="text-xs text-gray-500 uppercase font-medium mb-3">Quick Actions</p>
                                        <div className="flex flex-wrap gap-3">
                                            <button className="px-4 py-2 bg-white border border-gray-300 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                                                <Shield className="w-4 h-4" />
                                                Troubleshoot Device
                                            </button>
                                            <button className="px-4 py-2 bg-white border border-gray-300 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                View Usage Logs
                                            </button>
                                            <button className="px-4 py-2 bg-white border border-gray-300 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                                                <Download className="w-4 h-4" />
                                                Export Data
                                            </button>
                                            <button className="px-4 py-2 bg-red-50 border border-red-200 shadow-sm rounded-lg text-sm font-medium text-red-700 hover:bg-red-100 transition-colors ml-auto flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4" />
                                                Report Lost/Damaged
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <Tablet className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">No Device Assigned</h3>
                                    <p className="text-gray-500 mt-2 mb-6 max-w-sm mx-auto">
                                        This participant currently doesn't have a tablet assigned to them.
                                    </p>
                                    <button className="px-6 py-2.5 bg-knbs-600 text-white rounded-lg hover:bg-knbs-700 transition-colors shadow-sm font-medium">
                                        Assign Tablet
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Recent Activity Log */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-knbs-600" />
                                    Recent Activity
                                </h3>
                                <button className="text-sm text-gray-500 hover:text-gray-700">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="relative border-l-2 border-gray-200 pl-6 ml-2 space-y-8">
                                    <div className="relative group">
                                        <div className="absolute -left-[31px] bg-green-500 h-4 w-4 rounded-full border-4 border-white shadow-sm group-hover:scale-110 transition-transform"></div>
                                        <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                            <p className="text-sm font-medium text-gray-900">Device Checked In</p>
                                            <p className="text-xs text-gray-500 mt-1">Automated system check • 2 hours ago</p>
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute -left-[31px] bg-blue-500 h-4 w-4 rounded-full border-4 border-white shadow-sm group-hover:scale-110 transition-transform"></div>
                                        <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                            <p className="text-sm font-medium text-gray-900">Survey Data Synced</p>
                                            <p className="text-xs text-gray-500 mt-1">Uploaded 15 records • Yesterday at 4:30 PM</p>
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute -left-[31px] bg-yellow-500 h-4 w-4 rounded-full border-4 border-white shadow-sm group-hover:scale-110 transition-transform"></div>
                                        <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                            <p className="text-sm font-medium text-gray-900">Profile Updated</p>
                                            <p className="text-xs text-gray-500 mt-1">Contact information modified • 2 days ago</p>
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute -left-[31px] bg-gray-300 h-4 w-4 rounded-full border-4 border-white shadow-sm group-hover:scale-110 transition-transform"></div>
                                        <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                            <p className="text-sm font-medium text-gray-900">Tablet Assigned</p>
                                            <p className="text-xs text-gray-500 mt-1">Issued by Admin • {participant.issueDate}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 text-center">
                                    <button className="text-sm text-knbs-600 font-semibold hover:text-knbs-700 hover:underline transition-colors">
                                        View Full Activity Log →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}