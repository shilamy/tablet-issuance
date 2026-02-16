"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, CameraOff, AlertCircle, Loader2, RotateCcw } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

export type ScannerMode = 'scanning' | 'success' | 'error' | 'loading' | 'camera_off' | 'permission_denied';

interface ScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanFailure?: (error: any) => void;
    isScanning: boolean;
    setIsScanning: (scanning: boolean) => void;
    scanMode?: 'qr' | 'barcode';
    containerId?: string;
    className?: string;
    showOverlay?: boolean;
}

export default function Scanner({
    onScanSuccess,
    onScanFailure,
    isScanning,
    setIsScanning,
    scanMode = 'qr',
    containerId = "scanner-container",
    className = "",
    showOverlay = true
}: ScannerProps) {
    const [scannerStatus, setScannerStatus] = useState<ScannerMode>('loading');
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [availableCameras, setAvailableCameras] = useState<Array<{ id: string, label: string }>>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>('');

    const scannerRef = useRef<Html5Qrcode | null>(null);
    const scannerContainerRef = useRef<HTMLDivElement>(null);

    // Initialize camera list
    useEffect(() => {
        const getCameras = async () => {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                    throw new Error("Camera API not supported");
                }
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');

                if (videoDevices.length > 0) {
                    setAvailableCameras(videoDevices.map(d => ({
                        id: d.deviceId,
                        label: d.label || `Camera ${d.deviceId.slice(0, 5)}...`
                    })));
                    // Prefer back camera if available (usually last in list on mobile, but environment facing mode handles usually)
                    setSelectedCamera(videoDevices[0].deviceId);
                } else {
                    setCameraError("No camera found");
                    setScannerStatus('error');
                }
            } catch (err: any) {
                console.error("Error getting cameras:", err);
                setCameraError(err.message || "Failed to access camera");
                setScannerStatus('permission_denied');
            }
        };

        getCameras();

        return () => {
            stopScannerInstance();
        };
    }, []);

    // Handle scanning state changes
    useEffect(() => {
        if (isScanning) {
            startScannerInstance();
        } else {
            stopScannerInstance();
            setScannerStatus('camera_off');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isScanning, selectedCamera]);

    const startScannerInstance = async () => {
        try {
            setCameraError(null);
            setScannerStatus('loading');

            // Stop existing instance if any
            await stopScannerInstance();

            if (!document.getElementById(containerId)) {
                console.warn(`Scanner container ${containerId} not found`);
                return;
            }

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
            };

            scannerRef.current = new Html5Qrcode(containerId);

            const cameraId = selectedCamera || (availableCameras[0]?.id);

            const successCallback = (decodedText: string, result: any) => {
                onScanSuccess(decodedText);
                // Don't stop automatically here, let parent decide via prop update
            };

            const errorCallback = (errorMessage: string) => {
                if (onScanFailure) onScanFailure(errorMessage);
            };

            if (!cameraId) {
                await scannerRef.current.start(
                    { facingMode: "environment" },
                    config,
                    successCallback,
                    errorCallback
                );
            } else {
                await scannerRef.current.start(
                    cameraId,
                    config,
                    successCallback,
                    errorCallback
                );
            }

            setScannerStatus('scanning');
        } catch (err: any) {
            console.error("Error starting scanner:", err);
            let errorMsg = "Failed to start camera";
            let status: ScannerMode = 'error';

            if (err.name === 'NotAllowedError') {
                errorMsg = "Camera access denied";
                status = 'permission_denied';
            } else if (err.name === 'NotFoundError') {
                errorMsg = "No camera found";
            } else if (err.name === 'NotReadableError') {
                errorMsg = "Camera in use by another app";
            }

            setCameraError(errorMsg);
            setScannerStatus(status);
            setIsScanning(false); // Propagate stop to parent
        }
    };

    const stopScannerInstance = async () => {
        try {
            if (scannerRef.current && scannerRef.current.isScanning) {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            }
        } catch (err) {
            console.error("Error stopping scanner:", err);
        }
    };

    const switchCamera = () => {
        if (availableCameras.length <= 1) return;

        const currentIndex = availableCameras.findIndex(c => c.id === selectedCamera);
        const nextIndex = (currentIndex + 1) % availableCameras.length;
        setSelectedCamera(availableCameras[nextIndex].id);
        // Effect will trigger restart
    };

    return (
        <div className={`relative rounded-xl overflow-hidden bg-black min-h-[300px] ${className}`}>
            {/* HTML5-QRCode Scanner Element */}
            <div id={containerId} className="w-full h-full" style={{ display: scannerStatus === 'scanning' ? 'block' : 'none' }}></div>

            {/* States Display */}
            {scannerStatus !== 'scanning' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-gray-900">
                    {scannerStatus === 'loading' && (
                        <>
                            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                            <p>Initializing camera...</p>
                        </>
                    )}
                    {scannerStatus === 'camera_off' && (
                        <>
                            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <CameraOff className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-400 mb-4">Camera is disabled</p>
                            <button
                                onClick={() => setIsScanning(true)}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                            >
                                Enable Camera
                            </button>
                        </>
                    )}
                    {(scannerStatus === 'error' || scannerStatus === 'permission_denied') && (
                        <>
                            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                            <p className="text-lg font-medium mb-2">Camera Error</p>
                            <p className="text-gray-400 mb-6">{cameraError}</p>
                            <button
                                onClick={() => setIsScanning(true)} // Try restart
                                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Try Again
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Overlay for scanning */}
            {showOverlay && scannerStatus === 'scanning' && (
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

                    {/* Controls Overlay */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-auto">
                        {availableCameras.length > 1 && (
                            <button
                                onClick={switchCamera}
                                className="px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-full text-sm backdrop-blur-sm flex items-center"
                            >
                                <Camera className="w-4 h-4 mr-2" />
                                Switch Camera
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
