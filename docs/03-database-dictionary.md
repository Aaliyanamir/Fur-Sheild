# 03 — Database Dictionary & Mongoose Schemas

**Rule:** Ensure all queries leverage these exact indexes to maximize dashboard load speeds.

## 1. Collection: `users`
**Purpose:** Central identity store with polymorphic sub-documents for roles.
- **Fields:** `_id`, `email` (String, Unique), `passwordHash` (String), `role` (Enum: owner, vet, shelter, admin), `name` (String), `phone` (String), `address` (String).
- **Sub-Documents:** 
  - `vetProfile`: `{ specializations: [String], availableSlots: [Object], location: GeoJSON Point }`
  - `shelterProfile`: `{ shelterName: String, capacity: Number, location: GeoJSON Point }`
- **Indexes:** 
  - Ascending index on `email`.
  - `2dsphere` index on `vetProfile.location` and `shelterProfile.location` for SOS proximity search.

## 2. Collection: `pets`
**Purpose:** Core entity for demographic data.
- **Fields:** `_id`, `ownerId` (ObjectId → users), `name` (String), `species` (String), `breed` (String), `dateOfBirth` (Date), `microchipId` (String), `gallery` ([String]).
- **Compound Index:** `{ ownerId: 1, name: 1 }` (Critical for multi-pet tabbed navigation).

## 3. Collection: `appointments`
**Purpose:** Booking lifecycle management.
- **Fields:** `_id`, `petId` (ObjectId), `ownerId` (ObjectId), `vetId` (ObjectId), `appointmentDate` (Date), `startTime` (String), `status` (Enum: pending, confirmed, completed, cancelled), `symptoms` ([String]).
- **Compound Indexes:** 
  - `{ vetId: 1, appointmentDate: 1 }` (Crucial for vet availability and slot conflict checks).
  - Ascending index on `ownerId`.

## 4. Collection: `healthRecords`
**Purpose:** Immutable medical timeline.
- **Fields:** `_id`, `petId` (ObjectId), `vetId` (ObjectId), `recordType` (Enum: vaccination, illness, checkup), `visitDate` (Date), `diagnosis` (String), `attachments` ([Object]).
- **Compound Index:** `{ petId: 1, visitDate: -1 }` (Ensures the visual timeline always loads newest-first instantly).

## 5. Collection: `adoptionListings`
**Purpose:** Shelter adoptable pets catalog.
- **Fields:** `_id`, `shelterId` (ObjectId), `petName` (String), `species` (String), `healthStatus` (String), `status` (Enum: available, pending, adopted).
- **Compound Index:** `{ shelterId: 1, status: 1 }` (For shelter dashboard filtering).

## 6. Collection: `products` & `orders` (Mock E-Commerce)
- **Products:** `name`, `category`, `price`, `stockQuantity`. (Compound Index: `{ category: 1, price: 1 }`).
- **Orders:** `ownerId` (ObjectId), `items` ([Object]), `totalAmount` (Number), `status` (Enum: pending_payment, confirmed, delivered). (No payment intents stored).
