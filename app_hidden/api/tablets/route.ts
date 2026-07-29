import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { TabletDevice } from '@/types/tablets';

export async function GET() {
  try {
    const tablets = await prisma.tablet.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(tablets);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tablets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Omit<TabletDevice, 'id' | 'createdAt' | 'updatedAt'>;
    const tablet = await prisma.tablet.create({
      data: body,
    });
    return NextResponse.json(tablet, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tablet' }, { status: 500 });
  }
}
