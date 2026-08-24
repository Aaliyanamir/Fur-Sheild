# 26 — Loading States, Skeletons & Shimmer Protocols

## 1. Skeleton Screen Architecture
- **Placeholder Strategy:** Avoid jarring full-page loading spinners wherever possible. Bento-box grid cells, table rows, and timeline items must display structural skeleton placeholders during data fetching.
- **Shimmer Aesthetic:** Skeletons must use a subtle, neutral slate background (`bg-slate-100`) combined with a smooth, continuous linear shimmer gradient passing horizontally (`animate-pulse`) to mimic incoming content contours perfectly.

## 2. Transition & Action Feedback Indicators
- **Button Loading States:** Primary and secondary action buttons must support an inline loading state. When clicked, the button text fades out, and a minimalist white or forest green spinner replaces it while disabling subsequent clicks to prevent duplicate submissions.
- **Route-Level Suspense:** React suspense fallbacks for lazy-loaded route changes must display a minimal, centered branded pulse loader to preserve seamless flow across views.
