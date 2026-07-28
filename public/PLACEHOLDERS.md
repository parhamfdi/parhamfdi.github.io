# ⚠ PLACEHOLDERS.md — do not share the live URL until this file is empty of unchecked boxes

Every proof entry currently ships with **plausible but invented** numbers and confidential
org names (`placeholder: true` in the original brief). Before sending the URL to anyone
outside the team:

1. Replace the metrics, org names, and method text with real, checkable data.
2. Flip the flag for that entry below (check the box).
3. When **all** entries are real, remove the amber `placeholder-ribbon` `<div>` from:
   - `index.html`
   - `dossier/index.html`
   - each page in `proof/` (also change `<body data-placeholder="true">` to `"false"`)
   - and remove the `badge-placeholder` spans from the proof cards in `index.html`.

## Entry status

- [ ] `proof/saas-ai-lane.html` — Launching an AI revenue lane inside a mid-size SaaS (+32% ARR, 2.3x attach, −18% TTFV)
- [ ] `proof/expansion-signals.html` — AI-driven upsell engine (+27% expansion, +19% ARPU, 3.1x conversion)
- [ ] `proof/signal-territories.html` — Reading AI signals to open new markets (+41% new-segment revenue, 3 verticals, 8 weeks)
- [ ] `proof/dealsense.html` — Turning noisy leads into prioritized deal flow (+24% conversion, −21% cycle, +15% pipeline)
- [ ] `proof/ai-capital-board.html` — Capital allocation framework for AI bets (12 evaluated, 5 greenlit, −28% waste)
- [ ] `proof/legacy-to-ai.html` — Legacy service to AI product line (35% bookings share, +22% margin, 4 clients)
- [ ] `proof/journeylift.html` — Compounding user value through AI-shaped journeys (−17% churn, +21% LTV, +14% actives)

## Also verify before going live

- [ ] `WRITING_URL` (`https://parham-network-capital.ai/writing`) actually resolves
- [ ] `EXTRA_LINK` (`https://parham-network-capital.ai/deals`) actually resolves — the "Open Ledger" card on the homepage points there
- [ ] Email `parham.fadaii1377@gmail.com` is correct
- [ ] GitHub `https://github.com/parhamfdi` is correct
