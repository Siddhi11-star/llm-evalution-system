---
name: JudgeLens
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#4b41e1'
  on-secondary: '#ffffff'
  secondary-container: '#645efb'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0f0069'
  on-secondary-fixed-variant: '#3323cc'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  max-width: 1280px
  margin-page: 32px
  gutter: 16px
  unit-xs: 4px
  unit-sm: 8px
  unit-md: 16px
  unit-lg: 24px
  unit-xl: 48px
---

## Brand & Style
The design system for this product is built on a "Precision Engineering" aesthetic. It targets developers and AI researchers who require high-density data visualization and absolute clarity in LLM evaluation metrics.

The visual style is **Corporate / Modern** with a lean toward **Minimalism**. It prioritizes functional clarity over decorative elements. The brand personality is authoritative, objective, and analytical. To differentiate from standard SaaS templates, it utilizes a "Workstation" density—smaller base font sizes and tighter margins that allow for complex side-by-side model comparisons.

To maintain visual interest without sacrificing professionalism, the design system utilizes subtle "neural signal" gradients—soft, low-opacity indigo and emerald blurs that suggest background processing and judge agent activity.

## Colors
The palette is strictly engineered for a light-mode "Laboratory" environment.

- **Primary (#000000):** Used for core text, primary action buttons, and structural borders. It conveys weight and finality.
- **Secondary / Logic Indigo (#4F46E5):** Represents reasoning, graph connections, and LLM logic flows.
- **Tertiary / Emerald (#10B981):** Reserved exclusively for positive evaluation statuses (Accuracy, Safety, Pass).
- **Background (#FFFFFF):** The absolute canvas for all screens.
- **Surface (#F3F4F6):** A soft gray for card backgrounds and inactive states, providing enough contrast to separate UI modules from the white background.
- **Accent Red (#EF4444):** Used sparingly for Hallucination alerts and Safety violations.

## Typography
This design system uses **Geist** for structural headings and labels to impart a technical, monospaced-adjacent feel, while **Inter** is used for body text to ensure maximum legibility during long-form evaluation reading.

- Use **Geist** for all numerical data and status labels.
- Use **Inter** for LLM prompt/response text.
- Headings should use tight letter spacing to maintain a "tightly packed" professional appearance.
- Labels should be frequently used in uppercase with tracking to denote metadata and category headers.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy centered on a 1280px container. This mimics a professional dashboard or IDE environment.

- **Grid:** Use a 12-column grid system for primary content areas.
- **Density:** Use 16px as the standard gutter between modules to maintain high information density without clutter.
- **Vertical Rhythm:** Utilize 8px increments for internal component padding.
- **Mobile Adaptation:** On mobile devices, the 1280px container collapses to a 100% fluid width with 16px side margins. Complex data tables should implement horizontal scrolling rather than reflowing, to preserve column relationships.

## Elevation & Depth
In this design system, depth is communicated through **Tonal Layers** rather than shadows. This keeps the interface feeling "flat" and engineered.

- **Level 0 (Background):** #FFFFFF.
- **Level 1 (Card/Section):** #F9FAFB with a 1px solid border (#E5E7EB).
- **Level 2 (Inlay/Active State):** #F3F4F6.
- **Active Selection:** Instead of shadows, use a 2px solid Indigo (#4F46E5) border or a subtle vertical accent bar to indicate focus.
- **Overlays:** Modals and dropdowns use a very light, diffused shadow (0px 4px 20px rgba(0,0,0,0.05)) to distinguish them from the base grid.

## Shapes
The shape language is **Soft (0.25rem)**. This slight rounding takes the edge off the brutalist structure while maintaining a serious, disciplined atmosphere. 

- **Buttons & Inputs:** 4px (0.25rem) corner radius.
- **Large Containers:** 8px (0.5rem) corner radius.
- **Tags/Status Badges:** Fully rounded (pill) only when indicating a discrete status like "Completed" or "Failed."

## Components

### Buttons
- **Primary:** Solid Black (#000000) with White text. No gradients.
- **Secondary:** White background with 1px border (#E5E7EB).
- **Ghost:** No border, Indigo text for "Add" or "Configure" actions.

### Data Cards
Cards should have a 1px border (#E5E7EB) and no shadow. The header of the card should be separated by a light horizontal rule. Use `label-md` for metadata in the top right corner of cards.

### Input Fields
Strict 1px borders. Use `mono-sm` for placeholder text to signal a technical environment. On focus, the border transitions to Indigo (#4F46E5).

### Evaluation Indicators
- **Score Chips:** Use a circular progress ring or a bold numerical display.
- **Status Badges:** Emerald background (10% opacity) with Emerald text for "Safe"; Red background (10% opacity) with Red text for "Hallucination Detected."

### Navigation
Vertical sidebar with minimal icons. Active state is indicated by a background color change to #F3F4F6 and a bold black font weight.

### Specialty Components
- **Comparison Split-View:** A vertically divided container for comparing two LLM outputs side-by-side. 
- **Graph Node:** Small, 4px rounded rectangles for LangGraph visualization, connected by 1px Indigo lines.