"use client";

import { Suspense, useMemo, useState } from "react";
import { 
  Download, Filter, ChevronLeft, RefreshCw, 
  Save, Eye, Trash2, Clock, BarChart, 
  Layers, ToggleLeft, ToggleRight, X,
  Search, CheckCircle, AlertCircle, Settings
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";
import { TabletDevice } from "@/types/tablets";
import { useTabletStore } from "@/store/tabletStore";

// Saved filters templates
const savedFilters = [
  { id: 1, name: "Available Tablets", count: 87, color: "bg-green-100 text-green-800" },
  { id: 2, name: "Field Team Devices", count: 45, color: "bg-blue-100 text-blue-800" },
  { id: 3, name: "Maintenance Required", count: 12, color: "bg-yellow-100 text-yellow-800" },
  { id: 4, name: "Low Battery (<30%)", count: 8, color: "bg-red-100 text-red-800" },
  { id: 5, name: "Warranty Expiring", count: 5, color: "bg-purple-100 text-purple-800" },
];

function ExportFiltered() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeFilters, setActiveFilters] = useState(() => {
    const status = searchParams.get('status');
    const condition = searchParams.get('condition');
    const search = searchParams.get('search');

    return {
      search: search || "",
      status: status ? [status] : ([] as string[]),
      condition: condition ? [condition] : ([] as string[]),
      batteryRange: [0, 100] as [number, number],
      location: [] as string[],
      assigned: "all" as "all" | "assigned" | "unassigned",
      dateRange: { start: "", end: "" },
    };
  });

  const filteredData = useMemo(() => {
    const { tablets: storeTablets } = useTabletStore();
    let result = [...storeTablets];

    // Search filter
    if (activeFilters.search) {
      const query = activeFilters.search.toLowerCase();
      result = result.filter(t =>
        t.deviceId.toLowerCase().includes(query) ||
        t.model.toLowerCase().includes(query) ||
        (t.assignedTo?.toLowerCase() || '').includes(query) ||
        t.location.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (activeFilters.status.length > 0) {
      result = result.filter(t => activeFilters.status.includes(t.status));
    }

    // Condition filter
    if (activeFilters.condition.length > 0) {
      result = result.filter(t => activeFilters.condition.includes(t.condition));
    }

    // Battery range filter
    result = result.filter(t =>
      t.battery >= activeFilters.batteryRange[0] &&
      t.battery <= activeFilters.batteryRange[1]
    );

    // Assignment filter
    if (activeFilters.assigned === "assigned") {
      result = result.filter(t => t.assignedTo !== null);
    } else if (activeFilters.assigned === "unassigned") {
      result = result.filter(t => t.assignedTo === null);
    }

    return result;
  }, [activeFilters]);
  const [savedFilterName, setSavedFilterName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);

  const handleSaveFilter = () => {
    if (savedFilterName.trim()) {
      // In real app, save to backend
      alert(`Filter "${savedFilterName}" saved successfully!`);
      setShowSaveDialog(false);
      setSavedFilterName("");
    }
  };

  const handleLoadFilter = (filterName: string) => {
    // In real app, load from saved filters
    alert(`Loading filter: ${filterName}`);
  };

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export
    setTimeout(() => {
      setIsExporting(false);
      alert(`Exported ${filteredData.length} records as ${exportFormat.toUpperCase()}`);
    }, 2000);
  };

  const tablets = useTabletStore((s) => s.tablets);
  const statusOptions = ['available', 'issued', 'damaged', 'missing', 'maintenance'];
  const conditionOptions = ['excellent', 'good', 'fair', 'poor'];
  const locationOptions = Array.from(new Set((tablets || []).map(t => t.location)));

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/tablets/export"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Export Filtered Data</h1>
              <p className="text-gray-600">Apply complex filters and export results</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.refresh()}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <Link
              href="/tablets"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm"
            >
              Back to Tablets
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Filters */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search tablets..."
                  value={activeFilters.search}
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Filter */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                  <Layers className="w-5 h-5 mr-2" />
                  Status
                </h3>
                <div className="space-y-2">
                  {statusOptions.map(status => (
                    <label
                      key={status}
                      className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={activeFilters.status.includes(status)}
                        onChange={(e) => {
                          setActiveFilters(prev => ({
                            ...prev,
                            status: e.target.checked
                              ? [...prev.status, status]
                              : prev.status.filter(s => s !== status)
                          }));
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-3 text-sm text-gray-700 capitalize">{status}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        ({tablets.filter(t => t.status === status).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition Filter */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                  <ToggleRight className="w-5 h-5 mr-2" />
                  Condition
                </h3>
                <div className="space-y-2">
                  {conditionOptions.map(condition => (
                    <label
                      key={condition}
                      className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={activeFilters.condition.includes(condition)}
                        onChange={(e) => {
                          setActiveFilters(prev => ({
                            ...prev,
                            condition: e.target.checked
                              ? [...prev.condition, condition]
                              : prev.condition.filter(c => c !== condition)
                          }));
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-3 text-sm text-gray-700 capitalize">{condition}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        ({tablets.filter(t => t.condition === condition).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Battery Range */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">Battery Level</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{activeFilters.batteryRange[0]}%</span>
                    <span>{activeFilters.batteryRange[1]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeFilters.batteryRange[0]}
                    onChange={(e) => setActiveFilters(prev => ({
                      ...prev,
                      batteryRange: [parseInt(e.target.value), prev.batteryRange[1]]
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeFilters.batteryRange[1]}
                    onChange={(e) => setActiveFilters(prev => ({
                      ...prev,
                      batteryRange: [prev.batteryRange[0], parseInt(e.target.value)]
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-center">
                    <span className="text-sm font-medium text-gray-900">
                      {activeFilters.batteryRange[0]}% - {activeFilters.batteryRange[1]}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Assignment Filter */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">Assignment</h3>
                <div className="space-y-3">
                  {(["all", "assigned", "unassigned"] as const).map(option => (
                    <label
                      key={option}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="assignment"
                        checked={activeFilters.assigned === option}
                        onChange={() => setActiveFilters(prev => ({ ...prev, assigned: option }))}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-3 text-sm text-gray-700 capitalize">{option}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        {option === 'all' && `(${tablets.length})`}
                        {option === 'assigned' && `(${tablets.filter(t => t.assignedTo).length})`}
                        {option === 'unassigned' && `(${tablets.filter(t => !t.assignedTo).length})`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Active Filters</h3>
                <button
                  onClick={() => setActiveFilters({
                    search: "",
                    status: [],
                    condition: [],
                    batteryRange: [0, 100],
                    location: [],
                    assigned: "all",
                    dateRange: { start: "", end: "" },
                  })}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear all
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {activeFilters.search && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Search: {activeFilters.search}
                    <button
                      onClick={() => setActiveFilters(prev => ({ ...prev, search: "" }))}
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {activeFilters.status.map(status => (
                  <span key={status} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    Status: {status}
                    <button
                      onClick={() => setActiveFilters(prev => ({
                        ...prev,
                        status: prev.status.filter(s => s !== status)
                      }))}
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                
                {activeFilters.batteryRange[0] > 0 || activeFilters.batteryRange[1] < 100 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                    Battery: {activeFilters.batteryRange[0]}% - {activeFilters.batteryRange[1]}%
                    <button
                      onClick={() => setActiveFilters(prev => ({
                        ...prev,
                        batteryRange: [0, 100]
                      }))}
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ) : null}
                
                {activeFilters.assigned !== "all" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                    {activeFilters.assigned === "assigned" ? "Assigned Only" : "Unassigned Only"}
                    <button
                      onClick={() => setActiveFilters(prev => ({ ...prev, assigned: "all" }))}
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="space-y-6">
            {/* Results Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Results Preview</h2>
              
              <div className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{filteredData.length}</div>
                  <div className="text-gray-600">Tablets Match Filters</div>
                  <div className="text-sm text-gray-500 mt-2">
                    {filteredData.length} of {tablets.length} total tablets
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estimated Size:</span>
                    <span className="font-medium">
                      {(filteredData.length * 0.035).toFixed(1)} MB
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Format:</span>
                    <select
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="border-0 bg-transparent font-medium focus:ring-0"
                    >
                      <option value="csv">CSV</option>
                      <option value="excel">Excel</option>
                      <option value="pdf">PDF</option>
                      <option value="json">JSON</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Updated:</span>
                    <span className="font-medium">Just now</span>
                  </div>
                </div>
                
                  <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-900 mb-3">Preview Data:</div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredData.slice(0, 5).map(tablet => (
                      <div
                        key={tablet.id}
                        className="p-3 bg-gray-50 rounded-lg text-sm"
                      >
                        <div className="font-medium">{tablet.deviceId}</div>
                        <div className="text-gray-600">{tablet.model}</div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs capitalize">{tablet.status}</span>
                          <span className="text-xs">{tablet.battery}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Export Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Export Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={handleExport}
                  disabled={isExporting || filteredData.length === 0}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg flex items-center justify-center disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Export {filteredData.length} Records
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save This Filter
                </button>
                
                <button
                  onClick={() => router.push(`/tablets?filters=${encodeURIComponent(JSON.stringify(activeFilters))}`)}
                  className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  View in Tablets Page
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm font-medium text-gray-900 mb-3">Quick Export Formats</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setExportFormat('csv');
                      handleExport();
                    }}
                    className="p-2 border border-gray-200 rounded text-xs hover:bg-gray-50"
                  >
                    CSV Export
                  </button>
                  <button
                    onClick={() => {
                      setExportFormat('pdf');
                      handleExport();
                    }}
                    className="p-2 border border-gray-200 rounded text-xs hover:bg-gray-50"
                  >
                    PDF Report
                  </button>
                </div>
              </div>
            </div>

            {/* Saved Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Saved Filters
              </h3>
              <div className="space-y-3">
                {savedFilters.map(filter => (
                  <div
                    key={filter.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group"
                    onClick={() => handleLoadFilter(filter.name)}
                  >
                    <div>
                      <div className="font-medium text-gray-900">{filter.name}</div>
                      <div className="text-sm text-gray-600">{filter.count} tablets</div>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadFilter(filter.name);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Load Filter"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Delete filter
                        }}
                        className="p-1 hover:bg-red-50 text-red-600 rounded"
                        title="Delete Filter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Filter Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Save Filter</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter Name
                  </label>
                  <input
                    type="text"
                    value={savedFilterName}
                    onChange={(e) => setSavedFilterName(e.target.value)}
                    placeholder="e.g., Available Tablets in Nairobi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowSaveDialog(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveFilter}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function ExportFilteredWithSuspense() {
  return <Suspense fallback={<div className="p-8">Loading…</div>}><ExportFiltered /></Suspense>;
}
