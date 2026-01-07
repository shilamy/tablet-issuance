"use client";

import { useState, useEffect } from "react";
import { 
  Download, FileSpreadsheet, Filter, ChevronLeft, 
  RefreshCw, CheckCircle, AlertCircle, Clock, 
  Database, HardDrive, Users, Calendar, 
  BarChart, Shield, Cloud, Zap, Eye, Settings
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { TabletDevice } from "@/types/tablet";

// Mock data
const mockTablets: TabletDevice[] = [
  // ... (same as your main tablets page)
];

export default function ExportAllTablets() {
  const router = useRouter();
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'pdf' | 'json'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [filters, setFilters] = useState({
    status: 'all',
    condition: 'all',
    model: 'all',
    dateRange: 'all',
  });
  const [advancedOptions, setAdvancedOptions] = useState({
    includeDeleted: false,
    includeHistory: true,
    sensitiveData: false,
    compressed: true,
    splitFiles: false,
    watermark: false,
  });
  const [exportStats, setExportStats] = useState({
    totalRecords: mockTablets.length,
    estimatedSize: '5.2 MB',
    processingTime: '~45 seconds',
    fieldsCount: 18,
  });

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setTimeout(() => {
            alert(`Export completed! Downloaded ${exportStats.estimatedSize} file.`);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const applyFilters = () => {
    let filtered = [...mockTablets];
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    if (filters.condition !== 'all') {
      filtered = filtered.filter(t => t.condition === filters.condition);
    }
    if (filters.model !== 'all') {
      filtered = filtered.filter(t => t.model === filters.model);
    }
    
    // Update stats based on filtered data
    setExportStats(prev => ({
      ...prev,
      totalRecords: filtered.length,
      estimatedSize: `${(filtered.length * 0.035).toFixed(1)} MB`,
      processingTime: `~${Math.ceil(filtered.length / 50)} seconds`,
    }));
  };

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Best for Excel/Data analysis', color: 'bg-green-100 text-green-800' },
    { value: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'Native Excel format (.xlsx)', color: 'bg-blue-100 text-blue-800' },
    { value: 'pdf', label: 'PDF', icon: FileSpreadsheet, description: 'For reports & sharing', color: 'bg-red-100 text-red-800' },
    { value: 'json', label: 'JSON', icon: FileSpreadsheet, description: 'For APIs & developers', color: 'bg-purple-100 text-purple-800' },
  ];

  const filterOptions = {
    status: [
      { value: 'all', label: 'All Statuses' },
      { value: 'available', label: 'Available', count: mockTablets.filter(t => t.status === 'available').length },
      { value: 'issued', label: 'Issued', count: mockTablets.filter(t => t.status === 'issued').length },
      { value: 'damaged', label: 'Damaged', count: mockTablets.filter(t => t.status === 'damaged').length },
      { value: 'missing', label: 'Missing', count: mockTablets.filter(t => t.status === 'missing').length },
      { value: 'maintenance', label: 'Maintenance', count: mockTablets.filter(t => t.status === 'maintenance').length },
    ],
    condition: [
      { value: 'all', label: 'All Conditions' },
      { value: 'excellent', label: 'Excellent', count: mockTablets.filter(t => t.condition === 'excellent').length },
      { value: 'good', label: 'Good', count: mockTablets.filter(t => t.condition === 'good').length },
      { value: 'fair', label: 'Fair', count: mockTablets.filter(t => t.condition === 'fair').length },
      { value: 'poor', label: 'Poor', count: mockTablets.filter(t => t.condition === 'poor').length },
    ],
    models: [
      { value: 'all', label: 'All Models' },
      ...Array.from(new Set(mockTablets.map(t => t.model))).map(model => ({
        value: model,
        label: model,
        count: mockTablets.filter(t => t.model === model).length
      }))
    ],
    dateRanges: [
      { value: 'all', label: 'All Time' },
      { value: 'week', label: 'Last 7 Days' },
      { value: 'month', label: 'Last 30 Days' },
      { value: 'quarter', label: 'Last 90 Days' },
      { value: 'year', label: 'Last Year' },
    ]
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Export All Tablets</h1>
              <p className="text-gray-600">Export complete tablet inventory with advanced filtering</p>
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
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              View Tablets
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center">
              <Database className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{exportStats.totalRecords}</div>
                <div className="text-sm text-gray-600">Total Records</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center">
              <HardDrive className="w-5 h-5 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{exportStats.estimatedSize}</div>
                <div className="text-sm text-gray-600">Estimated Size</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{exportStats.processingTime}</div>
                <div className="text-sm text-gray-600">Processing Time</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{exportStats.fieldsCount}</div>
                <div className="text-sm text-gray-600">Data Fields</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Format Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Export Format</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {formatOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedFormat(option.value as any)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedFormat === option.value
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-sm font-medium mb-1 ${option.color}`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{option.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setFilters({
                    status: 'all',
                    condition: 'all',
                    model: 'all',
                    dateRange: 'all',
                  })}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear all
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Status
                  </label>
                  <div className="space-y-2">
                    {filterOptions.status.map((status) => (
                      <label
                        key={status.value}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="status"
                            value={status.value}
                            checked={filters.status === status.value}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="ml-3 text-sm text-gray-700">{status.label}</span>
                        </div>
                        {status.value !== 'all' && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            {status.count}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Condition
                  </label>
                  <div className="space-y-2">
                    {filterOptions.condition.map((condition) => (
                      <label
                        key={condition.value}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="condition"
                            value={condition.value}
                            checked={filters.condition === condition.value}
                            onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="ml-3 text-sm text-gray-700">{condition.label}</span>
                        </div>
                        {condition.value !== 'all' && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            {condition.count}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Model
                  </label>
                  <select
                    value={filters.model}
                    onChange={(e) => setFilters(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {filterOptions.models.map((model) => (
                      <option key={model.value} value={model.value}>
                        {model.label} {model.count ? `(${model.count})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {filterOptions.dateRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={applyFilters}
                  className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg"
                >
                  Apply Filters & Update Preview
                </button>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Advanced Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(advancedOptions).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setAdvancedOptions(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {key === 'includeDeleted' && 'Include soft-deleted records'}
                        {key === 'includeHistory' && 'Include change history log'}
                        {key === 'sensitiveData' && 'Export sensitive information (requires approval)'}
                        {key === 'compressed' && 'Compress files using ZIP format'}
                        {key === 'splitFiles' && 'Split large exports into multiple files'}
                        {key === 'watermark' && 'Add organization watermark to PDFs'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Export */}
          <div className="space-y-6">
            {/* Export Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Export Preview</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Format:</span>
                  <span className="font-medium">{selectedFormat.toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Records:</span>
                  <span className="font-medium">{exportStats.totalRecords}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Size:</span>
                  <span className="font-medium">{exportStats.estimatedSize}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time:</span>
                  <span className="font-medium">{exportStats.processingTime}</span>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview first 5 rows:
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono overflow-x-auto">
                    <div className="text-gray-500">deviceId,model,status,location,assignedTo</div>
                    <div className="text-gray-800">KNBS-TAB-001,Samsung Galaxy Tab A8,available,Nairobi Warehouse,</div>
                    <div className="text-gray-800">KNBS-TAB-002,Lenovo Tab M10,issued,Nairobi Field,John Doe</div>
                    <div className="text-gray-800">KNBS-TAB-003,iPad 9th Gen,damaged,Repair Center,</div>
                    <div className="text-gray-800">KNBS-TAB-004,Samsung Galaxy Tab S6 Lite,available,Nairobi Warehouse,</div>
                    <div className="text-gray-800">KNBS-TAB-005,Lenovo Tab P11,missing,Unknown,David Kimani</div>
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
                  disabled={isExporting}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg flex items-center justify-center disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Exporting... {exportProgress}%
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download Export
                    </>
                  )}
                </button>
                
                {isExporting && (
                  <div className="mt-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-300"
                        style={{ width: `${exportProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-2 text-center">
                      Processing {exportStats.totalRecords} records...
                    </div>
                  </div>
                )}
                
                <button className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center">
                  <Cloud className="w-5 h-5 mr-2" />
                  Save to Cloud Storage
                </button>
                
                <button className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Export
                </button>
                
                <button className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Save as Template
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Shield className="w-4 h-4 mr-2" />
                  Security & Compliance
                </div>
                <p className="text-xs text-gray-500">
                  This export contains sensitive data. Ensure proper handling according to your organization's data protection policies.
                </p>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <Zap className="w-5 h-5 text-blue-500 mr-2" />
                Quick Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Use CSV for data analysis in Excel or statistical software
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  PDF format includes formatted reports with charts
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Enable compression for exports larger than 10MB
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  Sensitive data exports require manager approval
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}