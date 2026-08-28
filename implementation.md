# Implementation Plan: ICEGUARD AI v2.0 — Major Upgrades & Bugfixes

This plan addresses the route path trajectory issues and implements all requested advanced capabilities for the Antarctic Iceberg Intelligence & Safe Navigation System.

---

## 1. Issues to Fix & Major New Features

### 🐛 Bugfix: Route Waypoint Geometry & Realistic Maritime Smoothing
- **Issue**: The route waypoints in the current build had zig-zag coordinates crossing south over the continental ice shelf rather than staying strictly in navigable Antarctic waters.
- **Fix**: Re-engineer the waypoint path generator in `route_optimizer.py` and `scenario_manager.py` using cubic spline interpolation / great-circle arc segments strictly bounded between $-62^\circ\text{ S}$ and $-69.8^\circ\text{ S}$, ensuring smooth, hydrodynamically realistic maritime corridors that safely skirt around the fast-ice edge to the designated coastal unloading waypoints.

---

### 🌟 6 Major Feature Additions

#### 1. Multi-Vessel Fleet Tracking (All Present Vessels on Board)
- Display all active Indian and international Antarctic expedition vessels simultaneously on the map:
  - 🇮🇳 **MV Vasiliy Golovnin** (NCPOR Flagship en route to Maitri Coast)
  - 🇮🇳 **ORV Sagar Nidhi** (MoES Oceanographic Vessel en route to Bharati / Prydz Bay)
  - 🇮🇳 **INS Sagardhwani** (Acoustic Research Vessel in Weddell Sea)
  - 🇬🇧 **RRS Sir David Attenborough** (British Antarctic Survey)
  - 🇩🇪 **RV Polarstern** (Alfred Wegener Institute)
  - 🇿🇦 **S.A. Agulhas II** (South African Polar Logistics)
- Interactive Fleet Selector to switch active vessel perspective and inspect live telemetry for any ship.

#### 2. Real-Time Pictorial Satellite View (Google Maps / NASA Style)
- Add a True High-Resolution Satellite Imagery basemap layer toggle:
  - **ESRI World Imagery Satellite** (real-world optical satellite photography showing sea ice textures and continental glacier edges).
  - Basemap switcher control in top-right map corner: **`🛰️ Satellite` | `🌌 Dark Ocean` | `🧊 Glacial Light`**.

#### 3. Glacial Ice Light Mode Theme
- Add full theme switching between **Dark Command Center** and **Glacial Ice Light Mode**:
  - Crisp glacial ice palette (`#E0F7FA`, `#F0F4F8`, `#C3F5FF`, deep navy `#0A192F` typography) matching the Stitch UI design specifications in `stitch_dynamic_ui_generator`.
  - Instant toggle button in the main Navbar.

#### 4. Emergency SOS & Distress Beacon System
- Dedicated SOS Emergency Protocol panel & modal:
  - Distress triggers: **Ice Entrapment (Bespoke Fast-Ice Besetment)**, **Imminent Collision**, **Hull Stress Warning**, **Engine Failure**.
  - Computes distance to nearest Indian stations (*Maitri*, *Bharati*) and nearest relief icebreakers.
  - Generates realistic GMDSS / Iridium emergency distress message packet with GPS coordinates, POB (Persons on Board), and distress code.
  - Visual pulsing emergency alert strobe on map and audio siren toggle.

#### 5. Commander & Navigator Login Panel
- Role-based authentication modal & header badge:
  - Roles: **NCPOR Mission Commander**, **Chief Navigator (OOW)**, **Polar Researcher**, and **Guest Observer**.
  - Demo quick-login presets (e.g. `commander / sih2026`).

#### 6. 100% Offline Standalone Operational Mode
- Ensure the system works completely offline in isolated polar waters without any internet connection.
- Local SVG/Vector tile fallbacks, bundled historical ice tracks, and offline ML inference.

---

## 2. Proposed Changes & File Architecture

```
SIH_PS_26059/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── fleet.py               # [NEW] Multi-vessel fleet schema
│   │   │   ├── emergency.py           # [NEW] SOS distress beacon schema
│   │   │   └── user.py                # [NEW] Auth & user roles schema
│   │   ├── services/
│   │   │   ├── fleet_service.py       # [NEW] Fleet repository & multi-ship telemetry
│   │   │   ├── emergency_service.py   # [NEW] GMDSS distress calculations & SAR dispatch
│   │   │   ├── auth_service.py        # [NEW] Officer authentication & role management
│   │   │   ├── route_optimizer.py     # [MODIFY] Fix route curves & realistic maritime splines
│   │   │   └── scenario_manager.py    # [MODIFY] Synchronize all fleet positions & smooth tracks
│   │   └── api/v1/
│   │       ├── fleet.py               # [NEW] /api/v1/fleet endpoints
│   │       ├── emergency.py           # [NEW] /api/v1/emergency/sos endpoints
│   │       └── auth.py                # [NEW] /api/v1/auth endpoints
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx             # [MODIFY] Add Theme toggle (Light/Dark), SOS button, Login pill
│   │   │   ├── SOSModal.jsx           # [NEW] Emergency distress broadcast modal
│   │   │   ├── LoginModal.jsx         # [NEW] Role-based login modal
│   │   │   ├── map/
│   │   │   │   ├── PolarMap.jsx       # [MODIFY] Add Satellite basemap layer, Fleet markers, SOS strobe
│   │   │   │   └── BasemapControl.jsx # [NEW] Satellite vs Dark vs Light layer switcher
│   │   │   ├── panels/
│   │   │   │   ├── FleetPanel.jsx     # [NEW] Multi-vessel list & quick switch
│   │   │   │   └── VesselPanel.jsx    # [MODIFY] Support active selected vessel from fleet
│   │   │   └── views/
│   │   │       ├── DashboardView.jsx  # [MODIFY] Integrate fleet selector & satellite view
│   │   │       └── FleetView.jsx      # [NEW] Dedicated Full Fleet Overview View
│   │   └── App.jsx                    # [MODIFY] Theme context & SOS state handling
```

---

## 3. Verification Plan

### Automated Tests
- Run `pytest tests/` in backend verifying:
  - Route waypoint coordinates remain strictly in navigable maritime waters north of ice shelves.
  - Multi-vessel fleet telemetry query and distance-to-station calculations.
  - Emergency SOS packet generation and nearest search-and-rescue asset dispatch logic.

### Manual Verification
- **Satellite View**: Switch to "🛰️ Satellite View" on PolarMap and verify real-color satellite imagery renders smoothly without watermarks.
- **Light Theme**: Toggle "Glacial Ice Light Mode" in Navbar and verify crisp ice-blue styling.
- **Fleet Tracking**: Click different ships (*MV Vasiliy Golovnin*, *ORV Sagar Nidhi*, *INS Sagardhwani*) and verify camera flies to the selected ship with active route.
- **Emergency SOS**: Click `[ 🚨 EMERGENCY SOS ]`, select "Ice Entrapment / Besetment", and verify distress beacon broadcasts on map with rescue ETA.
- **Login Modal**: Click login pill, test quick-login with `Commander`, verify access level changes.

