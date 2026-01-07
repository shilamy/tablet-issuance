"use client";

import { useState, useEffect } from "react";
import { 
  Download, CheckSquare, ChevronLeft, RefreshCw, 
  Eye, Trash2, Filter, Plus, X, Search,
  Users, MapPin, Battery, Package, Tablet,
  BarChart, Clipboard, Share2, Mail, Cloud,
  CheckCircle, AlertCircle, Clock, Settings
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { TabletDevice } from "@/types/tablet";

// Mock data
const mockTablets: TabletDevice[] = [
  // ... (same as your main tablets page)
];

export default function ExportSelected() {
  const router = useRouter();
  const [selectedTablets, setSelectedTablets] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportOptions, setExportOptions] = useState({
    includeDetails: true,
    includeHistory: false,
    compress: true,
    emailCopy: false,
    watermark: true,
  });
  const [bulkActions, setBulkActions] = useState<string[]>([]);
  const [showSelectionPanel, setShowSelectionPanel] = useState(false);

  // Load selected tablets from localStorage/session
  useEffect(() => {
    const saved = localStorage.getItem('selectedTablets');
    if (saved) {
      setSelectedTablets(JSON.parse(saved));
    }
  }, []);

  // Save selected tablets
  useEffect(() => {
    localStorage.setItem('selectedTablets', JSON.stringify(selectedTablets));
  }, [selectedTablets]);

  const filteredTablets = mockTablets.filter(tablet =>
    selectedTablets.includes(tablet.id) &&
    (searchQuery === "" ||
      tablet.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tablet.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tablet.assignedTo?.toLowerCase() || '').includes(searchQuery.toLowerCase()))
  );

  const handleSelectAll = () => {
    if (selectedTablets.length === mockTablets.length) {
      setSelectedTablets([]);
    } else {
      setSelectedTablets(mockTablets.map(t => t.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedTablets(prev =>
      prev.includes(id)
        ? prev.filter(tId => tId !== id)
        : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    setBulkActions(prev => [...prev, action]);
    // Apply action to selected tablets
    alert(`Applying "${action}" to ${selectedTablets.length} tablets...`);
  };

  const handleExport = () => {
    if (selectedTablets.length === 0) {
      alert("Please select tablets to export");
      return;
    }

    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const filename = `selected-tablets-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      alert(`Exported ${selectedTablets.length} tablets to ${filename}`);
    }, 2000);
  };

  const handleShareExport = () => {
    const data = {
      tablets: selectedTablets,
      format: exportFormat,
      options: exportOptions,
      timestamp: new Date().toISOString(),
    };
    const encoded = btoa(JSON.stringify(data));
    const shareUrl = `${window.location.origin}/tablets/export/share?data=${encoded}`;
    
    navigator.clipboard.writeText(shareUrl);
    alert("Share link copied to clipboard!");
  };

  const bulkActionsList = [
    { id: 'assign', label: 'Assign to Team', icon: Users, color: 'bg-blue-100 text-blue-700' },
    { id: 'transfer', label: 'Transfer Location', icon: MapPin, color: 'bg-green-100 text-green-700' },
    { id: 'maintenance', label: 'Schedule Maintenance', icon: Settings, color: 'bg-yellow-100 text-yellow-700' },
    { id: 'update', label: 'Update Status', icon: RefreshCw, color: 'bg-purple-100 text-purple-700' },
    { id: 'export', label: 'Quick Export', icon: Download, color: 'bg-indigo-100 text-indigo-700' },
  ];

  const formatOptions = [
    { id: 'csv', label: 'CSV', description: 'For Excel analysis', icon: Clipboard },
    { id: 'excel', label: 'Excel', description: 'Native .xlsx format', icon: BarChart },
    { id: 'pdf', label: 'PDF', description: 'Formatted report', icon: FileText },
    { id: 'json', label: 'JSON', description: 'API/Developer use', icon: Code },
  ];

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
              <h1 className="text-2xl font-bold text-gray-900">Export Selected Tablets</h1>
              <p className="text-gray-600">Select specific tablets for export and bulk actions</p>
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
              View All Tablets
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{selectedTablets.length}</div>
                <div className="text-sm text-gray-600">Selected</div>
              </div>
              <div className="h-12 w-px bg-blue-200"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{mockTablets.length}</div>
                <div className="text-sm text-gray-600">Total Available</div>
              </div>
              <div className="h-12 w-px bg-blue-200"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {selectedTablets.length > 0 ? 
                    `${Math.round((selectedTablets.length / mockTablets.length) * 100)}%` : 
                    '0%'
                  }
                </div>
                <div className="text-sm text-gray-600">Of Inventory</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSelectAll}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedTablets.length === mockTablets.length
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {selectedTablets.length === mockTablets.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                onClick={() => setSelectedTablets([])}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Selection Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="search"
                      placeholder="Search selected tablets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowSelectionPanel(!showSelectionPanel)}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add More
                </button>
              </div>
            </div>

            {/* Selected Tablets List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Selected Tablets</h3>
                  <span className="text-sm text-gray-600">
                    {filteredTablets.length} items
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
                {filteredTablets.length === 0 ? (
                  <div className="p-12 text-center">
                    <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No tablets selected</h4>
                    <p className="text-gray-600 mb-6">Select tablets from the inventory to export</p>
                    <Link
                      href="/tablets"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Browse Tablets
                    </Link>
                  </div>
                ) : (
                  filteredTablets.map((tablet) => (
                    <div
                      key={tablet.id}
                      className="p-4 hover:bg-gray-50 flex items-center"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTablets.includes(tablet.id)}
                        onChange={() => handleToggleSelect(tablet.id)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{tablet.deviceId}</div>
                            <div className="text-sm text-gray-600">{tablet.model}</div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              tablet.status === 'available' ? 'bg-green-100 text-green-800' :
                              tablet.status === 'issued' ? 'bg-blue-100 text-blue-800' :
                              tablet.status === 'damaged' ? 'bg-red-100 text-red-800' :
                              tablet.status === 'missing' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {tablet.status}
                            </span>
                            <span className="text-sm text-gray-600">{tablet.battery}%</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">
                              {tablet.assignedTo || 'Unassigned'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">{tablet.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Package className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-600 capitalize">{tablet.condition}</span>
                          </div>
                          <div className="flex items-center">
                            <Battery className="w-4 h-4 text-gray-400 mr-2" />
                            <span className={`font-medium ${
                              tablet.battery > 70 ? 'text-green-600' :
                              tablet.battery > 30 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {tablet.battery}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleToggleSelect(tablet.id)}
                        className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedTablets.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">Bulk Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {bulkActionsList.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleBulkAction(action.label)}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center ${action.color} hover:opacity-90 transition-opacity`}
                    >
                      <action.icon className="w-5 h-5 mb-2" />
                      <span className="text-xs font-medium text-center">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Export Configuration */}
          <div className="space-y-6">
            {/* Export Configuration */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Export Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {formatOptions.map((format) => (
                      <button
                        key={format.id}
                        onClick={() => setExportFormat(format.id)}
                        className={`p-3 rounded-lg border ${
                          exportFormat === format.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{format.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{format.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Options
                  </label>
                  <div className="space-y-3">
                    {Object.entries(exportOptions).map(([key, value]) => (
                      <label
                        key={key}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setExportOptions(prev => ({
                              ...prev,
                              [key]: e.target.checked
                            }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <span className="ml-3 text-sm text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {key === 'includeDetails' && 'Full details'}
                          {key === 'includeHistory' && 'With history'}
                          {key === 'compress' && 'ZIP file'}
                          {key === 'emailCopy' && 'Send email'}
                          {key === 'watermark' && 'Add watermark'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Selected Tablets:</span>
                      <span className="font-medium">{selectedTablets.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Size:</span>
                      <span className="font-medium">
                        {(selectedTablets.length * 0.05).toFixed(1)} MB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Export Format:</span>
                      <span className="font-medium">{exportFormat.toUpperCase()}</span>
                    </div>
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
                  disabled={isExporting || selectedTablets.length === 0}
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
                      Export Selected
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleShareExport}
                  disabled={selectedTablets.length === 0}
                  className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center disabled:opacity-50"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Export Link
                </button>
                
                <button
                  onClick={() => {
                    if (selectedTablets.length > 0 && exportOptions.emailCopy) {
                      alert(`Scheduled export of ${selectedTablets.length} tablets`);
                    }
                  }}
                  className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Schedule Export
                </button>
                
                <button
                  onClick={() => {
                    // Save selection as template
                    localStorage.setItem('exportSelectionTemplate', JSON.stringify({
                      tablets: selectedTablets,
                      options: exportOptions,
                      format: exportFormat,
                    }));
                    alert('Selection saved as template!');
                  }}
                  className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  <Cloud className="w-5 h-5 mr-2" />
                  Save Selection
                </button>
              </div>
              
              {selectedTablets.length === 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-700">
                      Select tablets to enable export options
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <BarChart className="w-5 h-5 mr-2" />
                Selection Stats
              </h3>
              <div className="space-y-3">
                {selectedTablets.length > 0 ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">By Status:</span>
                      <div className="space-x-2">
                        {['available', 'issued', 'damaged', 'missing', 'maintenance'].map(status => {
                          const count = filteredTablets.filter(t => t.status === status).length;
                          return count > 0 ? (
                            <span key={status} className="text-xs font-medium">
                              {count} {status.charAt(0)}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg Battery:</span>
                      <span className="font-medium">
                        {Math.round(filteredTablets.reduce((acc, t) => acc + t.battery, 0) / filteredTablets.length)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Locations:</span>
                      <span className="font-medium">
                        {new Set(filteredTablets.map(t => t.location)).size}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Models:</span>
                      <span className="font-medium">
                        {new Set(filteredTablets.map(t => t.model)).size}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <CheckSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Select tablets to see stats</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Selection Panel Modal */}
        {showSelectionPanel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Add Tablets to Selection</h3>
                <button
                  onClick={() => setShowSelectionPanel(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockTablets.filter(t => !selectedTablets.includes(t.id)).slice(0, 12).map(tablet => (
                    <div
                      key={tablet.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                      onClick={() => handleToggleSelect(tablet.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900">{tablet.deviceId}</div>
                        <Plus className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="text-sm text-gray-600">{tablet.model}</div>
                      <div className="flex items-center justify-between mt-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          tablet.status === 'available' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {tablet.status}
                        </span>
                        <span className="text-sm font-medium">{tablet.battery}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowSelectionPanel(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}