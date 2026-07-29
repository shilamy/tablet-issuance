/**
 * Standalone password-reset helper – no tsx, no Prisma engine.
 * Uses only built-in Node.js modules + bcryptjs (already installed).
 *
 * Usage:  node scripts/reset-admin-pw.mjs <email> <newPassword>
 * Example: node scripts/reset-admin-pw.mjs admin@knbs.go.ke admin123
 */
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import Database from 'better-sqlite3';

const require = createRequire(import.meta.url);
const bcrypt = require('bcryptjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const [email, password] = process.argv.slice(2);

if (!email || !password) {
    console.error('Usage: node scripts/reset-admin-pw.mjs <email> <newPassword>');
    process.exitCode = 1;
    process.exit();
}

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');

let db;
try {
    db = new Database(dbPath);
} catch (err) {
    console.error('Could not open database at', dbPath);
    console.error(err.message);
    process.exitCode = 1;
    process.exit();
}

const hashed = bcrypt.hashSync(password, 10);

const stmt = db.prepare(`UPDATE users SET password = ? WHERE email = ?`);
const result = stmt.run(hashed, email);

if (result.changes === 0) {
    console.error(`No user found with email: ${email}`);
    process.exitCode = 1;
} else {
    console.log(`✅ Password updated for ${email}`);
}

db.close();
