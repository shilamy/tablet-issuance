"use client";

import { useState, useRef, useEffect } from "react";
import { 
  QrCode, Camera, CameraOff, Tablet, User, 
  Search, CheckCircle, AlertCircle, Loader2,
  ArrowLeft, LogOut, LogIn, Smartphone, RotateCcw,
  Zap, Scan, ScanLine, ScanSearch, ScanFace, ScanText,
  ChevronDown, ChevronUp, History, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";

// Import Html5QrcodeScanner from the library
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";

// Scanner states
type ScannerMode = 'scanning' | 'success' | 'error' | 'loading' | 'camera_off' | 'permission_denied';
type ScanType = 'checkout' | 'checkin' | 'universal';

export default function ScanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') as ScanType | null;
  
  const [scannerMode, setScannerMode] = useState<ScannerMode>('loading');
  const [scanType, setScanType] = useState<ScanType>(initialType || 'universal');
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [scanHistory, setScanHistory] = useState<Array<{code: string, timestamp: Date, type: ScanType}>>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<Array<{id: string, label: string}>>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>("");
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const manualInputRef = useRef<HTMLInputElement>(null);

  // Mock data for testing
  const mockQRCodes = {
    participant: "P-2024-00123",
    tablet: "KNBS-TAB-789",
    location: "KNBS-HQ-101"
  };

  // Initialize scanner and set current time
  useEffect(() => {
    initScanner();
    
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
    
    return () => {
      stopScanner();
      clearInterval(interval);
    };
  }, []);

  const initScanner = async () => {
    try {
      setScannerMode('loading');
      
      // Check if browser supports camera
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }

      // Get available cameras
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        throw new Error("No camera found on this device");
      }

      setAvailableCameras(videoDevices.map(device => ({
        id: device.deviceId,
        label: device.label || `Camera ${availableCameras.length + 1}`
      })));

      if (videoDevices.length > 0) {
        setSelectedCamera(videoDevices[0].deviceId);
      }

      // Start scanner automatically
      await startScanner();
      
    } catch (error: any) {
      console.error("Scanner init error:", error);
      setCameraError(error.message);
      setScannerMode('error');
    }
  };

  const startScanner = async () => {
    try {
      stopScanner(); // Stop any existing scanner

      if (!scannerContainerRef.current) return;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        disableFlip: false,
      };

      scannerRef.current = new Html5Qrcode("scanner-container");
      
      await scannerRef.current.start(
        { deviceId: { exact: selectedCamera } },
        config,
        onScanSuccess,
        onScanFailure
      );

      setScannerMode('scanning');
      setCameraError(null);
      
    } catch (error: any) {
      console.error("Scanner start error:", error);
      
      if (error.name === 'NotAllowedError') {
        setCameraError("Camera access was denied. Please enable camera permissions in your browser settings.");
        setScannerMode('permission_denied');
      } else if (error.name === 'NotFoundError') {
        setCameraError("No camera found on this device.");
        setScannerMode('error');
      } else if (error.name === 'NotSupportedError') {
        setCameraError("QR scanning is not supported in your browser.");
        setScannerMode('error');
      } else if (error.name === 'NotReadableError') {
        setCameraError("Camera is already in use by another application.");
        setScannerMode('error');
      } else {
        setCameraError("Failed to start camera. Please try again.");
        setScannerMode('error');
      }
    }
  };

  const stopScanner = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().then(() => {
        scannerRef.current?.clear();
      }).catch((error: any) => {
        console.error("Failed to stop scanner:", error);
      });
    }
  };

  const onScanSuccess = (decodedText: string) => {
    console.log("QR Code detected:", decodedText);
    
    // Debounce rapid scans
    if (scannedCode === decodedText) return;
    
    setScannedCode(decodedText);
    setScannerMode('success');
    
    // Add to scan history
    setScanHistory(prev => [
      { code: decodedText, timestamp: new Date(), type: scanType },
      ...prev.slice(0, 9) // Keep only last 10
    ]);
    
    // Stop scanner temporarily
    stopScanner();
    
    // Process the scanned code after a short delay
    setTimeout(() => {
      processScannedCode(decodedText);
    }, 1000);
  };

  const onScanFailure = (error: string) => {
    // Ignore normal scanning errors (no QR code found)
    console.log("Scan failure (normal):", error);
  };

  // Process the scanned code and determine action
  const processScannedCode = (code: string) => {
    const isTabletCode = /^(KNBS-TAB-|TAB-)/i.test(code);
    const isParticipantCode = /^(P-|PARTICIPANT-)/i.test(code);
    const isLocationCode = /^(LOC-|ROOM-)/i.test(code);

    if (scanType === 'checkout') {
      // For checkout, expect participant code
      if (isParticipantCode) {
        router.push(`/issuance/checkout?participant=${encodeURIComponent(code)}`);
      } else {
        // If tablet scanned during checkout, ask for participant
        router.push(`/issuance/checkout?tablet=${encodeURIComponent(code)}`);
      }
    } else if (scanType === 'checkin') {
      // For checkin, accept both tablet and participant codes
      if (isTabletCode) {
        router.push(`/issuance/checkin?tablet=${encodeURIComponent(code)}`);
      } else if (isParticipantCode) {
        router.push(`/issuance/checkin?participant=${encodeURIComponent(code)}`);
      } else {
        // Unknown code type - show error and restart scanner
        alert(`Unrecognized QR code format: ${code}\nExpected: Tablet (KNBS-TAB-...) or Participant (P-...) QR code`);
        resetScanner();
      }
    } else {
      // Universal scan - detect automatically
      if (isTabletCode) {
        router.push(`/issuance/checkin?tablet=${encodeURIComponent(code)}`);
      } else if (isParticipantCode) {
        // Check if this participant has an active issuance
        const hasActiveIssuance = true; // Replace with actual API check
        if (hasActiveIssuance) {
          router.push(`/issuance/checkin?participant=${encodeURIComponent(code)}`);
        } else {
          router.push(`/issuance/checkout?participant=${encodeURIComponent(code)}`);
        }
      } else if (isLocationCode) {
        router.push(`/locations/${encodeURIComponent(code)}`);
      } else {
        alert(`Unrecognized QR code: ${code}\nPlease scan a valid tablet or participant QR code.`);
        resetScanner();
      }
    }
  };

  // Manual input submit
  const handleManualSubmit = () => {
    const code = manualInput.trim();
    if (code) {
      setScannedCode(code);
      setScannerMode('success');
      stopScanner();
      processScannedCode(code);
    }
  };

  // Toggle camera on/off
  const toggleCamera = async () => {
    if (scannerMode === 'scanning') {
      stopScanner();
      setScannerMode('camera_off');
      setCameraError(null);
    } else {
      await startScanner();
    }
  };

  // Switch camera (front/back)
  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    // Find the next camera
    const currentIndex = availableCameras.findIndex(cam => cam.id === selectedCamera);
    const nextIndex = (currentIndex + 1) % availableCameras.length;
    setSelectedCamera(availableCameras[nextIndex].id);
    startScanner();
  };

  // Reset scanner
  const resetScanner = () => {
    setScannerMode('scanning');
    setScannedCode(null);
    setManualInput("");
    setCameraError(null);
    startScanner();
    if (manualInputRef.current) {
      manualInputRef.current.focus();
    }
  };

  // Quick test with mock codes
  const testWithMockCode = (type: 'participant' | 'tablet' | 'location') => {
    const code = mockQRCodes[type];
    setManualInput(code);
    setTimeout(() => {
      handleManualSubmit();
    }, 100);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.push('/issuance');
      }
      if (e.key === 'Enter' && manualInput) {
        handleManualSubmit();
      }
      if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        resetScanner();
      }
      if (e.key === 't' && e.ctrlKey) {
        e.preventDefault();
        testWithMockCode('tablet');
      }
      if (e.key === 'p' && e.ctrlKey) {
        e.preventDefault();
        testWithMockCode('participant');
      }
      if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        testWithMockCode('location');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [manualInput]);

  // Focus manual input when camera is off
  useEffect(() => {
    if (scannerMode === 'camera_off' && manualInputRef.current) {
      manualInputRef.current.focus();
    }
  }, [scannerMode]);

  // Format time for history - client-side only
  const formatTime = (date: Date) => {
    if (typeof window === 'undefined') return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get browser info client-side only
  const getBrowserInfo = () => {
    if (typeof navigator === 'undefined') return 'Unknown';
    return navigator.userAgent.split(' ')[0] || 'Unknown';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {/* Header */}
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <Link
                href="/issuance"
                className="inline-flex items-center gap-2 text-gray-300 hover:text-white group mb-3"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl">
                  <QrCode className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">QR Code Scanner</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <div className={`w-2 h-2 rounded-full ${
                  scannerMode === 'scanning' ? 'bg-green-500 animate-pulse' : 
                  scannerMode === 'success' ? 'bg-blue-500' :
                  scannerMode === 'error' ? 'bg-rose-500' : 'bg-gray-500'
                }`}></div>
                <span className="text-sm">
                  {scannerMode === 'scanning' ? 'Scanning...' : 
                   scannerMode === 'success' ? 'Code Detected' : 
                   scannerMode === 'error' ? 'Error' : 
                   scannerMode === 'permission_denied' ? 'Permission Denied' : 'Camera Off'}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={resetScanner}
                  className="p-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  title="Reset scanner (Ctrl+R)"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleCamera}
                  className="p-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  title={scannerMode === 'scanning' ? 'Turn camera off' : 'Turn camera on'}
                >
                  {scannerMode === 'scanning' ? (
                    <CameraOff className="w-5 h-5" />
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Scan Type Selector */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(['universal', 'checkout', 'checkin'] as ScanType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setScanType(type);
                  resetScanner();
                }}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  scanType === type
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {type === 'checkout' && <LogOut className="w-4 h-4" />}
                {type === 'checkin' && <LogIn className="w-4 h-4" />}
                {type === 'universal' && <Scan className="w-4 h-4" />}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Scanner Status */}
          <div className="text-center mb-6">
            <p className="text-gray-300 text-lg">
              {scanType === 'checkout' ? 'Scan a participant QR code to issue a tablet' :
               scanType === 'checkin' ? 'Scan a tablet or participant QR code to return' :
               'Scan any QR code - system will detect the appropriate action'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Place QR code within the scanner frame
            </p>
          </div>
        </div>

        {/* Main Scanner Area */}
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Scanner Column (2/3 width) */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gray-700/50">
                {scannerMode === 'scanning' ? (
                  <div className="relative">
                    {/* Real QR Scanner Container */}
                    <div id="scanner-container" ref={scannerContainerRef} className="relative rounded-xl overflow-hidden bg-black min-h-[400px]">
                      {/* Scanner will be rendered here by html5-qrcode */}
                    </div>
                    
                    {/* Scanner Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Scanner Frame */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-blue-500/50 rounded-xl">
                        {/* Corners */}
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-blue-500 rounded-tl-lg"></div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-blue-500 rounded-tr-lg"></div>
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-blue-500 rounded-bl-lg"></div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-blue-500 rounded-br-lg"></div>
                        
                        {/* Scanning Line */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan"></div>
                      </div>
                      
                      {/* Instructions */}
                      <div className="absolute bottom-8 left-0 right-0 text-center">
                        <div className="inline-flex items-center gap-2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full">
                          <ScanSearch className="w-4 h-4" />
                          <span className="text-sm">Align QR code within frame</span>
                        </div>
                      </div>
                    </div>

                    {/* Camera Controls */}
                    <div className="flex justify-center gap-4 mt-6">
                      {availableCameras.length > 1 && (
                        <button
                          onClick={switchCamera}
                          className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 text-sm flex items-center gap-2"
                          title="Switch Camera"
                        >
                          <Camera className="w-4 h-4" />
                          Switch Camera
                        </button>
                      )}
                    </div>
                  </div>
                ) : scannerMode === 'success' ? (
                  <div className="text-center py-12">
                    <div className="inline-flex flex-col items-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                      <h3 className="text-xl font-bold mb-2">QR Code Scanned Successfully!</h3>
                      <p className="text-gray-300 mb-6">Processing your request...</p>
                      <div className="bg-gray-800 px-6 py-4 rounded-xl mb-6 max-w-md mx-auto">
                        <div className="text-sm text-gray-400 mb-2">Scanned Code:</div>
                        <div className="font-mono text-lg break-all bg-gray-900/50 p-3 rounded-lg">
                          {scannedCode}
                        </div>
                      </div>
                      <div className="animate-pulse text-blue-400">
                        <Loader2 className="w-6 h-6 animate-spin inline mr-2" />
                        Redirecting to next step...
                      </div>
                    </div>
                  </div>
                ) : scannerMode === 'loading' ? (
                  <div className="text-center py-16">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
                    <p className="text-gray-300">Initializing scanner...</p>
                  </div>
                ) : scannerMode === 'permission_denied' ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Camera Permission Required</h3>
                    <p className="text-gray-300 mb-4">{cameraError}</p>
                    <div className="bg-gray-800/50 rounded-xl p-6 max-w-md mx-auto mb-6">
                      <h4 className="font-bold mb-3">How to enable camera:</h4>
                      <ol className="text-left text-sm text-gray-400 space-y-2">
                        <li>1. Click the camera icon in your browser&apos;s address bar</li>
                        <li>2. Select &quot;Allow&quot; for camera access</li>
                        <li>3. Refresh this page</li>
                      </ol>
                    </div>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                    >
                      Refresh Page
                    </button>
                  </div>
                ) : scannerMode === 'error' ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Scanner Error</h3>
                    <p className="text-gray-300 mb-6">{cameraError || "Failed to initialize scanner"}</p>
                    <button
                      onClick={resetScanner}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                ) : scannerMode === 'camera_off' ? (
                  <div className="text-center py-12">
                    <CameraOff className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Camera Disabled</h3>
                    <p className="text-gray-300 mb-6">Use manual input or enable camera</p>
                  </div>
                ) : null}

                {/* Manual Input Fallback */}
                <div className="mt-8 bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
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
                      placeholder="Enter QR code, tablet ID (KNBS-TAB-...), or participant ID (P-...)"
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
                  
                  {/* Test Buttons (Development Only) */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <div className="text-sm text-gray-400 mr-3">Test with:</div>
                    <button
                      onClick={() => testWithMockCode('participant')}
                      className="px-3 py-1.5 text-xs bg-blue-900/30 hover:bg-blue-900/50 rounded-lg border border-blue-700/30"
                    >
                      Participant QR
                    </button>
                    <button
                      onClick={() => testWithMockCode('tablet')}
                      className="px-3 py-1.5 text-xs bg-emerald-900/30 hover:bg-emerald-900/50 rounded-lg border border-emerald-700/30"
                    >
                      Tablet QR
                    </button>
                    <button
                      onClick={() => testWithMockCode('location')}
                      className="px-3 py-1.5 text-xs bg-purple-900/30 hover:bg-purple-900/50 rounded-lg border border-purple-700/30"
                    >
                      Location QR
                    </button>
                  </div>
                </div>

                {/* Scan History */}
                {scanHistory.length > 0 && (
                  <div className="mt-6 bg-gray-800/30 backdrop-blur-sm rounded-xl p-4">
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-2">
                        <History className="w-4 h-4" />
                        <span className="font-medium">Recent Scans ({scanHistory.length})</span>
                      </div>
                      {showHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    
                    {showHistory && (
                      <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                        {scanHistory.map((scan, index) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-mono text-sm truncate">{scan.code}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                {formatTime(scan.timestamp)} • {scan.type}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setManualInput(scan.code);
                                handleManualSubmit();
                              }}
                              className="ml-2 p-1.5 hover:bg-blue-500/20 rounded-lg"
                              title="Rescan this code"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
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
                  <Link
                    href="/issuance/checkout"
                    className="flex items-center gap-3 p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl transition-colors group"
                  >
                    <div className="p-2 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                      <LogOut className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Check-out Tablet</div>
                      <div className="text-sm text-gray-400">Issue new tablet to participant</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </Link>
                  
                  <Link
                    href="/issuance/checkin"
                    className="flex items-center gap-3 p-3 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl transition-colors group"
                  >
                    <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:scale-110 transition-transform">
                      <LogIn className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Check-in Tablet</div>
                      <div className="text-sm text-gray-400">Return tablet from participant</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </Link>
                  
                  <Link
                    href="/tablets"
                    className="flex items-center gap-3 p-3 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl transition-colors group"
                  >
                    <div className="p-2 bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform">
                      <Smartphone className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Tablet Inventory</div>
                      <div className="text-sm text-gray-400">View all available tablets</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </Link>
                  
                  <Link
                    href="/participants"
                    className="flex items-center gap-3 p-3 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl transition-colors group"
                  >
                    <div className="p-2 bg-amber-500/20 rounded-lg group-hover:scale-110 transition-transform">
                      <User className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Participants</div>
                      <div className="text-sm text-gray-400">Manage participant database</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </Link>
                </div>
              </div>

              {/* Help & Tips */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <h3 className="text-lg font-bold mb-4">Scanning Tips</h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-blue-500/20 rounded-lg mt-0.5">
                      <ScanLine className="w-4 h-4" />
                    </div>
                    <div>Ensure good lighting and hold the QR code steady</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-blue-500/20 rounded-lg mt-0.5">
                      <ScanFace className="w-4 h-4" />
                    </div>
                    <div>Keep the QR code within the scanner frame</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-blue-500/20 rounded-lg mt-0.5">
                      <ScanText className="w-4 h-4" />
                    </div>
                    <div>Use manual entry if the QR code is damaged</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-blue-500/20 rounded-lg mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>Keyboard shortcuts: Ctrl+T (Tablet), Ctrl+P (Participant), Ctrl+R (Reset)</div>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 backdrop-blur-sm rounded-2xl border border-blue-700/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Scanner Status</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm">Ready</span>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mode</span>
                    <span className="font-medium">{scanType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Camera</span>
                    <span className="font-medium">{availableCameras.length} available</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recent Scans</span>
                    <span className="font-medium">{scanHistory.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Scan</span>
                    <span className="font-medium">
                      {scanHistory[0] ? formatTime(scanHistory[0].timestamp) : 'Never'}
                    </span>
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
                <button
                  onClick={() => window.print()}
                  className="hover:text-gray-300"
                  title="Print this page"
                >
                  Print
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="hover:text-gray-300"
                  title="Copy scanner URL"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => window.open('/help/scanner', '_blank')}
                  className="hover:text-gray-300"
                  title="Get help"
                >
                  Help
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </Layout>
  );
}