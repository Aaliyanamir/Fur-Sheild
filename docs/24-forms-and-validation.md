# 24 — Forms, Inputs & Validation States

## 1. Minimalist Input Styling Rules
- **Base State:** Clean white background (`bg-white`), subtle 1px border (`border-slate-200`), and rounded corners (`rounded-lg` / 8px). Text styling must use standard body typography (`Inter`, `text-slate-900`).
- **Focus State:** Upon focus, remove the generic blue/purple outline and apply a clean deep forest green focus ring (`border-forest-500`, `ring-1 ring-forest-500`) to match our clinical brand accent.
- **Placeholder Text:** Soft muted gray (`text-slate-400`) with clear, descriptive instructions.

## 2. Validation & Error Feedback Mechanics
- **Error State:** Invalid inputs shift border color instantly to a subtle rose/red tone (`border-rose-500`, `ring-1 ring-rose-500`).
- **Inline Error Text:** Concise error description text displayed immediately beneath the input field in small font size (`text-xs text-rose-600`) accompanied by a tiny warning icon.
- **Success/Valid State:** Clean checkmark icon inside the right-hand edge of the input container for verified fields (e.g., matching passwords or available email addresses).
