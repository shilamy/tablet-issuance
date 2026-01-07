"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  History, Download, Filter, Search, Calendar,
  LogOut, LogIn, User, Tablet, MapPin, Clock,
  ChevronLeft, RefreshCw, FileText, Eye, Printer,
  ChevronRight, ChevronDown, ChevronUp, MoreVertical,
  X, AlertCircle, CheckCircle, DownloadCloud, 
  BarChart, TrendingUp, CalendarDays, Clock4,
  Users, Smartphone, Building, UserCheck, UserX,
  ArrowUpDown, FileDown, FilterX, CalendarRange
} from "lucide-react";
import Link from "next/link";
import Layout from "@/components/Layout";

// Types
type LogType = 'checkout' | 'checkin';
type LogStatus = 'success' | 'warning' | 'error';

interface LogEntry {
  id: string;
  type: LogType;
  participantId: string;
  participantName: string;
  tabletId: string;
  tabletModel: string;
  timestamp: string;
  location: string;
  performedBy: string;
  notes: string;
  status: LogStatus;
  duration?: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    location: "all",
    dateRange: { start: "", end: "" }
  });
  const [sortBy, setSortBy] = useState<keyof LogEntry>("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Mock data generation
  useEffect(() => {
    const generateMockLogs = (): LogEntry[] => {
      const locations = ['Nairobi HQ', 'Mombasa Branch', 'Kisumu Office', 'Nakuru Center', 'Eldoret Base'];
      const participants = [
        { id: 'P-1001', name: 'John Doe' },
        { id: 'P-1002', name: 'Jane Smith' },
        { id: 'P-1003', name: 'Robert Johnson' },
        { id: 'P-1004', name: 'Sarah Williams' },
        { id: 'P-1005', name: 'Michael Brown' },
        { id: 'P-1006', name: 'Emily Davis' },
        { id: 'P-1007', name: 'David Wilson' },
        { id: 'P-1008', name: 'Lisa Miller' },
      ];
      const tablets = [
        { id: 'KNBS-TAB-001', model: 'Samsung Galaxy Tab A8' },
        { id: 'KNBS-TAB-002', model: 'iPad 10th Gen' },
        { id: 'KNBS-TAB-003', model: 'Lenovo Tab M10' },
        { id: 'KNBS-TAB-004', model: 'Microsoft Surface Go 3' },
        { id: 'KNBS-TAB-005', model: 'Samsung Galaxy Tab S9' },
      ];
      const performers = ['Admin User', 'Manager 1', 'Supervisor 2', 'Field Officer 3'];
      const statuses: LogStatus[] = ['success', 'warning', 'error'];

      const logs: LogEntry[] = [];
      const now = new Date();

      for (let i = 1; i <= 50; i++) {
        const type: LogType = Math.random() > 0.5 ? 'checkout' : 'checkin';
        const participant = participants[Math.floor(Math.random() * participants.length)];
        const tablet = tablets[Math.floor(Math.random() * tablets.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const performedBy = performers[Math.floor(Math.random() * performers.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Generate random date within last 30 days
        const daysAgo = Math.floor(Math.random() * 30);
        const timestamp = new Date(now);
        timestamp.setDate(now.getDate() - daysAgo);
        timestamp.setHours(Math.floor(Math.random() * 24));
        timestamp.setMinutes(Math.floor(Math.random() * 60));

        logs.push({
          id: `LOG-${String(i).padStart(3, '0')}`,
          type,
          participantId: participant.id,
          participantName: participant.name,
          tabletId: tablet.id,
          tabletModel: tablet.model,
          timestamp: timestamp.toISOString(),
          location,
          performedBy,
          notes: type === 'checkout' ? 'Field survey equipment issued' : 'Tablet returned and inspected',
          status,
          duration: type === 'checkout' ? `${Math.floor(Math.random() * 14) + 1} days` : undefined
        });
      }

      return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    };

    setLoading(true);
    setTimeout(() => {
      const mockLogs = generateMockLogs();
      setLogs(mockLogs);
      setFilteredLogs(mockLogs);
      setLoading(false);
    }, 800);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...logs];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(log => 
        log.participantName.toLowerCase().includes(searchLower) ||
        log.tabletId.toLowerCase().includes(searchLower) ||
        log.participantId.toLowerCase().includes(searchLower) ||
        log.performedBy.toLowerCase().includes(searchLower) ||
        log.location.toLowerCase().includes(searchLower)
      );
    }

    // Type filter
    if (filters.type !== "all") {
      result = result.filter(log => log.type === filters.type);
    }

    // Status filter
    if (filters.status !== "all") {
      result = result.filter(log => log.status === filters.status);
    }

    // Location filter
    if (filters.location !== "all") {
      result = result.filter(log => log.location === filters.location);
    }

    // Date range filter
    if (filters.dateRange.start) {
      const startDate = new Date(filters.dateRange.start);
      result = result.filter(log => new Date(log.timestamp) >= startDate);
    }
    if (filters.dateRange.end) {
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter(log => new Date(log.timestamp) <= endDate);
    }

    // Sorting
    result.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      if (sortBy === 'timestamp') {
        return sortOrder === 'asc'
          ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      
      return 0;
    });

    setFilteredLogs(result);
    setCurrentPage(1);
  }, [logs, search, filters, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats calculations
  const stats = useMemo(() => {
    const checkouts = logs.filter(l => l.type === 'checkout').length;
    const checkins = logs.filter(l => l.type === 'checkin').length;
    const successLogs = logs.filter(l => l.status === 'success').length;
    const warningLogs = logs.filter(l => l.status === 'warning').length;
    const errorLogs = logs.filter(l => l.status === 'error').length;
    
    const uniqueParticipants = new Set(logs.map(l => l.participantId)).size;
    const uniqueTablets = new Set(logs.map(l => l.tabletId)).size;
    const uniqueLocations = new Set(logs.map(l => l.location)).size;

    return {
      total: logs.length,
      checkouts,
      checkins,
      successLogs,
      warningLogs,
      errorLogs,
      uniqueParticipants,
      uniqueTablets,
      uniqueLocations,
      successRate: logs.length > 0 ? Math.round((successLogs / logs.length) * 100) : 0
    };
  }, [logs]);

  // Get status icon and color
  const getStatusConfig = (status: LogStatus) => {
    switch (status) {
      case 'success':
        return { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Success' };
      case 'warning':
        return { icon: AlertCircle, color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Warning' };
      case 'error':
        return { icon: X, color: 'bg-rose-100 text-rose-700 border-rose-200', label: 'Error' };
    }
  };

  // Handle export
  const handleExport = (format: 'csv' | 'pdf') => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `tablet-logs-${new Date().toISOString().split('T')[0]}.${format}`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Handle sort
  const handleSort = (column: keyof LogEntry) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setFilters({
      type: "all",
      status: "all",
      location: "all",
      dateRange: { start: "", end: "" }
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link
                href="/issuance"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Activity Logs</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 text-sm font-medium flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                onClick={() => window.print()}
                className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50"
                title="Print"
              >
                <Printer className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
              >
                <DownloadCloud className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          <p className="text-gray-600 max-w-3xl">
            Comprehensive audit trail of all tablet issuance and return activities. Monitor system usage, track participant interactions, and maintain operational transparency.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <History className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Check-outs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.checkouts}</p>
                <p className="text-xs text-emerald-600 mt-2">
                  {stats.checkouts > 0 ? `${Math.round((stats.checkouts / stats.total) * 100)}% of total` : 'No data'}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <LogOut className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Check-ins</p>
                <p className="text-2xl font-bold text-gray-900">{stats.checkins}</p>
                <p className="text-xs text-violet-600 mt-2">
                  {stats.checkins > 0 ? `${Math.round((stats.checkins / stats.total) * 100)}% of total` : 'No data'}
                </p>
              </div>
              <div className="p-3 bg-violet-50 rounded-xl">
                <LogIn className="w-6 h-6 text-violet-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
                <p className="text-xs text-rose-600 mt-2">
                  {stats.errorLogs} errors • {stats.warningLogs} warnings
                </p>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl">
                <TrendingUp className="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Filter Logs</h3>
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <FilterX className="w-4 h-4" />
                Clear all filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search logs..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Type filter */}
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="checkout">Check-outs Only</option>
                <option value="checkin">Check-ins Only</option>
              </select>

              {/* Status filter */}
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="success">Success Only</option>
                <option value="warning">Warning Only</option>
                <option value="error">Error Only</option>
              </select>

              {/* Location filter */}
              <select
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Locations</option>
                {Array.from(new Set(logs.map(l => l.location))).map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              {/* Date range */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                <div className="relative">
                  <CalendarDays className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => setFilters({
                      ...filters, 
                      dateRange: {...filters.dateRange, start: e.target.value}
                    })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Start Date"
                  />
                </div>
                <div className="relative">
                  <CalendarDays className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => setFilters({
                      ...filters, 
                      dateRange: {...filters.dateRange, end: e.target.value}
                    })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="End Date"
                  />
                </div>
              </div>

              {/* Active filters indicator */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  <div className="flex flex-wrap gap-2">
                    {filters.type !== "all" && (
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                        {filters.type === "checkout" ? "Check-outs" : "Check-ins"}
                      </span>
                    )}
                    {filters.status !== "all" && (
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium">
                        {filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}
                      </span>
                    )}
                    {filters.location !== "all" && (
                      <span className="px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg text-xs font-medium">
                        {filters.location}
                      </span>
                    )}
                    {(filters.dateRange.start || filters.dateRange.end) && (
                      <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
                        Date Range
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Activity Records</h3>
            <p className="text-gray-600 text-sm">
              Showing {paginatedLogs.length} of {filteredLogs.length} logs
              {search && ` • "${search}"`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Sort by:{" "}
              <button
                onClick={() => handleSort('timestamp')}
                className="font-medium text-gray-900 hover:text-blue-600 flex items-center gap-1"
              >
                {sortBy === 'timestamp' ? 'Date' : 'Date'}
                {sortBy === 'timestamp' && (
                  <ArrowUpDown className={`w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                )}
              </button>
            </div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [col, order] = e.target.value.split('-');
                setSortBy(col as keyof LogEntry);
                setSortOrder(order as "asc" | "desc");
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="timestamp-desc">Newest First</option>
              <option value="timestamp-asc">Oldest First</option>
              <option value="participantName-asc">Participant A-Z</option>
              <option value="participantName-desc">Participant Z-A</option>
              <option value="tabletId-asc">Tablet ID A-Z</option>
              <option value="tabletId-desc">Tablet ID Z-A</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading activity logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <History className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Participant
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Device
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Time & Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedLogs.map((log) => {
                      const statusConfig = getStatusConfig(log.status);
                      const StatusIcon = statusConfig.icon;
                      
                      return (
                        <tr 
                          key={log.id} 
                          className="hover:bg-gray-50 transition-colors"
                          onClick={() => setSelectedLog(log)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                log.type === 'checkout' 
                                  ? 'bg-blue-50 text-blue-600' 
                                  : 'bg-emerald-50 text-emerald-600'
                              }`}>
                                {log.type === 'checkout' ? (
                                  <LogOut className="w-5 h-5" />
                                ) : (
                                  <LogIn className="w-5 h-5" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {log.type === 'checkout' ? 'Check-out' : 'Check-in'}
                                </div>
                                <div className="text-sm text-gray-500">ID: {log.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{log.participantName}</div>
                                <div className="text-sm text-gray-500">{log.participantId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <Tablet className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{log.tabletId}</div>
                                <div className="text-sm text-gray-500">{log.tabletModel}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">
                                  {new Date(log.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(log.timestamp).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{log.location}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1.5 rounded-full border text-xs font-medium inline-flex items-center gap-1 ${statusConfig.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusConfig.label}
                              </span>
                            </div>
                            {log.duration && (
                              <div className="text-xs text-gray-500 mt-1">
                                Duration: {log.duration}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLog(log);
                              }}
                              className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-lg ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Log Details Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div 
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Log Details</h3>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${
                        selectedLog.type === 'checkout' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {selectedLog.type === 'checkout' ? (
                          <LogOut className="w-6 h-6" />
                        ) : (
                          <LogIn className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">
                          {selectedLog.type === 'checkout' ? 'Tablet Check-out' : 'Tablet Check-in'}
                        </div>
                        <div className="text-sm text-gray-500">ID: {selectedLog.id}</div>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full border text-sm font-medium ${
                      getStatusConfig(selectedLog.status).color
                    }`}>
                      {getStatusConfig(selectedLog.status).label}
                    </div>
                  </div>

                  {/* Grid details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Participant Information</h4>
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{selectedLog.participantName}</div>
                              <div className="text-sm text-gray-500">{selectedLog.participantId}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Tablet Information</h4>
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <Tablet className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{selectedLog.tabletId}</div>
                              <div className="text-sm text-gray-500">{selectedLog.tabletModel}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Activity Details</h4>
                        <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Time</span>
                            <span className="font-medium">
                              {new Date(selectedLog.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Location</span>
                            <span className="font-medium flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {selectedLog.location}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Performed By</span>
                            <span className="font-medium">{selectedLog.performedBy}</span>
                          </div>
                          {selectedLog.duration && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Duration</span>
                              <span className="font-medium">{selectedLog.duration}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Notes</h4>
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-gray-700">{selectedLog.notes}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedLog(null)}
                      className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        handleExport('pdf');
                        setSelectedLog(null);
                      }}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export Log
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}