"use client";

import { useState, useEffect, useRef } from "react";
import { 
  QrCode, Barcode, Camera, ChevronLeft, RefreshCw,
  Search, CheckCircle, XCircle, AlertCircle, 
  Download, Upload, Tablet, Package, MapPin,
  History, Settings, Zap, Battery, Users,
  Scan, StopCircle, Maximize2, Minimize2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { ScanResult } from "@/types/tablets";

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<'barcode' | 'qr'>('barcode');
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [manualInput, setManualInput] = useState("");
  const [scannerSettings, setScannerSettings] = useState({
    audioFeedback: true,
    vibration: true,
    autoFocus: true,
    torch: false,
    zoom: 1,
    resolution: 'hd',
  });
  const [showHistory, setShowHistory] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // Mock tablet data for scanning
  const mockTablets = [
    { deviceId: "KNBS-TAB-001", model: "Samsung Galaxy Tab A8", status: "available", battery: 85 },
    { deviceId: "KNBS-TAB-002", model: "Lenovo Tab M10", status: "issued", battery: 45 },
    { deviceId: "KNBS-TAB-003", model: "iPad 9th Gen", status: "damaged", battery: 0 },
    { deviceId: "KNBS-TAB-004", model: "Samsung Galaxy Tab S6 Lite", status: "available", battery: 92 },
    { deviceId: "KNBS-TAB-005", model: "Lenovo Tab P11", status: "missing", battery: 0 },
  ];

  // Simulate scanner initialization
  useEffect(() => {
    if (isScanning) {
      // In a real app, this would initialize the camera/scanner
      console.log(`Initializing ${scanMode} scanner...`);
      
      // Simulate scanning for demo
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          simulateScan();
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isScanning, scanMode]);

  const simulateScan = () => {
    const device = mockTablets[Math.floor(Math.random() * mockTablets.length)];
    const result: ScanResult = {
      type: scanMode,
      value: device.deviceId,
      timestamp: new Date().toISOString(),
      deviceId: device.deviceId,
      status: 'success',
      message: `Found: ${device.model} (${device.status}, ${device.battery}% battery)`
    };
    
    setScanResults(prev => [result, ...prev]);
    
    if (scannerSettings.audioFeedback) {
      // Play success sound
      new Audio('/audio/beep.mp3').play().catch(() => {});
    }
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      const found = mockTablets.find(t => t.deviceId === manualInput);
      const result: ScanResult = {
        type: 'barcode',
        value: manualInput,
        timestamp: new Date().toISOString(),
        deviceId: manualInput,
        status: found ? 'success' : 'error',
        message: found 
          ? `Found: ${found.model} (${found.status})`
          : `Device ${manualInput} not found in database`
      };
      
      setScanResults(prev => [result, ...prev]);
      setManualInput("");
    }
  };

  const handleStartScan = () => {
    setIsScanning(true);
    // Request camera permissions in real app
  };

  const handleStopScan = () => {
    setIsScanning(false);
  };

  const handleClearHistory = () => {
    setScanResults([]);
  };

  const handleExportScans = () => {
    const data = scanResults.map(r => ({
      timestamp: r.timestamp,
      type: r.type,
      deviceId: r.deviceId,
      status: r.status,
      message: r.message
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan-results-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const stats = {
    totalScans: scanResults.length,
    successful: scanResults.filter(r => r.status === 'success').length,
    errors: scanResults.filter(r => r.status === 'error').length,
    duplicates: scanResults.filter((r, i, arr) => 
      arr.findIndex(a => a.deviceId === r.deviceId) !== i
    ).length,
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Tablet Scanner</h1>
              <p className="text-gray-600">Scan barcodes and QR codes for tablet inventory</p>
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
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              <History className="w-4 h-4 inline mr-2" />
              History
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Scanner */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scanner View */}
            <div className={`bg-gray-900 rounded-xl overflow-hidden ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
              <div className="p-4 bg-gray-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded ${scanMode === 'barcode' ? 'bg-blue-500' : 'bg-gray-700'}`}>
                    <Barcode className="w-5 h-5 text-white" />
                  </div>
                  <div className={`p-2 rounded ${scanMode === 'qr' ? 'bg-blue-500' : 'bg-gray-700'}`}>
                    <QrCode className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium">
                    {scanMode === 'barcode' ? 'Barcode Scanner' : 'QR Code Scanner'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFullscreen(!fullscreen)}
                    className="p-2 text-white hover:bg-gray-700 rounded"
                  >
                    {fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setScannerSettings(prev => ({ ...prev, torch: !prev.torch }))}
                    className={`p-2 rounded ${scannerSettings.torch ? 'bg-yellow-500' : 'bg-gray-700'}`}
                  >
                    <Zap className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              
              <div className="relative h-96 flex items-center justify-center">
                {/* Scanner Visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {isScanning ? (
                    <div className="text-center">
                      <div className="relative">
                        {/* Scanner animation */}
                        <div className="w-64 h-1 bg-blue-500 animate-pulse rounded-full"></div>
                        <div className="w-64 h-64 border-2 border-blue-400 rounded-lg mt-4 relative overflow-hidden">
                          {/* Scanning lines */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 animate-scan"></div>
                          <div className="absolute top-1/3 left-0 right-0 h-1 bg-blue-500 animate-scan-delay"></div>
                          <div className="absolute top-2/3 left-0 right-0 h-1 bg-blue-500 animate-scan-delay-2"></div>
                          
                          {/* Corners */}
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-400"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-400"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-400"></div>
                        </div>
                      </div>
                      <p className="text-white mt-4">Align {scanMode === 'barcode' ? 'barcode' : 'QR code'} within frame</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-64 h-64 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center">
                        <Camera className="w-16 h-16 text-gray-600" />
                      </div>
                      <p className="text-gray-400 mt-4">Scanner inactive</p>
                    </div>
                  )}
                </div>
                
                {/* Stats overlay */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-xl font-bold">{stats.totalScans}</div>
                      <div className="text-xs">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-400">{stats.successful}</div>
                      <div className="text-xs">Success</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-red-400">{stats.errors}</div>
                      <div className="text-xs">Errors</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-800 flex items-center justify-between">
                {isScanning ? (
                  <button
                    onClick={handleStopScan}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center"
                  >
                    <StopCircle className="w-5 h-5 mr-2" />
                    Stop Scanning
                  </button>
                ) : (
                  <button
                    onClick={handleStartScan}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
                  >
                    <Scan className="w-5 h-5 mr-2" />
                    Start Scanning
                  </button>
                )}
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setScanMode('barcode')}
                    className={`px-4 py-2 rounded ${scanMode === 'barcode' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                  >
                    Barcode
                  </button>
                  <button
                    onClick={() => setScanMode('qr')}
                    className={`px-4 py-2 rounded ${scanMode === 'qr' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                  >
                    QR Code
                  </button>
                </div>
              </div>
            </div>

            {/* Manual Input */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4">Manual Entry</h3>
              <div className="flex space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Enter device ID or barcode manually"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
                  />
                </div>
                <button
                  onClick={handleManualSubmit}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg"
                >
                  Submit
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Press Enter or click Submit to manually add a scan
              </p>
            </div>

            {/* Scanner Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Scanner Settings
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(scannerSettings).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <input
                        type={typeof value === 'boolean' ? 'checkbox' : 'range'}
                        checked={typeof value === 'boolean' ? value : undefined}
                        value={typeof value === 'number' ? value : undefined}
                        onChange={(e) => setScannerSettings(prev => ({
                          ...prev,
                          [key]: typeof value === 'boolean' ? e.target.checked : e.target.value
                        }))}
                        className={typeof value === 'boolean' 
                          ? 'h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500'
                          : 'w-full'
                        }
                      />
                      <span className="ml-3 text-sm text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    {typeof value === 'boolean' && (
                      <span className="text-xs text-gray-500">{value ? 'On' : 'Off'}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Results & Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={handleExportScans}
                  disabled={scanResults.length === 0}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg flex items-center justify-center disabled:opacity-50"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export Scan Results
                </button>
                
                <button
                  onClick={handleClearHistory}
                  disabled={scanResults.length === 0}
                  className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center disabled:opacity-50"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Clear History
                </button>
                
                <button
                  onClick={() => {
                    // Bulk process scanned items
                    const devices = scanResults
                      .filter(r => r.status === 'success')
                      .map(r => r.deviceId);
                    alert(`Processing ${devices.length} scanned devices...`);
                  }}
                  disabled={scanResults.filter(r => r.status === 'success').length === 0}
                  className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center disabled:opacity-50"
                >
                  <Package className="w-5 h-5 mr-2" />
                  Process Scanned ({scanResults.filter(r => r.status === 'success').length})
                </button>
                
                <button
                  onClick={() => {
                    // Upload scan file
                    alert("Upload scan file functionality");
                  }}
                  className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Scan File
                </button>
              </div>
            </div>

            {/* Recent Scans */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Recent Scans</h3>
                <span className="text-sm text-gray-600">{scanResults.length} total</span>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {scanResults.slice(0, 5).map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      result.status === 'success' 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {result.status === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                        )}
                        <span className="font-medium text-gray-900">{result.deviceId}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{result.message}</div>
                    <div className="text-xs text-gray-500 mt-2 flex items-center">
                      {result.type === 'barcode' ? (
                        <Barcode className="w-3 h-3 mr-1" />
                      ) : (
                        <QrCode className="w-3 h-3 mr-1" />
                      )}
                      {result.type.toUpperCase()}
                    </div>
                  </div>
                ))}
                
                {scanResults.length === 0 && (
                  <div className="text-center py-8">
                    <Scan className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No scans yet</p>
                    <p className="text-sm text-gray-500 mt-1">Start scanning to see results here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Scan Statistics */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-medium text-gray-900 mb-4">Scan Statistics</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-medium">
                      {stats.totalScans > 0 
                        ? `${Math.round((stats.successful / stats.totalScans) * 100)}%` 
                        : '0%'}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${stats.totalScans > 0 ? (stats.successful / stats.totalScans) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.totalScans}</div>
                    <div className="text-sm text-gray-600">Total Scans</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.duplicates}</div>
                    <div className="text-sm text-gray-600">Duplicates</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-blue-200">
                  <div className="text-sm text-gray-600">Last Scan</div>
                  <div className="font-medium text-gray-900">
                    {scanResults.length > 0 
                      ? new Date(scanResults[0].timestamp).toLocaleString() 
                      : 'No scans yet'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Scan History</h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {scanResults.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No scan history available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scanResults.map((result, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            {result.status === 'success' ? (
                              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{result.deviceId}</div>
                              <div className="text-sm text-gray-600">
                                {new Date(result.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            result.status === 'success' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {result.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700">{result.message}</div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500">
                            {result.type === 'barcode' ? 'Barcode' : 'QR Code'}
                          </span>
                          <button
                            onClick={() => {
                              // View device details
                              router.push(`/tablets/${result.deviceId}`);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            View Device
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Showing {scanResults.length} scan records
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleExportScans}
                    disabled={scanResults.length === 0}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Export
                  </button>
                  <button
                    onClick={handleClearHistory}
                    disabled={scanResults.length === 0}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Clear All
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