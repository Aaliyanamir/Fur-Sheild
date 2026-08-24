# 02 — Tech Stack Decisions

## Runtime & Core Stack
- **Stack:** MERN (MongoDB, Express.js, React, Node.js)
- **Node.js:** v20.x LTS

## Frontend Ecosystem
- **Framework:** React v18.x (Vite)
- **Routing:** React Router DOM v6.x
- **State Management:** Zustand (lightweight, rapid state sync)
- **Styling:** Tailwind CSS v3.4 (Strict Minimalist White Theme)
- **UI Primitives:** shadcn/ui
- **Animation:** Framer Motion v11 (for layoutId tab transitions and spring physics)
- **Charts:** Recharts v2 (Monochrome styling)
- **Utilities:** `jspdf` + `html2canvas` (PDF Export), `lucide-react` (Icons)
- **Maps:** React-Leaflet with OpenStreetMap

## Backend Ecosystem
- **Framework:** Express.js v4.x
- **Database:** MongoDB v7.x / Mongoose v8.x
- **Auth:** jsonwebtoken (JWT) + bcryptjs
- **Cron Jobs:** node-cron (for automated vaccine reminders)

## Design Tokens (Strict Minimalist White)
- **Canvas/Backgrounds:** Pure White (`#FFFFFF`) for main canvas, Soft Slate (`#F8FAFC`) for structural panels/cards.
- **Borders:** Hairline Slate (`#E2E8F0`).
- **Typography:** Deep Slate (`#0F172A`) for high-contrast headings, `slate-500` for body text. 
- **Primary CTA:** Deep Forest Green (`#14532D` or `#166534`).
- **Font Stack:** Plus Jakarta Sans (Headings), Inter (Body).

## Strict Folder Architecture
/client/src/
  ├── /components    # Reusable UI atoms and molecules
  ├── /pages         # Route-level views
  ├── /hooks         # Custom React hooks
  ├── /store         # Zustand state slices
  ├── /lib           # Utilities and API clients
  └── /styles        # Global CSS, Tailwind config

/server/
  ├── /config        # DB connection, env variables
  ├── /models        # Mongoose schemas
  ├── /controllers   # Route handlers
  ├── /routes        # Express definitions
  ├── /middleware    # Auth, RBAC guards, error handling
  └── /seed          # Database seeding scripts
