import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tablet = await prisma.tablet.findUnique({
      where: { id: params.id },
    });
    if (!tablet) return NextResponse.json({ error: 'Tablet not found' }, { status: 404 });
    return NextResponse.json(tablet);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tablet' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const tablet = await prisma.tablet.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(tablet);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tablet' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.tablet.delete({
      where: { id: params.id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tablet' }, { status: 500 });
  }
}
