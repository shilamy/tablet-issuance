export interface IssuanceRecord {
    id: string;
    participantId: string;
    participantName: string;
    tabletId: string;
    tabletModel: string;
    checkoutDate: string;
    expectedReturnDate: string;
    actualReturnDate?: string;
    checkoutLocation: string;
    checkinLocation?: string;
    checkoutBy: string;
    checkinBy?: string;
    status: "active" | "returned" | "overdue";
    notes?: string;
    activity: string;
}

export interface CheckOutData {
    participantId: string;
    tabletId: string;
    expectedReturnDate: string;
    location: string;
    activity: string;
    notes?: string;
}

export interface CheckInData {
    issuanceId: string;
    actualReturnDate: string;
    location: string;
    condition?: "excellent" | "good" | "fair" | "poor" | "damaged";
    notes?: string;
}

export interface BulkOperation {
    type: "checkout" | "checkin";
    items: string[]; // Array of tablet IDs or participant IDs
    timestamp: string;
    processedBy: string;
}
