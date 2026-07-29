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
    if (!body.participantId || !body.tabletId || !body.expectedReturnDate || !body.checkoutLocation) {
      return NextResponse.json({ error: 'participantId, tabletId, expectedReturnDate and checkoutLocation are required' }, { status: 400 });
    }
    const issuance = await prisma.$transaction(async (tx) => {
      const tablet = await tx.tablet.findUnique({ where: { id: body.tabletId } });
      const participant = await tx.participant.findUnique({ where: { id: body.participantId } });
      if (!tablet || !participant) throw new Error('NOT_FOUND');
      if (tablet.status !== 'AVAILABLE') throw new Error('TABLET_UNAVAILABLE');
      const active = await tx.issuance.findFirst({ where: { participantId: body.participantId, status: 'ACTIVE' } });
      if (active) throw new Error('PARTICIPANT_ALREADY_HAS_TABLET');
      const created = await tx.issuance.create({
        data: { participantId: body.participantId, tabletId: body.tabletId, expectedReturnDate: new Date(body.expectedReturnDate), checkoutLocation: body.checkoutLocation, notes: body.notes, checkoutById: body.checkoutById },
        include: { participant: true, tablet: true },
      });
      await tx.tablet.update({ where: { id: tablet.id }, data: { status: 'ISSUED', location: body.checkoutLocation } });
      await tx.participant.update({ where: { id: participant.id }, data: { tabletsIssued: { increment: 1 }, status: 'ACTIVE', tabletSerial: tablet.deviceId, tabletModel: tablet.model, tabletStatus: 'active', issueDate: new Date(), expectedReturnDate: new Date(body.expectedReturnDate) } });
      return created;
    });
    return NextResponse.json(issuance, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const status = ['NOT_FOUND','TABLET_UNAVAILABLE','PARTICIPANT_ALREADY_HAS_TABLET'].includes(message) ? 409 : 500;
    return NextResponse.json({ error: message === 'NOT_FOUND' ? 'Participant or tablet not found' : message || 'Failed to create issuance' }, { status });
  }
}
