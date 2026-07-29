'use strict';
/**
 * Reset a user's password directly via Prisma.
 * Runs with plain `node` — no tsx, no TypeScript compilation.
 *
 * Usage:   node scripts/reset-pw.js <email> <newPassword>
 * Example: node scripts/reset-pw.js admin@knbs.go.ke admin123
 */

const path = require('path');

// resolve bcryptjs from the project's node_modules
const bcrypt = require(path.resolve(__dirname, '../node_modules/bcryptjs'));
const { PrismaClient } = require(path.resolve(__dirname, '../node_modules/@prisma/client'));

const [email, newPassword] = process.argv.slice(2);

if (!email || !newPassword) {
    console.error('Usage: node scripts/reset-pw.js <email> <newPassword>');
    console.error('Example: node scripts/reset-pw.js admin@knbs.go.ke admin123');
    process.exitCode = 1;
    return;
}

// Load DATABASE_URL from .env manually (dotenv not installed, use fs)
const fs = require('fs');
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
        const match = line.match(/^\s*([^#=\s]+)\s*=\s*"?(.+?)"?\s*$/);
        if (match) {
            process.env[match[1]] = match[2];
        }
    }
}

const prisma = new PrismaClient();

async function main() {
    const hashed = await bcrypt.hash(newPassword, 10);

    const user = await prisma.user.update({
        where: { email },
        data: { password: hashed },
    });

    console.log(`\u2705 Password updated for ${user.email}`);
}

main()
    .catch((err) => {
        console.error('\u274c Error:', err.message || err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
