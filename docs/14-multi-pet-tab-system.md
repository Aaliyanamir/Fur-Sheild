# 14 — Multi-Pet Tab System (Dynamic Context Switching)

## 1. Core Concept & UX Goal
- **Vision:** Pet owners with multiple animals (e.g., a dog and a cat) must be able to switch the entire dashboard's context (health timeline, appointments, stats) instantly without a full page reload.
- **Placement:** A horizontal, horizontally-scrollable (on mobile) tab bar placed directly below the dashboard header, acting as the primary contextual filter for the Bento-Box grid.

## 2. Visual Design of the Tabs
- **Tab Layout:** Each tab contains a small, circular pet avatar (or a generic icon if no photo exists) alongside the pet's name.
- **Active State:** The selected pet's tab text turns to `text-forest-700` with `font-semibold`. 
- **Inactive State:** Unselected tabs remain muted with `text-slate-500` and `font-normal`, featuring a subtle `hover:bg-slate-50` effect.
- **"Add Pet" Action:** The final tab in the row is always a dashed-border circle with a "plus" icon, allowing instant access to the pet registration modal.

## 3. Framer Motion Animation Physics
- **The Sliding Indicator:** Instead of instantly appearing, the active state indicator (e.g., a bottom border or a pill background) MUST physically slide from the previous tab to the newly selected tab. 
- **Implementation:** Use Framer Motion's `layoutId="activePetTab"` on the active indicator element to achieve this fluid, Apple-style transition.
- **Content Cross-Fade:** The dashboard grid content below the tabs must be wrapped in `<AnimatePresence mode="wait">`. When the pet changes, the old data fades out quickly (`opacity: 0, y: -5`) and the new data fades in (`opacity: 1, y: 0`) with a fast duration (`duration: 0.2s`).

## 4. State & URL Synchronization
- **Deep Linking:** The active tab state must sync with the URL query parameters (e.g., `?pet=uuid`). This ensures that if the user refreshes the page or shares the link, the correct pet is loaded immediately.
- **Caching:** Switching tabs should utilize React Query (or similar caching) so that revisiting a previously loaded pet's tab feels instantaneous without a perceived network delay.
