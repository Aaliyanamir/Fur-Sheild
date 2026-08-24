# 27 — Notifications & Toast UI Engineering

## 1. Notification Center & Dropdown
- **Trigger:** Notification bell icon located in the top navigation bar, featuring an active unread red/forest indicator badge.
- **Dropdown Panel:** Clean white card (`bg-white`, `shadow-lg`, rounded-xl) displaying a scrollable history of alerts (vaccine reminders, appointment updates, shelter messages).
- **Read/Unread Differentiation:** Unread items feature a subtle left border accent (`border-l-4 border-forest-600`) with a light tint background, whereas read notifications transition to muted gray text without accents.

## 2. Transient Toast Messaging
- **Positioning:** Fixed positioning at the bottom-right or top-right of the viewport (z-index 100), ensuring they float above all dashboard cards and modals.
- **Animation Physics:** Smooth slide-in and fade entrance via Framer Motion (`x: 50, opacity: 0` -> `x: 0, opacity: 1`), auto-dismissing after 4 seconds with a subtle exit dissolve.
- **Type Variants:** Clean color-coded treatments (Success with forest green border, Error with rose border, Info with slate styling) with small descriptive icons.
