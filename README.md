## About Project
This is a 

## Getting Started

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
