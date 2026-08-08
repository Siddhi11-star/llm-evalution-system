---
name: Auralis AI
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#4c4546'
  inverse-surface: '#303030'
  inverse-on-surface: '#f1f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdf'
  on-secondary-container: '#636262'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1b'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e4e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
  background-warm: '#F7F7F5'
  panel-fill: '#F3F2EF'
  card-fill: '#FCFCFB'
  border-subtle: '#E7E7E4'
  accent-emerald: '#10B981'
  accent-indigo: '#4F46E5'
  accent-purple: '#9333EA'
  glass-white: rgba(255, 255, 255, 0.6)
  glass-dark: rgba(20, 20, 20, 0.6)
typography:
  h1:
    fontFamily: Geist
    fontSize: 84px
    fontWeight: '600'
    lineHeight: '1.05'
    letterSpacing: -0.04em
  h1-mobile:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  h3:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  caption:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit_base: 8px
  gutter: 32px
  padding_card: 24px
  section_gap_desktop: 180px
  section_gap_mobile: 80px
  container_max_width: 1280px
---

## Brand & Style
Auralis is a high-precision LLM evaluation dashboard designed for AI researchers and developers. The brand personality is **Technical, Authoritative, and Sophisticated**, blending the clinical precision of developer tools with a premium editorial aesthetic.

The design style is a hybrid of **Minimalism** and **Glassmorphism**. It utilizes a "Dark Hero / Light UI" split to create a dramatic entrance while maintaining high readability for data-heavy tasks. Visual interest is driven by high-quality typography, subtle radial gradients (orbs), and translucent glassy overlays that suggest depth and computational complexity without clutter.

## Colors
The palette is rooted in a monochromatic base of deep blacks and soft grays, providing a neutral "canvas" for data. 

- **Primary & Secondary:** Pure black (`#000000`) is used for primary actions and headlines to convey authority. Grays are used for secondary text and UI scaffolding.
- **Surface Strategy:** The system uses a hierarchy of off-whites (`#F7F7F5`, `#FCFCFB`) rather than pure white to reduce eye strain and feel more "material."
- **Accents:** Vibrant functional colors are used sparingly for status indicators and data visualization: Emerald for success/active states, Indigo and Purple for "AI magic" and high-value data points.
- **Glass Effects:** Semi-transparent layers are used for floating panels and "Advisor" recommendations to maintain context with the background.

## Typography
The system relies entirely on **Geist**, a typeface designed for developers that balances technical precision with high-impact display weights. 

- **Display:** Large headlines use heavy weights and aggressive negative letter-spacing for a modern, "tight" look.
- **Functional:** Labels and metadata use uppercase "caps" styling to differentiate from prose and body text.
- **Monospaced Contexts:** While not defined as a separate variable, data points like "Cost" and "Output" should utilize the monospaced alternates of Geist or a matching mono font for alignment.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for maximum control over data density. 

- **Max Width:** Content is capped at `1280px` to maintain optimal line lengths.
- **Sectioning:** Vertical rhythm is extremely generous (`180px` gaps) to allow complex data sets room to "breathe."
- **Component Padding:** Internal card padding is set to `24px` (`unit_base * 3`) to ensure text doesn't feel cramped against borders.
- **Mobile Adaptation:** Section gaps compress by ~55% on mobile, and horizontal gutters reduce to `16px`.

## Elevation & Depth
Depth is expressed through **Glassmorphism and Tonal Layering** rather than traditional shadows.

- **The Glass Layer:** Used for the "Advisor" card and the Radar Chart container. It features a high backdrop-blur (`24px` to `40px`) and a thin, low-opacity white border to define edges.
- **The Flat Layer:** Standard cards use a `1px` subtle border (`#E7E7E4`) and a very slight elevation shadow (`0 4px 24px -1px rgba(0,0,0,0.02)`) to appear resting on the surface.
- **Interactions:** Buttons use an `active:scale-95` transform to provide tactile feedback without needing complex shadow changes.

## Shapes
The shape language is **Rounded**, using varied radii to establish a "nested" hierarchy:

- **Large Containers:** Hero panels and sections use `rounded-3xl` (`1.5rem`) for a soft, premium feel.
- **Standard Cards:** Use `rounded-2xl` or `3xl` depending on content density.
- **Interactive Elements:** Buttons and secondary tags use **Full (Pill)** rounding to maximize contrast with the structural rectangular grid of tables and inputs.
- **Form Fields:** Use `rounded-xl` (`0.75rem`) to appear distinct from pill-shaped buttons.

## Components

### Buttons
- **Primary:** Rounded-full, high-contrast (Black/White), `font-body-md` semibold.
- **Secondary:** Rounded-full, border-subtle, transparent background, transitions to slight fill on hover.

### Cards
- **Feature Cards:** `rounded-3xl`, `bg-card-fill`, `1px border-subtle`. Feature a "Footer" area separated by a border for metadata like status and model name.
- **Glass Cards:** `backdrop-blur-xl`, `bg-white/60`, `border-white/40`. Used for high-priority insights.

### Tables
- **Professional Table:** Clean, no vertical borders. Uses `font-label-caps` for headers and `hover:bg-surface-container-low` for row interactions. Highlights specific metrics (like Latency) with accent colors.

### Inputs
- **Text Areas:** `rounded-xl`, `border-border-subtle`. Focus state uses a `ring-2` of the primary color with a transparent border to maintain sharp definition.

### Status Indicators
- **Dot Labels:** Small `rounded-full` badges containing a solid color dot (Emerald/Purple) alongside `font-caption` text.