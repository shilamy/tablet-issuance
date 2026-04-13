"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import {
  TrendingUp,
  Tablet,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Users,
  Activity,
  Package,
  FileText,
  MapPin,
  Send,
  Plus
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/toast";

export default function DashboardPage() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    activity: "",
    quantity: "",
    counties: [] as string[],
    type: "",
    notes: ""
  });

  // Mock data synced with other pages
  const stats = {
    totalTablets: 5000,
    availableTablets: 3245,
    issuedTablets: 1523,
    reservedTablets: 232,
    pendingRequests: 3,
    pendingRegistrations: 4,
    activeSurveys: 10
  };

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

  // Recent requests (synced with issuance page)
  const recentRequests = [
    {
      id: "REQ-001",
      requester: "Dr. Jane Mwangi",
      activity: "2024 Kenya Population and Housing Census",
      quantity: 150,
      status: "pending",
      date: "2026-02-15"
    },
    {
      id: "REQ-002",
      requester: "Prof. Peter Ochieng",
      activity: "Continuous Household Surveys (KCHSP)",
      quantity: 45,
      status: "pending",
      date: "2026-02-14"
    }
  ];

  // Recent registrations (synced with issuance page)
  const recentRegistrations = [
    {
      id: "REG-001",
      name: "John Kamau",
      role: "Supervisor",
      activity: "2024 Kenya Population and Housing Census",
      tabletId: "KNBS-TB-0001",
      status: "pending"
    },
    {
      id: "REG-002",
      name: "Sarah Akinyi",
      role: "Research Assistant",
      activity: "2024 Kenya Population and Housing Census",
      tabletId: "KNBS-TB-0002",
      status: "pending"
    }
  ];

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Tablet request submitted successfully! Pending admin approval.", "success");
    setShowRequestForm(false);
    setRequestData({ activity: "", quantity: "", counties: [], type: "", notes: "" });
  };

  return (
    <Layout>
      <div className="space-y-8 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Welcome to TabletTrack - KNBS Digital Asset Management</p>
          </div>
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="px-6 py-3 bg-gradient-to-r from-knbs-500 to-knbs-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-knbs-500/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Request Tablets
          </button>
        </div>

        {/* Tablet Request Form */}
        {showRequestForm && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-knbs-600 dark:text-knbs-400" />
                New Tablet Request
              </h3>
              <button
                onClick={() => setShowRequestForm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitRequest} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Activity/Survey *</label>
                  <select
                    required
                    value={requestData.activity}
                    onChange={(e) => setRequestData({ ...requestData, activity: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500"
                  >
                    <option value="">Select activity</option>
                    {activities.map((activity) => (
                      <option key={activity} value={activity}>{activity}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Quantity Needed *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={requestData.quantity}
                    onChange={(e) => setRequestData({ ...requestData, quantity: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500"
                    placeholder="Enter number of tablets"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Request Type *</label>
                  <select
                    required
                    value={requestData.type}
                    onChange={(e) => setRequestData({ ...requestData, type: e.target.value })}
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
                  <select
                    required
                    multiple
                    value={requestData.counties}
                    onChange={(e) => setRequestData({ ...requestData, counties: Array.from(e.target.selectedOptions, option => option.value) })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500 h-32"
                  >
                    {counties.map((county) => (
                      <option key={county} value={county}>{county}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Hold Ctrl/Cmd to select multiple</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Additional Notes</label>
                  <textarea
                    value={requestData.notes}
                    onChange={(e) => setRequestData({ ...requestData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500"
                    placeholder="Any special requirements or notes..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-knbs-500 to-knbs-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-knbs-500/30 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-xl flex items-center justify-center">
                <Tablet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12%
              </span>
            </div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Total Tablets</p>
            <p className="text-3xl font-black text-gray-900 dark:text-gray-100">{stats.totalTablets.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-950/30 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <Link href="/tablets" className="text-xs font-bold text-knbs-600 dark:text-knbs-400 hover:underline">
                View All
              </Link>
            </div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Available</p>
            <p className="text-3xl font-black text-gray-900 dark:text-gray-100">{stats.availableTablets.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/30 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-knbs-600 dark:text-knbs-400" />
              </div>
              <Link href="/issuance" className="text-xs font-bold text-knbs-600 dark:text-knbs-400 hover:underline">
                Manage
              </Link>
            </div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Issued</p>
            <p className="text-3xl font-black text-gray-900 dark:text-gray-100">{stats.issuedTablets.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-950/30 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <Link href="/issuance" className="text-xs font-bold text-knbs-600 dark:text-knbs-400 hover:underline">
                Review
              </Link>
            </div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Reserved</p>
            <p className="text-3xl font-black text-gray-900 dark:text-gray-100">{stats.reservedTablets}</p>
          </div>
        </div>

        {/* Pending Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Requests */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-knbs-600 dark:text-knbs-400" />
                Pending Requests
                <span className="px-2 py-0.5 bg-knbs-100 dark:bg-knbs-950/30 text-knbs-700 dark:text-knbs-400 rounded-full text-xs">
                  {stats.pendingRequests}
                </span>
              </h3>
              <Link href="/issuance" className="text-sm font-bold text-knbs-600 dark:text-knbs-400 hover:underline flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 space-y-3">
              {recentRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">{request.activity}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">By {request.requester}</p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 rounded-lg text-xs font-bold">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Tablet className="w-3 h-3" />
                      {request.quantity} tablets
                    </span>
                    <span>{request.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Registrations */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-knbs-600 dark:text-knbs-400" />
                Pending Registrations
                <span className="px-2 py-0.5 bg-knbs-100 dark:bg-knbs-950/30 text-knbs-700 dark:text-knbs-400 rounded-full text-xs">
                  {stats.pendingRegistrations}
                </span>
              </h3>
              <Link href="/issuance" className="text-sm font-bold text-knbs-600 dark:text-knbs-400 hover:underline flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 space-y-3">
              {recentRegistrations.map((reg) => (
                <div key={reg.id} className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">{reg.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{reg.role} • {reg.activity}</p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 rounded-lg text-xs font-bold">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1 font-mono text-knbs-600 dark:text-knbs-400">
                      <Tablet className="w-3 h-3" />
                      {reg.tabletId}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>Reserved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/activities" className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white hover:shadow-xl hover:-translate-y-1 transition-all group">
            <Activity className="w-8 h-8 mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-lg font-bold mb-2">View Activities</h3>
            <p className="text-sm text-blue-100 mb-4">Track ongoing KNBS surveys and tablet deployments</p>
            <div className="flex items-center gap-2 text-sm font-bold">
              Explore
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/issuance" className="bg-gradient-to-br from-knbs-500 to-knbs-600 rounded-2xl p-6 text-white hover:shadow-xl hover:-translate-y-1 transition-all group">
            <Package className="w-8 h-8 mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-lg font-bold mb-2">Bulk Issuance</h3>
            <p className="text-sm text-knbs-100 mb-4">Review and approve tablet requests and registrations</p>
            <div className="flex items-center gap-2 text-sm font-bold">
              Manage
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/logs" className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover:shadow-xl hover:-translate-y-1 transition-all group">
            <Activity className="w-8 h-8 mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-lg font-bold mb-2">System Logs</h3>
            <p className="text-sm text-purple-100 mb-4">View comprehensive audit trail of all events</p>
            <div className="flex items-center gap-2 text-sm font-bold">
              View Logs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}