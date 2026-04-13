"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  Tablet,
  Battery,
  Package,
  Edit2,
  Trash2,
  MoreVertical,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  QrCode,
  Eye,
  Upload,
  BarChart3,
  Grid3x3,
  List,
  Shield,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  HardDrive,
  Cpu,
  MemoryStick,
  Settings,
  User,
  Calendar,
  MapPin,
  ExternalLink,
  FileSpreadsheet,
  Barcode
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import { useTabletStore } from "@/store/tabletStore";
import { TabletDevice } from "@/types/tablets";
import { mockTablets } from "@/data/mockdata";
import { ImportModal } from "@/components/ui/import-modal";
import { importTablets } from "@/lib/import";

const statusOptions = [
  { value: "all", label: "All Tablets", color: "bg-gray-100 text-gray-800", icon: Tablet },
  { value: "available", label: "Available", color: "bg-green-100 text-green-800", icon: CheckCircle },
  { value: "issued", label: "Issued", color: "bg-blue-100 text-blue-800", icon: Package },
  { value: "damaged", label: "Damaged", color: "bg-red-100 text-red-800", icon: AlertCircle },
  { value: "missing", label: "Missing", color: "bg-orange-100 text-orange-800", icon: XCircle },
  { value: "maintenance", label: "Maintenance", color: "bg-yellow-100 text-yellow-800", icon: Settings },
];

const conditionOptions = [
  { value: "all", label: "All Conditions" },
  { value: "excellent", label: "Excellent", color: "bg-green-100 text-green-800" },
  { value: "good", label: "Good", color: "bg-blue-100 text-blue-800" },
  { value: "fair", label: "Fair", color: "bg-yellow-100 text-yellow-800" },
  { value: "poor", label: "Poor", color: "bg-red-100 text-red-800" },
];

const modelOptions = [
  { value: "all", label: "All Models" },
  { value: "Samsung Galaxy Tab A8", label: "Samsung Galaxy Tab A8" },
  { value: "Lenovo Tab M10", label: "Lenovo Tab M10" },
  { value: "iPad 9th Gen", label: "iPad 9th Gen" },
  { value: "Samsung Galaxy Tab S6 Lite", label: "Samsung Galaxy Tab S6 Lite" },
  { value: "Lenovo Tab P11", label: "Lenovo Tab P11" },
];

const viewModes = [
  { id: "list", label: "List", icon: List },
  { id: "grid", label: "Grid", icon: Grid3x3 },
];

const exportOptions = [
  {
    label: "Export All",
    description: "Export complete inventory list",
    format: "CSV",
    icon: FileSpreadsheet,
    href: "/tablets/export/all"
  },
  {
    label: "Export Filtered",
    description: "Export current filtered results",
    format: "CSV",
    icon: Filter,
    href: "/tablets/export/filtered",
    disabled: false
  },
  {
    label: "Export Selected",
    description: "Export selected tablets only",
    format: "CSV",
    icon: CheckCircle,
    href: "/tablets/export/selected",
    disabled: false
  },
  {
    label: "Custom Export",
    description: "Choose fields and format",
    format: "Multiple",
    icon: Settings,
    href: "/tablets/export/custom"
  },
];

