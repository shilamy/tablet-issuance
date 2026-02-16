"use client";

import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { useTabletStore } from "@/store/tabletStore";
import { Participant } from "@/types/participants";
import {
    Search, Filter, Calendar, CheckCircle, XCircle,
    AlertCircle, Download, FileText, ChevronLeft,
    RefreshCw, MoreVertical, Eye, ArrowLeft, ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ContractsPage() {
    const { participants, refreshData } = useTabletStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "expired">("all");
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Filter participants to only show those with contracts (active or expired)
    // or arguably 'none' if we want to show who doesn't have one, but the prompt implies "participants who are under contract"
    // So let's include active/expired by default, maybe toggle for all.
    // Actually, let's show all but emphasize contract status. 
    // Wait, the prompt says "shows participants who are under contract". 
    // I will default to showing everyone but allow filtering, or perhaps better: 
    // Filter out 'none' by default if the page is specifically for contracts?
    // Let's stick to showing relevant contract data.

    // Let's filter out 'none' contract status by default to match "participants who are under contract" intent,
    // but maybe provide a way to see all if needed. For now, I'll filter out 'none' to be clean.

    const usersWithContracts = useMemo(() => {
        return participants.filter(p => p.contractStatus !== 'none');
    }, [participants]);

    const filteredParticipants = useMemo(() => {
        let filtered = usersWithContracts;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.id.toLowerCase().includes(query) ||
                p.activity.toLowerCase().includes(query)
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(p => p.contractStatus === statusFilter);
        }

        return filtered;
    }, [usersWithContracts, searchQuery, statusFilter]);

    const stats = {
        total: usersWithContracts.length,
        active: usersWithContracts.filter(p => p.contractStatus === 'active').length,
        expired: usersWithContracts.filter(p => p.contractStatus === 'expired').length,
        endingSoon: usersWithContracts.filter(p => {
            if (!p.contractEndDate || p.contractStatus !== 'active') return false;
            const today = new Date();
            const end = new Date(p.contractEndDate);
            const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return diffDays > 0 && diffDays <= 30;
        }).length
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        refreshData();
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const handleExport = () => {
        const headers = ['ID', 'Name', 'Activity', 'Role', 'Contract Status', 'Start Date', 'End Date'];
        const csvContent = [
            headers.join(','),
            ...filteredParticipants.map(p => [
                p.id,
                `"${p.name}"`,
                `"${p.activity}"`,
                p.role || '',
                p.contractStatus,
                p.joinDate,
                p.contractEndDate || ''
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `contracts-export-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'expired': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
                            <p className="text-gray-600">Overview of participant activities and contract durations</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRefresh}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                            title="Refresh"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Contracts</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</h3>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Active Contracts</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.active}</h3>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(stats.active / stats.total) * 100}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Ending Soon</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.endingSoon}</h3>
                            </div>
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-orange-600" />
                            </div>
                        </div>
                        <p className="text-xs text-orange-600 mt-2 font-medium">Within 30 days</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Expired</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.expired}</h3>
                            </div>
                            <div className="p-2 bg-red-50 rounded-lg">
                                <XCircle className="w-5 h-5 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search participants, activity..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setStatusFilter("all")}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${statusFilter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setStatusFilter("active")}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${statusFilter === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setStatusFilter("expired")}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${statusFilter === 'expired' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    Expired
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contracts List */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Participant</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role & Activity</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contract Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">End Date</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredParticipants.length > 0 ? (
                                    filteredParticipants.map((participant) => (
                                        <tr key={participant.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                                                        {participant.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                                                        <div className="text-xs text-gray-500">{participant.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{participant.role || 'Participant'}</div>
                                                <div className="text-xs text-gray-500">{participant.activity}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(participant.contractStatus)}`}>
                                                    {participant.contractStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                {new Date(participant.joinDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                {participant.contractEndDate
                                                    ? new Date(participant.contractEndDate).toLocaleDateString()
                                                    : <span className="text-gray-400 italic">Open-ended</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link href={`/participants/${participant.id}`} className="text-blue-600 hover:text-blue-900 inline-flex items-center">
                                                    View
                                                    <ArrowUpRight className="w-3 h-3 ml-1" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <FileText className="w-12 h-12 text-gray-300 mb-3" />
                                                <p className="text-lg font-medium">No contracts found</p>
                                                <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
                        <span>Showing {filteredParticipants.length} records</span>
                        {/* Pagination could go here */}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
