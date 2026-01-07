"use client";

import { useState, useEffect } from "react";
import { 
  Download, Settings, ChevronLeft, RefreshCw, 
  Save, Eye, Clock, Calendar, Mail, Cloud,
  Code, FileText, BarChart, Database, Layers,
  Filter, CheckCircle, AlertCircle, Zap, 
  Users, MapPin, Battery, Cpu, Shield
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { TabletDevice, ExportConfig } from "@/types/tablet";

export default function ExportCustom() {
  const router = useRouter();
  const [config, setConfig] = useState<ExportConfig>({
    format: 'csv',
    includeFields: ['deviceId', 'model', 'status', 'location', 'assignedTo'],
    filename: 'custom-export',
    includeTimestamp: true,
    compression: true,
    emailNotification: false,
  });
  
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('fields');
  const [fieldCategories, setFieldCategories] = useState<Record<string, string[]>>({});
  const [scheduledExport, setScheduledExport] = useState({
    enabled: false,
    frequency: 'weekly',
    day: 'monday',
    time: '09:00',
    recipients: [],
  });

  // Initialize field categories
  useEffect(() => {
    const categories = {
      'Basic Information': ['deviceId', 'model', 'serialNumber', 'imei'],
      'Status & Condition': ['status', 'condition', 'lastSeen', 'lastChecked'],
      'Specifications': ['storage', 'ram', 'os', 'battery'],
      'Assignment': ['assignedTo', 'assignedActivity', 'department'],
      'Location': ['location', 'purchaseDate', 'warranty'],
      'Metadata': ['createdAt', 'updatedAt', 'notes'],
    };
    setFieldCategories(categories);
  }, []);

  const allFields = Object.values(fieldCategories).flat();

  const handleFieldToggle = (field: string) => {
    setConfig(prev => ({
      ...prev,
      includeFields: prev.includeFields.includes(field as any)
        ? prev.includeFields.filter(f => f !== field)
        : [...prev.includeFields, field as keyof TabletDevice]
    }));
  };

  const handleSelectAll = (category: string) => {
    const fields = fieldCategories[category] || [];
    const allSelected = fields.every(f => config.includeFields.includes(f as any));
    
    setConfig(prev => ({
      ...prev,
      includeFields: allSelected
        ? prev.includeFields.filter(f => !fields.includes(f as string))
        : [...new Set([...prev.includeFields, ...fields as any])]
    }));
  };

  const handleSaveTemplate = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Template saved successfully!');
    }, 1000);
  };

  const handleScheduleExport = () => {
    if (scheduledExport.enabled) {
      const newSchedule = {
        id: Date.now(),
        name: config.filename,
        frequency: scheduledExport.frequency,
        nextRun: new Date(Date.now() + 86400000).toISOString(),
        fields: config.includeFields.length,
        status: 'active'
      };
      setSchedules([newSchedule, ...schedules]);
      alert('Export scheduled successfully!');
    }
  };

  const formatOptions = [
    { id: 'csv', label: 'CSV', icon: FileText, color: 'bg-green-100 text-green-800' },
    { id: 'excel', label: 'Excel', icon: BarChart, color: 'bg-blue-100 text-blue-800' },
    { id: 'pdf', label: 'PDF', icon: FileText, color: 'bg-red-100 text-red-800' },
    { id: 'json', label: 'JSON', icon: Code, color: 'bg-purple-100 text-purple-800' },
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
  ];

  const dayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
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
              <h1 className="text-2xl font-bold text-gray-900">Custom Export</h1>
              <p className="text-gray-600">Create custom exports with scheduling and automation</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.refresh()}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleSaveTemplate}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Template'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex overflow-x-auto">
                  {['fields', 'format', 'schedule', 'delivery', 'advanced'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3 font-medium text-sm capitalize border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="p-6">
                {/* Fields Tab */}
                {activeTab === 'fields' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Select Data Fields</h3>
                      <p className="text-gray-600 mb-6">
                        Choose which fields to include in your export. Fields are grouped by category for easy selection.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {Object.entries(fieldCategories).map(([category, fields]) => {
                        const selectedCount = fields.filter(f => config.includeFields.includes(f as any)).length;
                        return (
                          <div key={category} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={fields.every(f => config.includeFields.includes(f as any))}
                                  onChange={() => handleSelectAll(category)}
                                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-3 font-medium text-gray-900">{category}</span>
                              </div>
                              <span className="text-sm text-gray-600">
                                {selectedCount}/{fields.length} selected
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {fields.map(field => (
                                <label
                                  key={field}
                                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={config.includeFields.includes(field as any)}
                                    onChange={() => handleFieldToggle(field)}
                                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">
                                    {field.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Zap className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900 mb-1">Smart Selection</div>
                          <p className="text-sm text-gray-600">
                            Selected {config.includeFields.length} of {allFields.length} fields. 
                            Consider including related fields for complete data analysis.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Format Tab */}
                {activeTab === 'format' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Export Format & Options</h3>
                      <p className="text-gray-600 mb-6">
                        Configure the export format and additional options for your data.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Select Format
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {formatOptions.map(format => (
                            <button
                              key={format.id}
                              onClick={() => setConfig(prev => ({ ...prev, format: format.id as any }))}
                              className={`p-4 rounded-lg border-2 ${
                                config.format === format.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="text-center">
                                <div className={`text-sm font-medium mb-1 ${format.color}`}>
                                  {format.label}
                                </div>
                                <format.icon className="w-8 h-8 mx-auto my-3 text-gray-400" />
                                <div className="text-xs text-gray-500">
                                  {format.id === 'csv' && 'Comma separated values'}
                                  {format.id === 'excel' && 'Microsoft Excel format'}
                                  {format.id === 'pdf' && 'Portable document format'}
                                  {format.id === 'json' && 'JavaScript object notation'}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            File Options
                          </label>
                          <div className="space-y-3">
                            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={config.compression}
                                  onChange={e => setConfig(prev => ({ ...prev, compression: e.target.checked }))}
                                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-sm text-gray-700">Compress files (ZIP)</span>
                              </div>
                              <span className="text-xs text-gray-500">Recommended</span>
                            </label>
                            
                            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={config.includeTimestamp}
                                  onChange={e => setConfig(prev => ({ ...prev, includeTimestamp: e.target.checked }))}
                                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-sm text-gray-700">Include timestamp in filename</span>
                              </div>
                              <span className="text-xs text-gray-500">Auto-generated</span>
                            </label>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            File Name
                          </label>
                          <input
                            type="text"
                            value={config.filename}
                            onChange={e => setConfig(prev => ({ ...prev, filename: e.target.value }))}
                            placeholder="Enter filename"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Final filename: {config.filename}
                            {config.includeTimestamp && `-${new Date().toISOString().split('T')[0]}`}
                            .{config.format}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Schedule Tab */}
                {activeTab === 'schedule' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Schedule Export</h3>
                      <p className="text-gray-600 mb-6">
                        Set up automated exports on a recurring schedule.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={scheduledExport.enabled}
                          onChange={e => setScheduledExport(prev => ({ ...prev, enabled: e.target.checked }))}
                          className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Enable Scheduled Export</div>
                          <div className="text-sm text-gray-500 mt-1">
                            Automatically run this export on a schedule
                          </div>
                        </div>
                      </label>
                      
                      {scheduledExport.enabled && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Frequency
                              </label>
                              <select
                                value={scheduledExport.frequency}
                                onChange={e => setScheduledExport(prev => ({ ...prev, frequency: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                {frequencyOptions.map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Day of Week
                              </label>
                              <select
                                value={scheduledExport.day}
                                onChange={e => setScheduledExport(prev => ({ ...prev, day: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                {dayOptions.map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Time
                            </label>
                            <input
                              type="time"
                              value={scheduledExport.time}
                              onChange={e => setScheduledExport(prev => ({ ...prev, time: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start">
                              <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                              <div>
                                <div className="font-medium text-gray-900 mb-1">Next Scheduled Run</div>
                                <p className="text-sm text-gray-600">
                                  Your export is scheduled to run every {scheduledExport.frequency} 
                                  on {scheduledExport.day}s at {scheduledExport.time}.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Delivery Tab */}
                {activeTab === 'delivery' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Options</h3>
                      <p className="text-gray-600 mb-6">
                        Configure how and where to deliver your export files.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.emailNotification}
                          onChange={e => setConfig(prev => ({ ...prev, emailNotification: e.target.checked }))}
                          className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Email Notification</div>
                          <div className="text-sm text-gray-500 mt-1">
                            Send export completion notification via email
                          </div>
                        </div>
                      </label>
                      
                      {config.emailNotification && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Recipients
                          </label>
                          <input
                            type="text"
                            placeholder="Enter email addresses (comma separated)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Notifications will be sent to these addresses when exports complete
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cloud Storage
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['Google Drive', 'Dropbox', 'OneDrive', 'AWS S3'].map(service => (
                            <label
                              key={service}
                              className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{service}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Webhook URL (Optional)
                        </label>
                        <input
                          type="url"
                          placeholder="https://your-webhook-url.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Send export completion notifications to a webhook endpoint
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Advanced Tab */}
                {activeTab === 'advanced' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Advanced Settings</h3>
                      <p className="text-gray-600 mb-6">
                        Configure advanced options for your export.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data Filter (SQL Where Clause)
                        </label>
                        <input
                          type="text"
                          placeholder="status = 'available' AND battery > 50"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Use SQL-like syntax to filter the exported data
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sort Order
                        </label>
                        <input
                          type="text"
                          placeholder="deviceId ASC, status DESC"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Row Limit
                        </label>
                        <input
                          type="number"
                          placeholder="Leave empty for no limit"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Character Encoding
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>UTF-8</option>
                          <option>UTF-16</option>
                          <option>ASCII</option>
                          <option>ISO-8859-1</option>
                        </select>
                      </div>
                      
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <Shield className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900 mb-1">Security Settings</div>
                            <p className="text-sm text-gray-600">
                              This export may contain sensitive data. Ensure proper access controls are in place.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="space-y-6">
            {/* Configuration Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Configuration Summary</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2">Selected Fields</div>
                  <div className="flex flex-wrap gap-1">
                    {config.includeFields.slice(0, 5).map(field => (
                      <span key={field} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {field}
                      </span>
                    ))}
                    {config.includeFields.length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{config.includeFields.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-medium">{config.format.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fields:</span>
                    <span className="font-medium">{config.includeFields.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Compression:</span>
                    <span className="font-medium">{config.compression ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Scheduled:</span>
                    <span className="font-medium">{scheduledExport.enabled ? 'Yes' : 'No'}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-900 mb-2">Preview Filename</div>
                  <div className="p-2 bg-gray-50 rounded text-sm font-mono">
                    {config.filename}
                    {config.includeTimestamp && `-${new Date().toISOString().split('T')[0]}`}
                    .{config.format}
                    {config.compression && '.zip'}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Execute export
                    alert(`Exporting ${config.includeFields.length} fields as ${config.format}...`);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Execute Export Now
                </button>
                
                <button
                  onClick={handleScheduleExport}
                  disabled={!scheduledExport.enabled}
                  className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center disabled:opacity-50"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Save & Schedule
                </button>
                
                <button
                  onClick={handleSaveTemplate}
                  className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save as Template
                </button>
                
                <button
                  onClick={() => {
                    // Share configuration
                    const shareable = {
                      config,
                      scheduledExport,
                    };
                    navigator.clipboard.writeText(JSON.stringify(shareable, null, 2));
                    alert('Configuration copied to clipboard!');
                  }}
                  className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  <Cloud className="w-5 h-5 mr-2" />
                  Share Configuration
                </button>
              </div>
            </div>

            {/* Scheduled Exports */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Scheduled Exports
              </h3>
              
              {schedules.length === 0 ? (
                <div className="text-center py-4">
                  <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No scheduled exports</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {schedules.slice(0, 3).map(schedule => (
                    <div
                      key={schedule.id}
                      className="p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900">{schedule.name}</div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          schedule.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {schedule.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {schedule.frequency} • {schedule.fields} fields
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}