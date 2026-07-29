import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/request-tablets - list requests with populated activity and counties
export async function GET() {
  try {
    const requests = await prisma.requestTablets.findMany({
      orderBy: { createdAt: 'desc' },
      include: { activity: true, counties: true },
    });

    return NextResponse.json(requests);
  } catch (err) {
    console.error('Failed to fetch request-tablets', err);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// POST /api/request-tablets - create a new request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { requester, email, phone, activityName, activityId, quantity, countyNames, countyIds, type, notes } = body;

    if (!requester || !(activityName || activityId) || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Resolve or create activity
    let activity;
    if (activityId) {
      activity = await prisma.activity.findUnique({ where: { id: activityId } });
    } else {
      activity = await prisma.activity.upsert({
        where: { name: activityName },
        update: {},
        create: { name: activityName },
      });
    }

    // Resolve counties: accept either ids or names
    const countyRecords = [] as any[];
    if (Array.isArray(countyIds) && countyIds.length > 0) {
      for (const id of countyIds) {
        const c = await prisma.county.findUnique({ where: { id } });
        if (c) countyRecords.push(c);
      }
    } else if (Array.isArray(countyNames)) {
      for (const name of countyNames) {
        const c = await prisma.county.upsert({ where: { name }, update: {}, create: { name } });
        countyRecords.push(c);
      }
    }

    const created = await prisma.requestTablets.create({
      data: {
        requester,
        email,
        phone,
        quantity: Number(quantity),
        type,
        notes,
        status: 'PENDING',
        activity: activity ? { connect: { id: activity.id } } : undefined,
        counties: countyRecords.length > 0 ? { connect: countyRecords.map((c) => ({ id: c.id })) } : undefined,
      },
      include: { activity: true, counties: true },
    });

    return NextResponse.json({ success: true, request: created }, { status: 201 });
  } catch (err) {
    console.error('Failed to create request', err);
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}
