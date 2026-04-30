---
name: Vibrant Growth
colors:
  surface: '#fff8f5'
  surface-dim: '#ebd6c9'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1e9'
  surface-container: '#ffeadd'
  surface-container-high: '#f9e4d7'
  surface-container-highest: '#f4ded2'
  on-surface: '#241912'
  on-surface-variant: '#574335'
  inverse-surface: '#3a2e25'
  inverse-on-surface: '#ffede3'
  outline: '#8a7262'
  outline-variant: '#dec1ae'
  surface-tint: '#934b00'
  primary: '#934b00'
  on-primary: '#ffffff'
  primary-container: '#fb8500'
  on-primary-container: '#5d2e00'
  inverse-primary: '#ffb781'
  secondary: '#006a60'
  on-secondary: '#ffffff'
  secondary-container: '#8cf5e4'
  on-secondary-container: '#007166'
  tertiary: '#006493'
  on-tertiary: '#ffffff'
  tertiary-container: '#00aefc'
  on-tertiary-container: '#003e5e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc4'
  primary-fixed-dim: '#ffb781'
  on-primary-fixed: '#301400'
  on-primary-fixed-variant: '#703800'
  secondary-fixed: '#8cf5e4'
  secondary-fixed-dim: '#6fd8c8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#cae6ff'
  tertiary-fixed-dim: '#8dcdff'
  on-tertiary-fixed: '#001e30'
  on-tertiary-fixed-variant: '#004b70'
  background: '#fff8f5'
  on-background: '#241912'
  surface-variant: '#f4ded2'
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 20px
  gutter: 16px
---

## Brand & Style

This design system is engineered for the 18-25 demographic, balancing the high-energy ambition of youth entrepreneurship with the institutional stability required for financial and educational trust. The style is **Modern Minimalist with Tactile Accents**, utilizing a clean digital framework punctuated by organic textures.

The experience should feel kinetic yet grounded. We achieve this through the "Radiant Precision" principle: using a high-energy primary palette within a strictly organized, spacious layout. The inclusion of low-opacity wooden textures introduces a human, craft-oriented element that differentiates this design system from purely "tech" platforms, suggesting building, making, and tangible results.

## Colors

The palette is divided into functional roles to drive user action and establish authority. 

- **Primary (Warm Orange):** Used for primary calls-to-action and key brand moments. It represents the "spark" of an idea and the flow of capital.
- **Secondary (Dark Green):** Reserved for growth indicators, success states, and elements requiring a sense of stability and institutional trust.
- **Backgrounds:** A layered approach using Off-white for the application canvas and Pure White for interactive cards and containers to create a subtle sense of depth.
- **Typography:** Dark Grey provides high legibility without the harshness of pure black, while Medium Grey is used for metadata and placeholder content.

## Typography

This design system utilizes **Plus Jakarta Sans** for headlines to provide a modern, slightly geometric personality that feels friendly and approachable. **Inter** is used for all body and UI text to ensure maximum readability and a systematic, clean aesthetic.

Headlines should use tight letter-spacing to appear impactful and confident. Body text maintains a generous line height to prevent cognitive fatigue, especially in educational content. The "Label-caps" style is used sparingly for category tags and small headers above section groups.

## Layout & Spacing

This design system follows a **Mobile-First Fluid Grid** model. Given the target audience, the layout must feel "app-like" even in a browser. 

- **Grid:** A 4-column fluid mobile grid transitioning to an 8-column tablet grid.
- **Rhythm:** An 8pt spatial system is used for component sizing, while a 4pt system is used for fine-tuning internal element alignment.
- **Whitespace:** Emphasize generous vertical padding between sections (32px+) to maintain a minimalist feel and allow the content to breathe.

## Elevation & Depth

Hierarchy is established using a combination of **Tonal Layering** and **Ambient Shadows**. 

1.  **Level 0 (Base):** The Off-white background (#F9F9F9).
2.  **Level 1 (Cards/Surface):** Pure White containers (#FFFFFF) with a 12px corner radius.
3.  **Shadows:** Shadows are highly diffused and soft, using a 10% opacity of the Dark Grey text color. Avoid hard edges.
    - *Example:* `box-shadow: 0 4px 20px rgba(43, 45, 66, 0.08);`
4.  **Accents:** Wooden textures are applied as low-opacity (5-8%) image masks or backgrounds specifically within header sections or primary feature cards to add a tactile quality without compromising legibility.

## Shapes

The shape language is defined by the **12px Border Radius (Rounded)**. This specific radius strikes a balance between the "bubble" look of consumer apps and the "sharp" look of traditional enterprise software.

- **Standard Elements:** 12px radius for cards, input fields, and buttons.
- **Small Elements:** 8px radius for tags, chips, and small selection indicators.
- **Icons:** Fine-line icons with a 1.5pt or 2pt stroke weight and slightly rounded caps to match the UI's geometry.

## Components

### Buttons
- **Primary:** Warm Orange background, white text. Bold weight. 12px radius. High-energy.
- **Secondary:** Dark Green background or 2px Dark Green border with Dark Green text.
- **Tertiary:** Text-only with an icon, using Medium Grey.

### Cards
- **Product/Course Cards:** Pure white background, soft ambient shadow, 12px radius. Content is padded at 20px. 
- **Accent Cards:** May feature a subtle wooden texture overlay at 5% opacity in the header area of the card.

### Input Fields
- **Default State:** 1px border using Medium Grey at 30% opacity. 12px radius.
- **Focus State:** 2px border using Warm Orange or Dark Green depending on context (growth vs. action).

### Selection Controls
- **Chips:** Used for filtering topics (e.g., "Finances", "Marketing"). 8px radius. Light secondary color fill (#2A9D8F at 10% opacity) when active.
- **Checkboxes/Radios:** Use the Dark Green for selected states to emphasize the "Trust/Growth" aspect of completion and choice.

### Additional Elements
- **Progress Bars:** Thin 6px bars. The track is light grey, and the fill is Dark Green to signify growth/progress.
- **Iconography:** Use "Fine-line" icons only. Avoid solid/filled icons unless used as a notification badge.