export default function TabletsPage() {
  // Get tablets from store
  const { tablets: storeTablets, refreshData, addTablet } = useTabletStore();

  const [tablets, setTablets] = useState<TabletDevice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedModel, setSelectedModel] = useState("all");
  const [selectedTablets, setSelectedTablets] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof TabletDevice; direction: 'asc' | 'desc' } | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Memoized filtered tablets
  const filteredTablets = useMemo(() => {
    let filtered = storeTablets;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.deviceId.toLowerCase().includes(query) ||
        t.model.toLowerCase().includes(query) ||
        (t.assignedTo?.toLowerCase() || '').includes(query) ||
        t.location.toLowerCase().includes(query)
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(t => t.status === selectedStatus);
    }

    if (selectedCondition !== "all") {
      filtered = filtered.filter(t => t.condition === selectedCondition);
    }

    if (selectedModel !== "all") {
      filtered = filtered.filter(t => t.model === selectedModel);
    }

    // Apply sorting
    if (sortConfig !== null) {
      const config = sortConfig;
      filtered.sort((a, b) => {
        const aValue = a[config.key];
        const bValue = b[config.key];

        // Handle null/undefined values
        if (aValue == null || bValue == null) {
          if (aValue == null && bValue == null) return 0;
          if (aValue == null) return 1;
          if (bValue == null) return -1;
        }

        if (aValue < bValue) return config.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return config.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;

  }, [storeTablets, searchQuery, selectedStatus, selectedCondition, selectedModel, sortConfig]);

  // Paginate results
  const paginatedTablets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTablets.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTablets, currentPage]);

  useEffect(() => {
    setTablets(paginatedTablets);
  }, [paginatedTablets]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedCondition, selectedModel]);

  const handleSort = (key: keyof TabletDevice) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = () => {
    if (selectedTablets.length === tablets.length) {
      setSelectedTablets([]);
    } else {
      setSelectedTablets(tablets.map(t => t.id));
    }
  };

  const handleSelectTablet = (id: string) => {
    setSelectedTablets(prev =>
      prev.includes(id)
        ? prev.filter(tId => tId !== id)
        : [...prev, id]
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExportClick = () => {
    setShowExportMenu(!showExportMenu);
  };

  const handleExport = (type: string) => {
    console.log(`Exporting ${type}...`);
    setShowExportMenu(false);
  };

  const handleQuickExport = () => {
    const dataToExport = filteredTablets;
    console.log("Quick exporting data:", dataToExport.length, "items");
    // In a real app, this would trigger a download or open export modal
  };

  const totalPages = Math.ceil(filteredTablets.length / itemsPerPage);

  const stats = {
    total: storeTablets.length,
    available: storeTablets.filter(t => t.status === 'available').length,
    issued: storeTablets.filter(t => t.status === 'issued').length,
    damaged: storeTablets.filter(t => t.status === 'damaged').length,
    missing: storeTablets.filter(t => t.status === 'missing').length,
    maintenance: storeTablets.filter(t => t.status === 'maintenance').length,
    byCondition: conditionOptions.slice(1).map(condition => ({
      ...condition,
      count: storeTablets.filter((t: TabletDevice) => t.condition === condition.value).length
    })),
    byModel: Array.from(new Set(storeTablets.map(t => t.model))).map(model => ({
      model,
      count: storeTablets.filter(t => t.model === model).length
    })),
    batteryAverage: storeTablets.length > 0 ? Math.round(storeTablets.reduce((acc, t) => acc + t.battery, 0) / storeTablets.length) : 0,
    lowBattery: storeTablets.filter(t => t.battery < 30).length,
  };

  const getStatusIcon = (status: TabletDevice['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-3 h-3" />;
      case 'issued':
        return <Package className="w-3 h-3" />;
      case 'damaged':
        return <AlertCircle className="w-3 h-3" />;
      case 'missing':
        return <XCircle className="w-3 h-3" />;
      case 'maintenance':
        return <Settings className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: TabletDevice['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'issued':
        return 'bg-blue-100 text-blue-800';
      case 'damaged':
        return 'bg-red-100 text-red-800';
      case 'missing':
        return 'bg-orange-100 text-orange-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 70) return 'text-green-600';
    if (battery > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConditionColor = (condition: TabletDevice['condition']) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
    }
  };

  const bulkActions = [
    { label: "Assign Tablets", icon: Package, color: "bg-blue-500 hover:bg-blue-600" },
    { label: "Export List", icon: Download, color: "bg-gray-800 hover:bg-gray-900", onClick: handleQuickExport },
    { label: "Mark for Maintenance", icon: Settings, color: "bg-yellow-500 hover:bg-yellow-600" },
    { label: "Update Status", icon: RefreshCw, color: "bg-purple-500 hover:bg-purple-600" },
    { label: "Delete Selected", icon: Trash2, color: "bg-red-500 hover:bg-red-600" },
  ];

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tablets</h1>
            <p className="text-sm text-gray-600">Manage tablet inventory and assignments</p>
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

            {/* Export Button with Dropdown */}
            <div className="relative">
              <button
                onClick={handleExportClick}
                className="flex items-center px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm"
              >
                <Download className="w-4 h-4 mr-1.5" />
                Export
                <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
              </button>

              {showExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">Export Options</p>
                        <p className="text-xs text-gray-500 mt-0.5">Choose export type</p>
                      </div>
                      <div className="py-1">
                        {exportOptions.map((option, index) => (
                          <Link
                            key={index}
                            href={option.href}
                            className={cn(
                              "flex items-start px-3 py-2 hover:bg-gray-50 rounded-md transition-colors",
                              option.disabled && "opacity-50 cursor-not-allowed"
                            )}
                            onClick={() => setShowExportMenu(false)}
                          >
                            <div className="mr-3 mt-0.5">
                              <option.icon className="w-4 h-4 text-gray-500" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">{option.label}</span>
                                <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">
                                  {option.format}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>


            <Link
              href="/tablets/new"
              className="flex items-center px-3 py-2 bg-knbs-500 hover:bg-knbs-600 text-white rounded-lg text-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Tablet
            </Link>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
            >
              <Upload className="w-4 h-4 mr-1.5" />
              Import CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <Tablet className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-xl font-bold text-green-600 mt-1">{stats.available}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Issued</p>
                <p className="text-xl font-bold text-blue-600 mt-1">{stats.issued}</p>
              </div>
              <Package className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Damaged</p>
                <p className="text-xl font-bold text-red-600 mt-1">{stats.damaged}</p>
              </div>
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Missing</p>
                <p className="text-xl font-bold text-orange-600 mt-1">{stats.missing}</p>
              </div>
              <XCircle className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Battery Avg.</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{stats.batteryAverage}%</p>
              </div>
              <Battery className="w-5 h-5 text-gray-400" />
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
                  placeholder="Search by device ID, model, assigned to, or location..."
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
                {(selectedStatus !== "all" || selectedCondition !== "all" || selectedModel !== "all") && (
                  <span className="ml-1.5 w-2 h-2 rounded-full bg-knbs-500"></span>
                )}
              </button>

            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedStatus(option.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedStatus === option.value
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-knbs-500 focus:border-transparent text-sm"
                  >
                    {conditionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-knbs-500 focus:border-transparent text-sm"
                  >
                    {modelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  {filteredTablets.length} of {mockTablets.length} tablets
                </div>
                <button
                  onClick={() => {
                    setSelectedStatus("all");
                    setSelectedCondition("all");
                    setSelectedModel("all");
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
        {selectedTablets.length > 0 && (
          <div className="bg-knbs-50 border border-knbs-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Tablet className="w-4 h-4 text-knbs-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedTablets.length} tablet{selectedTablets.length > 1 ? 's' : ''} selected
                  </p>
                  <p className="text-xs text-gray-600">Apply actions to selected tablets</p>
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

        {/* Tablets Table/Grid */}
        {viewMode === "list" ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedTablets.length === tablets.length && tablets.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-knbs-600 focus:ring-knbs-500 h-4 w-4"
                      />
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('deviceId')}
                    >
                      <div className="flex items-center">
                        Device ID
                        {sortConfig?.key === 'deviceId' && (
                          <ChevronDown className={`w-3 h-3 ml-1 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Model & Specs
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Battery
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tablets.map((tablet) => (
                    <tr
                      key={tablet.id}
                      className={cn(
                        "hover:bg-gray-50",
                        selectedTablets.includes(tablet.id) && "bg-knbs-50"
                      )}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedTablets.includes(tablet.id)}
                          onChange={() => handleSelectTablet(tablet.id)}
                          className="rounded border-gray-300 text-knbs-600 focus:ring-knbs-500 h-4 w-4"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{tablet.deviceId}</div>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <HardDrive className="w-3 h-3 mr-1" />
                            {tablet.storage}
                            <span className="mx-1">•</span>
                            <MemoryStick className="w-3 h-3 mr-1" />
                            {tablet.ram}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{tablet.model}</div>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Cpu className="w-3 h-3 mr-1" />
                            {tablet.os}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tablet.status)}`}>
                            {getStatusIcon(tablet.status)}
                            <span className="ml-1 capitalize">{tablet.status}</span>
                          </div>
                          <div className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getConditionColor(tablet.condition)}`}>
                            {tablet.condition}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Battery className={`w-4 h-4 mr-2 ${getBatteryColor(tablet.battery)}`} />
                          <div>
                            <div className={`text-sm font-medium ${getBatteryColor(tablet.battery)}`}>
                              {tablet.battery}%
                            </div>
                            <div className="text-xs text-gray-500">
                              Last: {new Date(tablet.lastSeen).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {tablet.assignedTo ? (
                          <div>
                            <div className="flex items-center text-sm font-medium text-gray-900">
                              <User className="w-3 h-3 mr-1.5 text-gray-400" />
                              {tablet.assignedTo}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{tablet.assignedActivity}</div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Not assigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{tablet.location}</div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          Purchased {tablet.purchaseDate}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1">
                          <Link
                            href={`/tablets/${tablet.id}`}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/tablets/${tablet.id}/edit`}
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
            {tablets.length === 0 && (
              <div className="text-center py-12">
                <Tablet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No tablets found</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {searchQuery ? "Try adjusting your search" : "Add your first tablet to inventory"}
                </p>
                <div className="space-x-3">
                  <Link
                    href="/tablets/new"
                    className="inline-flex items-center px-4 py-2 bg-knbs-500 text-white rounded-lg text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Tablet
                  </Link>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {filteredTablets.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-gray-500 mb-2 sm:mb-0">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTablets.length)} of {filteredTablets.length} tablets
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tablets.map((tablet) => (
              <div
                key={tablet.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{tablet.deviceId}</div>
                    <div className="text-xs text-gray-500">{tablet.model}</div>
                  </div>
                  <div className={`p-1.5 rounded ${getStatusColor(tablet.status)}`}>
                    {getStatusIcon(tablet.status)}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Battery className={`w-4 h-4 mr-2 ${getBatteryColor(tablet.battery)}`} />
                      <span className={`text-sm font-medium ${getBatteryColor(tablet.battery)}`}>
                        {tablet.battery}%
                      </span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getConditionColor(tablet.condition)}`}>
                      {tablet.condition}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <HardDrive className="w-3 h-3 mr-2" />
                    {tablet.storage} • {tablet.ram}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Cpu className="w-3 h-3 mr-2" />
                    {tablet.os}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-3 h-3 mr-2" />
                    {tablet.assignedTo || "Unassigned"}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-3 h-3 mr-2" />
                    {tablet.location}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Last seen: {new Date(tablet.lastSeen).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Link
                      href={`/tablets/${tablet.id}`}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/tablets/${tablet.id}/edit`}
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
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Tablets by Status</h3>
              <BarChart3 className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-3">
              {statusOptions.slice(1).map((status) => (
                <div key={status.value} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${status.value === 'available' ? 'bg-green-500' :
                      status.value === 'issued' ? 'bg-blue-500' :
                        status.value === 'damaged' ? 'bg-red-500' :
                          status.value === 'missing' ? 'bg-orange-500' :
                            'bg-yellow-500'
                      }`}></div>
                    <span className="text-sm text-gray-600">{status.label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {stats[status.value as keyof typeof stats] as number}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Tablets by Model</h3>
              <Smartphone className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-3">
              {stats.byModel.slice(0, 4).map((model) => (
                <div key={model.model} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate">{model.model}</span>
                  <span className="text-sm font-medium text-gray-900">{model.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Quick Actions</h3>
              <Sparkles className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-2">
              <Link
                href="/tablets/import"
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-900">Import Tablets</span>
                <Upload className="w-4 h-4 text-gray-400" />
              </Link>
              <Link
                href="/tablets/export"
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-900">Advanced Export</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </Link>

            </div>
          </div>
        </div>
      </div>

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={(data) => {
          // Add imported tablets to store
          data.forEach((tablet) => {
            addTablet(tablet as TabletDevice);
          });
        }}
        type="tablets"
        importFunction={importTablets}
      />
    </Layout>
  );
}