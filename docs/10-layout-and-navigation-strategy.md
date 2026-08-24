# 10 — Global Layout & Navigation Strategy

## 1. Top Navigation Bar (Navbar)
- **Desktop:** Sticky header with a subtle backdrop blur (glassmorphism) on scroll. Clean logo on the left, primary navigation centered, and user actions (Notifications Bell, Profile Avatar) on the right. 
- **Mobile:** Top bar with logo and a clean hamburger menu icon. No cluttered links.
- **Active States:** Subtle underline or text color shift (`text-forest-700`) for the active route. No heavy background blocks.

## 2. Dashboard Sidebar (Owners, Vets, Shelters)
- **Structure:** Left-aligned, collapsible sidebar. Must occupy a fixed width (e.g., `w-64`) on desktop.
- **Items:** `lucide-react` icons paired with crisp text. 
- **Active State:** A soft slate background (`bg-slate-100`) with a deep green left border (`border-l-4 border-forest-700`) to indicate the current page.
- **Mobile Behavior:** Sidebar converts to a sliding drawer (with a dark backdrop overlay) or a sticky bottom navigation bar for quick access.

## 3. The Footer
- **Layout:** Spacious 4-column grid (Brand/About, Quick Links, Legal, Contact).
- **Styling:** Minimalist slate background (`bg-slate-50`) with a subtle top hairline border (`border-slate-200`). High legibility, smaller typography (`text-sm`). 
- **Bottom Bar:** Copyright and static links (Terms, Privacy).

## 4. Floating Action Hierarchy (Z-Index Strategy)
To ensure our interactive elements (mascots, SOS, chat) don't overlap awkwardly, we strictly adhere to this z-index scale:
- **z-40 (Navigation):** Navbar and Sidebars.
- **z-50 (Mascots & Chat):** The interactive streaming-style pet mascot (bottom-left) and the AI Chatbot trigger (bottom-right).
- **z-60 (Emergency):** The prominent SOS Locator button. It must remain visible and accessible above standard widgets.
- **z-100 (Overlays):** Modals, full-screen takeovers, and dropdown menus.

## 5. Navigation Animations
- **Sidebar Slide:** Framer motion `x: -100%` to `x: 0` for mobile drawer entry.
- **Dropdowns:** Subtle scale and fade (`scale: 0.95, opacity: 0` to `scale: 1, opacity: 1`).
