import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await prisma.$transaction(async (tx) => {
      const issuance = await tx.issuance.findUnique({ where: { id }, include: { tablet: true } });
      if (!issuance) throw new Error('NOT_FOUND');
      if (issuance.status !== 'ACTIVE') throw new Error('ALREADY_RETURNED');
      const updated = await tx.issuance.update({ where: { id }, data: { status: 'RETURNED', actualReturnDate: new Date(body.actualReturnDate || new Date()), checkinLocation: body.checkinLocation, notes: body.notes, checkinById: body.checkinById }, include: { participant: true, tablet: true } });
      await tx.tablet.update({ where: { id: issuance.tabletId }, data: { status: body.condition?.toUpperCase() === 'DAMAGED' ? 'DAMAGED' : 'AVAILABLE', condition: body.condition?.toUpperCase(), location: body.checkinLocation } });
      await tx.participant.update({ where: { id: issuance.participantId }, data: { tabletsReturned: { increment: 1 }, tabletStatus: 'returned', actualReturnDate: updated.actualReturnDate, tabletSerial: null, tabletModel: null, expectedReturnDate: null } });
      return updated;
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    return NextResponse.json({ error: message === 'NOT_FOUND' ? 'Issuance not found' : message === 'ALREADY_RETURNED' ? 'Issuance is already returned' : 'Failed to check in tablet' }, { status: message === 'NOT_FOUND' ? 404 : message === 'ALREADY_RETURNED' ? 409 : 500 });
  }
}
