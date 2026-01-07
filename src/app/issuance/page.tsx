"use client";

import { useState, useEffect } from "react";
import { 
  QrCode, Tablet, User, CheckCircle, XCircle, 
  History, LogOut, LogIn, AlertCircle, Clock,
  BarChart, Users, Package, RefreshCw, Download,
  Shield, Zap, TrendingUp, Calendar, Search,
  MapPin, Filter, Eye, ExternalLink, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { ActiveIssuance, IssuanceLog, mockActiveIssuances, mockRecentLogs } from "@/data/mockdata";

export default function IssuanceDashboard() {
  const router = useRouter();
  const [activeIssuances, setActiveIssuances] = useState<ActiveIssuance[]>([]);
  const [recentLogs, setRecentLogs] = useState<IssuanceLog[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");
  
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

  const isOverdue = (expectedReturn: string) => new Date(expectedReturn) < new Date();

  return (
    <Layout>
      <div className="space-y-8 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tablet Management Dashboard</h1>
            <p className="text-gray-600 mt-2">Overview of tablet issuance, check-ins, and system status</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                router.refresh();
                setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
              }}
              className="p-2.5 hover:bg-gray-100 rounded-lg border border-gray-200"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
            <Link
              href="/issuance/logs"
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
            >
              <History className="w-4 h-4 inline mr-2" />
              View All Logs
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Active Issuances', value: stats.activeIssuances, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Available Tablets', value: stats.availableTablets, icon: Tablet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Overdue Returns', value: stats.overdueReturns, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
            { label: 'Today Check-outs', value: stats.todayCheckouts, icon: LogOut, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Today Check-ins', value: stats.todayCheckins, icon: LogIn, color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'Avg Duration', value: stats.avgDuration, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-2 rounded-lg`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/issuance/checkout"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl p-6 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <LogOut className="w-6 h-6" />
              </div>
              <QrCode className="w-6 h-6 opacity-80 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-bold mb-2">Check-out Tablet</h3>
            <p className="text-blue-100 text-sm">Issue tablet to participant via QR scan or manual entry</p>
            <div className="mt-4 flex items-center gap-2 text-sm opacity-80">
              Start process <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          
          <Link
            href="/issuance/checkin"
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl p-6 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <LogIn className="w-6 h-6" />
              </div>
              <QrCode className="w-6 h-6 opacity-80 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-bold mb-2">Check-in Tablet</h3>
            <p className="text-emerald-100 text-sm">Return tablet from participant via QR scan or manual entry</p>
            <div className="mt-4 flex items-center gap-2 text-sm opacity-80">
              Start process <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          
          <Link
            href="/issuance/scan"
            className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm rounded-xl p-6 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <ScanIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">QR Scanner</h3>
            <p className="text-gray-600 text-sm">Universal scanner for all issuance actions</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 font-medium">
              Open Scanner <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Issuances */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Active Issuances</h3>
                  <p className="text-gray-600 text-sm">Tablets currently checked out to participants</p>
                </div>
                <Link
                  href="/issuance/active"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all →
                </Link>
              </div>
              
              <div className="divide-y divide-gray-200">
                {activeIssuances.slice(0, 5).map((issuance) => (
                  <div key={issuance.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{issuance.participantName}</div>
                          <div className="text-sm text-gray-500">{issuance.tabletId}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          isOverdue(issuance.expectedReturn) ? 'text-rose-600' : 'text-gray-900'
                        }`}>
                          Due: {new Date(issuance.expectedReturn).toLocaleDateString()}
                        </div>
                        <Link
                          href={`/issuance/checkin?participant=${issuance.participantId}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Check-in
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              </div>
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {recentLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="p-6">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        log.type === 'checkout' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {log.type === 'checkout' ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {log.type === 'checkout' ? 'Checked out' : 'Checked in'} {log.tabletId}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {log.participantName} • {log.location}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200">
                <Link
                  href="/issuance/logs"
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all activity
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
              <div className="space-y-3">
                {[
                  { label: 'Tablet Inventory', href: '/tablets', icon: Tablet },
                  { label: 'Participants', href: '/participants', icon: Users },
                  { label: 'Analytics', href: '/analytics', icon: BarChart },
                  { label: 'Settings', href: '/settings', icon: Shield },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                  >
                    <span className="text-sm text-gray-700">{link.label}</span>
                    <link.icon className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const ScanIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
  </svg>
);