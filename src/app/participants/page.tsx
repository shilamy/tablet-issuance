// app/participants/page.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { 
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
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
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
    let filtered = mockParticipants;

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
  }, [searchQuery, selectedStatus, selectedTabletStatus, selectedActivity, sortConfig]);

  // Paginate results
  const paginatedParticipants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredParticipants.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredParticipants, currentPage]);

  useEffect(() => {
    setParticipants(paginatedParticipants);
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [paginatedParticipants]);

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
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);

  const stats = {
    total: mockParticipants.length,
    active: mockParticipants.filter(p => p.status === 'active').length,
    pending: mockParticipants.filter(p => p.status === 'pending').length,
    withTablets: mockParticipants.filter(p => p.tabletsIssued > 0).length,
    tabletsActive: mockParticipants.filter(p => p.tabletStatus === 'active').length,
    tabletsDue: mockParticipants.filter(p => {
      if (!p.expectedReturnDate || p.tabletStatus !== 'active') return false;
      const returnDate = new Date(p.expectedReturnDate);
      const today = new Date();
      const diffTime = returnDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0;
    }).length,
    byActivity: activityOptions.slice(1).map(activity => ({
      ...activity,
      count: mockParticipants.filter(p => p.activity === activity.value).length
    })),
    byLocation: Array.from(new Set(mockParticipants.map(p => p.location))).map(location => ({
      location,
      count: mockParticipants.filter(p => p.location === location).length
    })),
    tabletStatus: {
      active: mockParticipants.filter(p => p.tabletStatus === 'active').length,
      damaged: mockParticipants.filter(p => p.tabletStatus === 'damaged').length,
      returned: mockParticipants.filter(p => p.tabletStatus === 'returned').length,
      lost: mockParticipants.filter(p => p.tabletStatus === 'lost').length,
      maintenance: mockParticipants.filter(p => p.tabletStatus === 'maintenance').length,
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
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tablet Management</h1>
            <p className="text-sm text-gray-600">Track tablets issued to survey participants</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </button>
            <button 
              onClick={handleImport}
              className="flex items-center px-3 py-2 bg-knbs-500 hover:bg-knbs-600 text-white rounded-lg text-sm"
            >
              <Upload className="w-4 h-4 mr-1.5" />
              Import
            </button>
            <Link
              href="/participants/new"
              className="flex items-center px-3 py-2 bg-knbs-600 hover:bg-knbs-700 text-white rounded-lg text-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add New
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Participants</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tablets Issued</p>
                <p className="text-xl font-bold text-green-600 mt-1">{stats.withTablets}</p>
              </div>
              <Tablet className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Due for Return</p>
                <p className="text-xl font-bold text-yellow-600 mt-1">{stats.tabletsDue}</p>
              </div>
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Tablets</p>
                <p className="text-xl font-bold text-blue-600 mt-1">{stats.tabletsActive}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-blue-400" />
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Participant Status</label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedStatus(option.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          selectedStatus === option.value
                            ? option.color
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tablet Status</label>
                  <div className="flex flex-wrap gap-2">
                    {tabletStatusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedTabletStatus(option.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          selectedTabletStatus === option.value
                            ? option.color
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Activity</label>
                  <select
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-knbs-500 focus:border-transparent text-sm"
                  >
                    {activityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    setSelectedStatus("all");
                    setSelectedTabletStatus("all");
                    setSelectedActivity("all");
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear all filters
                </button>
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
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedParticipants.length === participants.length && participants.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-knbs-600 focus:ring-knbs-500 h-4 w-4"
                      />
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Participant
                        {sortConfig?.key === 'name' && (
                          <ChevronDown className={`w-3 h-3 ml-1 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity & Tablet
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Return Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {participants.map((participant) => (
                    <tr 
                      key={participant.id}
                      className={cn(
                        "hover:bg-gray-50",
                        selectedParticipants.includes(participant.id) && "bg-knbs-50",
                        isReturnDatePassed(participant.expectedReturnDate) && "bg-red-50"
                      )}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedParticipants.includes(participant.id)}
                          onChange={() => handleSelectParticipant(participant.id)}
                          className="rounded border-gray-300 text-knbs-600 focus:ring-knbs-500 h-4 w-4"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-lg bg-knbs-100 flex items-center justify-center mr-3">
                            <span className="text-xs font-bold text-knbs-700">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <Link
                                href={`/participants/${participant.id}`}
                                className="text-sm font-medium text-gray-900 hover:text-knbs-600"
                              >
                                {participant.name}
                              </Link>
                              <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                                {participant.id}
                              </span>
                            </div>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3 mr-1" />
                              {participant.location} • {participant.role}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Mail className="w-3 h-3 mr-2 text-gray-400" />
                            {participant.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-3 h-3 mr-2 text-gray-400" />
                            {participant.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">{participant.activity}</div>
                          {participant.tabletSerial ? (
                            <>
                              <div className="flex items-center text-xs text-gray-600">
                                <Smartphone className="w-3 h-3 mr-1" />
                                {participant.tabletModel}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <span className="font-mono">{participant.tabletSerial}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500 space-x-2">
                                {participant.batteryHealth && (
                                  <span className="flex items-center">
                                    <Battery className="w-3 h-3 mr-1" />
                                    {participant.batteryHealth}%
                                  </span>
                                )}
                                {participant.wifiConnected ? (
                                  <span className="flex items-center text-green-600">
                                    <Wifi className="w-3 h-3 mr-1" />
                                    Online
                                  </span>
                                ) : (
                                  <span className="flex items-center text-gray-400">
                                    <WifiOff className="w-3 h-3 mr-1" />
                                    Offline
                                  </span>
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="text-xs text-gray-400">No tablet assigned</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            participant.status === 'active' ? 'bg-green-100 text-green-800' :
                            participant.status === 'inactive' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {getStatusIcon(participant.status)}
                            <span className="ml-1 capitalize">{participant.status}</span>
                          </div>
                          <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getTabletStatusColor(participant.tabletStatus)}`}>
                            {getTabletStatusIcon(participant.tabletStatus)}
                            <span className="ml-1 capitalize">{participant.tabletStatus || 'No tablet'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {participant.expectedReturnDate ? (
                          <div className="space-y-1">
                            <div className={cn(
                              "text-sm font-medium",
                              isReturnDatePassed(participant.expectedReturnDate) 
                                ? "text-red-600"
                                : isReturnDateNear(participant.expectedReturnDate)
                                ? "text-yellow-600"
                                : "text-gray-900"
                            )}>
                              {participant.expectedReturnDate}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              Issued: {participant.issueDate}
                            </div>
                            {participant.actualReturnDate && (
                              <div className="text-xs text-green-600">
                                Returned: {participant.actualReturnDate}
                              </div>
                            )}
                            {isReturnDatePassed(participant.expectedReturnDate) && (
                              <div className="text-xs text-red-600 font-medium">OVERDUE</div>
                            )}
                            {isReturnDateNear(participant.expectedReturnDate) && !isReturnDatePassed(participant.expectedReturnDate) && (
                              <div className="text-xs text-yellow-600 font-medium">Due Soon</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">No return date</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleSendNotification(participant.id)}
                            className={cn(
                              "flex items-center px-2 py-1 rounded text-xs",
                              notificationSent[participant.id]
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            )}
                            title="Send return reminder"
                          >
                            <Bell className="w-3 h-3 mr-1" />
                            {notificationSent[participant.id] ? "Sent" : "Notify"}
                          </button>
                          <Link
                            href={`/participants/${participant.id}`}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/participants/${participant.id}/edit`}
                            className="p-1.5 text-gray-400 hover:text-knbs-600 hover:bg-knbs-50 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
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
                          className={`px-3 py-1.5 rounded text-sm ${
                            currentPage === pageNum
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className={cn(
                  "bg-white rounded-lg border border-gray-200 p-4",
                  isReturnDatePassed(participant.expectedReturnDate) && "border-red-200 bg-red-50"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-lg bg-knbs-100 flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-knbs-700">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{participant.name}</h3>
                      <p className="text-xs text-gray-500">{participant.id}</p>
                    </div>
                  </div>
                  <div className={`p-1.5 rounded ${
                    participant.status === 'active' ? 'bg-green-50 text-green-600' :
                    participant.status === 'inactive' ? 'bg-red-50 text-red-600' :
                    'bg-yellow-50 text-yellow-600'
                  }`}>
                    {getStatusIcon(participant.status)}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-3 h-3 mr-2" />
                    {participant.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-3 h-3 mr-2" />
                    {participant.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-3 h-3 mr-2" />
                    {participant.location}
                  </div>
                  {participant.tabletModel && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Tablet className="w-3 h-3 mr-2" />
                      {participant.tabletModel}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{participant.activity}</p>
                    <p className="text-xs text-gray-500">
                      {participant.expectedReturnDate ? `Due: ${participant.expectedReturnDate}` : 'No return date'}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getTabletStatusColor(participant.tabletStatus)}`}>
                    {participant.tabletStatus || 'No tablet'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleSendNotification(participant.id)}
                    className={cn(
                      "text-sm flex items-center",
                      notificationSent[participant.id]
                        ? "text-green-600"
                        : "text-knbs-600 hover:text-knbs-700"
                    )}
                  >
                    <Bell className="w-3 h-3 mr-1" />
                    {notificationSent[participant.id] ? "Notification Sent" : "Send Reminder"}
                  </button>
                  <div className="flex items-center space-x-1">
                    <Link
                      href={`/participants/${participant.id}`}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/participants/${participant.id}/edit`}
                      className="p-1 text-gray-400 hover:text-knbs-600"
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