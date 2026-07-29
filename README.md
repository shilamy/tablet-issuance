## About Project
This is a 

## Getting Started

For local development, configure `DATABASE_URL` and run `npx prisma generate`, `npx prisma db push`, then `npm run dev`.

For the split deployment, copy `.env.example` to `.env`, set a strong `POSTGRES_PASSWORD`, and run:

```bash
docker compose up --build
```

The frontend is served on port 3000 and the standalone API on port 4000. Read [CAPABILITY_AUDIT.md](CAPABILITY_AUDIT.md) before production rollout.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

/issuance-frontend
│
├─ /app                 # Next.js app directory
│   ├─ /dashboard       # Dashboard pages per role
│   ├─ /activities      # Activity pages
│   ├─ /participants    # Participants pages
│   ├─ /contracts       # Contracts pages
│   ├─ /tablets         # Tablets pages
│   ├─ /issuance        # Issuance pages
│   ├─ /reports         # Reports pages
│   └─ layout.tsx       # Global layout
│
├─ /components          # Reusable components
│   ├─ QRScanner.tsx
│   ├─ FilterBar.tsx
│   ├─ ActivityFilter.tsx
│   └─ Modals.tsx
│
├─ /lib                 # API calls & helpers
│   └─ api.ts
│
├─ /styles
│   └─ globals.css
│
├─ tailwind.config.cjs
└─ next.config.js
