# 12 — Interactive Floating Mascots Logic

## 1. Core Concept (The Streaming-Style Avatar)
- **Vision:** To add emotional warmth to the clinical SaaS interface, a subtle, interactive pet mascot (e.g., a high-fidelity AI-generated cat or dog with a transparent background) will float in the bottom-left corner of the viewport (z-index 50).
- **Format:** Optimized `.webm` for video loops with transparency, or advanced CSS/SVG character rigging. No blocky square backgrounds.

## 2. State-Based Behaviors & Reactions
The mascot is not static; it acts as a contextual companion.
- **Idle State:** Subtle, continuous breathing animation (slow `y-axis` translation via Framer Motion) and occasional blinking.
- **Hover/Click Reaction:** When the user hovers over the mascot, it triggers a "happy" or "curious" micro-animation (e.g., ears perk up).
- **Chatbot Synergy:** When the user opens the AI Triage Assistant (bottom-right), the mascot visually "looks" toward the chat window.
- **Emergency State:** If the SOS Locator is triggered, the mascot switches to an "alert" or disappears entirely to ensure zero distraction from the emergency workflow.

## 3. Context-Aware Page Logic
- **Dashboard:** Mascot might hold a small stethoscope or clipboard.
- **E-Commerce/Cart:** Mascot looks excitedly at the cart when an item is added (triggering a small floating heart or star particle effect).
- **Shelter View:** Replaced by a subtle "Guardian" themed mascot variant.

## 4. Animation Physics (Framer Motion)
- **Entrance:** Slides in from the bottom left (`y: 100`, `opacity: 0` -> `y: 0`, `opacity: 1`) with a gentle spring bounce on initial page load.
- **Float Effect:** `animate={{ y: [0, -10, 0] }}`, `transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}`.

## 5. UI/UX Restraint
- **Rule:** The mascot must remain small (e.g., `w-24 h-24` or `w-32 h-32`) and non-intrusive. It must NEVER block primary content, buttons, or navigation. 
- **Toggle:** Users must have a subtle "Hide" button (small 'x' or eye icon on hover) to dismiss the mascot for maximum clinical focus if they prefer.
