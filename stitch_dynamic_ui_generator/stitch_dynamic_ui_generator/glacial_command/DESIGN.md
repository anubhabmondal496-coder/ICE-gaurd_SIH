---
name: Glacial Command
colors:
  surface: '#0d1516'
  surface-dim: '#0d1516'
  surface-bright: '#333a3c'
  surface-container-lowest: '#080f11'
  surface-container-low: '#151d1e'
  surface-container: '#192122'
  surface-container-high: '#242b2d'
  surface-container-highest: '#2e3638'
  on-surface: '#dce4e5'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#dce4e5'
  inverse-on-surface: '#2a3233'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#ffb692'
  on-secondary: '#562000'
  secondary-container: '#fd6c00'
  on-secondary-container: '#562000'
  tertiary: '#ffeac0'
  on-tertiary: '#3e2e00'
  tertiary-container: '#fec931'
  on-tertiary-container: '#6f5500'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#ffdbcb'
  secondary-fixed-dim: '#ffb692'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#7a3000'
  tertiary-fixed: '#ffdf96'
  tertiary-fixed-dim: '#f3bf26'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#0d1516'
  on-background: '#dce4e5'
  surface-variant: '#2e3638'
  ice-white: '#F0F4F8'
  deep-ocean: '#0A121E'
  slate-gray: '#1C2533'
  safety-orange: '#FF6D00'
  neon-green: '#00E676'
  risk-high: '#FF3D00'
  risk-medium: '#FFC400'
  risk-low: '#00E676'
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
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
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
  data-display:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '500'
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
  panel-gap: 12px
  data-row-padding: 8px
  compact-padding: 4px
---

## Brand & Style
The design system embodies the "Antarctic navigation command center"—a high-stakes, decision-support environment where data clarity is paramount. The brand personality is authoritative, technical, and stoic, designed for operators working in low-light vessel bridges.

The chosen style is a blend of **Minimalism** and **Modern Corporate**, utilizing a "Terminal-Plus" aesthetic. This means prioritizing high-contrast data density, clear structural hierarchies, and a utilitarian layout that removes all non-functional decoration. The interface feels like a precision instrument: cold, sharp, and hyper-reliable.

## Colors
The palette is rooted in a `dark` color mode to preserve night vision and reduce eye strain in bridge environments. 

- **Primary (#00E5FF):** An "Electric Cyan" used for active trajectories, vessel markers, and primary UI highlights. It represents the "glow" of the radar.
- **Secondary / Safety Orange (#FF6D00):** Reserved strictly for warnings, critical alerts, and manual overrides.
- **Neutral / Deep Ocean (#0A121E):** The base background color, providing maximum contrast for chromatic data.
- **Surface / Slate Gray (#1C2533):** Used for panel backgrounds and container levels.

**Data Visualization Logic:**
- Solid lines: Historical/Actual data.
- Dashed lines: Predicted data.
- Color Tiers: Use `risk-high`, `risk-medium`, and `risk-low` for status indicators and route safety ratings.

## Typography
Typography is optimized for legibility under pressure. **Inter** provides a neutral, highly readable base for general UI and body text. 

**JetBrains Mono** is introduced as a secondary functional font for coordinate readouts (Lat/Long), timestamps, and sensor data. The monospaced nature of JetBrains Mono ensures that numerical values do not "jump" when updating in real-time, maintaining a stable visual field for the operator. Use `label-caps` for all technical headers and metadata categories to create a clear "form-like" structure.

## Layout & Spacing
The system uses a **Fluid Grid** with a "Sidebar-Panel" architecture. The Central Map is the primary viewport, occupying at least 60% of the screen width. 

**Layout Rules:**
- **Desktop (1440px+):** 12-column grid. Information panels are pinned to the left and right, appearing as "overlaid glass panels" or docked columns.
- **Tablet (768px - 1024px):** 8-column grid. Side panels collapse into a bottom-sheet or a single-column drawer to maximize map visibility.
- **Mobile:** Not recommended for full command, but supported via a "Critical Alert & Status" single-column view.

Spacing is tight and systematic (4px/8px increments) to maximize "information density" without clutter, allowing the operator to see all vital stats at a single glance.

## Elevation & Depth
Elevation is conveyed through **Tonal Layers** and **Low-Contrast Outlines** rather than soft shadows, which can appear muddy in dark-themed professional software.

- **Level 0 (Base):** `#0A121E` (The deep ocean/map background).
- **Level 1 (Docked Panels):** `#1C2533` with a 1px solid border of `#2D3748`.
- **Level 2 (Active Modals/Overlays):** `#232D3B` with a subtle 10px blur backdrop (glassmorphism) to maintain the sense of the map existing "underneath" the data.

Status markers on the map use a "Glow" effect (outer neon stroke) to denote activity/selection, ensuring they pop against the dark topography.

## Shapes
The design system uses a **Soft (0.25rem)** roundedness. While high-tech systems often trend toward sharp corners, a slight radius improves scannability and "modernizes" the technical aesthetic. 

- **Primary Buttons:** 4px radius.
- **Data Cards:** 4px radius.
- **Status Pills:** Fully rounded (pill-shaped) to distinguish them from interactive buttons.
- **Map Markers:** Hexagonal or diamond shapes for icebergs to differentiate them from the circular vessel marker.

## Components
- **Buttons:** Primary buttons use `primary_color_hex` with black text for maximum contrast. Ghost buttons (border only) are used for secondary actions like "Analyze Trajectory."
- **Technical Status Indicators:** Use a "Dot + Label" pattern. The dot should pulse slightly for `ACTIVE` or `CRITICAL` statuses.
- **Compact Cards:** No padding on horizontal edges for data rows; use `data-row-padding` (8px) vertically. Use dividers (`#2D3748`) between data points.
- **Input Fields:** Dark backgrounds (`#0A121E`) with a 1px border. Focus state should use a `primary_color_hex` glow.
- **Map Markers:** 
    - **Vessel:** Solid Cyan Arrow showing heading.
    - **Iceberg:** Ice-white outline with a semi-transparent fill.
    - **Risk Zone:** Transparent red/yellow radial gradients with a stroked perimeter.
- **Route Planner:** A vertical "stepper" component showing Start, Waypoints, and Destination, color-coded by the risk level of that specific segment.