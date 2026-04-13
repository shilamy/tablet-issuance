// lib/import.ts - CSV/Excel import utilities

import { TabletDevice } from '@/types/tablets';
import { Participant } from '@/types/participants';

export interface ImportResult<T> {
  success: boolean;
  data: T[];
  errors: ImportError[];
  totalRows: number;
  importedCount: number;
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
}

export interface TabletCSVRow {
  deviceId?: string;
  model?: string;
  serialNumber?: string;
  imei?: string;
  os?: string;
  storage?: string;
  ram?: string;
  battery?: string | number;
  condition?: string;
  location?: string;
  purchaseDate?: string;
  warranty?: string;
  department?: string;
  notes?: string;
}

export interface ParticipantCSVRow {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  role?: string;
  activity?: string;
  supervisor?: string;
  notes?: string;
}

// Parse CSV string to array of objects
export function parseCSV(csvString: string): Record<string, string>[] {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim().replace(/^"|"$/g, '') || '';
    });
    rows.push(row);
  }
  
  return rows;
}

// Parse CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
}

// Validate and transform tablet CSV row to TabletDevice
export function validateTabletRow(row: Record<string, string>, index: number): { 
  data?: Partial<TabletDevice>; 
  error?: ImportError 
} {
  const errors: ImportError[] = [];
  
  const deviceId = row['deviceId'] || row['Device ID'] || row['device_id'] || row['ID'];
  const model = row['model'] || row['Model'] || row['device'];
  
  if (!deviceId) {
    return { error: { row: index + 2, field: 'deviceId', message: 'Device ID is required' } };
  }
  
  if (!model) {
    return { error: { row: index + 2, field: 'model', message: 'Model is required' } };
  }
  
  const battery = parseInt(String(row['battery'] || row['Battery'] || '100'));
  if (isNaN(battery) || battery < 0 || battery > 100) {
    return { error: { row: index + 2, field: 'battery', message: 'Battery must be 0-100' } };
  }
  
  const now = new Date().toISOString();
  
  return {
    data: {
      id: `IMP-${Date.now()}-${index}`,
      deviceId: deviceId,
      model: model,
      status: (row['status'] || row['Status'] || 'available').toLowerCase() as TabletDevice['status'],
      battery: battery,
      storage: row['storage'] || row['Storage'] || row['Memory'] || '64GB',
      ram: row['ram'] || row['RAM'] || row['Memory'] || '4GB',
      os: row['os'] || row['OS'] || row['Operating System'] || 'Android',
      lastSeen: row['lastSeen'] || row['Last Seen'] || now.split('T')[0],
      assignedTo: row['assignedTo'] || row['Assigned To'] || null,
      assignedActivity: row['assignedActivity'] || row['Activity'] || null,
      location: row['location'] || row['Location'] || 'Main Warehouse',
      purchaseDate: row['purchaseDate'] || row['Purchase Date'] || now.split('T')[0],
      warranty: row['warranty'] || row['Warranty'] || '1 year',
      lastChecked: row['lastChecked'] || row['Last Checked'] || now.split('T')[0],
      condition: (row['condition'] || row['Condition'] || 'good').toLowerCase() as TabletDevice['condition'],
      serialNumber: row['serialNumber'] || row['Serial Number'] || '',
      imei: row['imei'] || row['IMEI'] || '',
      department: row['department'] || row['Department'] || '',
      notes: row['notes'] || row['Notes'] || '',
      createdAt: now,
      updatedAt: now,
    }
  };
}

// Validate and transform participant CSV row to Participant
export function validateParticipantRow(row: Record<string, string>, index: number): { 
  data?: Partial<Participant>; 
  error?: ImportError 
} {
  const name = row['name'] || row['Name'] || row['participantName'];
  const email = row['email'] || row['Email'] || row['Email Address'];
  const phone = row['phone'] || row['Phone'] || row['Phone Number'] || row['Tel'];
  
  if (!name) {
    return { error: { row: index + 2, field: 'name', message: 'Name is required' } };
  }
  
  const now = new Date().toISOString();
  
  return {
    data: {
      id: `IMP-P-${Date.now()}-${index}`,
      name: name,
      email: email || '',
      phone: phone || '',
      location: row['location'] || row['Location'] || '',
      status: (row['status'] || row['Status'] || 'pending').toLowerCase() as Participant['status'],
      activity: row['activity'] || row['Activity'] || row['Survey'] || '',
      tabletsIssued: parseInt(row['tabletsIssued'] || row['Tablets Issued'] || '0') || 0,
      tabletsReturned: parseInt(row['tabletsReturned'] || row['Tablets Returned'] || '0') || 0,
      lastActivity: row['lastActivity'] || row['Last Activity'] || now.split('T')[0],
      contractStatus: (row['contractStatus'] || row['Contract Status'] || 'none') as Participant['contractStatus'],
      joinDate: row['joinDate'] || row['Join Date'] || row['Start Date'] || now.split('T')[0],
      contractEndDate: row['contractEndDate'] || row['Contract End Date'] || row['End Date'] || undefined,
      role: row['role'] || row['Role'] || row['Position'] || '',
      supervisor: row['supervisor'] || row['Supervisor'] || '',
      notes: row['notes'] || row['Notes'] || '',
    }
  };
}

// Import tablets from CSV
export function importTablets(csvString: string): ImportResult<TabletDevice> {
  const rows = parseCSV(csvString);
  const data: TabletDevice[] = [];
  const errors: ImportError[] = [];
  
  rows.forEach((row, index) => {
    const result = validateTabletRow(row, index);
    if (result.error) {
      errors.push(result.error);
    } else if (result.data) {
      data.push(result.data as TabletDevice);
    }
  });
  
  return {
    success: errors.length === 0,
    data,
    errors,
    totalRows: rows.length,
    importedCount: data.length,
  };
}

// Import participants from CSV
export function importParticipants(csvString: string): ImportResult<Participant> {
  const rows = parseCSV(csvString);
  const data: Participant[] = [];
  const errors: ImportError[] = [];
  
  rows.forEach((row, index) => {
    const result = validateParticipantRow(row, index);
    if (result.error) {
      errors.push(result.error);
    } else if (result.data) {
      data.push(result.data as Participant);
    }
  });
  
  return {
    success: errors.length === 0,
    data,
    errors,
    totalRows: rows.length,
    importedCount: data.length,
  };
}

// Generate sample CSV template
export function generateTabletTemplate(): string {
  return `deviceId,model,serialNumber,imei,os,storage,ram,battery,condition,location,department,notes
TAB-001,Samsung Galaxy Tab A8,SERIAL001,IMEI001,Android 12,64GB,4GB,100,good,Nairobi HQ,Survey,Test tablet
TAB-002,Lenovo Tab M10,SERIAL002,IMEI002,Android 11,32GB,3GB,95,excellent,Mombasa Office,Survey,Test tablet 2`;
}

export function generateParticipantTemplate(): string {
  return `name,email,phone,location,role,activity,supervisor
John Doe,john.doe@example.com,+254700123456,Nairobi,Field Officer,Household Survey,Jane Smith
Jane Smith,jane.smith@example.com,+254700234567,Mombasa,Supervisor,Household Survey,Manager`;
}

// Export to CSV
export function exportToCSV<T extends Record<string, unknown>>(data: T[], filename: string): void {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        const stringValue = value === null || value === undefined ? '' : String(value);
        // Escape quotes and wrap in quotes if contains comma
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
