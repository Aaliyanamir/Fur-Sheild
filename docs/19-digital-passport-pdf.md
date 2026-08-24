# 19 — Digital Health Passport PDF Layout & Generation

## 1. Document Architecture & Dimensions
- **Format:** A4 Portrait layout.
- **Engine:** Client-side generation using `jspdf` and `html2canvas` for zero server load.
- **Styling Rules:** Strict adherence to clean white backgrounds, dark slate text (`#0F172A`), and thin hairline separators to mirror the web app's clinical aesthetic.

## 2. Page Content Layout Structure
- **Header Section:** FurShield official brand mark, "Digital Health Passport" title, generation timestamp, and a unique cryptographic verification QR code linking to the pet profile.
- **Identity Panel:** Side-by-side layout featuring the pet's photo (base64 rendered via canvas), name, species/breed, age, gender, microchip ID, and owner contact details.
- **Vaccination Table:** Structured table detailing vaccine names, administration dates, next due dates, and verifying veterinarian signatures.
- **Medical & Insurance Summary:** Chronological list of past treatments, current prescriptions, and active insurance policy details.
- **Footer:** Mandatory platform disclaimer and official copyright statement.
