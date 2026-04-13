import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const issuances = await prisma.issuance.findMany({
      include: { participant: true, tablet: true, checkoutBy: true },
      orderBy: { checkoutDate: 'desc' },
    });
    return NextResponse.json(issuances);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch issuances' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const issuance = await prisma.issuance.create({
      data: {
        ...body,
        checkoutById: body.checkoutById, // From session
      },
      include: { participant: true, tablet: true },
    });
    // Update tablet status
    await prisma.tablet.update({
      where: { id: body.tabletId },
      data: { status: 'ISSUED' },
    });
    return NextResponse.json(issuance, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create issuance' }, { status: 500 });
  }
}
