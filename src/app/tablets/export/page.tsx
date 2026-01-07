"use client";

import { useState, useEffect } from "react";
import { 
  Download, FileSpreadsheet, Filter, CheckSquare, Settings, 
  ChevronRight, Calendar, Users, Clock, BarChart, Zap, 
  Shield, Cloud, History, AlertCircle, CheckCircle,
  Grid, List, Upload, Eye, Trash2, RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { TabletDevice, ExportConfig } from "@/types/tablets";

// Mock data - in real app, fetch from API
const mockTablets: TabletDevice[] = [
  // ... use the same mock data from your tablets page
];

const exportTemplates = [
  { id: 'full-inventory', name: 'Full Inventory Report', fields: ['deviceId', 'model', 'status', 'condition', 'location'], format: 'pdf' },
  { id: 'field-audit', name: 'Field Audit', fields: ['deviceId', 'assignedTo', 'assignedActivity', 'lastSeen', 'battery'], format: 'csv' },
  { id: 'maintenance', name: 'Maintenance Schedule', fields: ['deviceId', 'model', 'lastChecked', 'condition', 'warranty'], format: 'excel' },
  { id: 'asset-tracking', name: 'Asset Tracking', fields: ['deviceId', 'serialNumber', 'imei', 'purchaseDate', 'department'], format: 'json' },
];

export default function ExportDashboard() {
  const router = useRouter();
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'csv',
    includeFields: ['deviceId', 'model', 'status', 'location', 'assignedTo'],
    filename: 'tablet-inventory',
    includeTimestamp: true,
    compression: false,
    emailNotification: false,
  });
  
  const [recentExports, setRecentExports] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [stats, setStats] = useState({
    totalExports: 124,
    thisMonth: 12,
    avgSize: '2.4 MB',
    mostUsedFormat: 'CSV',
  });

  const allFields: { key: keyof TabletDevice; label: string; category: string }[] = [
    { key: 'deviceId', label: 'Device ID', category: 'Basic' },
    { key: 'model', label: 'Model', category: 'Basic' },
    { key: 'status', label: 'Status', category: 'Status' },
    { key: 'condition', label: 'Condition', category: 'Status' },
    { key: 'battery', label: 'Battery', category: 'Specs' },
    { key: 'storage', label: 'Storage', category: 'Specs' },
    { key: 'ram', label: 'RAM', category: 'Specs' },
    { key: 'os', label: 'OS', category: 'Specs' },
    { key: 'assignedTo', label: 'Assigned To', category: 'Assignment' },
    { key: 'assignedActivity', label: 'Activity', category: 'Assignment' },
    { key: 'location', label: 'Location', category: 'Location' },
    { key: 'purchaseDate', label: 'Purchase Date', category: 'Financial' },
    { key: 'warranty', label: 'Warranty', category: 'Financial' },
    { key: 'lastChecked', label: 'Last Checked', category: 'Maintenance' },
    { key: 'lastSeen', label: 'Last Seen', category: 'Tracking' },
    { key: 'serialNumber', label: 'Serial Number', category: 'Identification' },
    { key: 'imei', label: 'IMEI', category: 'Identification' },
    { key: 'department', label: 'Department', category: 'Organization' },
    { key: 'notes', label: 'Notes', category: 'Additional' },
  ];

  const handleFieldToggle = (field: keyof TabletDevice) => {
    setExportConfig(prev => ({
      ...prev,
      includeFields: prev.includeFields.includes(field)
        ? prev.includeFields.filter(f => f !== field)
        : [...prev.includeFields, field]
    }));
  };

  const handleSelectAll = (category: string) => {
    const categoryFields = allFields
      .filter(f => f.category === category)
      .map(f => f.key);
    
    const allSelected = categoryFields.every(f => exportConfig.includeFields.includes(f));
    
    setExportConfig(prev => ({
      ...prev,
      includeFields: allSelected
        ? prev.includeFields.filter(f => !categoryFields.includes(f))
        : [...new Set([...prev.includeFields, ...categoryFields])]
    }));
  };

  const handleQuickExport = () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      alert(`Export completed! ${exportConfig.includeFields.length} fields exported in ${exportConfig.format.toUpperCase()} format.`);
      
      // Add to recent exports
      const newExport = {
        id: Date.now(),
        name: exportConfig.filename,
        format: exportConfig.format,
        fields: exportConfig.includeFields.length,
        size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setRecentExports(prev => [newExport, ...prev.slice(0, 9)]);
    }, 2000);
  };

  const handleTemplateLoad = (template: typeof exportTemplates[0]) => {
    setExportConfig(prev => ({
      ...prev,
      includeFields: template.fields as (keyof TabletDevice)[],
      format: template.format as 'csv' | 'excel' | 'pdf' | 'json',
      filename: template.name.toLowerCase().replace(/\s+/g, '-')
    }));
  };

  const exportOptions = [
    {
      title: "Export All Tablets",
      description: "Complete inventory with advanced filtering",
      icon: FileSpreadsheet,
      href: "/tablets/export/all",
      color: "bg-gradient-to-r from-blue-500 to-indigo-500",
      stats: { count: mockTablets.length, size: "~5.2 MB" },
      features: ["All records", "Advanced filters", "Multiple formats", "Batch processing"]
    },
    {
      title: "Export Filtered",
      description: "Apply complex filters from main view",
      icon: Filter,
      href: "/tablets/export/filtered",
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      stats: { count: "Dynamic", size: "Variable" },
      features: ["Live filters", "Custom columns", "Real-time data", "Save filters"]
    },
    {
      title: "Export Selected",
      description: "Bulk export with selection management",
      icon: CheckSquare,
      href: "/tablets/export/selected",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      stats: { count: "Manual", size: "Selective" },
      features: ["Bulk select", "Range selection", "Preview data", "Merge exports"]
    },
    {
      title: "Custom Export",
      description: "Advanced field selection and scheduling",
      icon: Settings,
      href: "/tablets/export/custom",
      color: "bg-gradient-to-r from-orange-500 to-red-500",
      stats: { count: "Custom", size: "Configurable" },
      features: ["Field picker", "Schedule exports", "Templates", "API integration"]
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Data Export Center</h1>
              <p className="text-gray-300">Advanced export tools for tablet inventory management</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalExports}</div>
                <div className="text-sm text-gray-300">Total Exports</div>
              </div>
              <div className="h-8 w-px bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.thisMonth}</div>
                <div className="text-sm text-gray-300">This Month</div>
              </div>
              <div className="h-8 w-px bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.avgSize}</div>
                <div className="text-sm text-gray-300">Avg Size</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Export Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Quick Export Configuration</h2>
                <p className="text-gray-600">Configure and execute immediate exports</p>
              </div>
              <button
                onClick={() => router.refresh()}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Format Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Export Format</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['csv', 'excel', 'pdf', 'json'] as const).map(format => (
                    <button
                      key={format}
                      onClick={() => setExportConfig(prev => ({ ...prev, format }))}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        exportConfig.format === format
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-lg font-medium mb-1 ${
                          exportConfig.format === format ? 'text-blue-600' : 'text-gray-700'
                        }`}>
                          {format.toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format === 'csv' && 'Best for Excel'}
                          {format === 'excel' && 'Native format'}
                          {format === 'pdf' && 'For reports'}
                          {format === 'json' && 'For APIs'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Field Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Select Fields</h3>
                  <div className="text-sm text-gray-600">
                    {exportConfig.includeFields.length} of {allFields.length} fields selected
                  </div>
                </div>
                
                <div className="space-y-4">
                  {['Basic', 'Status', 'Specs', 'Assignment', 'Location', 'Financial', 'Maintenance', 'Tracking', 'Identification', 'Organization', 'Additional'].map(category => {
                    const categoryFields = allFields.filter(f => f.category === category);
                    const selectedCount = categoryFields.filter(f => exportConfig.includeFields.includes(f.key)).length;
                    
                    return (
                      <div key={category} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={categoryFields.every(f => exportConfig.includeFields.includes(f.key))}
                              onChange={() => handleSelectAll(category)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                            />
                            <span className="ml-2 font-medium text-gray-900">{category}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {selectedCount}/{categoryFields.length}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {categoryFields.map(field => (
                            <label
                              key={field.key}
                              className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={exportConfig.includeFields.includes(field.key)}
                                onChange={() => handleFieldToggle(field.key)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                              />
                              <span className="text-sm text-gray-700">{field.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Options */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Advanced Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportConfig.includeTimestamp}
                      onChange={e => setExportConfig(prev => ({ ...prev, includeTimestamp: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Include Timestamp</div>
                      <div className="text-sm text-gray-500">Add export date to filename</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportConfig.compression}
                      onChange={e => setExportConfig(prev => ({ ...prev, compression: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Compress Files</div>
                      <div className="text-sm text-gray-500">ZIP compression for large exports</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportConfig.emailNotification}
                      onChange={e => setExportConfig(prev => ({ ...prev, emailNotification: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Email Notification</div>
                      <div className="text-sm text-gray-500">Send export completion alert</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Templates & Actions */}
          <div className="space-y-6">
            {/* Export Action Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Export Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Format:</span>
                      <span className="font-medium">{exportConfig.format.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fields:</span>
                      <span className="font-medium">{exportConfig.includeFields.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Size:</span>
                      <span className="font-medium">
                        {(exportConfig.includeFields.length * 0.1).toFixed(1)} MB
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filename
                  </label>
                  <input
                    type="text"
                    value={exportConfig.filename}
                    onChange={e => setExportConfig(prev => ({ ...prev, filename: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <button
                  onClick={handleQuickExport}
                  disabled={isExporting || exportConfig.includeFields.length === 0}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Start Export
                    </>
                  )}
                </button>
                
                <div className="text-center">
                  <button
                    onClick={() => router.push('/tablets/export/custom')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Advanced configuration →
                  </button>
                </div>
              </div>
            </div>

            {/* Templates */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4">Saved Templates</h3>
              <div className="space-y-3">
                {exportTemplates.map(template => (
                  <div
                    key={template.id}
                    className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => handleTemplateLoad(template)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{template.name}</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {template.format.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 flex items-center">
                      <span className="truncate">
                        {template.fields.slice(0, 3).join(', ')}
                        {template.fields.length > 3 && '...'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Export Options Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Specialized Export Types</h2>
              <p className="text-gray-600">Choose from specialized export workflows</p>
            </div>
            <Link
              href="/tablets"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all tablets →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exportOptions.map((option) => (
              <Link
                key={option.title}
                href={option.href}
                className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-3 rounded-xl ${option.color} text-white`}>
                    <option.icon className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-transform" />
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600">{option.title}</h4>
                <p className="text-gray-600 mb-4">{option.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{option.stats.count}</div>
                      <div className="text-xs text-gray-500">Records</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{option.stats.size}</div>
                      <div className="text-xs text-gray-500">Size</div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${option.color} text-white`}>
                    Recommended
                  </div>
                </div>
                
                <div className="space-y-2">
                  {option.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}