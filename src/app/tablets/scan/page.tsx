"use client";

import { useState, useRef, useEffect } from "react";
import {
  QrCode, Barcode, Camera, ChevronLeft, RefreshCw,
  Search, CheckCircle, XCircle, AlertCircle,
  Download, History, Scan, StopCircle, Maximize2, Minimize2,
  CameraOff, ScanLine, ScanFace, ScanText, Zap, ChevronDown, ChevronUp, ChevronRight,
  Tablet
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { ScanResult } from "@/types/tablets";
import Scanner from "@/components/Scanner";

export default function ScanPage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<'barcode' | 'qr'>('barcode');
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [manualInput, setManualInput] = useState("");
  const [scannerSettings, setScannerSettings] = useState({
    audioFeedback: true,
    vibration: true,
    zoom: 1,
  });
  const [showHistory, setShowHistory] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");

  const manualInputRef = useRef<HTMLInputElement>(null);

  // Initialize time and cameras
  useEffect(() => {
    // Set current time on client only
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Check for available cameras
    const getCameras = async () => {
      try {
        if (navigator?.mediaDevices?.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInput = devices.filter(device => device.kind === 'videoinput');
          setAvailableCameras(videoInput);
        }
      } catch (err) {
        console.error("Error enumerating cameras:", err);
      }
    };
    getCameras();

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Initialize scanning on mount (optional, matches other page?)
  // Actually the other page starts scanning on mount. Let's do that for consistency unless manual start is preferred.
  // The previous implementation had manual start/stop button but defaulted to false? 
  // Let's default to false to let user choose, but maybe auto-start is better for UX.
  // I'll keep it false initially to match previous logic but give clear UI to start.
  // Wait, the other page (issuance) starts automatically. Uniformity suggests auto-start.
  useEffect(() => {
    setIsScanning(true);
  }, []);

  // Focus manual input when camera is off
  useEffect(() => {
    if (!isScanning && manualInputRef.current) {
      manualInputRef.current.focus();
    }
  }, [isScanning]);

  const onScanSuccess = (decodedText: string) => {
    // Play sound if enabled
    if (scannerSettings.audioFeedback) {
      const audio = new Audio('/audio/beep.mp3');
      audio.play().catch(e => console.log("Audio play failed", e));
    }

    // Vibrate if enabled
    if (scannerSettings.vibration && navigator.vibrate) {
      navigator.vibrate(200);
    }

    // Process result
    const isTabletId = decodedText.includes('TAB') || decodedText.includes('KNBS');

    const result: ScanResult = {
      type: scanMode,
      value: decodedText,
      timestamp: new Date().toISOString(),
      deviceId: isTabletId ? decodedText : undefined,
      status: isTabletId ? 'success' : 'error',
      message: isTabletId
        ? `Valid Tablet ID detected: ${decodedText}`
        : `Scanned code: ${decodedText} (Not a recognized Tablet ID format)`
    };

    setScanResults(prev => [result, ...prev]);

    // Pause scanning briefly to avoid duplicates
    setIsScanning(false);
    setTimeout(() => {
      setIsScanning(true);
    }, 1500);
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      // Simulate a scan result
      const isTabletId = manualInput.includes('TAB') || manualInput.includes('KNBS');

      const result: ScanResult = {
        type: 'barcode', // weak assumption
        value: manualInput,
        timestamp: new Date().toISOString(),
        deviceId: manualInput,
        status: isTabletId ? 'success' : 'error',
        message: isTabletId
          ? `Manually entered: ${manualInput}`
          : `Entry ${manualInput} may not be a valid ID`
      };

      setScanResults(prev => [result, ...prev]);
      setManualInput("");
    }
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
      arr.findIndex(a => a.value === r.value) !== i
    ).length,
  };

  // Format time for history - client-side only
  const formatTime = (isoString: string) => {
    if (typeof window === 'undefined') return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {/* Header */}
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <Link
                href="/tablets"
                className="inline-flex items-center gap-2 text-gray-300 hover:text-white group mb-3"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Inventory
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl">
                  {scanMode === 'barcode' ? <Barcode className="w-6 h-6" /> : <QrCode className="w-6 h-6" />}
                </div>
                <h1 className="text-3xl font-bold">Tablet Scanner</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-sm">
                  {isScanning ? 'Scanning...' : 'Scanner Paused'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsScanning(!isScanning)}
                  className="p-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  title={isScanning ? 'Pause Scanner' : 'Resume Scanner'}
                >
                  {isScanning ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => router.refresh()}
                  className="p-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  title="Refresh Page"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setScanMode('barcode')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${scanMode === 'barcode'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg'
                : 'bg-white/10 hover:bg-white/20'
                }`}
            >
              <Barcode className="w-4 h-4" />
              Barcode Mode
            </button>
            <button
              onClick={() => setScanMode('qr')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${scanMode === 'qr'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg'
                : 'bg-white/10 hover:bg-white/20'
                }`}
            >
              <QrCode className="w-4 h-4" />
              QR Code Mode
            </button>
          </div>

          {/* Scanner Status */}
          <div className="text-center mb-6">
            <p className="text-gray-300 text-lg">
              Scan {scanMode === 'barcode' ? 'barcodes' : 'QR codes'} to verify tablet inventory
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Ensure proper lighting and hold code steady
            </p>
          </div>
        </div>

        {/* Main Scanner Area */}
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Scanner Column (2/3 width) */}
            <div className="lg:col-span-2">
              <div className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gray-700/50 ${fullscreen ? 'fixed inset-0 z-50 m-0 rounded-none h-screen bg-black' : ''}`}>

                {/* Fullscreen Controls */}
                {fullscreen && (
                  <div className="absolute top-4 right-4 z-50">
                    <button
                      onClick={() => setFullscreen(false)}
                      className="p-2 bg-black/50 text-white rounded-lg backdrop-blur-sm"
                    >
                      <Minimize2 className="w-6 h-6" />
                    </button>
                  </div>
                )}

                <div className="relative rounded-xl overflow-hidden min-h-[400px]">
                  {!fullscreen && (
                    <div className="absolute top-2 right-2 z-10">
                      <button
                        onClick={() => setFullscreen(true)}
                        className="p-2 bg-black/30 text-white hover:bg-black/50 rounded-lg backdrop-blur-sm transition-colors"
                        title="Fullscreen"
                      >
                        <Maximize2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <Scanner
                    isScanning={isScanning}
                    setIsScanning={setIsScanning}
                    onScanSuccess={onScanSuccess}
                    scanMode={scanMode}
                    className="h-full min-h-[400px]"
                  />

                  {/* Stats Overlay (on top of scanner) */}
                  <div className="absolute top-4 left-4 flex gap-4 pointer-events-none">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Total</div>
                      <div className="text-lg font-bold">{stats.totalScans}</div>
                    </div>
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                      <div className="text-xs text-green-400 uppercase tracking-wider">Success</div>
                      <div className="text-lg font-bold text-green-400">{stats.successful}</div>
                    </div>
                  </div>
                </div>

                {/* Manual Input Fallback */}
                <div className={`mt-8 bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 ${fullscreen ? 'hidden' : ''}`}>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Manual Entry
                  </h3>
                  <div className="flex gap-2">
                    <input
                      ref={manualInputRef}
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="Enter device ID manually"
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
                    />
                    <button
                      onClick={handleManualSubmit}
                      disabled={!manualInput.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-medium"
                    >
                      Submit
                    </button>
                  </div>
                </div>

                {/* Scan History List (Preview) */}
                {scanResults.length > 0 && !fullscreen && (
                  <div className="mt-6 bg-gray-800/30 backdrop-blur-sm rounded-xl p-4">
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-2">
                        <History className="w-4 h-4" />
                        <span className="font-medium">Recent Scans ({scanResults.length})</span>
                      </div>
                      {showHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    {showHistory && (
                      <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                        {scanResults.map((result, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/50 border ${result.status === 'success' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                {result.status === 'success' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                                <div className="font-mono text-sm truncate">{result.value}</div>
                              </div>
                              <div className="text-xs text-gray-400 mt-1 pl-6">
                                {formatTime(result.timestamp)} • {result.message}
                              </div>
                            </div>
                            {result.deviceId && (
                              <Link href={`/tablets/${result.deviceId}`} className="ml-2 text-blue-400 hover:text-blue-300 text-xs">
                                View
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar (1/3 width) */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleExportScans}
                    disabled={scanResults.length === 0}
                    className="w-full flex items-center gap-3 p-3 bg-blue-500/10 hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors group text-left"
                  >
                    <div className="p-2 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                      <Download className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-200">Export Results</div>
                      <div className="text-sm text-gray-400">Download JSON report</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </button>

                  <button
                    onClick={handleClearHistory}
                    disabled={scanResults.length === 0}
                    className="w-full flex items-center gap-3 p-3 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors group text-left"
                  >
                    <div className="p-2 bg-red-500/20 rounded-lg group-hover:scale-110 transition-transform">
                      <XCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-200">Clear History</div>
                      <div className="text-sm text-gray-400">Remove all scans</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Scanning Tips */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <h3 className="text-lg font-bold mb-4">Scanning Tips</h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-blue-500/20 rounded-lg mt-0.5">
                      <ScanLine className="w-4 h-4" />
                    </div>
                    <div>Hold the scanner steady while focusing</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-blue-500/20 rounded-lg mt-0.5">
                      <ScanFace className="w-4 h-4" />
                    </div>
                    <div>Keep the code fully within the frame</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-blue-500/20 rounded-lg mt-0.5">
                      <ScanText className="w-4 h-4" />
                    </div>
                    <div>Use manual entry if code is damaged</div>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 backdrop-blur-sm rounded-2xl border border-blue-700/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Scanner Status</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                    <span className="text-sm">{isScanning ? 'Active' : 'Standby'}</span>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mode</span>
                    <span className="font-medium capitalize">{scanMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Camera</span>
                    <span className="font-medium">{availableCameras.length} available</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Session Scans</span>
                    <span className="font-medium">{scanResults.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-700/50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  Scanner ready
                </span>
                <span>Current time: {currentTime || "Loading..."}</span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => window.print()} className="hover:text-gray-300">Print</button>
                <button onClick={() => window.open('/help/scanner', '_blank')} className="hover:text-gray-300">Help</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}