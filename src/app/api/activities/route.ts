import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(activities);
  } catch (err) {
    console.error('Failed to list activities', err);
    return NextResponse.json({ error: 'Failed to list activities' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    const activity = await prisma.activity.upsert({ where: { name }, update: {}, create: { name } });
    return NextResponse.json(activity, { status: 201 });
  } catch (err) {
    console.error('Failed to create activity', err);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
