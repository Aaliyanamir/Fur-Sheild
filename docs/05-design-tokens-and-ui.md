# 05 — Design Tokens & UI System (Clinical Minimalist)

## Color Palette
- `--color-bg-primary`: `#FFFFFF` (Main canvas)
- `--color-bg-secondary`: `#F8FAFC` (Cards, panels, hover states)
- `--color-border`: `#E2E8F0` (Dividers, hairlines)
- `--color-text-primary`: `#0F172A` (Headings, primary data)
- `--color-text-secondary`: `#64748B` (Body, metadata)
- `--color-accent-primary`: `#166534` (Deep Forest Green — Primary CTAs)
- `--color-accent-secondary`: `#475569` (Charcoal — Secondary actions)

## Typography
- **Display/H1-H3:** `Plus Jakarta Sans`, Weights: 600-700. Tight letter spacing (-0.02em).
- **Body/Caption:** `Inter`, Weights: 400-500. Standard line height (1.5-1.6).

## Spatial & Component Rules
- **Shadows:** Use sparingly. `shadow-sm` for inputs, `shadow-md` for cards, `shadow-lg` for modals.
- **Borders:** Default to 1px `#E2E8F0` instead of relying on heavy shadows.
- **Border Radius:** `md` (8px) or `lg` (12px) for structural elements.

## Animation & Motion (Framer Motion)
- **Route Transitions:** `AnimatePresence` with slight fade and y-offset (10px).
- **Tab Switching (Multi-Pet):** Use `layoutId="activePetIndicator"` to slide the active state indicator seamlessly between tabs.
- **List Stagger:** Stagger children entrance by `0.05s` to avoid overwhelming the user.
- **Physics:** Use spring physics (`stiffness: 300, damping: 30`) for natural-feeling drawers and modals.
