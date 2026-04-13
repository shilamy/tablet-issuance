# Database Migration TODO (PostgreSQL + Prisma)

✅ **Steps 1-5 Complete:**
- Prisma deps/package.json fixed
- schema.prisma (models, enums)
- seed.ts (mocks → DB)
- lib/db.ts
- API routes: tablets (CRUD), participants (CRUD), issuances (list/create), auth/login

📋 **Step 6: Update auth-provider.tsx** (DB login)
📋 **Step 7: Replace mockdata in pages**
📋 **Step 8: User setup** - Set DATABASE_URL in .env, run:
  ```
  npx prisma db push
  npx prisma db seed
  npm run dev
  ```
- Install Prisma deps
- prisma init
- Basic schema

## Remaining Steps
- [ ] Step 2: Define schema.prisma
- [ ] Step 3: seed.ts
- [ ] Step 4: DB utils
- [ ] Step 5: API routes
- [ ] Step 6: Update auth
- [ ] Step 7: Replace mocks
- [ ] Step 8: Migrate/seed/test

Updated: Step 1 complete after confirmation.
