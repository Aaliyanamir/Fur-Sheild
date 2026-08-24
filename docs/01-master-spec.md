# 01 — Master Specification

## Project Identity
- **Name:** FurShield
- **Competition:** TechViz 6 (Aptech Global AI-Based Tech Competition)
- **Theme:** Pet Care
- **Category:** Full-Stack Application Development

## Mission Statement
A unified, real-time ecosystem bringing together Pet Owners, Veterinarians, and Animal Shelters to ensure lifelong wellness and seamless care coordination.

## Core Personas
1. **Pet Owner (The Caregiver):** Manages multi-pet profiles, tracks visual health timelines, books appointments, and browses mock e-commerce products.
2. **Veterinarian (The Clinician):** Manages clinical workflows, logs treatments, approves appointments, and maintains available slots.
3. **Animal Shelter (The Guardian):** Lists adoptable pets, tracks daily care status, and coordinates adoption applications.

## Standout "Killer" Modules
- **Geolocation-Based Emergency SOS:** One-tap locator using browser geolocation and 2dsphere indexing to find nearby 24/7 emergency vets.
- **Real-Time Medical Passport Exporter:** Client-side, zero-server-load PDF generation of a pet's complete medical history using `jspdf`.

## Absolute Constraints (NON-NEGOTIABLE)
- [ ] **NO real payment gateway integration** (Orders remain in a UI-only 'pending_payment' mock state).
- [ ] **NO veterinarian credential validation logic** (Registration UI looks rigorous, but bypasses backend validation).
- [ ] **AI Asset Rule:** Any AI-generated images must be attributed in an `ATTRIBUTION.md` file.
- [ ] **Code Rule:** No source code may be included in the final documentation PDF report.

## Aptech Evaluation Deliverables Checklist
- [ ] Problem Definition
- [ ] Design Specifications
- [ ] Flowcharts & DFDs (Level 0, 1, 2)
- [ ] Database Schema & ER Diagrams
- [ ] Test Data Seeding Script & User Credentials
- [ ] Installation Instructions
- [ ] Video Demonstration (.mp4, 3-5 min)

## Agent Execution Rules
- NEVER generate code before reading all `/docs` memory files.
- NEVER modify database schemas without updating `03-database-dictionary.md`.
