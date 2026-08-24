# 25 — Data Visualization & Chart Styling Rules

## 1. Monochrome & Minimalist Design Philosophy
- **Anti-Rainbow Rule:** Strict ban on vibrant, multi-color charts (no cheap purple, blue, green gradients). All charts (Recharts / Chart.js) must adhere to a strict monochrome/slate and deep forest green palette.
- **Canvas Surrounds:** No heavy background fills or outer chart borders. Charts must sit seamlessly within clean white cards (`bg-white`), relying entirely on whitespace for separation.

## 2. Gridlines, Axes & Tooltip Engineering
- **Axis Lines & Ticks:** Clean, ultra-thin horizontal dashed gridlines (`stroke="#F1F5F9"`). Vertical gridlines are strictly prohibited to reduce visual noise. Axis labels must use `Inter`, 12px, in `text-slate-400`.
- **Data Series Colors:** Primary metrics mapped strictly to Deep Forest Green (`#166534`) and secondary comparison trends mapped to muted slate (`#94A3B8`).
- **Tooltips:** Custom-styled tooltips featuring a solid white background, subtle drop shadow (`shadow-lg`), rounded corners (`8px`), and zero border lines, displaying high-contrast dark text.
