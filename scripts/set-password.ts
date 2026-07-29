#!/usr/bin/env tsx
import { hash } from 'bcryptjs';

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  let email: string | undefined;
  let password: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--email' && argv[i + 1]) {
      email = argv[i + 1];
      i++;
    } else if (a === '--password' && argv[i + 1]) {
      password = argv[i + 1];
      i++;
    }
  }

  if (!email || !password) {
    // Throw instead of process.exit() to avoid Windows libuv UV_HANDLE_CLOSING assertion
    throw new Error('Usage: tsx scripts/set-password.ts --email user@domain --password MyP@ss');
  }

  // Lazy-import prisma so it's never initialised on bad args
  const { prisma } = await import('../src/lib/db');

  try {
    const hashed = await hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: { password: hashed },
      create: {
        email,
        password: hashed,
        name: email === 'admin@knbs.go.ke' ? 'Admin User' : email,
        role: 'ADMIN',
      },
    });

    console.log(`✅ Password updated for ${user.email}`);
  } finally {
    // Disconnect cleanly so the Node process exits without libuv handle warnings
    await prisma.$disconnect();
  }
}

main().catch((e: Error) => {
  console.error(e.message ?? e);
  // Allow event loop to drain before exiting to avoid the UV_HANDLE_CLOSING crash on Windows
  setImmediate(() => process.exit(1));
});

