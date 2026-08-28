---
name: Glacial Light
colors:
  surface: '#ffffff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#f1f5f9'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3f4850'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#cbd5e1'
  outline-variant: '#bfc7d2'
  surface-tint: '#006398'
  primary: '#006194'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#93ccff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#4e5e68'
  on-tertiary: '#ffffff'
  tertiary-container: '#667781'
  on-tertiary-container: '#fbfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#d3e5f1'
  tertiary-fixed-dim: '#b7c9d5'
  on-tertiary-fixed: '#0c1e26'
  on-tertiary-fixed-variant: '#384953'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
  safety-orange: '#ff6d00'
  glacial-blue: '#f0f8ff'
  data-cyan: '#00ced1'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-display:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-margin: 24px
  panel-gap: 16px
  data-row-padding: 10px
  compact-padding: 6px
  gutter: 16px
---

## Brand & Style
The design system transitions from the dark, nocturnal bridge environment to a high-visibility, daylight-optimized interface for maritime and scientific operations. The brand personality remains authoritative and technical, but shifts its emotional tone from "stealth" to "clarity and precision." It evokes the atmosphere of an arctic expedition—bright, crisp, and high-contrast.

The style is **Modern Corporate** with a focus on **Precision Minimalism**. It leverages the brightness of snow and ice as a backdrop to highlight critical data. The interface prioritizes extreme legibility under high-glare conditions by utilizing a stark white base, maritime blue accents, and subtle depth markers. The visual language feels like a high-end scientific instrument: clean, cold, and meticulously organized.

## Colors
The palette is inspired by glacial environments, moving away from dark tones to a high-visibility light mode. 

- **Primary (#0284c7):** A deep maritime blue used for active states, primary actions, and primary text to ensure WCAG AAA compliance on white backgrounds.
- **Secondary (#64748b):** A muted slate blue for auxiliary information and non-critical UI elements.
- **Surface / Surface-Container:** Transitions from pure `#ffffff` for the base to `#f1f5f9` for nested panels, creating a crisp hierarchical stack.
- **Accents:** 
    - **Safety Orange (#ff6d00):** Strictly reserved for alerts, high-risk warnings, and critical data points.
    - **Data Cyan (#00ced1):** A bright, clear hue used specifically for telemetry visualizations and map-based data overlays.

## Typography
Typography is tuned for high-contrast legibility. **Inter** is the primary typeface; font weights are slightly increased (e.g., using 500 instead of 400 for body-lg) to maintain visual weight against the bright white surfaces.

**JetBrains Mono** remains the functional choice for coordinates, sensor readouts, and timestamps. The monospaced width is critical for ensuring that rapidly changing numerical data remains stable. `label-caps` should be used for technical headers and metadata to provide a clear, rigid structure to data-heavy panels.

## Layout & Spacing
The layout uses a **Fluid Grid** system designed for professional multi-monitor setups or high-resolution laptops. The primary content (typically a map or sonar view) should occupy the majority of the viewport, with collapsible data sidebars.

- **Desktop:** 12-column grid with 16px gutters. Sidebars are docked but can be hidden to maximize situational awareness.
- **Tablet:** 8-column grid. Sidebars transition to overlay drawers.
- **Mobile:** Single-column layout focusing on critical alerts and status summaries.

Spacing is slightly expanded compared to the dark mode version to allow the "breathable" white space to define boundaries, using a strict 8px/4px rhythm.

## Elevation & Depth
In this design system, depth is communicated through **Ambient Shadows** and **Tonal Layers** rather than borders. This creates a softer, more modern "app" feel while maintaining scientific rigor.

- **Level 0 (Base):** White (`#ffffff`) background.
- **Level 1 (Panels):** Surface-container (`#f1f5f9`) with a subtle 1px inner stroke of `#cbd5e1`.
- **Level 2 (Active Overlays):** White surfaces with a soft, diffused shadow (0px 4px 20px rgba(15, 23, 42, 0.08)).
- **Level 3 (Modals):** High-elevation shadows with a blue-tinted ambient occlusion to tie into the maritime theme.

Avoid heavy dark borders; use light-on-light color shifts to define areas of the UI.

## Shapes
The design system employs a **Soft (0.25rem)** roundedness. This provides a balance between the precision of a professional tool and the approachability of contemporary software.

- **Components:** Buttons and input fields use a standard 4px radius.
- **Data Cards:** 8px (rounded-lg) radius to clearly distinguish them from the base layout.
- **Status Pills:** Fully rounded to differentiate static status markers from interactive UI buttons.

## Components
- **Buttons:** Primary buttons use `primary_color_hex` with white text. Secondary buttons use the `outline` color with `primary` text.
- **Input Fields:** Use white backgrounds with a 1px `#cbd5e1` border. Focus states use a `primary_color_hex` border and a soft blue glow.
- **Chips & Tags:** Use `glacial-blue` backgrounds with `primary` text for a clean, non-obtrusive look.
- **Lists:** Use alternating row colors (White and `#f1f5f9`) for long data tables to improve horizontal tracking.
- **Navigation:** Maintain the "Scientific Navigation" aesthetic with sharp icons and monospaced labels. Active tabs should be marked with a `primary` thick bottom border (3px).
- **Cards:** Cards should have no borders, using the Level 2 shadow to separate themselves from the background.
- **Alerts:** Critical alerts use `safety-orange` for the background with white text, ensuring they are the highest-priority visual element on the screen.