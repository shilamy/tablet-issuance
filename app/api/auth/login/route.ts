import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { compare } from 'bcryptjs'; // Will need to install bcryptjs

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' });
    }

    // For demo, skip bcrypt - use plain password match (update to hashed in prod)
    // if (!(await compare(password, user.password ?? ''))) { // Add password field later
    if (user.email === email && ['admin123', 'manager123'].includes(password)) { // Demo match
      // In prod: set JWT/session cookie
      const response = NextResponse.json({ success: true, user });
      response.cookies.set('auth-token', 'demo-token', { httpOnly: true }); // Placeholder
      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid credentials' });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
