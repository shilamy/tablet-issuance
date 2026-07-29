"use client";

import { useState } from "react";
import { 
  Plus, ChevronLeft, Camera, Barcode, 
  Save, X, Upload, RefreshCw, CheckCircle,
  AlertCircle, Tablet, Battery, HardDrive,
  Cpu, MemoryStick, MapPin, Calendar, Shield,
  QrCode, Scan, Package, User, Settings,
  Info, Clipboard
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTabletStore } from "@/store/tabletStore";
import Layout from "@/components/Layout";
import { toast } from "@/components/ui/toast";

interface NewTabletForm {
  deviceId: string;
  serialNumber: string;
  imei: string;
  model: string;
  status: string;
  condition: string;
  battery: number;
  storage: string;
  ram: string;
  os: string;
  location: string;
  purchaseDate: string;
  warranty: string;
  assignedTo: string;
  assignedActivity: string;
  department: string;
  notes: string;
}

const modelOptions = [
  "Samsung Galaxy Tab A8",
  "Samsung Galaxy Tab S6 Lite",
  "Samsung Galaxy Tab S7 FE",
  "Samsung Galaxy Tab S9",
  "Lenovo Tab M10",
  "Lenovo Tab P11",
  "Lenovo Tab M8",
  "iPad 9th Gen",
  "iPad Air 5",
  "Other"
];

const statusOptions = [
  { value: "available", label: "Available", color: "bg-green-100 text-green-800" },
  { value: "issued", label: "Issued", color: "bg-blue-100 text-blue-800" },
  { value: "damaged", label: "Damaged", color: "bg-red-100 text-red-800" },
  { value: "missing", label: "Missing", color: "bg-orange-100 text-orange-800" },
  { value: "maintenance", label: "Maintenance", color: "bg-yellow-100 text-yellow-800" },
];

const conditionOptions = [
  { value: "excellent", label: "Excellent", color: "bg-green-100 text-green-800" },
  { value: "good", label: "Good", color: "bg-blue-100 text-blue-800" },
  { value: "fair", label: "Fair", color: "bg-yellow-100 text-yellow-800" },
  { value: "poor", label: "Poor", color: "bg-red-100 text-red-800" },
];

const storageOptions = ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"];
const ramOptions = ["2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"];
const osOptions = ["Android 11", "Android 12", "Android 13", "Android 14", "iOS 15", "iOS 16", "iOS 17"];

