// app/participants/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
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
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "active" | "inactive" | "pending";
  activity: string;
  tabletsIssued: number;
  lastActivity: string;
  contractStatus: "active" | "expired" | "none";
  joinDate: string;
  role?: string;
}

const mockParticipants: Participant[] = [
  {
    id: "P001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+254 712 345 678",
    location: "Nairobi",
    status: "active",
    activity: "Household Survey",
    tabletsIssued: 2,
    lastActivity: "2024-01-15",
    contractStatus: "active",
    joinDate: "2023-11-20",
    role: "Field Officer"
  },
  {
    id: "P002",
    name: "Mary Wilson",
    email: "mary.w@example.com",
    phone: "+254 723 456 789",
    location: "Mombasa",
    status: "active",
    activity: "Agricultural Census",
    tabletsIssued: 1,
    lastActivity: "2024-01-14",
    contractStatus: "active",
    joinDate: "2023-10-15",
    role: "Supervisor"
  },
  {
    id: "P003",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    phone: "+254 734 567 890",
    location: "Kisumu",
    status: "pending",
    activity: "Business Survey",
    tabletsIssued: 0,
    lastActivity: "2024-01-10",
    contractStatus: "none",
    joinDate: "2024-01-05",
    role: "Enumerator"
  },
  {
    id: "P004",
    name: "Sarah Chen",
    email: "sarah.c@example.com",
    phone: "+254 745 678 901",
    location: "Nakuru",
    status: "active",
    activity: "Household Survey",
    tabletsIssued: 3,
    lastActivity: "2024-01-13",
    contractStatus: "active",
    joinDate: "2023-09-12",
    role: "Team Lead"
  },
  {
    id: "P005",
    name: "David Kimani",
    email: "david.k@example.com",
    phone: "+254 756 789 012",
    location: "Eldoret",
    status: "inactive",
    activity: "Population Census",
    tabletsIssued: 1,
    lastActivity: "2023-12-20",
    contractStatus: "expired",
    joinDate: "2023-08-25",
    role: "Field Officer"
  },
  {
    id: "P006",
    name: "Grace Omondi",
    email: "grace.o@example.com",
    phone: "+254 767 890 123",
    location: "Nairobi",
    status: "active",
    activity: "Health Survey",
    tabletsIssued: 2,
    lastActivity: "2024-01-12",
    contractStatus: "active",
    joinDate: "2023-12-01",
    role: "Data Collector"
  },
  {
    id: "P007",
    name: "Peter Mbogo",
    email: "peter.m@example.com",
    phone: "+254 778 901 234",
    location: "Kisii",
    status: "pending",
    activity: "Education Survey",
    tabletsIssued: 0,
    lastActivity: "2024-01-09",
    contractStatus: "none",
    joinDate: "2024-01-08",
    role: "Enumerator"
  },
  {
    id: "P008",
    name: "Lucy Wanjiku",
    email: "lucy.w@example.com",
    phone: "+254 789 012 345",
    location: "Thika",
    status: "active",
    activity: "Agricultural Census",
    tabletsIssued: 1,
    lastActivity: "2024-01-14",
    contractStatus: "active",
    joinDate: "2023-11-30",
    role: "Field Officer"
  },
];

