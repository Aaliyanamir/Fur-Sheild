# 18 — Cart & Checkout Drawer Flow

## 1. Multi-Step Mock Checkout Modal
- **Step 1 (Shipping Details):** Pre-filled address form from the user profile, editable fields, and a clear "Continue to Review" action.
- **Step 2 (Order Summary):** Item thumbnails, quantity checks, price breakdown (subtotal, estimated shipping, final total), and a prominent "Place Order" button.
- **Step 3 (Confirmation Screen):** Success visual animation (animated checkmark), mock order ID generation, and a clear "Continue Shopping" button.

## 2. Constraint Compliance & Mock State
- **Explicit Notice:** The checkout interface must prominently display a small badge or note reading *"Demo Checkout — No Real Payment Gateway"* to ensure evaluators understand it is a mock implementation per SRS constraints.
- **Database State:** Completed orders are saved instantly to MongoDB with a status of `pending_payment`.
