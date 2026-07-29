import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hash } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) return NextResponse.json({ success: false, error: 'Token and password required' }, { status: 400 });

    const record = await prisma.passwordReset.findUnique({ where: { token } });
    if (!record) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 400 });
    if (record.used) return NextResponse.json({ success: false, error: 'Token already used' }, { status: 400 });
    if (record.expiresAt < new Date()) return NextResponse.json({ success: false, error: 'Token expired' }, { status: 400 });

    const hashed = await hash(password, 10);

    await prisma.user.update({ where: { id: record.userId }, data: { password: hashed } });
    await prisma.passwordReset.update({ where: { id: record.id }, data: { used: true } });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Reset failed' }, { status: 500 });
  }
}
