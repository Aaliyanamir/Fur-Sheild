# 11 — Home Page Deep Dive & Scroll Dynamics

## 1. Hero Section (The "Wow" Factor)
- **Layout:** High-impact, highly spacious layout. Massive typography (e.g., "Complete Care for Every Paw & Wing.") using `Plus Jakarta Sans` bold.
- **Dynamic Media Element:** Instead of a generic static hero image, embed a high-fidelity, AI-generated looping video of a cute pet (e.g., a cat/dog exhibiting realistic, engaging reactions or a "talking" cue). 
- **Masking:** The video MUST be masked with a modern "squircle" (smooth rounded corners) or blended seamlessly into the pure white background to look like a high-end SaaS product.
- **CTAs:** Primary Deep Forest Green button and a secondary minimalist outline button.

## 2. Features Grid (The Ecosystem)
- **Structure:** A spacious grid (e.g., 2x2 or 3x1) showcasing Health Management, Vet Appointments, and Adoption Network.
- **Card Styling:** Pure white backgrounds, hairline borders (`border-slate-200`), and pastel-tinted icon wrappers. No heavy drop shadows.
- **Interaction:** Cards will use `framer-motion` for a staggered fade-up on scroll, with a subtle 3D tilt effect on hover.

## 3. "How It Works" (Scroll-Triggered Timeline)
- **Interaction Pattern:** A vertical progress line that dynamically "fills" (changes to `bg-forest-700`) as the user scrolls down the section (`framer-motion` `useScroll`).
- **Content:** Alternating left/right clean text blocks explaining the user journey seamlessly.

## 4. Testimonials & Social Proof
- **Layout:** A clean, horizontal scroll slider or a minimalist 3-card grid.
- **Aesthetic:** Focus on typography. Small circular avatars and minimalist star icons. Avoid large, clunky background quotation marks or distracting colors.

## 5. Spacing & Rhythm (Apple-Level Breathing Room)
- **Rule:** Strict adherence to massive vertical padding between sections (e.g., `py-24` or `py-32`). The pure white theme relies on abundant whitespace to feel premium and clinical. Cluttered sections are strictly prohibited.
