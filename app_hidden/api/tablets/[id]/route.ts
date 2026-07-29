import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tablet = await prisma.tablet.findUnique({
      where: { id },
    });
    if (!tablet) return NextResponse.json({ error: 'Tablet not found' }, { status: 404 });
    return NextResponse.json(tablet);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tablet' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const tablet = await prisma.tablet.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(tablet);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tablet' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.tablet.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tablet' }, { status: 500 });
  }
}
