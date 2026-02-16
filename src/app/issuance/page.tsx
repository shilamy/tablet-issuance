"use client";

import { useState, useEffect } from "react";
import {
  QrCode, Tablet, User, CheckCircle, XCircle,
  History, LogOut, LogIn, AlertCircle, Clock,
  BarChart, Users, Package, RefreshCw, Download,
  Shield, Zap, TrendingUp, Calendar, Search,
  MapPin, Filter, Eye, ExternalLink, ChevronRight,
  Plus, ArrowRight, Activity, Bell, MoreVertical,
  ChevronUp, ChevronDown
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { ActiveIssuance, IssuanceLog, mockActiveIssuances, mockRecentLogs } from "@/data/mockdata";
import { cn } from "@/lib/utils";

export default function IssuanceDashboard() {
  const router = useRouter();
  const [activeIssuances, setActiveIssuances] = useState<ActiveIssuance[]>([]);
  const [recentLogs, setRecentLogs] = useState<IssuanceLog[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [stats, setStats] = useState({
    activeIssuances: 0,
    availableTablets: 42,
    overdueReturns: 3,
    todayCheckouts: 8,
    todayCheckins: 5,
    avgDuration: '3.2 days',
  });

  useEffect(() => {
    setActiveIssuances(mockActiveIssuances);
    setRecentLogs(mockRecentLogs);
    setStats(prev => ({ ...prev, activeIssuances: mockActiveIssuances.length }));

    // Set last sync time on client only
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsRefreshing(false);
      router.refresh();
    }, 800);
  };

  const isOverdue = (expectedReturn: string) => new Date(expectedReturn) < new Date();

  const getDaysRemaining = (expectedReturn: string) => {
    const diff = new Date(expectedReturn).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <Layout>
      <div className="space-y-8 pb-12">
        {/* Header Section with Glassmorphism touch */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-knbs-600 font-semibold text-sm mb-1">
              <Activity className="w-4 h-4" />
              <span>Management System</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Issuance Dashboard</h1>
            <p className="text-gray-500 mt-1 max-w-2xl">
              Monitor real-time tablet distribution, track returns, and manage field equipment with precision.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-500 font-medium">
              <span className={cn("w-2 h-2 rounded-full", isRefreshing ? "bg-orange-400 animate-pulse" : "bg-green-500")}></span>
              Last Sync: {lastSyncTime}
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-200 shadow-sm transition-all active:scale-95 disabled:opacity-50"
              title="Refresh Dashboard"
            >
              <RefreshCw className={cn("w-5 h-5", isRefreshing && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* Action Center - High Prominence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/issuance/checkout"
            className="relative overflow-hidden group bg-gradient-to-br from-knbs-500 to-knbs-700 p-1 rounded-2xl shadow-lg shadow-knbs-200 hover:shadow-xl hover:shadow-knbs-300 transition-all active:scale-[0.98]"
          >
            <div className="h-full bg-knbs-600 group-hover:bg-transparent transition-colors p-6 rounded-[14px]">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white">
                  <LogOut className="w-7 h-7" />
                </div>
                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                  <QrCode className="w-5 h-5 text-white/80" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Check-out Tablet</h3>
              <p className="text-orange-50/80 text-sm leading-relaxed">
                Seamlessly issue equipment to a participant using rapid scan detection.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-white">
                Initiate Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            {/* Aesthetic Background Shapes */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </Link>

          <Link
            href="/issuance/checkin"
            className="relative overflow-hidden group bg-gradient-to-br from-emerald-500 to-green-700 p-1 rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all active:scale-[0.98]"
          >
            <div className="h-full bg-emerald-600 group-hover:bg-transparent transition-colors p-6 rounded-[14px]">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white">
                  <LogIn className="w-7 h-7" />
                </div>
                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                  <QrCode className="w-5 h-5 text-white/80" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Check-in Tablet</h3>
              <p className="text-emerald-50/80 text-sm leading-relaxed">
                Process returns and verify device health status in one simple workflow.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-white">
                Register Return <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </Link>

          <Link
            href="/issuance/scan"
            className="flex flex-col group bg-white border border-gray-200 hover:border-knbs-300 rounded-2xl p-7 transition-all hover:shadow-md hover:shadow-gray-100"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-3 bg-knbs-50 rounded-xl group-hover:bg-knbs-100 transition-colors">
                <QrCode className="w-7 h-7 text-knbs-600" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-knbs-500">Fast Scan Mode</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Universal Terminal</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Open the high-speed scanning interface for bulk device identification.
            </p>
            <div className="mt-auto pt-6 flex items-center gap-2 text-sm font-bold text-knbs-600">
              Open Scanner <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Stats Grid - Premium Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Active Issuances', value: stats.activeIssuances, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
            { label: 'Available Units', value: stats.availableTablets, icon: Tablet, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            { label: 'Overdue Returns', value: stats.overdueReturns, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
            { label: 'Today Out', value: stats.todayCheckouts, icon: LogOut, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
            { label: 'Today In', value: stats.todayCheckins, icon: LogIn, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
            { label: 'Avg Assignment', value: stats.avgDuration, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          ].map((stat, i) => (
            <div key={i} className={cn(
              "relative overflow-hidden bg-white border rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 group",
              stat.border
            )}>
              <div className={`${stat.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{stat.value}</p>

              {/* Subtle background element */}
              <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-gray-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            </div>
          ))}
        </div>

        {/* Two Column Layout: Detailed View */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed: Active Issuances */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <History className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-none">Live Assignments</h3>
                    <p className="text-gray-500 text-xs mt-1">Real-time status of equipment in the field</p>
                  </div>
                </div>
                <Link
                  href="/issuance/active"
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:text-knbs-600 hover:border-knbs-200 transition-colors flex items-center gap-1.5"
                >
                  Manage All
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-4 space-y-3">
                {activeIssuances.length > 0 ? activeIssuances.map((issuance) => {
                  const overdue = isOverdue(issuance.expectedReturn);
                  const daysLeft = getDaysRemaining(issuance.expectedReturn);
                  return (
                    <div key={issuance.id} className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-knbs-200 hover:shadow-md transition-all duration-300 group">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors duration-300",
                            overdue ? "bg-rose-50 text-rose-600 group-hover:bg-rose-100" : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                          )}>
                            <User className="w-6 h-6" />
                          </div>
                          <div className="truncate">
                            <div className="font-black text-gray-900 text-base truncate tracking-tight">{issuance.participantName}</div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                              <span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded text-gray-600">{issuance.tabletId}</span>
                              <span className="text-gray-300">•</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{issuance.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                            overdue
                              ? "bg-rose-50 text-rose-700 border border-rose-100"
                              : daysLeft <= 2
                                ? "bg-amber-50 text-amber-700 border border-amber-100"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          )}>
                            {overdue ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {overdue ? 'Overdue' : daysLeft <= 0 ? 'Due Today' : `${daysLeft} days`}
                          </div>
                          <Link
                            href={`/issuance/checkin?participant=${issuance.participantId}`}
                            className="mt-3 text-xs font-black text-knbs-600 hover:text-knbs-700 uppercase tracking-widest flex items-center gap-1 group/btn"
                          >
                            Check-in <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="p-12 text-center">
                    <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No active issuances found</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-center">
                <button className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
                  Show More <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Analytics Mini Card */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-lg">
              <div className="relative z-10">
                <h4 className="text-lg font-bold mb-1 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-knbs-400" />
                  Issuance Performance
                </h4>
                <p className="text-gray-400 text-sm">System efficiency is up by 12% compared to last month.</p>
              </div>
              <div className="flex gap-4 relative z-10">
                <Link href="/reports" className="px-5 py-2.5 bg-knbs-500 hover:bg-knbs-600 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 text-white">
                  <Download className="w-4 h-4" />
                  Monthly Report
                </Link>
              </div>
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* Sidebar: Activity & Resource Center */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Activity Log</h3>
                <Bell className="w-4 h-4 text-gray-400" />
              </div>
              <div className="p-2 space-y-1 max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                {recentLogs.length > 0 ? recentLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-xl hover:bg-gray-50 transition-colors flex items-start gap-3">
                    <div className={cn(
                      "p-2.5 rounded-xl shrink-0",
                      log.type === 'checkout' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                    )}>
                      {log.type === 'checkout' ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 text-sm truncate">
                        {log.tabletId} {log.type === 'checkout' ? 'Dispatched' : 'Returned'}
                      </div>
                      <div className="text-[11px] text-gray-500 uppercase font-bold tracking-tight mt-0.5">
                        {log.participantName}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold uppercase">{log.location}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-gray-400 text-sm">No recent activity</div>
                )}
              </div>
              <div className="p-4 border-t border-gray-100">
                <Link
                  href="/issuance/logs"
                  className="w-full inline-flex justify-center items-center gap-2 p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-600 transition-colors"
                >
                  View Full History
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Quick Access Menu */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h4 className="font-bold text-gray-900 text-sm mb-5 flex items-center justify-between">
                Resource Center
                <Settings className="w-4 h-4 text-gray-400" />
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: 'Tablet Inventory', href: '/tablets', icon: Tablet, count: 124 },
                  { label: 'Participant Registry', href: '/participants', icon: Users, count: 350 },
                  { label: 'Global Analytics', href: '/analytics', icon: BarChart },
                  { label: 'System Guard', href: '/settings', icon: Shield },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 text-gray-400 rounded-lg group-hover:bg-white group-hover:text-knbs-500 transition-colors border border-transparent group-hover:border-knbs-100">
                        <link.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">{link.label}</span>
                    </div>
                    {link.count ? (
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{link.count}</span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Help & Support Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-5 relative overflow-hidden">
              <div className="relative z-10">
                <h5 className="text-indigo-900 font-bold text-sm mb-1">Need assistance?</h5>
                <p className="text-indigo-700/70 text-xs mb-4 leading-relaxed">Check our knowledge base for issuance guidelines and troubleshooting.</p>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 underline decoration-2 underline-offset-4">
                  Open Support Portal
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                <Shield className="w-20 h-20 text-indigo-900" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const Settings = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);