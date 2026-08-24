# 22 — Typography & Spacing Scales (Design System Foundation)

## 1. Font Family & Hierarchy Tokenization
- **Display & Headings:** `Plus Jakarta Sans` (Weights: 600 Semi-Bold, 700 Bold). Used across all page titles, hero headers, and card titles with tight letter tracking (`tracking-tight` / `-0.02em`).
- **Body & General UI:** `Inter` (Weights: 400 Regular, 500 Medium). Optimized for clean readability across data tables, descriptions, and buttons.
- **Monospace Code/IDs:** `JetBrains Mono` (Weight: 400 Regular). Reserved exclusively for microchip numbers, dates, timestamps, and order reference codes.

## 2. Strict Spacing Scale (4px Base Unit)
- **xs (4px):** Micro-margins between icon wrappers and text labels.
- **sm (8px):** Padding inside tight badge elements and button internals.
- **md (16px):** Standard gap between stacked form elements and card inner padding.
- **lg (24px):** Container padding for standard Bento-Box grid cells.
- **xl (32px):** Major section separation gaps on mobile views.
- **2xl (48px) to 3xl (64px):** Massive vertical breathing room between landing page sections to preserve the "Clinical White" premium aesthetic.
