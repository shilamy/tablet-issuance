// app/participants/page.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Trash2,
  UserCheck,
  MoreVertical,
  ChevronDown,
  CheckCircle,
  XCircle,
  Users,
  FileText,
  AlertCircle,
  Package,
  Eye,
  Send,
  RefreshCw,
  Upload,
  BarChart3,
  Grid3x3,
  List,
  Copy,
  UserPlus,
  Shield,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Bell,
  Tablet,
  Clock,
  Smartphone,
  Battery,
  Wifi,
  HardDrive,
  Check,
  X,
  BatteryCharging,
  WifiOff,
  AlertTriangle,
  CalendarDays,
  FileUp,
  FileDown,
  SendHorizontal,
  BellRing
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import { Participant } from "@/types/participants";
import { useTabletStore } from "@/store/tabletStore";






const statusOptions = [
  { value: "all", label: "All Status", color: "bg-gray-100 text-gray-800", icon: Users },
  { value: "active", label: "Active", color: "bg-green-100 text-green-800", icon: CheckCircle },
  { value: "inactive", label: "Inactive", color: "bg-red-100 text-red-800", icon: XCircle },
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
];

const tabletStatusOptions = [
  { value: "all", label: "All Tablet Status", color: "bg-gray-100 text-gray-800", icon: Tablet },
  { value: "active", label: "Active", color: "bg-green-100 text-green-800", icon: CheckCircle },
  { value: "damaged", label: "Damaged", color: "bg-red-100 text-red-800", icon: AlertTriangle },
  { value: "returned", label: "Returned", color: "bg-blue-100 text-blue-800", icon: Check },
  { value: "lost", label: "Lost", color: "bg-red-100 text-red-800", icon: XCircle },
  { value: "maintenance", label: "Maintenance", color: "bg-yellow-100 text-yellow-800", icon: Package },
];

const activityOptions = [
  { value: "all", label: "All Activities" },
  { value: "Household Survey", label: "Household Survey", color: "bg-blue-100 text-blue-800" },
  { value: "Agricultural Census", label: "Agricultural Census", color: "bg-green-100 text-green-800" },
  { value: "Business Survey", label: "Business Survey", color: "bg-purple-100 text-purple-800" },
  { value: "Population Census", label: "Population Census", color: "bg-orange-100 text-orange-800" },
  { value: "Health Survey", label: "Health Survey", color: "bg-pink-100 text-pink-800" },
  { value: "Education Survey", label: "Education Survey", color: "bg-indigo-100 text-indigo-800" },
];

const viewModes = [
  { id: "list", label: "List", icon: List },
  { id: "grid", label: "Grid", icon: Grid3x3 },
];

