# FurShield Ecosystem: Backend Architecture Blueprint

**Status:** Planning Phase  
**Objective:** Define the backend infrastructure required to replace mock frontend state with a robust, production-ready REST API for the FurShield SaaS ecosystem (Dashboard, VetHub, Shelter Portal, Shop).

---

## 1. Recommended Tech Stack
To ensure maximum scalability, relational data integrity (crucial for healthcare records), and seamless integration with our React (Vite) frontend, the following stack is recommended:

- **Runtime & Framework:** Node.js + Express.js (or NestJS for stricter OOP architecture).
- **Database:** PostgreSQL.
  - *Rationale:* Pet healthcare involves complex relationships (e.g., A Pet belongs to an Owner, is treated by a Vet, requires an Rx Product). Relational databases excel here over NoSQL.
- **ORM:** Prisma.
  - *Rationale:* Type-safe database access that seamlessly aligns with modern JavaScript/TypeScript ecosystems.
- **Authentication:** Clerk (or Firebase Auth).
  - *Rationale:* Handles B2C (Pet Owners) and B2B (Vets, Shelter Staff) roles effortlessly via JWTs and Role-Based Access Control (RBAC).
- **File Storage:** AWS S3 (or Cloudinary) for pet avatars, X-rays, and PDF invoices.

---

## 2. Database Schema (ERD Outline)
The ecosystem requires strict relational modeling across 6 primary domains:

### Core Entities
- **Users (Owners / Vets / Shelter Staff)**
  - `id` (PK, UUID), `role` (ENUM), `clerk_id`, `name`, `email`, `phone`, `created_at`
- **Pets (Patients)**
  - `id` (PK), `owner_id` (FK -> Users), `name`, `species`, `breed`, `dob`, `weight`, `avatar_url`

### VetHub Domain
- **Appointments & Queue**
  - `id` (PK), `pet_id` (FK), `vet_id` (FK), `status` (ENUM: WAITING, EXAM, DISCHARGED), `reason`, `scheduled_at`
- **Medical Records & Rx**
  - `id` (PK), `pet_id` (FK), `vet_id` (FK), `diagnosis`, `notes`, `created_at`
  - **Prescriptions:** `id` (PK), `pet_id` (FK), `medication_name`, `dosage`, `valid_until`

### Shelter Portal Domain
- **Shelter Animals (Kanban Pipeline)**
  - `id` (PK), `name`, `status` (ENUM: INTAKE, VET_HOLD, ADOPTABLE), `intake_date`, `medical_notes`

### Shop & E-Commerce Domain
- **Products**
  - `id` (PK), `name`, `price`, `category`, `stock`, `rx_required` (BOOLEAN), `image_url`
- **Orders**
  - `id` (PK), `owner_id` (FK), `total_amount`, `status` (ENUM: PROCESSING, SHIPPED, DELIVERED), `tracking_number`
- **Order Items (Many-to-Many)**
  - `id` (PK), `order_id` (FK), `product_id` (FK), `quantity`, `is_auto_ship`, `price_at_purchase`

---

## 3. API Route Map

### Auth & Users
- `GET /api/v1/users/me` (Fetch active profile and RBAC role)

### Dashboard (Pet Owner)
- `GET /api/v1/pets` (List owner's pets)
- `GET /api/v1/pets/:id/health-vitals` (Fetch weight trends, vaccine dates)
- `GET /api/v1/pets/:id/ai-insights` (Trigger AI analysis on recent vitals)

### VetHub (Clinical)
- `GET /api/v1/vet/queue` (Fetch active waiting room Kanban state)
- `PATCH /api/v1/vet/queue/:id/status` (Move patient: Waiting -> Exam)
- `POST /api/v1/vet/records` (Create new medical record / issue Rx)

### Shelter Portal
- `GET /api/v1/shelter/pipeline` (Fetch intake pipeline)
- `PATCH /api/v1/shelter/pipeline/:id` (Move animal across Kanban columns)
- `GET /api/v1/shelter/analytics` (Fetch adoption velocity & intake metrics)

### Shop (E-Commerce)
- `GET /api/v1/shop/products?category=x&rx_required=y` (Filterable catalog)
- `POST /api/v1/shop/cart/validate` (Verify Rx requirements for cart payload)
- `POST /api/v1/shop/checkout` (Process mock payment, create Order)
- `GET /api/v1/shop/orders/history` (Fetch Order Vault for user)

---

## 4. Integration Strategy (The Safe Approach)
To ensure zero regressions to our award-winning UI, we will adopt a **Strangler Fig Pattern** for integration:

1. **Phase 1: Backend Scaffolding & DB Seeding**
   - Initialize the Node.js/Express server in a separate `backend/` directory.
   - Design the Prisma schema and run migrations.
   - Seed the database with the exact mock data currently hardcoded in our React files to ensure a 1:1 visual match.
2. **Phase 2: API Route Development**
   - Build out the `GET` routes first (Read-only). Test via Postman/Insomnia.
3. **Phase 3: State Decoupling (Frontend)**
   - Introduce Axios or React Query (TanStack Query) to the React frontend.
   - Target one module at a time (e.g., Dashboard). Replace the hardcoded `const [pets] = useState(...)` with `useQuery('/api/v1/pets')`.
   - Verify UI rendering remains pixel-perfect.
4. **Phase 4: Mutations (Write Operations)**
   - Connect the Cart Drawer checkout button, Kanban drag-and-drop events, and Form submissions to POST/PATCH routes using `useMutation`.
5. **Phase 5: Global Auth Wrap**
   - Wrap the React app in the Authentication Provider. Restrict API routes via JWT middleware.

---
*Prepared by Lead Design Agent (Antigravity)*
