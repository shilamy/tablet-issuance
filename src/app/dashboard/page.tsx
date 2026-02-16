"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Tablet,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Users,
  XCircle,
  Activity,
  Battery,
  Wifi,
  Calendar,
  UserCheck,
  UserX,
  UserPlus
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { mockParticipants } from "@/data/mockdata";

export default function DashboardPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Calculate real stats from mockParticipants
  const stats = useMemo(() => {
    const totalParticipants = mockParticipants.length;
    const activeParticipants = mockParticipants.filter(p => p.status === "active").length;
    const inactiveParticipants = mockParticipants.filter(p => p.status === "inactive").length;
    const pendingParticipants = mockParticipants.filter(p => p.status === "pending").length;

    const tabletsIssued = mockParticipants.reduce((sum, p) => sum + (p.tabletsIssued || 0), 0);
    const tabletsReturned = mockParticipants.reduce((sum, p) => sum + (p.tabletsReturned || 0), 0);
    const activeTablets = mockParticipants.filter(p => p.tabletStatus === "active").length;
    const damagedTablets = mockParticipants.filter(p => p.tabletStatus === "damaged" || p.tabletStatus === "lost").length;

    const avgBatteryHealth = mockParticipants
      .filter(p => p.batteryHealth)
      .reduce((sum, p) => sum + (p.batteryHealth || 0), 0) /
      mockParticipants.filter(p => p.batteryHealth).length || 0;

    const onlineDevices = mockParticipants.filter(p => p.wifiConnected).length;

    // Calculate overdue returns
    const today = new Date();
    const overdueReturns = mockParticipants.filter(p => {
      if (!p.expectedReturnDate) return false;
      const returnDate = new Date(p.expectedReturnDate);
      return returnDate < today && p.tabletStatus === "active";
    }).length;

    return {
      totalParticipants,
      activeParticipants,
      inactiveParticipants,
      pendingParticipants,
      tabletsIssued,
      tabletsReturned,
      activeTablets,
      damagedTablets,
      avgBatteryHealth: Math.round(avgBatteryHealth),
      onlineDevices,
      overdueReturns
    };
  }, []);

  // Generate recent activity from participants data
  const recentActivity = useMemo(() => {
    return mockParticipants.slice(0, 5).map((participant, index) => ({
      id: participant.id,
      action: participant.tabletStatus === "active" ? "issued" :
        participant.tabletStatus === "returned" ? "returned" : "updated",
      tablet: participant.tabletSerial || "N/A",
      participant: participant.name,
      time: index === 0 ? "10 min ago" :
        index === 1 ? "25 min ago" :
          index === 2 ? "1 hour ago" :
            index === 3 ? "2 hours ago" : "4 hours ago",
      status: participant.tabletStatus === "active" ? "success" :
        participant.tabletStatus === "damaged" ? "warning" : "info"
    }));
  }, []);

  const metrics = [
    {
      title: "Total Participants",
      value: stats.totalParticipants,
      icon: <Users className="w-5 h-5" />,
      change: "+5%",
      trend: "up",
      color: "bg-knbs-100 text-knbs-700",
      borderColor: "border-knbs-200",
      link: "/participants"
    },
    {
      title: "Active Participants",
      value: stats.activeParticipants,
      icon: <UserCheck className="w-5 h-5" />,
      change: "+12%",
      trend: "up",
      color: "bg-green-50 text-green-700",
      borderColor: "border-green-200",
      link: "/participants?status=active"
    },
    {
      title: "Tablets Issued",
      value: stats.activeTablets,
      icon: <Tablet className="w-5 h-5" />,
      change: "+8%",
      trend: "up",
      color: "bg-blue-50 text-blue-700",
      borderColor: "border-blue-200",
      link: "/tablets"
    },
    {
      title: "Damaged/Lost",
      value: stats.damagedTablets,
      icon: <AlertCircle className="w-5 h-5" />,
      change: stats.damagedTablets > 0 ? "+2" : "0",
      trend: stats.damagedTablets > 0 ? "up" : "down",
      color: "bg-red-50 text-red-700",
      borderColor: "border-red-200",
      link: "/tablets?status=damaged"
    },
  ];

  const quickActions = [
    { title: "Add Participant", icon: "👤", link: "/participants/new", color: "bg-gradient-to-r from-knbs-500 to-knbs-600 hover:from-knbs-600 hover:to-knbs-700" },
    { title: "Register Participant", icon: "📝", link: "/participants/register", color: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700" },
    { title: "View All Participants", icon: "👥", link: "/participants", color: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" },
    { title: "Manage Tablets", icon: "🛠️", link: "/tablets", color: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" },
  ];

  // Auto-refresh timer
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Function to refresh dashboard data
  const refreshData = () => {
    setLastUpdated(new Date());
  };

  const formatLastUpdated = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    return `${Math.floor(diff / 3600)} hours ago`;
  };

  return (
    <Layout>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Last updated: {formatLastUpdated()}</span>
          </div>
          <button
            onClick={refreshData}
            className="px-4 py-2 text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors shadow-sm font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Link
            key={index}
            href={metric.link}
            className={`relative overflow-hidden bg-white rounded-2xl border ${metric.borderColor} p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group`}
          >
            <div className="flex justify-between items-start relative z-10">
              <div>
                <div className={`inline-flex items-center justify-center p-3 rounded-xl ${metric.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {metric.icon}
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{metric.title}</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{metric.value}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${metric.trend === "up" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}>
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 mr-1" />
                  )}
                  {metric.change}
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase mt-2">vs last week</span>
              </div>
            </div>
            {/* Subtle background decoration */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gray-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          </Link>
        ))}
      </div>

      {/* Participant Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/participants?status=active" className="relative overflow-hidden bg-gradient-to-br from-white to-green-50/30 rounded-2xl p-6 border border-green-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-bold text-green-700 uppercase tracking-widest">Active Participants</p>
              <p className="text-4xl font-black text-green-900 mt-2">{stats.activeParticipants}</p>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 mt-3 bg-green-100/50 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Currently in field
              </p>
            </div>
            <div className="p-4 bg-green-100/50 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </Link>

        <Link href="/participants?status=pending" className="relative overflow-hidden bg-gradient-to-br from-white to-yellow-50/30 rounded-2xl p-6 border border-yellow-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-bold text-yellow-700 uppercase tracking-widest">Pending Participants</p>
              <p className="text-4xl font-black text-yellow-900 mt-2">{stats.pendingParticipants}</p>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-600 mt-3 bg-yellow-100/50 px-2 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                Awaiting assignment
              </p>
            </div>
            <div className="p-4 bg-yellow-100/50 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
              <UserPlus className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </Link>

        <Link href="/participants?status=inactive" className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50/30 rounded-2xl p-6 border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Inactive Participants</p>
              <p className="text-4xl font-black text-gray-900 mt-2">{stats.inactiveParticipants}</p>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 mt-3 bg-gray-100 px-2 py-1 rounded-full">
                Offline
              </p>
            </div>
            <div className="p-4 bg-gray-100 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
              <UserX className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-knbs-600" />
              Quick Actions
            </h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.link}
                  className={`group relative overflow-hidden flex items-center justify-between p-4 rounded-xl ${action.color} text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] shadow-md`}
                >
                  <div className="flex items-center relative z-10">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      {action.icon}
                    </div>
                    <span className="font-bold tracking-tight">{action.title}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />

                  {/* Glass decoration */}
                  <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-knbs-600" />
                Recent Activity
              </h2>
              <Link href="/participants" className="text-sm text-knbs-600 hover:text-knbs-700 font-medium hover:underline">
                View all →
              </Link>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <Link
                  key={activity.id}
                  href={`/participants/${activity.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center">
                    <div className={`p-2.5 rounded-full ${activity.status === "success" ? "bg-green-100" :
                      activity.status === "warning" ? "bg-yellow-100" :
                        "bg-blue-100"
                      }`}>
                      <Tablet className={`w-4 h-4 ${activity.status === "success" ? "text-green-600" :
                        activity.status === "warning" ? "text-yellow-600" :
                          "text-blue-600"
                        }`} />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">
                        Tablet <span className="font-bold">{activity.tablet}</span> {activity.action}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.participant} • {activity.time}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${activity.status === "success" ? "bg-green-100 text-green-800" :
                    activity.status === "warning" ? "bg-yellow-100 text-yellow-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                    {activity.status}
                  </span>
                </Link>
              ))}
            </div>

            {/* Activity Summary */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm flex-wrap gap-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-gray-600">Active: {stats.activeTablets}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-gray-600">Damaged: {stats.damagedTablets}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live updates enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-knbs-500 to-knbs-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-knbs-100 text-sm font-medium">Avg. Battery Health</p>
              <p className="text-3xl font-bold mt-2">{stats.avgBatteryHealth}%</p>
            </div>
            <Battery className="w-10 h-10 opacity-80" />
          </div>
          <div className="mt-4 text-sm text-knbs-100">
            Across all active devices
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Online Devices</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.onlineDevices}</p>
            </div>
            <Wifi className="w-10 h-10 text-green-500 opacity-80" />
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>Connected to network</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Returns</p>
              <p className={`text-3xl font-bold mt-2 ${stats.overdueReturns > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {stats.overdueReturns}
              </p>
            </div>
            <Calendar className={`w-10 h-10 opacity-80 ${stats.overdueReturns > 0 ? 'text-red-500' : 'text-gray-400'}`} />
          </div>
          <div className="mt-4">
            {stats.overdueReturns > 0 ? (
              <Link href="/participants?overdue=true" className="text-red-600 hover:text-red-700 text-sm font-medium hover:underline">
                Review now →
              </Link>
            ) : (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span>All on schedule</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Returns</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.tabletsReturned}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-blue-500 opacity-80" />
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
              <span>Successfully processed</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}