export default function NewTabletPage() {
  const router = useRouter();
  const [form, setForm] = useState<NewTabletForm>({
    deviceId: "",
    serialNumber: "",
    imei: "",
    model: "",
    status: "available",
    condition: "good",
    battery: 100,
    storage: "128GB",
    ram: "4GB",
    os: "Android 13",
    location: "Nairobi Warehouse",
    purchaseDate: new Date().toISOString().split('T')[0],
    warranty: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0],
    assignedTo: "",
    assignedActivity: "",
    department: "IT",
    notes: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('basic');

  const generateDeviceId = () => {
    const prefix = "KNBS-TAB-";
    const random = Math.floor(Math.random() * 900) + 100;
    const newId = `${prefix}${random.toString().padStart(3, '0')}`;
    setForm(prev => ({ ...prev, deviceId: newId }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.deviceId.trim()) newErrors.deviceId = "Device ID is required";
    if (!form.serialNumber.trim()) newErrors.serialNumber = "Serial number is required";
    if (!form.imei.trim()) newErrors.imei = "IMEI is required";
    if (!form.model) newErrors.model = "Model is required";
    if (form.battery < 0 || form.battery > 100) newErrors.battery = "Battery must be between 0-100%";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { refreshData } = useTabletStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/tablets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: form.deviceId,
          serialNumber: form.serialNumber,
          imei: form.imei,
          model: form.model,
          status: form.status,
          condition: form.condition,
          battery: form.battery,
          storage: form.storage,
          ram: form.ram,
          os: form.os,
          location: form.location,
          purchaseDate: form.purchaseDate || undefined,
          warranty: form.warranty,
          department: form.department,
          notes: form.notes,
        }),
      });

      if (!res.ok) throw new Error('Failed to create tablet');
      toast(`Tablet ${form.deviceId} added successfully!`, 'success');
      await refreshData();
      router.push('/tablets');
    } catch (err) {
      console.error(err);
      toast('Failed to add tablet', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Info },
    { id: 'specs', label: 'Specifications', icon: Cpu },
    { id: 'assignment', label: 'Assignment', icon: User },
    { id: 'additional', label: 'Additional', icon: Settings },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/tablets"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Tablet</h1>
              <p className="text-gray-600">Register a new tablet in the inventory system</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={generateDeviceId}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate ID
            </button>
            <button
              type="submit"
              form="new-tablet-form"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Tablet'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <form id="new-tablet-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Tabs */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                  <nav className="flex overflow-x-auto">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 font-medium text-sm flex items-center border-b-2 transition-colors whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <tab.icon className="w-4 h-4 mr-2" />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>
                
                <div className="p-6">
                  {/* Basic Info Tab */}
                  {activeTab === 'basic' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Device ID *
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={form.deviceId}
                              onChange={(e) => setForm(prev => ({ ...prev, deviceId: e.target.value }))}
                              className={`flex-1 px-3 py-2 border ${errors.deviceId ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                              placeholder="Enter device ID"
                            />
                            <button
                              type="button"
                              onClick={generateDeviceId}
                              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                              title="Generate ID"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </div>
                          {errors.deviceId && (
                            <p className="mt-1 text-sm text-red-600">{errors.deviceId}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Model *
                          </label>
                          <select
                            value={form.model}
                            onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))}
                            className={`w-full px-3 py-2 border ${errors.model ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          >
                            <option value="">Select a model</option>
                            {modelOptions.map(model => (
                              <option key={model} value={model}>{model}</option>
                            ))}
                          </select>
                          {errors.model && (
                            <p className="mt-1 text-sm text-red-600">{errors.model}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Serial Number *
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={form.serialNumber}
                              onChange={(e) => setForm(prev => ({ ...prev, serialNumber: e.target.value }))}
                              className={`w-full px-3 py-2 border ${errors.serialNumber ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                              placeholder="Enter serial number"
                            />
                          </div>
                          {errors.serialNumber && (
                            <p className="mt-1 text-sm text-red-600">{errors.serialNumber}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            IMEI Number *
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={form.imei}
                              onChange={(e) => setForm(prev => ({ ...prev, imei: e.target.value }))}
                              className={`w-full px-3 py-2 border ${errors.imei ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                              placeholder="15-digit IMEI"
                              maxLength={15}
                            />
                          </div>
                          {errors.imei && (
                            <p className="mt-1 text-sm text-red-600">{errors.imei}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {statusOptions.map(option => (
                              <label
                                key={option.value}
                                className={`p-3 border rounded-lg cursor-pointer flex items-center justify-center ${
                                  form.status === option.value
                                    ? `${option.color} border-transparent`
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="status"
                                  value={option.value}
                                  checked={form.status === option.value}
                                  onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                                  className="sr-only"
                                />
                                <span className="text-sm font-medium">{option.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Condition
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                            {conditionOptions.map(option => (
                              <label
                                key={option.value}
                                className={`p-3 border rounded-lg cursor-pointer flex items-center justify-center ${
                                  form.condition === option.value
                                    ? `${option.color} border-transparent`
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="condition"
                                  value={option.value}
                                  checked={form.condition === option.value}
                                  onChange={(e) => setForm(prev => ({ ...prev, condition: e.target.value }))}
                                  className="sr-only"
                                />
                                <span className="text-sm font-medium">{option.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Battery Level
                        </label>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{form.battery}%</span>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => setForm(prev => ({ ...prev, battery: Math.max(0, prev.battery - 10) }))}
                                className="p-1"
                              >
                                -
                              </button>
                              <button
                                type="button"
                                onClick={() => setForm(prev => ({ ...prev, battery: Math.min(100, prev.battery + 10) }))}
                                className="p-1"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={form.battery}
                            onChange={(e) => setForm(prev => ({ ...prev, battery: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          {errors.battery && (
                            <p className="mt-1 text-sm text-red-600">{errors.battery}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Specifications Tab */}
                  {activeTab === 'specs' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Storage Capacity
                          </label>
                          <select
                            value={form.storage}
                            onChange={(e) => setForm(prev => ({ ...prev, storage: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {storageOptions.map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            RAM
                          </label>
                          <select
                            value={form.ram}
                            onChange={(e) => setForm(prev => ({ ...prev, ram: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {ramOptions.map(ram => (
                              <option key={ram} value={ram}>{ram}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Operating System
                          </label>
                          <select
                            value={form.os}
                            onChange={(e) => setForm(prev => ({ ...prev, os: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {osOptions.map(os => (
                              <option key={os} value={os}>{os}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            value={form.location}
                            onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Nairobi Warehouse"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Purchase Date
                          </label>
                          <input
                            type="date"
                            value={form.purchaseDate}
                            onChange={(e) => setForm(prev => ({ ...prev, purchaseDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Warranty Until
                          </label>
                          <input
                            type="date"
                            value={form.warranty}
                            onChange={(e) => setForm(prev => ({ ...prev, warranty: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Assignment Tab */}
                  {activeTab === 'assignment' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assigned To
                        </label>
                        <input
                          type="text"
                          value={form.assignedTo}
                          onChange={(e) => setForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Staff name or ID"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Activity / Project
                        </label>
                        <input
                          type="text"
                          value={form.assignedActivity}
                          onChange={(e) => setForm(prev => ({ ...prev, assignedActivity: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Household Survey, Population Census"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department
                        </label>
                        <select
                          value={form.department}
                          onChange={(e) => setForm(prev => ({ ...prev, department: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="IT">IT Department</option>
                          <option value="Field Operations">Field Operations</option>
                          <option value="Research">Research</option>
                          <option value="Administration">Administration</option>
                          <option value="Finance">Finance</option>
                          <option value="Logistics">Logistics</option>
                        </select>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900 mb-1">Assignment Note</div>
                            <p className="text-sm text-gray-600">
                              Assigning a tablet to a staff member will automatically update its status to &quot;Issued&quot;.
                              Leave these fields empty if the tablet is not currently assigned.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Tab */}
                  {activeTab === 'additional' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notes
                        </label>
                        <textarea
                          value={form.notes}
                          onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Additional notes, special instructions, or observations..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Images
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 mb-2">Drag & drop images here or click to browse</p>
                          <p className="text-sm text-gray-500">Supports JPG, PNG up to 5MB each</p>
                          <button
                            type="button"
                            className="mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Browse Files
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                          <div>
                            <div className="font-medium text-gray-900">Require Verification</div>
                            <div className="text-sm text-gray-500">Manager approval needed</div>
                          </div>
                        </label>
                        
                        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                          <div>
                            <div className="font-medium text-gray-900">Send Notification</div>
                            <div className="text-sm text-gray-500">Notify relevant teams</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="space-y-6">
            {/* Tablet Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Tablet Preview</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Tablet className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <div className="font-medium text-gray-900">{form.deviceId || "New Tablet"}</div>
                      <div className="text-sm text-gray-600">{form.model || "No model selected"}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    form.status === 'available' ? 'bg-green-100 text-green-800' :
                    form.status === 'issued' ? 'bg-blue-100 text-blue-800' :
                    form.status === 'damaged' ? 'bg-red-100 text-red-800' :
                    form.status === 'missing' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {statusOptions.find(s => s.value === form.status)?.label || form.status}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Battery:</span>
                    <div className="flex items-center">
                      <Battery className="w-4 h-4 mr-2" />
                      <span className="font-medium">{form.battery}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Storage:</span>
                    <div className="flex items-center">
                      <HardDrive className="w-4 h-4 mr-2" />
                      <span className="font-medium">{form.storage}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">RAM:</span>
                    <div className="flex items-center">
                      <MemoryStick className="w-4 h-4 mr-2" />
                      <span className="font-medium">{form.ram}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">OS:</span>
                    <div className="flex items-center">
                      <Cpu className="w-4 h-4 mr-2" />
                      <span className="font-medium">{form.os}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Location:</span>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="font-medium">{form.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-900 mb-2">Quick Actions</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={generateDeviceId}
                      className="p-2 border border-gray-200 rounded text-xs hover:bg-gray-50"
                    >
                      Generate ID
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ 
                        ...prev, 
                        purchaseDate: new Date().toISOString().split('T')[0],
                        warranty: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]
                      }))}
                      className="p-2 border border-gray-200 rounded text-xs hover:bg-gray-50"
                    >
                      Set Dates
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Validation Status
              </h3>
              
              <div className="space-y-3">
                {[
                  { label: 'Device ID', valid: !!form.deviceId.trim() },
                  { label: 'Serial Number', valid: !!form.serialNumber.trim() },
                  { label: 'IMEI', valid: !!form.imei.trim() && form.imei.length === 15 },
                  { label: 'Model', valid: !!form.model },
                  { label: 'Battery Level', valid: form.battery >= 0 && form.battery <= 100 },
                  { label: 'Purchase Date', valid: !!form.purchaseDate },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    {item.valid ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {Object.keys(errors).length === 0 
                    ? 'All required fields are valid'
                    : `${Object.keys(errors).length} validation error(s) found`
                  }
                </div>
              </div>
            </div>

            {/* Quick Save Options */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-medium text-gray-900 mb-4">Quick Save Options</h3>
              
              <div className="space-y-3">
                <button
                  type="submit"
                  form="new-tablet-form"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save & Continue
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    // Save as draft
                    localStorage.setItem('tabletDraft', JSON.stringify(form));
                    toast('Saved as draft!', 'success');
                  }}
                  className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  <Clipboard className="w-5 h-5 mr-2" />
                  Save as Draft
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      deviceId: "",
                      serialNumber: "",
                      imei: "",
                      model: "",
                      status: "available",
                      condition: "good",
                      battery: 100,
                      storage: "128GB",
                      ram: "4GB",
                      os: "Android 13",
                      location: "Nairobi Warehouse",
                      purchaseDate: new Date().toISOString().split('T')[0],
                      warranty: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0],
                      assignedTo: "",
                      assignedActivity: "",
                      department: "IT",
                      notes: "",
                    });
                    setErrors({});
                  }}
                  className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  <X className="w-5 h-5 mr-2" />
                  Clear Form
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}