export default function ParticipantsPage() {
  // Get participants from store
  const { participants: storeParticipants, refreshData } = useTabletStore();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTabletStatus, setSelectedTabletStatus] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState("all");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Participant; direction: 'asc' | 'desc' } | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationSent, setNotificationSent] = useState<Record<string, boolean>>({});
  const itemsPerPage = 8;

  // Memoized filtered participants
  const filteredParticipants = useMemo(() => {
    let filtered = storeParticipants;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query) ||
        p.phone.includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.role?.toLowerCase().includes(query) ||
        p.tabletSerial?.toLowerCase().includes(query)
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    if (selectedTabletStatus !== "all") {
      filtered = filtered.filter(p => p.tabletStatus === selectedTabletStatus);
    }

    if (selectedActivity !== "all") {
      filtered = filtered.filter(p => p.activity === selectedActivity);
    }

    // Apply sorting
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined || bValue === undefined) {
          if (aValue === undefined && bValue === undefined) return 0;
          if (aValue === undefined) return 1;
          if (bValue === undefined) return -1;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [storeParticipants, searchQuery, selectedStatus, selectedTabletStatus, selectedActivity, sortConfig]);

  // Paginate results
  const paginatedParticipants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredParticipants.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredParticipants, currentPage]);

  useEffect(() => {
    setParticipants(paginatedParticipants);
  }, [paginatedParticipants]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedTabletStatus, selectedActivity]);

  const handleSort = (key: keyof Participant) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = () => {
    if (selectedParticipants.length === participants.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(participants.map(p => p.id));
    }
  };

  const handleSelectParticipant = (id: string) => {
    setSelectedParticipants(prev =>
      prev.includes(id)
        ? prev.filter(pId => pId !== id)
        : [...prev, id]
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleDeleteParticipant = (participantId: string, participantName: string) => {
    if (window.confirm(`Are you sure you want to delete ${participantName}? This action cannot be undone.`)) {
      // In a real app, this would call an API to delete the participant
      console.log(`Deleting participant: ${participantId}`);
      // For now, just show a success message
      alert(`Participant ${participantName} has been deleted successfully.`);
      // Optionally refresh the page or remove from local state
      handleRefresh();
    }
  };


  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);

  const stats = {
    total: storeParticipants.length,
    active: storeParticipants.filter((p: Participant) => p.status === 'active').length,
    pending: storeParticipants.filter((p: Participant) => p.status === 'pending').length,
    withTablets: storeParticipants.filter((p: Participant) => p.tabletsIssued > 0).length,
    tabletsActive: storeParticipants.filter((p: Participant) => p.tabletStatus === 'active').length,
    tabletsDue: storeParticipants.filter((p: Participant) => {
      if (!p.expectedReturnDate || p.tabletStatus !== 'active') return false;
      const returnDate = new Date(p.expectedReturnDate);
      const today = new Date();
      const diffTime = returnDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0;
    }).length,
    byActivity: activityOptions.slice(1).map(activity => ({
      ...activity,
      count: storeParticipants.filter((p: Participant) => p.activity === activity.value).length
    })),
    byLocation: Array.from(new Set(storeParticipants.map((p: Participant) => p.location))).map(location => ({
      location,
      count: storeParticipants.filter((p: Participant) => p.location === location).length
    })),
    tabletStatus: {
      active: storeParticipants.filter((p: Participant) => p.tabletStatus === 'active').length,
      damaged: storeParticipants.filter((p: Participant) => p.tabletStatus === 'damaged').length,
      returned: storeParticipants.filter((p: Participant) => p.tabletStatus === 'returned').length,
      lost: storeParticipants.filter((p: Participant) => p.tabletStatus === 'lost').length,
      maintenance: storeParticipants.filter((p: Participant) => p.tabletStatus === 'maintenance').length,
    }
  };

  const getStatusIcon = (status: Participant['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'inactive':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTabletStatusIcon = (status: Participant['tabletStatus']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'damaged':
        return <AlertTriangle className="w-4 h-4" />;
      case 'returned':
        return <Check className="w-4 h-4" />;
      case 'lost':
        return <XCircle className="w-4 h-4" />;
      case 'maintenance':
        return <Package className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTabletStatusColor = (status: Participant['tabletStatus'] = 'active') => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'damaged':
        return 'bg-red-100 text-red-800';
      case 'returned':
        return 'bg-blue-100 text-blue-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getContractStatusColor = (status: Participant['contractStatus']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'none':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendNotification = (participantId: string) => {
    const participant = participants.find(p => p.id === participantId);
    if (participant) {
      // In real app, integrate with SMS/email API
      alert(`Notification sent to ${participant.name} at ${participant.phone}`);
      setNotificationSent(prev => ({ ...prev, [participantId]: true }));
      // Reset notification sent status after 5 seconds
      setTimeout(() => {
        setNotificationSent(prev => ({ ...prev, [participantId]: false }));
      }, 5000);
    }
  };

  const handleBulkNotification = () => {
    if (selectedParticipants.length === 0) {
      alert("Please select participants first");
      return;
    }
    // In real app, send bulk notifications
    alert(`Notifications sent to ${selectedParticipants.length} participants`);
    selectedParticipants.forEach(id => {
      setNotificationSent(prev => ({ ...prev, [id]: true }));
    });
    setTimeout(() => {
      const reset = selectedParticipants.reduce((acc, id) => {
        acc[id] = false;
        return acc;
      }, {} as Record<string, boolean>);
      setNotificationSent(prev => ({ ...prev, ...reset }));
    }, 5000);
  };

  const handleImport = () => {
    // In real app, implement file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert(`Importing ${file.name}`);
        // Process file here
      }
    };
    input.click();
  };

  const handleExport = () => {
    const data = selectedParticipants.length > 0
      ? participants.filter(p => selectedParticipants.includes(p.id))
      : filteredParticipants;

    // Create CSV content
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Location', 'Activity', 'Tablet Serial', 'Tablet Model', 'Tablet Status', 'Issue Date', 'Expected Return', 'Battery Health', 'Last Sync'];
    const csvContent = [
      headers.join(','),
      ...data.map(p => [
        p.id,
        `"${p.name}"`,
        p.email,
        p.phone,
        p.location,
        p.activity,
        p.tabletSerial || '',
        p.tabletModel || '',
        p.tabletStatus || '',
        p.issueDate || '',
        p.expectedReturnDate || '',
        p.batteryHealth || '',
        p.lastSync || ''
      ].join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tablet-participants-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isReturnDateNear = (date?: string) => {
    if (!date) return false;
    const today = new Date();
    const returnDate = new Date(date);
    const diffTime = returnDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const isReturnDatePassed = (date?: string) => {
    if (!date) return false;
    const today = new Date();
    const returnDate = new Date(date);
    return returnDate < today;
  };

  const bulkActions = [
    { label: "Send Notification", icon: BellRing, color: "bg-blue-500 hover:bg-blue-600", onClick: handleBulkNotification },
    { label: "Export Selected", icon: Download, color: "bg-gray-800 hover:bg-gray-900", onClick: handleExport },
    { label: "Assign Tablets", icon: Package, color: "bg-purple-500 hover:bg-purple-600" },
    { label: "Mark as Returned", icon: Check, color: "bg-green-500 hover:bg-green-600" },
    { label: "Delete Selected", icon: Trash2, color: "bg-red-500 hover:bg-red-600" },
  ];

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Participant Management</h1>
              <p className="text-sm text-gray-600">Manage participants and their tablets </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleExport}
              className="flex items-center px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </button>
            <button
              onClick={handleImport}
              className="flex items-center px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm transition-colors shadow-sm"
            >
              <Upload className="w-4 h-4 mr-1.5" />
              Import
            </button>
            <Link
              href="/participants/new"
              className="flex items-center px-3 py-2 bg-knbs-600 hover:bg-knbs-700 text-white rounded-lg text-sm shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add New
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Participants</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <span className="text-green-600 font-medium flex items-center mr-1">
                <Users className="w-3 h-3 mr-0.5" /> +2
              </span>
              this week
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tablets Issued</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.withTablets}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <Tablet className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(stats.withTablets / stats.total) * 100}%` }}></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Due for Return</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.tabletsDue}</p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-yellow-600 font-medium">
              Action required for {stats.tabletsDue} items
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Tablets</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.tabletsActive}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(stats.tabletsActive / stats.withTablets) * 100}%` }}></div>
            </div>
          </div>
        </div>

        {/* Search and Actions Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search by name, phone, tablet serial..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-knbs-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                {viewModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id as "list" | "grid")}
                    className={cn(
                      "p-1.5 rounded-md text-xs transition-colors",
                      viewMode === mode.id
                        ? "bg-white text-knbs-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                    title={mode.label}
                  >
                    <mode.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Filter className="w-4 h-4 mr-1.5" />
                Filters
                {(selectedStatus !== "all" || selectedTabletStatus !== "all" || selectedActivity !== "all") && (
                  <span className="ml-1.5 w-2 h-2 rounded-full bg-knbs-500"></span>
                )}
              </button>

              {/* More Actions */}
              <div className="relative group">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <MoreVertical className="w-4 h-4" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-1">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Data
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Generate Report
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Send className="w-4 h-4 mr-2" />
                      Bulk Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Participant Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-knbs-500 focus:border-transparent"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tablet Status</label>
                  <select
                    value={selectedTabletStatus}
                    onChange={(e) => setSelectedTabletStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-knbs-500 focus:border-transparent"
                  >
                    {tabletStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Activity</label>
                  <select
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-knbs-500 focus:border-transparent"
                  >
                    {activityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pb-0.5">
                  <button
                    onClick={() => {
                      setSelectedStatus("all");
                      setSelectedTabletStatus("all");
                      setSelectedActivity("all");
                    }}
                    className="whitespace-nowrap px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                    title="Clear all filters"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions Bar */}
        {selectedParticipants.length > 0 && (
          <div className="bg-knbs-50 border border-knbs-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserCheck className="w-4 h-4 text-knbs-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedParticipants.length} selected
                  </p>
                  <p className="text-xs text-gray-600">Apply actions to selected</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {bulkActions.slice(0, 3).map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`flex items-center px-3 py-1.5 text-white rounded text-xs ${action.color}`}
                  >
                    <action.icon className="w-3 h-3 mr-1.5" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Participants Table/Grid */}
        {viewMode === "list" ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedParticipants.length === participants.length && participants.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-knbs-600 focus:ring-knbs-500 h-4 w-4 transition-colors"
                      />
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center group">
                        Participant
                        <div className={`ml-1 text-gray-400 group-hover:text-gray-600 ${sortConfig?.key === 'name' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                          <ChevronDown className={`w-3 h-3 ${sortConfig?.direction === 'desc' ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </th>
                    <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="hidden xl:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Activity & Tablet
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Return Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {participants.map((participant) => (
                    <tr
                      key={participant.id}
                      className={cn(
                        "group transition-colors hover:bg-gray-50",
                        selectedParticipants.includes(participant.id) && "bg-knbs-50",
                        isReturnDatePassed(participant.expectedReturnDate) && "bg-red-50/50"
                      )}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedParticipants.includes(participant.id)}
                          onChange={() => handleSelectParticipant(participant.id)}
                          className="rounded border-gray-300 text-knbs-600 focus:ring-knbs-500 h-4 w-4 transition-colors"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-knbs-100 to-knbs-200 flex-shrink-0 flex items-center justify-center mr-4 shadow-sm border border-knbs-100">
                            <span className="text-sm font-bold text-knbs-700">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <Link
                                href={`/participants/${participant.id}`}
                                className="text-sm font-medium text-gray-900 hover:text-knbs-600 transition-colors"
                              >
                                {participant.name}
                              </Link>
                            </div>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono mr-2">
                                {participant.id}
                              </span>
                              <span className="flex items-center truncate max-w-[150px]" title={participant.location}>
                                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                {participant.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                            <Mail className="w-3.5 h-3.5 mr-2 text-gray-400" />
                            <span className="truncate max-w-[180px]" title={participant.email}>{participant.email}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" />
                            {participant.phone}
                          </div>
                        </div>
                      </td>
                      <td className="hidden xl:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1.5">
                          <div className="text-sm text-gray-900">{participant.activity}</div>
                          {participant.tabletSerial ? (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center text-xs text-gray-600">
                                <Smartphone className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                {participant.tabletModel}
                              </div>
                              <div className="flex items-center text-xs space-x-3">
                                <span className="font-mono text-gray-500 bg-gray-50 px-1.5 rounded border border-gray-100">
                                  {participant.tabletSerial}
                                </span>
                                {participant.batteryHealth && (
                                  <span className={cn(
                                    "flex items-center",
                                    participant.batteryHealth < 20 ? "text-red-500" : "text-gray-500"
                                  )}>
                                    <Battery className="w-3 h-3 mr-1" />
                                    {participant.batteryHealth}%
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              No Device
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-2">
                          <div className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${participant.status === 'active' ? 'bg-green-100 text-green-800' :
                            participant.status === 'inactive' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                            {getStatusIcon(participant.status)}
                            <span className="ml-1.5 capitalize">{participant.status}</span>
                          </div>
                          {participant.tabletStatus && (
                            <div className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTabletStatusColor(participant.tabletStatus)}`}>
                              {getTabletStatusIcon(participant.tabletStatus)}
                              <span className="ml-1.5 capitalize">{participant.tabletStatus}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                        {participant.expectedReturnDate ? (
                          <div className="flex flex-col gap-0.5">
                            <div className={cn(
                              "text-sm font-medium flex items-center",
                              isReturnDatePassed(participant.expectedReturnDate)
                                ? "text-red-600"
                                : isReturnDateNear(participant.expectedReturnDate)
                                  ? "text-amber-600"
                                  : "text-gray-900"
                            )}>
                              <Calendar className="w-3.5 h-3.5 mr-1.5" />
                              {participant.expectedReturnDate}
                            </div>

                            {isReturnDatePassed(participant.expectedReturnDate) && (
                              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-1.5 py-0.5 rounded w-fit">
                                Overdue
                              </span>
                            )}
                            {isReturnDateNear(participant.expectedReturnDate) && !isReturnDatePassed(participant.expectedReturnDate) && (
                              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-1.5 py-0.5 rounded w-fit">
                                Due Soon
                              </span>
                            )}
                            {participant.actualReturnDate && (
                              <span className="text-xs text-green-600 flex items-center mt-1">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Returned: {participant.actualReturnDate}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">Not scheduled</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleSendNotification(participant.id)}
                            className={cn(
                              "p-1.5 rounded transition-colors",
                              notificationSent[participant.id]
                                ? "text-green-600 bg-green-50"
                                : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                            )}
                            title={notificationSent[participant.id] ? "Sent" : "Notify"}
                          >
                            <Bell className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/participants/${participant.id}`}
                            className="p-1.5 text-gray-400 hover:text-knbs-600 hover:bg-knbs-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/participants/${participant.id}/edit`}
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteParticipant(participant.id, participant.name)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {participants.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No participants found</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {searchQuery ? "Try adjusting your search" : "Add your first participant"}
                </p>
                <Link
                  href="/participants/new"
                  className="inline-flex items-center px-4 py-2 bg-knbs-500 text-white rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Participant
                </Link>
              </div>
            )}

            {/* Pagination */}
            {filteredParticipants.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-gray-500 mb-2 sm:mb-0">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredParticipants.length)} of {filteredParticipants.length} participants
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage === 1) {
                        pageNum = i + 1;
                      } else if (currentPage === totalPages) {
                        pageNum = totalPages - 2 + i;
                      } else {
                        pageNum = currentPage - 1 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1.5 rounded text-sm ${currentPage === pageNum
                            ? 'bg-knbs-500 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 3 && currentPage < totalPages - 1 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    {totalPages > 3 && currentPage < totalPages - 1 && (
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    )}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className={cn(
                  "group bg-white rounded-xl border p-4 transition-all duration-200 hover:shadow-md",
                  isReturnDatePassed(participant.expectedReturnDate)
                    ? "border-red-200 bg-red-50/30"
                    : "border-gray-200 hover:border-knbs-200"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-knbs-100 to-knbs-200 flex items-center justify-center mr-3 shadow-sm border border-knbs-100">
                      <span className="text-sm font-bold text-knbs-700">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-1" title={participant.name}>{participant.name}</h3>
                      <div className="flex items-center mt-0.5">
                        <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200/50">
                          {participant.id}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className={`p-1.5 rounded-lg shadow-sm ${participant.status === 'active' ? 'bg-green-100 text-green-700' :
                      participant.status === 'inactive' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                      {getStatusIcon(participant.status)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-8 flex justify-center mr-1">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <span className="truncate" title={participant.email}>{participant.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-8 flex justify-center mr-1">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <span className="truncate">{participant.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-8 flex justify-center mr-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <span className="truncate">{participant.location}</span>
                  </div>

                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Device</span>
                      {participant.tabletStatus ? (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getTabletStatusColor(participant.tabletStatus)}`}>
                          {participant.tabletStatus}
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-gray-100 text-gray-500">None</span>
                      )}
                    </div>

                    {participant.tabletModel ? (
                      <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                        <div className="flex items-center text-sm text-gray-700 font-medium mb-1">
                          <Tablet className="w-3.5 h-3.5 mr-2 text-gray-400" />
                          <span className="truncate">{participant.tabletModel}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-gray-500">{participant.tabletSerial}</span>
                          {participant.batteryHealth && (
                            <span className={cn(
                              "flex items-center text-[10px]",
                              participant.batteryHealth < 20 ? "text-red-600 font-bold" : "text-gray-500"
                            )}>
                              <Battery className="w-3 h-3 mr-1" />
                              {participant.batteryHealth}%
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100 border-dashed text-center">
                        <span className="text-xs text-gray-400 italic">No tablet assigned</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center">
                    {participant.expectedReturnDate && (
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-medium">Due Date</span>
                        <span className={cn(
                          "text-xs font-medium",
                          isReturnDatePassed(participant.expectedReturnDate) ? "text-red-600" : "text-gray-700"
                        )}>
                          {participant.expectedReturnDate}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleSendNotification(participant.id)}
                      className={cn(
                        "p-2 rounded-lg transition-colors border",
                        notificationSent[participant.id]
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-white text-gray-400 border-transparent hover:border-gray-200 hover:text-knbs-600"
                      )}
                      title={notificationSent[participant.id] ? "Notification Sent" : "Send Reminder"}
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/participants/${participant.id}`}
                      className="p-2 text-gray-400 bg-white hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg transition-all"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/participants/${participant.id}/edit`}
                      className="p-2 text-gray-400 bg-white hover:text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-100 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Participants by Activity</h3>
            <div className="space-y-3">
              {stats.byActivity.map((activity) => (
                <div key={activity.value} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{activity.label}</span>
                  <span className="font-medium text-gray-900">{activity.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Tablet Status Overview</h3>
            <div className="space-y-3">
              {Object.entries(stats.tabletStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 capitalize">{status}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={handleImport}
                className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left"
              >
                <span className="text-sm font-medium text-gray-900">Import Participants</span>
                <Upload className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={handleExport}
                className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left"
              >
                <span className="text-sm font-medium text-gray-900">Export All Data</span>
                <Download className="w-4 h-4 text-gray-400" />
              </button>
              <Link
                href="/tablets/issue"
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-900">Issue New Tablet</span>
                <Package className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}