export interface TabletDevice {
  id: string;
  deviceId: string;
  model: string;
  status: "available" | "issued" | "damaged" | "missing" | "maintenance";
  battery: number;
  storage: string;
  ram: string;
  os: string;
  lastSeen: string;
  assignedTo: string | null;
  assignedActivity: string | null;
  location: string;
  purchaseDate: string;
  warranty: string;
  lastChecked: string;
  condition: "excellent" | "good" | "fair" | "poor";
  serialNumber?: string;
  imei?: string;
  barcode?: string;
  department?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExportConfig {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  includeFields: (keyof TabletDevice)[];
  filename: string;
  includeTimestamp: boolean;
  compression: boolean;
  emailNotification: boolean;
}

export interface ScanResult {
  type: 'barcode' | 'qr';
  value: string;
  timestamp: string;
  deviceId?: string;
  status: 'success' | 'error' | 'duplicate';
  message?: string;
}