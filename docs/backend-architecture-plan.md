# FurShield Ecosystem: Enterprise MERN Architecture Master Plan

**Status:** Locked - Pre-Execution Phase  
**Architecture:** MERN (MongoDB, Express.js, React, Node.js)  
**Objective:** Define an exhaustive, production-grade enterprise backend blueprint for the FurShield SaaS ecosystem. This document serves as the absolute source of truth for database modeling, API design, security protocols, and integration phases.

---

## 1. Enterprise Folder Structure (Modular MVC)
To support a massive ecosystem spanning multiple distinct modules (Dashboard, VetHub, Shelter Portal, Shop), the backend will utilize a highly structured, domain-driven MVC architecture.

```text
FurShield/
├── client/                     # (Existing React Frontend - Untouched)
└── server/                     # (New Node.js/Express Backend)
    ├── config/                 # Environment variables, DB connection, third-party keys
    ├── controllers/            # Business logic (e.g., auth.controller.js, vet.controller.js)
    ├── middlewares/            # Custom middleware (auth, RBAC, error handlers, rate limiters)
    ├── models/                 # Mongoose Schemas (User, Pet, Appointment, Product, etc.)
    ├── routes/                 # API route definitions pointing to controllers
    ├── services/               # Reusable business logic/external API calls (e.g., stripe.service)
    ├── utils/                  # Helper functions (logger, standard API responses)
    ├── validations/            # Joi / Express-Validator schemas for request payload validation
    ├── package.json
    └── server.js               # Express app initialization & middleware mounting
```

---

## 2. Exhaustive Mongoose Schemas (Database Models)
MongoDB provides the flexibility needed for dynamic pet records, while references (`ObjectId`) will simulate strict relational integrity.

### User Schema (`User.js`)
*Centralized identity management for all ecosystem actors.*
- `_id`: ObjectId
- `name`: String (Required)
- `email`: String (Required, Unique, Indexed)
- `password`: String (bcrypt hashed)
- `role`: String (Enum: `['OWNER', 'VET', 'SHELTER_ADMIN', 'SYSTEM_ADMIN']`, Default: `'OWNER'`)
- `phone`: String
- `address`: Object (street, city, state, zip)
- `active`: Boolean (Default: true)
- `timestamps`: true

### Pet Schema (`Pet.js`)
*The core patient entity.*
- `_id`: ObjectId
- `ownerId`: ObjectId (Ref: `'User'`, Required, Indexed)
- `name`: String (Required)
- `species`: String (Required)
- `breed`: String
- `dob`: Date
- `weightHistory`: Array of Objects `[{ weight: Number, date: Date }]`
- `avatarUrl`: String
- `dnaMarkers`: Array of Strings
- `medicalPassport`: Object (vaccinations, allergies, chronicConditions)
- `timestamps`: true

### Appointment / Queue Schema (`Appointment.js`)
*Drives the VetHub Kanban and waiting room.*
- `_id`: ObjectId
- `petId`: ObjectId (Ref: `'Pet'`, Required)
- `ownerId`: ObjectId (Ref: `'User'`, Required)
- `vetId`: ObjectId (Ref: `'User'`) // Assigned Vet
- `status`: String (Enum: `['WAITING', 'EXAM', 'DISCHARGED', 'CANCELLED']`, Default: `'WAITING'`)
- `severity`: String (Enum: `['ROUTINE', 'URGENT', 'EMERGENCY']`)
- `reason`: String
- `medicalNotes`: String (Populated during Exam)
- `scheduledAt`: Date
- `completedAt`: Date
- `timestamps`: true

### Shelter Animal Schema (`ShelterAnimal.js`)
*Drives the Shelter Portal Kanban.*
- `_id`: ObjectId
- `name`: String (Required)
- `species`: String
- `intakeDate`: Date
- `status`: String (Enum: `['INTAKE', 'VET_HOLD', 'FOSTER', 'ADOPTABLE', 'ADOPTED']`)
- `medicalHolds`: Array of Strings
- `behaviorNotes`: String
- `aiTriageLog`: Array of Objects `[{ log: String, timestamp: Date }]`
- `timestamps`: true

### Product Schema (`Product.js`)
*Drives the Pharmacy & Shop.*
- `_id`: ObjectId
- `name`: String (Required)
- `category`: String (Enum: `['PRESCRIPTIONS', 'SUPPLEMENTS', 'NUTRITION', 'ACCESSORIES']`, Indexed)
- `price`: Number (Required)
- `stock`: Number (Default: 0)
- `rxRequired`: Boolean (Default: false)
- `imageUrl`: String
- `autoShipEligible`: Boolean (Default: false)
- `timestamps`: true

### Order Schema (`Order.js`)
*Drives the Shop Order History Vault.*
- `_id`: ObjectId
- `ownerId`: ObjectId (Ref: `'User'`, Required)
- `items`: Array of Objects:
  - `productId`: ObjectId (Ref: `'Product'`)
  - `quantity`: Number
  - `priceAtPurchase`: Number
  - `isAutoShip`: Boolean
