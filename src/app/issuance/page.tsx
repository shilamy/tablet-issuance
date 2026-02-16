"use client";

import Layout from "@/components/Layout";
import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Tablet,
  User,
  Calendar,
  MapPin,
  Activity,
  FileText,
  Send,
  Package
} from "lucide-react";

export default function IssuancePage() {
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [activeTab, setActiveTab] = useState<"requests" | "registrations">("requests");

  // Mock tablet requests from activity holders
  const tabletRequests = [
    {
      id: "REQ-001",
      requester: "Dr. Jane Mwangi",
      activity: "2024 Kenya Population and Housing Census",
      quantity: 150,
      counties: ["Nairobi", "Kiambu", "Machakos"],
      type: "main",
      date: "2026-02-15",
      status: "pending"
    },
    {
      id: "REQ-002",
      requester: "Prof. Peter Ochieng",
      activity: "Continuous Household Surveys (KCHSP)",
      quantity: 45,
      counties: ["Kisumu", "Siaya", "Homa Bay"],
      type: "pilot",
      date: "2026-02-14",
      status: "pending"
    },
    {
      id: "REQ-003",
      requester: "Mary Wanjiku",
      activity: "Agriculture and Livestock Surveys",
      quantity: 80,
      counties: ["Nakuru", "Narok", "Kajiado", "Laikipia"],
      type: "listing",
      date: "2026-02-13",
      status: "pending"
    }
  ];

  // Mock field staff registrations
  const registrations = [
    {
      id: "REG-001",
      name: "John Kamau",
      idNumber: "12345678",
      phone: "+254 712 345 678",
      email: "john.kamau@example.com",
      role: "Supervisor",
      activity: "2024 Kenya Population and Housing Census",
      county: "Nairobi",
      tabletId: "KNBS-TB-0001",
      date: "2026-02-16",
      status: "pending"
    },
    {
      id: "REG-002",
      name: "Sarah Akinyi",
      idNumber: "87654321",
      phone: "+254 723 456 789",
      email: "sarah.akinyi@example.com",
      role: "Research Assistant",
      activity: "2024 Kenya Population and Housing Census",
      county: "Kiambu",
      tabletId: "KNBS-TB-0002",
      date: "2026-02-16",
      status: "pending"
    },
    {
      id: "REG-003",
      name: "David Otieno",
      idNumber: "11223344",
      phone: "+254 734 567 890",
      email: "david.otieno@example.com",
      role: "Supervisor",
      activity: "Continuous Household Surveys (KCHSP)",
      county: "Kisumu",
      tabletId: "KNBS-TB-0015",
      date: "2026-02-15",
      status: "pending"
    },
    {
      id: "REG-004",
      name: "Grace Njeri",
      idNumber: "55667788",
      phone: "+254 745 678 901",
      email: "grace.njeri@example.com",
      role: "Research Assistant",
      activity: "Agriculture and Livestock Surveys",
      county: "Nakuru",
      tabletId: "KNBS-TB-0023",
      date: "2026-02-15",
      status: "pending"
    }
  ];

  const handleApproveRequests = () => {
    if (selectedRequests.length === 0) return;
    alert(`Approved ${selectedRequests.length} tablet request(s)`);
    setSelectedRequests([]);
  };

  const handleRejectRequests = () => {
    if (selectedRequests.length === 0) return;
    alert(`Rejected ${selectedRequests.length} tablet request(s)`);
    setSelectedRequests([]);
  };

  const handleApproveRegistrations = () => {
    if (selectedRegistrations.length === 0) return;
    alert(`Approved and issued tablets to ${selectedRegistrations.length} field staff`);
    setSelectedRegistrations([]);
  };

  const handleRejectRegistrations = () => {
    if (selectedRegistrations.length === 0) return;
    alert(`Rejected ${selectedRegistrations.length} registration(s). Tablets returned to available pool.`);
    setSelectedRegistrations([]);
  };

  return (
    <Layout>
      <div className="space-y-8 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Bulk Issuance</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Review and approve tablet requests and field staff registrations.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab("requests")}
            className={cn(
              "px-6 py-3 font-bold text-sm transition-all relative",
              activeTab === "requests"
                ? "text-knbs-600 dark:text-knbs-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            )}
          >
            Tablet Requests
            <span className="ml-2 px-2 py-0.5 bg-knbs-100 dark:bg-knbs-950/30 text-knbs-700 dark:text-knbs-400 rounded-full text-xs">
              {tabletRequests.length}
            </span>
            {activeTab === "requests" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-knbs-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("registrations")}
            className={cn(
              "px-6 py-3 font-bold text-sm transition-all relative",
              activeTab === "registrations"
                ? "text-knbs-600 dark:text-knbs-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            )}
          >
            Field Staff Registrations
            <span className="ml-2 px-2 py-0.5 bg-knbs-100 dark:bg-knbs-950/30 text-knbs-700 dark:text-knbs-400 rounded-full text-xs">
              {registrations.length}
            </span>
            {activeTab === "registrations" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-knbs-500"></div>
            )}
          </button>
        </div>

        {/* Tablet Requests Tab */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Pending Requests</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleRejectRequests}
                    disabled={selectedRequests.length === 0}
                    className="px-4 py-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-950/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject ({selectedRequests.length})
                  </button>
                  <button
                    onClick={handleApproveRequests}
                    disabled={selectedRequests.length === 0}
                    className="px-4 py-2 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-xl text-sm font-bold hover:bg-green-100 dark:hover:bg-green-950/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve ({selectedRequests.length})
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {tabletRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedRequests.includes(request.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRequests([...selectedRequests, request.id]);
                          } else {
                            setSelectedRequests(selectedRequests.filter(id => id !== request.id));
                          }
                        }}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-knbs-600 focus:ring-knbs-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{request.activity}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Requested by: {request.requester}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-bold uppercase">
                            {request.type}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Quantity</p>
                            <p className="text-lg font-black text-gray-900 dark:text-gray-100">{request.quantity}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Counties</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{request.counties.length}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Regions</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{request.counties.join(", ")}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add feedback (e.g., 'We have 120 available, preparing now')"
                            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-knbs-500"
                          />
                          <button className="px-4 py-2 bg-knbs-500 text-white rounded-lg text-sm font-bold hover:bg-knbs-600 transition-colors flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Field Staff Registrations Tab */}
        {activeTab === "registrations" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Pending Registrations</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleRejectRegistrations}
                    disabled={selectedRegistrations.length === 0}
                    className="px-4 py-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-950/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject ({selectedRegistrations.length})
                  </button>
                  <button
                    onClick={handleApproveRegistrations}
                    disabled={selectedRegistrations.length === 0}
                    className="px-4 py-2 bg-gradient-to-r from-knbs-500 to-knbs-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-knbs-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    Issue Tablets ({selectedRegistrations.length})
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {registrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedRegistrations.includes(reg.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRegistrations([...selectedRegistrations, reg.id]);
                          } else {
                            setSelectedRegistrations(selectedRegistrations.filter(id => id !== reg.id));
                          }
                        }}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-knbs-600 focus:ring-knbs-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{reg.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{reg.role} • {reg.activity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Reserved Tablet</p>
                            <p className="text-sm font-bold text-knbs-600 dark:text-knbs-400 font-mono">{reg.tabletId}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">ID Number</p>
                            <p className="text-gray-900 dark:text-gray-100 font-mono">{reg.idNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Phone</p>
                            <p className="text-gray-900 dark:text-gray-100">{reg.phone}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Email</p>
                            <p className="text-gray-900 dark:text-gray-100 truncate">{reg.email}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">County</p>
                            <p className="text-gray-900 dark:text-gray-100 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {reg.county}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

// Helper function
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}