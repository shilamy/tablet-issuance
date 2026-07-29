"""
Reset a user password directly in the SQLite database.
Hashes the password using bcrypt (compatible with bcryptjs used by the app).

Usage:
  python scripts/reset_pw.py admin@knbs.go.ke admin123

Requirements: pip install bcrypt
"""
import sys
import sqlite3
import os

def main():
    if len(sys.argv) < 3:
        print("Usage: python scripts/reset_pw.py <email> <newPassword>")
        sys.exit(1)

    email = sys.argv[1]
    password = sys.argv[2]

    # Try to import bcrypt
    try:
        import bcrypt
    except ImportError:
        print("bcrypt not installed. Installing now...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "bcrypt"])
        import bcrypt

    # Hash the password (bcrypt compatible with Node's bcryptjs)
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=10)).decode("utf-8")

    # Locate the SQLite database
    script_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(script_dir, "..", "prisma", "dev.db")
    db_path = os.path.normpath(db_path)

    if not os.path.exists(db_path):
        print(f"Database not found at: {db_path}")
        sys.exit(1)

    conn = sqlite3.connect(db_path)
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET password = ? WHERE email = ?", (hashed, email))
        conn.commit()
        if cursor.rowcount == 0:
            print(f"❌ No user found with email: {email}")
            sys.exit(1)
        else:
            print(f"✅ Password updated for {email}")
    finally:
        conn.close()

if __name__ == "__main__":
    main()
