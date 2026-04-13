import { PrismaClient } from '@prisma/client';
import { mockTablets, mockParticipants, mockActiveIssuances, mockRecentLogs } from '@/data/mockdata';

const prisma = new PrismaClient();

async function main() {
  // Seed Users (demo from auth)
  await prisma.user.upsert({
    where: { email: 'admin@knbs.go.ke' },
    update: {},
    create: {
      email: 'admin@knbs.go.ke',
      name: 'Admin User',
      role: 'ADMIN',
      department: 'IT Administration',
      phone: '+254 700 123 456',
    },
  });

  await prisma.user.upsert({
    where: { email: 'manager@knbs.go.ke' },
    update: {},
    create: {
      email: 'manager@knbs.go.ke',
      name: 'Manager User',
      role: 'MANAGER',
      department: 'Field Operations',
      phone: '+254 700 234 567',
    },
  });

  // Seed Participants (from mock)
  for (const p of mockParticipants) {
    await prisma.participant.upsert({
      where: { email: p.email || `p${p.id}@mock.com` },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        location: p.location,
        status: p.status as any,
        activity: p.activity,
        tabletsIssued: p.tabletsIssued,
        tabletsReturned: p.tabletsReturned || 0,
        lastActivity: new Date(p.lastActivity),
        contractStatus: (p.contractStatus?.toUpperCase() as any || 'NONE'),
        joinDate: new Date(p.joinDate),
        contractEndDate: p.contractEndDate ? new Date(p.contractEndDate) : undefined,
        tabletSerial: p.tabletSerial,
        tabletModel: p.tabletModel,
        tabletStatus: p.tabletStatus ? (p.tabletStatus.toUpperCase() as any) : undefined,
        notes: p.notes,
      },
    });
  }

  // Seed Tablets (from mock)
  for (const t of mockTablets) {
    await prisma.tablet.upsert({
      where: { deviceId: t.deviceId },
      update: {},
      create: {
        id: t.id,
        deviceId: t.deviceId,
        model: t.model,
        status: t.status.toUpperCase() as any,
        battery: t.battery,
        storage: t.storage,
        ram: t.ram,
        os: t.os,
        lastSeen: t.lastSeen ? new Date(t.lastSeen) : undefined,
        assignedTo: t.assignedTo,
        assignedActivity: t.assignedActivity,
        location: t.location,
        purchaseDate: new Date(t.purchaseDate),
        warranty: t.warranty,
        lastChecked: new Date(t.lastChecked),
        condition: t.condition.toUpperCase() as any,
        serialNumber: t.serialNumber,
        imei: t.imei,
        barcode: t.barcode,
        department: t.department,
        notes: t.notes,
      },
    });
  }

  // Seed Issuances/Logs from mocks
  console.log('✅ Database seeded with mock data.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
