/**
 * Reset admin password directly in SQLite using only built-in Node.js APIs.
 * No tsx, no Prisma, no external packages beyond bcryptjs (already installed).
 *
 * Usage:   node scripts/reset-pw.cjs <email> <newPassword>
 * Example: node scripts/reset-pw.cjs admin@knbs.go.ke admin123
 */
'use strict';

const path = require('path');
const bcrypt = require(path.join(__dirname, '..', 'node_modules', 'bcryptjs'));

// dynamically load sqlite3 driver that ships with @prisma packages on Windows
// Prisma bundles its own query engine; we use the raw node sqlite wrappers here.
// Fallback: use the prisma-bundled better-sqlite3 if available.
let Database;
try {
    Database = require(path.join(__dirname, '..', 'node_modules', 'better-sqlite3'));
} catch (_) {
    // Prisma 5 ships its own wasm sqlite – fall back to manual approach
    console.error(
        'better-sqlite3 is not installed. Run:\n  npm install --save-dev better-sqlite3\nthen retry.'
    );
    process.exitCode = 1;
    // Use setImmediate so the event loop drains before exit (avoids UV assert on Windows)
    setImmediate(() => process.exit(1));
}

const [email, password] = process.argv.slice(2);

if (!email || !password) {
    console.error('Usage: node scripts/reset-pw.cjs <email> <newPassword>');
    setImmediate(() => process.exit(1));
    return;
}

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');

let db;
try {
    db = new Database(dbPath);
} catch (err) {
    console.error('Could not open database at', dbPath, '\n', err.message);
    setImmediate(() => process.exit(1));
    return;
}

const hashed = bcrypt.hashSync(password, 10);
const result = db.prepare('UPDATE users SET password = ? WHERE email = ?').run(hashed, email);
db.close();

if (result.changes === 0) {
    console.error(`\u274c No user found with email: ${email}`);
    process.exitCode = 1;
} else {
    console.log(`\u2705 Password updated for ${email}`);
}
