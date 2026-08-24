# 21 — Contextual AI Pet Care Triage Assistant Widget

## 1. Floating Trigger & Drawer Layout
- **Placement:** Floating chat action button positioned at the bottom-right viewport (z-index 50, adjacent to the SOS button or above mascots).
- **Chat Drawer:** Expandable container (e.g., width 400px, height 600px on desktop; full-screen sheet on mobile) featuring a clean header with the assistant title and close control.

## 2. Interactive Triage Flow & Quick-Reply Chips
- **Conversation UI:** Clean message history layout with distinct styling for user inputs (right-aligned green/slate bubbles) and assistant responses (left-aligned white cards).
- **Interactive Chips:** Pre-configured species selectors (Dog, Cat, Bird) and categorized symptom chips (Digestive, Skin, Respiratory) to streamline user input without forcing manual text entry.

## 3. Rule-Based Urgency Engine & Safety Boundaries
- **Logic Handling:** Maps user symptoms through a deterministic decision tree to classify urgency into Low, Medium, or High.
- **Actionable Routing:** 
  - *Low Urgency:* Displays home-care tips and monitoring checklists.
  - *Medium Urgency:* Recommends booking a routine veterinary appointment.
  - *High Urgency:* Automatically triggers an alert and prompts the user to launch the Emergency SOS module.
- **Disclaimer:** Prominently displays a static clinical disclaimer stating it is an informational assistant, not a replacement for professional veterinary diagnosis.
