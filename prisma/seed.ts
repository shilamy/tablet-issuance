import { PrismaClient } from '@prisma/client';
import type { Participant as PrismaParticipant, Tablet as PrismaTablet } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Inlined mock data (previously in src/data/mockdata.ts)
const mockTablets = [
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

const mockParticipants = [
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

const prisma = new PrismaClient();

async function main() {
  // Seed users only with explicitly supplied credentials; never ship defaults.
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const managerPassword = process.env.SEED_MANAGER_PASSWORD;
  if (!adminPassword || !managerPassword) throw new Error('SEED_ADMIN_PASSWORD and SEED_MANAGER_PASSWORD are required');

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const managerHash = await bcrypt.hash(managerPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@knbs.go.ke' },
    update: { password: adminHash },
    create: {
      email: 'admin@knbs.go.ke',
      name: 'Admin User',
      role: 'ADMIN',
      department: 'IT Administration',
      phone: '+254 700 123 456',
      password: adminHash,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@knbs.go.ke' },
    update: { password: managerHash },
    create: {
      email: 'manager@knbs.go.ke',
      name: 'Manager User',
      role: 'MANAGER',
      department: 'Field Operations',
      phone: '+254 700 234 567',
      password: managerHash,
    },
  });

  // Seed Participants
  const createdParticipants: PrismaParticipant[] = [];
  for (const p of mockParticipants) {
    try {
      const cp = await prisma.participant.upsert({
        where: { email: p.email || `p${p.id}@mock.com` },
        update: {},
        create: {
          id: p.id,
          name: p.name,
          email: p.email || `p${p.id}@mock.com`,
          phone: p.phone,
          location: p.location || 'Unknown',
          status: (p.status || 'PENDING').toUpperCase(),
          activity: p.activity || 'General',
          tabletsIssued: p.tabletsIssued || 0,
          tabletsReturned: p.tabletsReturned || 0,
          lastActivity: p.lastActivity ? new Date(p.lastActivity) : undefined,
          contractStatus: (p.contractStatus || 'NONE').toUpperCase(),
          joinDate: p.joinDate ? new Date(p.joinDate) : new Date(),
          contractEndDate: p.contractEndDate ? new Date(p.contractEndDate) : undefined,
          supervisor: p.supervisor,
          notes: p.notes,
          tabletSerial: p.tabletSerial,
          tabletModel: p.tabletModel,
          tabletStatus: p.tabletStatus,
          issueDate: p.issueDate ? new Date(p.issueDate) : undefined,
          expectedReturnDate: p.expectedReturnDate ? new Date(p.expectedReturnDate) : undefined,
          actualReturnDate: p.actualReturnDate ? new Date(p.actualReturnDate) : undefined,
          batteryHealth: p.batteryHealth,
          storageUsed: p.storageUsed,
          wifiConnected: p.wifiConnected,
          lastSync: p.lastSync ? new Date(p.lastSync) : undefined,
        },
      });
      createdParticipants.push(cp);
    } catch (err) {
      console.warn('Failed to upsert participant', p.email, err);
    }
  }

  // Seed Tablets
  const createdTablets: PrismaTablet[] = [];
  for (const t of mockTablets) {
    try {
      const ct = await prisma.tablet.upsert({
        where: { deviceId: t.deviceId },
        update: {},
        create: {
          id: t.id,
          deviceId: t.deviceId,
          model: t.model || 'Unknown',
          status: (t.status || 'AVAILABLE').toUpperCase(),
          battery: t.battery,
          storage: t.storage,
          ram: t.ram,
          os: t.os,
          lastSeen: t.lastSeen ? new Date(t.lastSeen) : undefined,
          location: t.location,
          purchaseDate: t.purchaseDate ? new Date(t.purchaseDate) : undefined,
          warranty: t.warranty,
          lastChecked: t.lastChecked ? new Date(t.lastChecked) : undefined,
          condition: (t.condition || 'EXCELLENT').toUpperCase(),
          serialNumber: t.serialNumber,
          imei: t.imei,
          barcode: t.barcode,
          department: t.department,
          notes: t.notes,
        },
      });
      createdTablets.push(ct);
    } catch (err) {
      console.warn('Failed to upsert tablet', t.deviceId, err);
    }
  }

    // Seed RequestTablets (sample requests)
    const mockRequests = [
      {
        id: 'REQ-001',
        requester: 'Dr. Jane Mwangi',
        email: 'jane.mwangi@example.com',
        phone: '+254 711 000 111',
        activity: '2024 Kenya Population and Housing Census',
        quantity: 150,
        counties: ['Nairobi', 'Kiambu', 'Machakos'],
        type: 'main',
        notes: 'Requesting tablets for main enumeration team',
        status: 'PENDING',
      },
      {
        id: 'REQ-002',
        requester: 'Prof. Peter Ochieng',
        email: 'peter.ochieng@example.com',
        phone: '+254 722 000 222',
        activity: 'Continuous Household Surveys (KCHSP)',
        quantity: 45,
        counties: ['Kisumu', 'Siaya', 'Homa Bay'],
        type: 'pilot',
        notes: 'Pilot team request',
        status: 'PENDING',
      },
    ];

    // Ensure activities and counties exist, then create requests linking them
    const activityNames = Array.from(new Set(mockRequests.map((r) => r.activity)));
    for (const name of activityNames) {
      try {
        await prisma.activity.upsert({ where: { name }, update: {}, create: { name } });
      } catch (err) {
        console.warn('Failed to upsert activity', name, err);
      }
    }

    const countyNames = Array.from(new Set(mockRequests.flatMap((r) => r.counties || [])));
    for (const name of countyNames) {
      try {
        await prisma.county.upsert({ where: { name }, update: {}, create: { name } });
      } catch (err) {
        console.warn('Failed to upsert county', name, err);
      }
    }

    for (const r of mockRequests) {
      try {
        await prisma.requestTablets.upsert({
          where: { id: r.id },
          update: {},
          create: {
            id: r.id,
            requester: r.requester,
            email: r.email,
            phone: r.phone,
            quantity: r.quantity,
            type: r.type,
            notes: r.notes,
            status: r.status || 'PENDING',
            activity: { connect: { name: r.activity } },
            counties: r.counties && r.counties.length > 0 ? { connect: r.counties.map((c) => ({ name: c })) } : undefined,
          },
        });
      } catch (err) {
        console.warn('Failed to upsert request', r.id, err);
      }
    }

  // Create a few Issuances pairing first participants and tablets
  const issuancesToCreate = Math.min(createdParticipants.length, createdTablets.length, 3);
  for (let i = 0; i < issuancesToCreate; i++) {
    const participant = createdParticipants[i];
    const tablet = createdTablets[i];
    try {
      await prisma.issuance.upsert({
        where: { id: `seed-iss-${i}` },
        update: {},
        create: {
          id: `seed-iss-${i}`,
          participantId: participant.id,
          tabletId: tablet.id,
          expectedReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          checkoutLocation: 'Seed Script',
          status: 'ACTIVE',
          notes: 'Seeded issuance',
          checkoutById: admin.id,
        },
      });

      // mark tablet as ISSUED
      await prisma.tablet.update({ where: { id: tablet.id }, data: { status: 'ISSUED' } });
      // increment participant tabletsIssued
      await prisma.participant.update({ where: { id: participant.id }, data: { tabletsIssued: { increment: 1 } } as import('@prisma/client').Prisma.ParticipantUpdateInput });
    } catch (err) {
      console.warn('Failed to create issuance for', participant.id, tablet.id, err);
    }
  }

  // Create a few logs
  try {
    await prisma.log.createMany({
      data: [
        { userId: admin.id, action: 'seed', details: 'Seeded admin user and initial data' },
        { userId: manager.id, action: 'seed', details: 'Seeded manager user' },
      ],
    });
  } catch {
    // ignore if createMany fails on this provider
  }

  console.log('✅ Database seeded with participants, tablets, issuances and users.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
