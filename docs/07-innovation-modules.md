# 07 — Differentiation & Innovation Modules

## 1. Geolocation-Based Emergency SOS & Clinic Locator
- **Trigger:** Floating SOS button.
- **Action:** Captures browser geolocation, passes to OpenStreetMap API.
- **Output:** Returns ranked list of nearby 24/7 emergency clinics with route calculation.

## 2. Real-Time Medical Passport Exporter
- **Trigger:** "Export Passport" button on Pet Profile.
- **Action:** Client-side aggregation of demographic, vaccination, and treatment data via React Query cache.
- **Output:** Zero-server-load PDF generation using `jspdf` and `html2canvas`.

## 3. Contextual AI Pet Care Triage Assistant
- **Inspiration:** PawPilot (Vet-grade triage logic).
- **Interface:** Floating widget with symptom checkers and diet recommendations.
- **Flow:** User selects species -> Describes symptom -> Rule-based tree outputs urgency level (Low: Care tips, High: SOS locator).

## 4. Multi-Pet Dynamic Tab Synchronization
- **Flow:** URL query param sync (`?pet=uuid`). Switch profiles seamlessly without full page reloads.
- **Animation:** `framer-motion` layoutId for active tab indication.

## 5. Shelter Live Coordination Hub
- **Pipeline:** Application submission -> Housing review drawer -> In-app status updates -> Digital Adoption Certificate generation.
