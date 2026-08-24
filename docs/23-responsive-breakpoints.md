# 23 — Responsive Breakpoints & Mobile UX Adapters

## 1. Tailwind Breakpoint Tiering
- **sm (640px):** Small tablets, large phones in landscape orientation. Single columns convert to compact multi-column grids.
- **md (768px):** Tablets. Sidebar transitions from hidden/drawer to permanent layout; Bento-Box grids adjust to 2-column configurations.
- **lg (1024px):** Laptops & small desktops. Full 3-column Bento-Box layouts, fixed sidebars, and expanded header navigations activate.
- **xl / 2xl (1280px+):** Large desktop viewports. Maximum container width restrictions (`max-w-7xl`) engage with centered alignment to prevent text lines from stretching too wide.

## 2. Mobile-Specific Interaction Patterns
- **Bottom Navigation Bar:** On mobile viewports (< 768px), primary dashboard routes switch from sidebars to a fixed bottom navigation bar (`z-40`) for thumb-friendly reach.
- **Full-Screen Takeovers:** Modals and filters on mobile must expand to full-screen views with a clear top-right "Close" control instead of floating centered cards, ensuring zero awkward clipping on small screens.
