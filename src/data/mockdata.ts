


import { Participant } from "@/types/participants";
import { TabletDevice } from "@/types/tablets";


export const mockTablets: TabletDevice[] = [
  {
    id: 'KNBS-TAB-001',
    deviceId: 'TAB-001',
    model: 'Samsung Galaxy Tab A8',
    status: 'issued',
    battery: 85,
    storage: '64GB',
    ram: '4GB',
    os: 'Android 12',
    lastSeen: '2024-01-15',
    assignedTo: 'John Doe',
    assignedActivity: 'Household Survey',
    location: 'Nairobi',
    purchaseDate: '2023-11-20',
    warranty: '1 year',
    lastChecked: '2024-01-20',
    condition: 'excellent',
    serialNumber: 'TAB-001-2024',
    imei: '123456789012345678',
    barcode: 'TAB-001-2024',
    department: 'Survey',
    notes: 'Issued to John Doe for household survey',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
];

export interface IssuanceLog {
  id: string;
  type: 'checkout' | 'checkin';
  participantId: string;
  participantName: string;
  tabletId: string;
  tabletModel: string;
  timestamp: string;
  location: string;
  performedBy: string;
  notes: string;
  duration?: string;
}

export interface ActiveIssuance {
  id: string;
  participantId: string;
  participantName: string;
  tabletId: string;
  tabletModel: string;
  checkedOutAt: string;
  expectedReturn: string;
  checkedOutBy: string;
  location: string;
}

/**
 * Mock Active Issuances
 */
export const mockActiveIssuances: ActiveIssuance[] = [
  {
    id: 'ACT-001',
    participantId: 'P-1001',
    participantName: 'John Doe',
    tabletId: 'KNBS-TAB-001',
    tabletModel: 'Samsung Galaxy Tab A8',
    checkedOutAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    expectedReturn: new Date(Date.now() + 5 * 86400000).toISOString(),
    checkedOutBy: 'Admin User',
    location: 'Nairobi Office',
  },
  {
    id: 'ACT-002',
    participantId: 'P-1002',
    participantName: 'Jane Smith',
    tabletId: 'KNBS-TAB-002',
    tabletModel: 'Lenovo Tab M10',
    checkedOutAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    expectedReturn: new Date(Date.now() + 6 * 86400000).toISOString(),
    checkedOutBy: 'Manager',
    location: 'Mombasa Field',
  },
];

/**
 * Mock Issuance Logs
 */
export const mockRecentLogs: IssuanceLog[] = [
  {
    id: 'LOG-001',
    type: 'checkout',
    participantId: 'P-1003',
    participantName: 'David Kimani',
    tabletId: 'KNBS-TAB-003',
    tabletModel: 'iPad 9th Gen',
    timestamp: new Date().toISOString(),
    location: 'Kisumu Warehouse',
    performedBy: 'Supervisor',
    notes: 'Field survey equipment',
  },
  {
    id: 'LOG-002',
    type: 'checkin',
    participantId: 'P-1004',
    participantName: 'Grace Omondi',
    tabletId: 'KNBS-TAB-004',
    tabletModel: 'Samsung Galaxy Tab S6 Lite',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    location: 'Nairobi HQ',
    performedBy: 'IT Support',
    notes: 'Returned after maintenance',
    duration: '7 days',
  },
  {
    id: 'LOG-003',
    type: 'checkout',
    participantId: 'P-1005',
    participantName: 'Michael Otieno',
    tabletId: 'KNBS-TAB-005',
    tabletModel: 'Lenovo Tab P11',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    location: 'Thika Field',
    performedBy: 'Field Manager',
    notes: 'Population census project',
  },
];

export const mockParticipants: Participant[] = [
  {
    id: "P001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+254 712 345 678",
    location: "Nairobi",
    status: "active",
    activity: "Household Survey",
    tabletsIssued: 1,
    tabletsReturned: 0,
    lastActivity: "2024-01-15",
    contractStatus: "active",
    joinDate: "2023-11-20",
    contractEndDate: "2024-05-20",
    role: "Field Officer",
    tabletSerial: "TBL-001-2024",
    tabletModel: "Samsung Galaxy Tab A8",
    tabletStatus: "active",
    issueDate: "2024-01-15",
    expectedReturnDate: "2024-06-15",
    batteryHealth: 85,
    storageUsed: 32,
    wifiConnected: true,
    lastSync: "2024-01-20 14:30",
    supervisor: "Mary Johnson",
    notes: "Responsible field officer"
  },
  {
    id: "P002",
    name: "Mary Wilson",
    email: "mary.w@example.com",
    phone: "+254 723 456 789",
    location: "Mombasa",
    status: "active",
    activity: "Agricultural Census",
    tabletsIssued: 1,
    tabletsReturned: 0,
    lastActivity: "2024-01-14",
    contractStatus: "active",
    joinDate: "2023-10-15",
    contractEndDate: "2024-04-15",
    role: "Supervisor",
    tabletSerial: "TBL-002-2024",
    tabletModel: "iPad 9th Gen",
    tabletStatus: "damaged",
    issueDate: "2024-01-10",
    expectedReturnDate: "2024-06-10",
    batteryHealth: 65,
    storageUsed: 45,
    wifiConnected: false,
    lastSync: "2024-01-19 10:15",
    supervisor: "David Kim",
    notes: "Screen cracked - needs repair"
  },
  {
    id: "P003",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    phone: "+254 734 567 890",
    location: "Kisumu",
    status: "pending",
    activity: "Business Survey",
    tabletsIssued: 0,
    tabletsReturned: 0,
    lastActivity: "2024-01-10",
    contractStatus: "none",
    joinDate: "2024-01-05",
    contractEndDate: undefined,
    role: "Enumerator",
    tabletSerial: "",
    tabletModel: "",
    tabletStatus: "lost",
    issueDate: "2024-01-05",
    expectedReturnDate: "2024-06-05",
    batteryHealth: 30,
    storageUsed: 78,
    wifiConnected: true,
    lastSync: "2024-01-15 09:00",
    supervisor: "Sarah Chen",
    notes: "Tablet reported lost"
  },
  {
    id: "P004",
    name: "Sarah Chen",
    email: "sarah.c@example.com",
    phone: "+254 745 678 901",
    location: "Nakuru",
    status: "active",
    activity: "Household Survey",
    tabletsIssued: 1,
    tabletsReturned: 1,
    lastActivity: "2024-01-13",
    contractStatus: "active",
    joinDate: "2023-09-12",
    contractEndDate: "2024-03-12",
    role: "Team Lead",
    tabletSerial: "TBL-004-2024",
    tabletModel: "Samsung Galaxy Tab S6",
    tabletStatus: "returned",
    issueDate: "2023-12-20",
    expectedReturnDate: "2024-05-20",
    actualReturnDate: "2024-01-18",
    batteryHealth: 90,
    storageUsed: 25,
    wifiConnected: false,
    lastSync: "2024-01-18 16:45",
    supervisor: "Peter Mbogo",
    notes: "Returned early - survey completed"
  },
  {
    id: "P005",
    name: "David Kimani",
    email: "david.k@example.com",
    phone: "+254 756 789 012",
    location: "Eldoret",
    status: "inactive",
    activity: "Population Census",
    tabletsIssued: 1,
    tabletsReturned: 0,
    lastActivity: "2023-12-20",
    contractStatus: "expired",
    joinDate: "2023-08-25",
    contractEndDate: "2024-02-25",
    role: "Field Officer",
    tabletSerial: "TBL-005-2024",
    tabletModel: "iPad Air",
    tabletStatus: "active",
    issueDate: "2024-01-01",
    expectedReturnDate: "2024-06-01",
    batteryHealth: 75,
    storageUsed: 40,
    wifiConnected: true,
    lastSync: "2024-01-10 11:20",
    supervisor: "Lucy Wanjiku",
    notes: "Contract expired"
  },
  {
    id: "P006",
    name: "Grace Omondi",
    email: "grace.o@example.com",
    phone: "+254 767 890 123",
    location: "Nairobi",
    status: "active",
    activity: "Health Survey",
    tabletsIssued: 1,
    tabletsReturned: 0,
    lastActivity: "2024-01-12",
    contractStatus: "active",
    joinDate: "2023-12-01",
    contractEndDate: "2024-06-01",
    role: "Data Collector",
    tabletSerial: "TBL-006-2024",
    tabletModel: "Samsung Galaxy Tab A7",
    tabletStatus: "maintenance",
    issueDate: "2024-01-12",
    expectedReturnDate: "2024-06-12",
    batteryHealth: 95,
    storageUsed: 28,
    wifiConnected: true,
    lastSync: "2024-01-20 08:45",
    supervisor: "James Mutua",
    notes: "Battery replacement needed"
  },
  {
    id: "P007",
    name: "Peter Mbogo",
    email: "peter.m@example.com",
    phone: "+254 778 901 234",
    location: "Kisii",
    status: "pending",
    activity: "Education Survey",
    tabletsIssued: 0,
    tabletsReturned: 0,
    lastActivity: "2024-01-09",
    contractStatus: "none",
    joinDate: "2024-01-08",
    contractEndDate: undefined,
    role: "Enumerator",
    tabletSerial: "",
    tabletModel: "",
    tabletStatus: "active",
    issueDate: "2024-01-08",
    expectedReturnDate: "2024-06-08",
    batteryHealth: 50,
    storageUsed: 60,
    wifiConnected: false,
    lastSync: "2024-01-16 13:10",
    supervisor: "Ann Wangari",
    notes: "Awaiting tablet assignment"
  },
  {
    id: "P008",
    name: "Lucy Wanjiku",
    email: "lucy.w@example.com",
    phone: "+254 789 012 345",
    location: "Thika",
    status: "active",
    activity: "Agricultural Census",
    tabletsIssued: 1,
    tabletsReturned: 0,
    lastActivity: "2024-01-14",
    contractStatus: "active",
    joinDate: "2023-11-30",
    contractEndDate: "2024-05-30",
    role: "Field Officer",
    tabletSerial: "TBL-008-2024",
    tabletModel: "iPad 10th Gen",
    tabletStatus: "active",
    issueDate: "2024-01-03",
    expectedReturnDate: "2024-06-03",
    batteryHealth: 80,
    storageUsed: 35,
    wifiConnected: true,
    lastSync: "2024-01-20 15:20",
    supervisor: "Brian Ochieng",
    notes: "New team member"
  },
];
