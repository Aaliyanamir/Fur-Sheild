# 28 — Component Scaffolding & Folder Architecture Plan

## 1. Atomic Design Structure (`/client/src/components/`)
- **Atoms (`/atoms/`):** Base-level UI primitives including buttons, inputs, badge pills, avatar wrappers, and icon containers. They contain zero business logic.
- **Molecules (`/molecules/`):** Combinations of atoms functioning together as a single unit, such as search input bars with integrated action buttons, card headers, and navigation links.
- **Organisms (`/organisms/`):** Complex, self-contained UI sections like the Bento-Box dashboard cards, navigation sidebars, the interactive AI chat drawer, and checkout steps.

## 2. Views & Route-Level Pages (`/client/src/pages/`)
- **Role-Based Isolation:** Clean separation between `OwnerDashboard.jsx`, `VetWorkstation.jsx`, `ShelterHub.jsx`, `CatalogView.jsx`, and `LandingPage.jsx`.
- **State Handling:** Each page component handles route-level layout integration while delegating heavy rendering to organisms.

## 3. Global State & Custom Hooks (`/client/src/store/` & `/hooks/`)
- **Zustand Stores:** Isolated stores for multi-pet state management (`usePetStore`), user authentication profiles (`useAuthStore`), and e-commerce cart tracking (`useCartStore`).
- **Custom Hooks:** Reusable logic handlers for debounced search, geolocation tracking, and API query synchronization.
