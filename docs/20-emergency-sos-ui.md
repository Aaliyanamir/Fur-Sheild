# 20 — Geolocation Emergency SOS & Clinic Locator UI

## 1. Floating SOS Action Element
- **Placement:** Fixed-position floating action button located at the bottom-right of the viewport (z-index 60, above mascots and chat widgets).
- **Visuals:** High-contrast rose/red accent container paired with a continuous, subtle pulsing ring animation (`animate-ping`) to immediately draw user attention during a crisis.

## 2. Emergency Modal & Proximity View
- **Activation:** Clicking the SOS button triggers an instant full-screen takeover or modal overlay with a darkened backdrop.
- **Workflow:** 
  1. Automatically requests browser geolocation (`navigator.geolocation`).
  2. Displays a loading skeleton scanning for nearby emergency clinics.
  3. Renders a structured list of the nearest 24/7 veterinary hospitals showing exact distance, open status, and direct "Call Now" or "Get Directions" buttons.
- **Map Integration:** Embeds an interactive React-Leaflet map utilizing OpenStreetMap tiles with custom emergency clinic markers and a clear route polyline.
