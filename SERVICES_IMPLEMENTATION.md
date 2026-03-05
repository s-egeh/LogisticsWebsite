# Services Section – Implementation

## What’s included

- **`style.css`** – Full CSS for the Services section (variables, bento grid, cards, deep dives, hover states).
- **`services.html`** – Dedicated Services page with bento hero, floating TOC, and deep dives (Road, Sea, Air, Warehousing, Customs).
- **`index.html`** – Homepage includes a services teaser section (`#services`) with 3 cards linking to `services.html#road`, `#sea`, `#air`.

## Structure

1. **Homepage (`index.html`)**  
   The section with `id="services"` is a teaser: badge “Our Capabilities”, title “Comprehensive Multi-Modal Logistics”, and 3 cards (Road, Sea, Air) with “Learn More →” linking to the full Services page.

2. **Services page (`services.html`)**  
   Single source for all service content:
   - Bento hero (intro + Road, Sea, Air tiles)
   - Floating table of contents (#road, #sea, #air, #warehousing, #customs)
   - Deep dives: Road, Sea, Air, Warehousing, Customs & Compliance

3. **Styling**  
   Ensure the `<head>` of each page contains:
   ```html
   <link rel="stylesheet" href="style.css">
   ```

## Section structure (reference)

- **Teaser (index):** Badge “Our Capabilities”, title “Comprehensive Multi-Modal Logistics”, subtitle. Grid: 3 cards – Road Haulage, Sea Freight, Air Freight – with “Learn More →” to `services.html#road`, `#sea`, `#air`.
- **Card:** Icon in circular blue container, Syne title, 2-line description, link.
- **Hover:** Card `translateY(-10px)`, border `#1A75D2`, icon `scale(1.1)`; transitions use `cubic-bezier(0.4, 0, 0.2, 1)`.

No frameworks; HTML5 + CSS3 only.
