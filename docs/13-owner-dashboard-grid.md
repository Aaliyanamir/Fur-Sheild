# 13 — Owner Dashboard UI Grid (The Bento-Box Layout)

## 1. Core Layout Strategy (Bento-Box Grid)
- **Concept:** The Owner Dashboard will utilize a modern CSS Grid "Bento-Box" layout. This allows dense clinical data to be displayed in distinct, orderly compartments without feeling cluttered.
- **Desktop View:** A 3-column grid layout (`grid-cols-12`). 
  - **Left Column (col-span-3):** Pet Profile summary, quick stats (weight, age), and primary actions (SOS, Book Vet).
  - **Middle Column (col-span-5):** The Visual Health Timeline (the centerpiece).
  - **Right Column (col-span-4):** Upcoming Appointments, Vaccine Reminders, and Recent Documents.
- **Mobile View:** Graceful degradation into a single-column stack (`flex-col`), prioritizing the Health Timeline and Reminders.

## 2. The Visual Health Timeline (Signature Component)
- **Structure:** A vertical line down the left side of the container (`border-l-2 border-slate-200`).
- **Nodes/Milestones:** Each medical event (vaccine, checkup, illness) is a node on this timeline.
- **Node Design:** 
  - Date on the left (or top in mobile).
  - A small circular status indicator (e.g., green for vaccine, amber for illness).
  - A crisp, white card attached to the node containing the event details, vet name, and attached document thumbnails.
- **Aesthetic:** Extremely clean. No heavy backgrounds. Relies purely on typography (`Inter` for body, `Plus Jakarta Sans` for titles) and spacing.

## 3. Metric Cards & Reminders
- **Styling:** Cards must use `bg-white`, a 1px border (`border-slate-200`), and a subtle `shadow-sm`.
- **Data Presentation:** Use large typography for numbers (e.g., "14 Days" until next vaccine) in `text-slate-900`, with small contextual labels in `text-slate-500`.
- **Iconography:** Use `lucide-react` icons wrapped in very pale pastel circles (e.g., `bg-forest-50 text-forest-700`) to add a tiny touch of color without breaking the white theme.

## 4. Hover & Interaction States
- **Cards:** On mouse hover, cards should slightly elevate (`-translate-y-1`) and increase shadow (`shadow-md`) using a smooth `duration-300` transition.
- **Action Buttons:** Secondary buttons inside cards (e.g., "Download PDF") should remain subtle (text only or light outline) until hovered, where they gain a very light gray background (`bg-slate-50`).

## 5. Whitespace Enforcement
- Every grid cell (card) must have internal padding of at least `p-6` on desktop (`p-4` on mobile) to ensure the clinical, breathable Apple-level aesthetic is maintained. Data must never touch the edges.
