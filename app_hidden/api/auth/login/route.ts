import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { compare } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' });
    }

    const passwordOk = await compare(password, user.password);
    if (!passwordOk) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' });
    }

    // In prod: set JWT/session cookie
    const response = NextResponse.json({ success: true, user });
    response.cookies.set('auth-token', 'demo-token', { httpOnly: true }); // Placeholder
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

