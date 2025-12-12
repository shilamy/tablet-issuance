"use client";

import Layout from "@/components/Layout";
import DashboardMetric from "@/components/DashboardMetric";
import { 
  TrendingUp, 
  TrendingDown, 
  Tablet,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Users
} from "lucide-react";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: "issued", tablet: "A12", participant: "John Doe", time: "10 min ago", status: "success" },
    { id: 2, action: "returned", tablet: "K90", participant: "Mary Wilson", time: "25 min ago", status: "success" },
    { id: 3, action: "marked as damaged", tablet: "XR5", participant: "System", time: "1 hour ago", status: "warning" },
    { id: 4, action: "checked out", tablet: "B34", participant: "Alex Johnson", time: "2 hours ago", status: "success" },
    { id: 5, action: "assigned to activity", tablet: "C56", participant: "Field Survey", time: "4 hours ago", status: "info" },
  ]);

  const [metrics, setMetrics] = useState([
    { 
      title: "Total Tablets", 
      value: 120, 
      icon: <Tablet className="w-5 h-5" />,
      change: "+5%",
      trend: "up",
      color: "bg-knbs-100 text-knbs-700",
      borderColor: "border-knbs-200"
    },
    { 
      title: "Issued Tablets", 
      value: 45, 
      icon: <CheckCircle className="w-5 h-5" />,
      change: "+12%",
      trend: "up",
      color: "bg-green-50 text-green-700",
      borderColor: "border-green-200"
    },
    { 
      title: "Damaged/Missing", 
      value: 5, 
      icon: <AlertCircle className="w-5 h-5" />,
      change: "-2%",
      trend: "down",
      color: "bg-red-50 text-red-700",
      borderColor: "border-red-200"
    },
    { 
      title: "Active Contracts", 
      value: 30, 
      icon: <FileText className="w-5 h-5" />,
      change: "+8%",
      trend: "up",
      color: "bg-blue-50 text-blue-700",
      borderColor: "border-blue-200"
    },
  ]);

  const quickActions = [
    { title: "Quick Check-out", icon: "📱", link: "/issuance/checkout", color: "bg-knbs-500 hover:bg-knbs-600" },
    { title: "View Reports", icon: "📊", link: "/reports", color: "bg-blue-500 hover:bg-blue-600" },
    { title: "Manage Tablets", icon: "🛠️", link: "/tablets", color: "bg-green-500 hover:bg-green-600" },
    { title: "Add Participant", icon: "👤", link: "/participants/new", color: "bg-purple-500 hover:bg-purple-600" },
  ];

  // Simulate data fetching
  useEffect(() => {
    // In a real app, you would fetch data here
    const interval = setInterval(() => {
      // Update the "Last updated" time
      console.log("Dashboard data refreshed");
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Function to refresh dashboard data
  const refreshData = () => {
    // This would fetch fresh data from your API
    console.log("Refreshing dashboard data...");
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
            <span className="text-gray-500">Last updated: Just now</span>
          </div>
          <button
            onClick={refreshData}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className={`bg-white rounded-xl border ${metric.borderColor} p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className={`inline-flex items-center justify-center p-2 rounded-lg ${metric.color} mb-4`}>
                  {metric.icon}
                </div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className={`inline-flex items-center text-sm font-medium ${
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {metric.change}
                </div>
                <span className="text-xs text-gray-500 mt-1">vs last week</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.link}
                  className={`flex items-center justify-between p-4 rounded-lg ${action.color} text-white transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{action.icon}</span>
                    <span className="font-medium">{action.title}</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <a href="/activity-logs" className="text-sm text-knbs-600 hover:text-knbs-700 font-medium hover:underline">
                View all →
              </a>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer"
                  onClick={() => console.log(`Clicked on activity ${activity.id}`)}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${
                      activity.status === "success" ? "bg-green-100" :
                      activity.status === "warning" ? "bg-yellow-100" :
                      "bg-blue-100"
                    }`}>
                      <Tablet className={`w-4 h-4 ${
                        activity.status === "success" ? "text-green-600" :
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
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.status === "success" ? "bg-green-100 text-green-800" :
                    activity.status === "warning" ? "bg-yellow-100 text-yellow-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Activity Summary */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-gray-600">Successful: 42</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-gray-600">Warnings: 3</span>
                  </div>
                </div>
                <button 
                  className="flex items-center text-knbs-600 hover:text-knbs-700 font-medium"
                  onClick={() => console.log("Enable real-time updates")}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Real-time updates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-knbs-500 to-knbs-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-knbs-100 text-sm font-medium">Active Users</p>
              <p className="text-2xl font-bold mt-2">18</p>
            </div>
            <Users className="w-8 h-8 opacity-80" />
          </div>
          <div className="mt-4 text-sm text-knbs-100">
            3 admins, 8 managers, 7 officers online
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Avg. Check-out Time</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">2.4 min</p>
          <div className="mt-4">
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>12% faster than last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">3</p>
          <div className="mt-4">
            <a href="/approvals" className="text-knbs-600 hover:text-knbs-700 text-sm font-medium hover:underline">
              Review now →
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}