- `subtotal`: Number
- `tax`: Number
- `shipping`: Number
- `totalAmount`: Number
- `status`: String (Enum: `['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']`)
- `shippingAddress`: Object
- `trackingNumber`: String
- `timestamps`: true

---

## 3. Complete RESTful API Endpoint Specification
All routes will be prefixed with `/api/v1/`.

### Auth & User Routes (`/api/v1/auth`)
- `POST /register`: Registers a new user. Expects `{ name, email, password, role }`. Returns JWT token.
- `POST /login`: Authenticates user. Expects `{ email, password }`. Returns JWT + user role.
- `GET /me`: Validates JWT, returns user profile data.

### Owner Dashboard Routes (`/api/v1/dashboard`)
- `GET /pets`: Returns all pets belonging to `req.user.id`.
- `POST /pets`: Creates a new pet profile.
- `GET /pets/:petId/vitals`: Fetches weight history and medical passport for charts.
- `PATCH /pets/:petId/vitals`: Appends new weight/vaccine data.

### VetHub Routes (`/api/v1/vethub`)
*Requires 'VET' role.*
- `GET /queue`: Fetches all appointments where status is NOT 'DISCHARGED'.
- `PATCH /queue/:id/status`: Updates appointment status (e.g., WAITING -> EXAM).
- `POST /queue/:id/notes`: Appends medical notes / live vitals to an active exam.
- `GET /patients/:petId/history`: Deep fetch of a pet's medical passport and past appointments.

### Shelter Portal Routes (`/api/v1/shelter`)
*Requires 'SHELTER_ADMIN' role.*
- `GET /pipeline`: Fetches all shelter animals for Kanban rendering.
- `PATCH /pipeline/:id/status`: Moves an animal between Kanban columns.
- `POST /intake`: Creates a new animal record + AI triage log.
- `GET /analytics`: Aggregates intake vs. adoption velocity metrics via MongoDB Aggregation Pipeline.

### Shop & Pharmacy Routes (`/api/v1/shop`)
- `GET /products`: Fetches catalog. Supports queries: `?category=x&rxRequired=y`.
- `POST /cart/validate`: Validates cart payload against DB stock and Rx requirements before checkout.
- `POST /checkout`: Processes payment (Stripe integration/mock), creates Order document, decrements stock.
- `GET /orders/history`: Fetches all past orders for `req.user.id` to populate the Order History Vault.

---

## 4. Security, Middleware & Error Handling Architecture

### Role-Based Access Control (RBAC)
- **`verifyToken` Middleware:** Validates the JWT in the `Authorization: Bearer <token>` header. Attaches `req.user` (id, role).
- **`requireRole(roles)` Middleware:** Evaluates `req.user.role` against an array of allowed roles (e.g., `requireRole(['VET'])`). Denies access with `403 Forbidden` if unauthorized.

### Request Validation
- All POST/PATCH requests will pass through a validation middleware (using **Joi**) before hitting controllers.
- Example: `POST /login` strictly requires a valid email string and a string password, rejecting early with `400 Bad Request` to prevent DB query overhead.

### Global Error Handling
- A centralized Express error handler (`app.use((err, req, res, next) => {...})`) will catch all thrown exceptions.
- It will standardize output: `{ success: false, error: { code, message } }`.
- Differentiates between Operational Errors (e.g., 404 Not Found) and Programmer Errors (e.g., 500 Internal Server Error, masking sensitive stack traces in production).

---

## 5. Safe Frontend-to-Backend Integration Strategy
To guarantee zero UI regressions in our award-winning React frontend, we will execute a strict, phased **API Service Layer** integration.

### Phase 1: The Service Layer Abstraction
- Create `client/src/services/api.js` featuring an Axios instance pre-configured with base URL and JWT interceptors.
- Create modular service files (e.g., `vetService.js`, `shopService.js`) mirroring the API routes.

### Phase 2: Module-by-Module Swap (Read-Only)
- **Target the Shop:** Replace hardcoded `product1`, `product2` constants with a `useEffect` that calls `shopService.getProducts()`. Verify grid renders perfectly.
- **Target the Dashboard:** Replace hardcoded pet data with `dashboardService.getPets()`.
- **Rule:** If the UI breaks or loading states flicker improperly, revert immediately and fix the API payload structure to match what the UI expects.

### Phase 3: Wiring Mutations (Write Operations)
- **Cart Checkout:** Wire the Cart Drawer's "Proceed to Checkout" button to `shopService.checkout(cartPayload)`. Handle the loading state and success toast.
- **VetHub Kanban:** Wire the drag-and-drop end event to `vetService.updateQueueStatus(id, newStatus)`. Use Optimistic UI updates (update the local React state instantly, and rollback if the API fails).

### Phase 4: Full Auth Lockdown
- Replace mock user state with global React Context / Redux containing the live JWT and user profile.
- Implement React Router Protected Routes (`<ProtectedRoute allowedRoles={['VET']}><VetHub /></ProtectedRoute>`).

---
*Blueprint Mastered by Lead Design Agent (Antigravity)*
