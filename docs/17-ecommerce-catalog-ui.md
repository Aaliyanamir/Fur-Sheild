# 17 — E-Commerce Shop Layout & Catalog

## 1. Discovery & Faceted Search
- **Sticky Filter Bar:** Instant search input (debounced), category selection pills (Food, Grooming, Toys, Health, Accessories), price range filters, and sorting controls.
- **Visual Feedback:** Active filter chips that can be clicked to reset individual search parameters instantly.

## 2. Product Grid & Card Architecture
- **Layout:** Responsive grid layout (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`).
- **Card Elements:** Clean white container, single product image with subtle hover zoom, clear category tags, 2-line clamped title, bold pricing, and dynamic stock indicator dots (green for in-stock, amber for low-stock).
- **Interaction:** An "Add to Cart" button that smoothly transforms into a quantity stepper once an item is added.

## 3. Cart Drawer & Slide-In Mechanics
- **Concept:** Right-hand side slide-in panel (`framer-motion` drawer animation) managed via global state (Zustand).
- **Contents:** Item list with quantity steppers, item removal controls, dynamic price subtotal calculations, and a prominent "Proceed to Checkout" action button.
