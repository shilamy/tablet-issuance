import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const counties = await prisma.county.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(counties);
  } catch (err) {
    console.error('Failed to list counties', err);
    return NextResponse.json({ error: 'Failed to list counties' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    const county = await prisma.county.upsert({ where: { name }, update: {}, create: { name } });
    return NextResponse.json(county, { status: 201 });
  } catch (err) {
    console.error('Failed to create county', err);
    return NextResponse.json({ error: 'Failed to create county' }, { status: 500 });
  }
}