const statusOptions = [
  { value: "all", label: "All Status", color: "bg-gray-100 text-gray-800", icon: Users },
  { value: "active", label: "Active", color: "bg-green-100 text-green-800", icon: CheckCircle },
  { value: "inactive", label: "Inactive", color: "bg-red-100 text-red-800", icon: XCircle },
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
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
  const [selectedActivity, setSelectedActivity] = useState("all");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Participant; direction: 'asc' | 'desc' } | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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
        p.role?.toLowerCase().includes(query)
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    if (selectedActivity !== "all") {
      filtered = filtered.filter(p => p.activity === selectedActivity);
    }

  
 // Apply sorting
  if (sortConfig !== null) {
  filtered.sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    // Handle undefined values
    if (aValue === undefined || bValue === undefined) {
      // Put undefined values at the end
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1; // undefined goes last
      if (bValue === undefined) return -1; // undefined goes last
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

return filtered;

  }, [searchQuery, selectedStatus, selectedActivity, sortConfig]);

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
    withContracts: mockParticipants.filter(p => p.contractStatus === 'active').length,
    byActivity: activityOptions.slice(1).map(activity => ({
      ...activity,
      count: mockParticipants.filter(p => p.activity === activity.value).length
    })),
    byLocation: Array.from(new Set(mockParticipants.map(p => p.location))).map(location => ({
      location,
      count: mockParticipants.filter(p => p.location === location).length
    }))
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

  const bulkActions = [
    { label: "Send Email", icon: Send, color: "bg-blue-500 hover:bg-blue-600" },
    { label: "Export Selected", icon: Download, color: "bg-gray-800 hover:bg-gray-900" },
    { label: "Assign Contract", icon: FileText, color: "bg-purple-500 hover:bg-purple-600" },
    { label: "Issue Tablets", icon: Package, color: "bg-green-500 hover:bg-green-600" },
    { label: "Delete Selected", icon: Trash2, color: "bg-red-500 hover:bg-red-600" },
  ];

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Participants</h1>
            <p className="text-sm text-gray-600">Manage all survey participants</p>
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
            <button className="flex items-center px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm">
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </button>
            <Link
              href="/participants/new"
              className="flex items-center px-3 py-2 bg-knbs-500 hover:bg-knbs-600 text-white rounded-lg text-sm"
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
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-bold text-green-600 mt-1">{stats.active}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contracts</p>
                <p className="text-xl font-bold text-blue-600 mt-1">{stats.withContracts}</p>
              </div>
              <FileText className="w-5 h-5 text-blue-400" />
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
                  placeholder="Search participants..."
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
                {(selectedStatus !== "all" || selectedActivity !== "all") && (
                  <span className="ml-1.5 w-2 h-2 rounded-full bg-knbs-500"></span>
                )}
              </button>

              {/* More Actions */}
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
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
                    setSelectedActivity("all");
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear filters
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
                      Activity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tablets
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
                        selectedParticipants.includes(participant.id) && "bg-knbs-50"
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
                              {participant.location}
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
                        <div className="text-sm text-gray-900">{participant.activity}</div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          Joined {participant.joinDate}
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
                          <div className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getContractStatusColor(participant.contractStatus)}`}>
                            {participant.contractStatus === 'none' ? 'No Contract' : participant.contractStatus}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{participant.tabletsIssued}</div>
                        <div className="text-xs text-gray-500">tablets</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1">
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
                className="bg-white rounded-lg border border-gray-200 p-4"
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
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{participant.activity}</p>
                    <p className="text-xs text-gray-500">{participant.tabletsIssued} tablets</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getContractStatusColor(participant.contractStatus)}`}>
                    {participant.contractStatus === 'none' ? 'No Contract' : participant.contractStatus}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <Link
                    href={`/participants/${participant.id}`}
                    className="text-sm text-knbs-600 hover:text-knbs-700"
                  >
                    View →
                  </Link>
                  <div className="flex items-center space-x-1">
                    <Link
                      href={`/participants/${participant.id}/edit`}
                      className="p-1 text-gray-400 hover:text-knbs-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
            <h3 className="text-sm font-medium text-gray-900 mb-3">Participants by Location</h3>
            <div className="space-y-3">
              {stats.byLocation.map((location) => (
                <div key={location.location} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{location.location}</span>
                  <span className="font-medium text-gray-900">{location.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/participants/import"
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-900">Import Participants</span>
                <Download className="w-4 h-4 text-gray-400" />
              </Link>
              <Link
                href="/contracts/new"
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-900">Create Contract</span>
                <FileText className="w-4 h-4 text-gray-400" />
              </Link>
              <Link
                href="/issuance/bulk"
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-900">Bulk Issuance</span>
                <Package className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}