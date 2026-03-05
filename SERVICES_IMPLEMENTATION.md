# Services Section – Implementation

## What’s included

- **`style.css`** – Full CSS for the Services section is appended (variables, bento grid, cards, hover states).
- **`sections/services.html`** – Standalone HTML for the Services section you can copy from.

## Add the section to `index.html`

1. **If the page uses `style.css`**  
   Ensure the `<head>` contains:
   ```html
   <link rel="stylesheet" href="style.css">
   ```
   The Services styles are already in `style.css`.

2. **If the page uses only inline styles**  
   Copy the Services block from `sections/services.html` and paste it into `index.html` where you want the section (e.g. after the hero, before Live Fleet Map).

3. **Ensure the section has `id="services"`**  
   So the nav link `#services` scrolls to it. The markup in `sections/services.html` already uses:
   ```html
   <section id="services" class="services-section" ...>
   ```

## Section structure (reference)

- **Header:** Badge “Our Capabilities”, title “Comprehensive Multi-Modal Logistics”, subtitle.
- **Grid:** 3 cards – Road Haulage (truck SVG), Sea Freight (ship SVG), Air Freight (plane SVG).
- **Card:** Icon in circular blue container, Syne title, 2-line description, “Learn More →” link to `#contact`.
- **Hover:** Card `translateY(-10px)`, border `#1A75D2`, icon `scale(1.1)`; transitions use `cubic-bezier(0.4, 0, 0.2, 1)`.

No frameworks; HTML5 + CSS3 only.
