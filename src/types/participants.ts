export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "active" | "inactive" | "pending";
  activity: string;
  tabletsIssued: number;
  lastActivity: string;
  contractStatus: "active" | "expired" | "none";
  joinDate: string;
  role?: string;
  // Tablet-specific fields
  tabletSerial?: string;
  tabletModel?: string;
  tabletStatus?: "active" | "damaged" | "returned" | "lost" | "maintenance";
  issueDate?: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  batteryHealth?: number;
  storageUsed?: number;
  wifiConnected?: boolean;
  lastSync?: string;
  supervisor?: string;
  notes?: string;
}