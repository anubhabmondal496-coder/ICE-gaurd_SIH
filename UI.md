# UI.md — ICEGUARD AI

## Antarctic Iceberg Intelligence & Safe Navigation System

The UI should look like a professional Antarctic navigation command center rather than a generic ML dashboard.

### Core visual story

**🚢 Vessel → 🧊 Iceberg → 🔮 Prediction → ⚠️ Risk → 🧭 Safer Route**

---

## 1. Main Navigation Bar

```text
ICEGUARD AI

Dashboard | Icebergs | Prediction | Risk Map |
Route Planner | Physical Demo | Data Sources
```

Branding:

**ICEGUARD AI**  
*Antarctic Iceberg Intelligence & Safe Navigation*

---

## 2. Main Dashboard

```text
┌────────────────────────────────────────────────────────────────────┐
│  ICEGUARD AI                          ● SYSTEM ONLINE    09:42 UTC │
│  Antarctic Iceberg Intelligence & Safe Navigation                  │
├───────────────┬────────────────────────────────────────────────────┤
│  NAVIGATION   │                ANTARCTIC MAP                       │
│ 🚢 Vessel     │       🧊 A76C                                     │
│ 🎯 Destination│          ╲ Predicted trajectory                    │
│ ⚠ Risk        │      🚢──────╲                                    │
│               │                                                    │
│ ENVIRONMENT   │  TRAJECTORY PREDICTION                            │
│ 🌊 Current    │  6h      12h      24h                            │
│ 🌬 Wind       │   ●──────●────────●                               │
│ 🧊 Sea Ice    │  Confidence: 87%                                  │
├───────────────┴────────────────────────────────────────────────────┤
│ ⚠ ALERT: Predicted iceberg trajectory intersects planned route    │
│ [ VIEW SAFER ROUTE ]                  [ ANALYZE TRAJECTORY ]       │
└────────────────────────────────────────────────────────────────────┘
```

The map should occupy most of the screen.

Show:
- Current iceberg positions
- Historical trajectories
- Predicted trajectories
- Prediction uncertainty corridor
- Vessel position
- Planned vessel route
- Recommended route
- Sea-ice layer
- Risk zones

Suggested map convention:
- Solid line = historical/actual trajectory
- Dashed line = predicted trajectory
- Shaded corridor = prediction uncertainty
- Vessel marker = ship
- Iceberg marker = iceberg
- 🟢 Safe / 🟡 Caution / 🔴 High Risk

---

## 3. Vessel Panel

```text
VESSEL STATUS
────────────────
Vessel: INS Explorer

Position
69.82° S
11.21° E

Speed
12.4 knots

Destination
Maitri Region

ETA
18:42 UTC
```

For the prototype, vessel position can initially be simulated. The architecture should allow future real vessel-position feeds.

Maitri is inland, so the maritime route should terminate at an appropriate coastal logistics/unloading waypoint rather than treating Maitri itself as a ship waypoint.

---

## 4. Iceberg Information Panel

When an iceberg is selected:

```text
ICEBERG A76C
────────────────
Current Position
-64.23°, 45.72°

Size
...

Velocity
0.21 m/s

Direction
37°

Predicted Movement
6h    +12 km
12h   +24 km
24h   +48 km

Confidence
87%
```

Include:
- Iceberg ID
- Latitude/longitude
- Size
- Velocity
- Direction
- Historical track
- Predicted movement
- Prediction confidence
- Last observation time

---

## 5. Environmental Conditions

```text
┌────────────┐
│ 🌊 CURRENT │
│ 0.32 m/s   │
│ → 37°      │
└────────────┘

┌────────────┐
│ 🌬 WIND    │
│ 7.2 m/s    │
│ ↗ 41°      │
└────────────┘

┌────────────┐
│ 🧊 SEA ICE │
│ 72%        │
│ HIGH       │
└────────────┘
```

Potential variables:
- Ocean-current speed/direction
- Wind speed/direction
- Sea-ice concentration
- Sea-surface temperature
- Other available environmental variables

---

## 6. AI Prediction Panel

```text
TRAJECTORY PREDICTION
────────────────────────

Model: XGBoost

Prediction Horizon

6h     12h     24h
●──────●───────●

Position Error
2.4 km

Confidence
87%

Model Status
● ACTIVE
```

Possible future model selector:

```text
MODEL
[ XGBoost ▼ ]
```

Future versions may include LSTM/GRU.

---

## 7. Navigation Risk Panel

```text
NAVIGATION RISK
══════════════════

       🟡 MEDIUM

Collision Probability
18%

Closest Approach
7.2 km

Time to Closest Approach
14h 32m
```

Risk categories:
- 🟢 LOW
- 🟡 MEDIUM
- 🔴 HIGH

Main action:

**[ GENERATE SAFER ROUTE ]**

Possible risk inputs:
- Estimated collision probability
- Closest predicted distance
- Time to closest approach
- Iceberg size
- Prediction uncertainty
- Sea-ice conditions
- Weather/current conditions

---

## 8. Route Recommendation

```text
ROUTE ANALYSIS

Current Route
Distance: 820 km
Risk: HIGH 🔴

Alternative A
Distance: 845 km
Risk: LOW 🟢

Alternative B
Distance: 835 km
Risk: MEDIUM 🟡

       ★ RECOMMENDED
       Alternative A

Risk reduction: 64%
```

The recommended route should be visually distinguished on the map.

Conceptual cost:

```text
Route Cost =
Distance Cost
+ Iceberg Risk
+ Sea-Ice Risk
+ Environmental Risk
```

The system should balance travel distance against navigation safety.

---

## 9. Physical Validation Page

Title:

**Physical Validation**

Use:
- ESP32-CAM
- Transparent water tank/bowl
- Floating iceberg model
- Artificial water ripples/current

```text
┌────────────────────────────────────────────────────┐
│             PHYSICAL VALIDATION                    │
├───────────────────────┬────────────────────────────┤
│   ESP32-CAM VIDEO     │    TRAJECTORY             │
│   ┌───────────────┐   │       🧊                  │
│   │      🧊       │   │        ╲──●              │
│   │   ~~~~~~~~~   │   │             ╲             │
│   │ → → → → → →  │   │              ●            │
│   └───────────────┘   │                            │
├───────────────────────┴────────────────────────────┤
│ Current: 0.18 m/s     Direction: 42°              │
│ Predicted Error: 3.2 cm                            │
│ Model Confidence: 91%                              │
└────────────────────────────────────────────────────┘
```

Workflow:

```text
ESP32-CAM
    ↓
Video Frames
    ↓
OpenCV Detection
    ↓
Ice Position (x,y)
    ↓
Velocity / Direction
    ↓
Artificial Ripple/Current
    ↓
Trajectory Prediction
    ↓
Predicted vs Actual Comparison
```

The physical setup is a validation platform, not a literal miniature Antarctic environment.

---

## 10. Data Sources Page

```text
DATA SOURCES

● USNIC
  Iceberg trajectories

● NSIDC
  Sea-ice concentration

● ERA5
  Wind & atmospheric data

● Copernicus Marine
  Ocean currents

● Sentinel-1
  SAR imagery
```

Also show:

```text
Last Updated
28 Aug 2026
```

For each source, display:
- Source name
- Dataset type
- Variables used
- Last update
- Data status
- Source/reference link

---

## 11. Icebergs Page

Provide a searchable table:

| ID | Latitude | Longitude | Velocity | Direction | Size | Risk | Last Updated |
|---|---:|---:|---:|---:|---|---|---|
| A76C | -64.23 | 45.72 | 0.21 m/s | 37° | ... | Medium | ... |
| A23A | ... | ... | ... | ... | ... | Low | ... |

Features:
- Search iceberg by ID
- Sort by risk
- Filter by region
- Click a row to focus on the map

---

## 12. Prediction Page

Show model inputs and outputs.

### Inputs
- Previous positions
- Velocity
- Direction
- Ocean current
- Wind
- Sea-ice concentration
- Other environmental features

### Outputs
- 6-hour prediction
- 12-hour prediction
- 24-hour prediction
- Predicted coordinates
- Uncertainty
- Error metrics

Example:

```text
CURRENT POSITION
-64.23°, 45.72°

             ↓

6 HOURS
-64.18°, 45.91°
Confidence: 92%

             ↓

12 HOURS
-64.12°, 46.20°
Confidence: 88%

             ↓

24 HOURS
-64.03°, 46.62°
Confidence: 81%
```

---

## 13. Risk Map Page

Layer controls:

```text
☑ Icebergs
☑ Historical Tracks
☑ Predicted Tracks
☑ Uncertainty
☑ Sea Ice
☑ Vessel
☑ Planned Route
☑ Recommended Route
☑ Risk Zones
```

Risk visualization:

```text
🟢 LOW
🟡 MEDIUM
🔴 HIGH
```

Users should be able to zoom into a region and inspect individual icebergs.

---

## 14. Route Planner Page

Input:

```text
START
[ Vessel Position ]

DESTINATION
[ Antarctic Coastal Waypoint ]

DEPARTURE TIME
[ Date / Time ]
```

Action:

**[ ANALYZE ROUTE ]**

Output:

```text
ORIGINAL ROUTE
Distance: ...
Risk: ...

OPTIMIZED ROUTE
Distance: ...
Risk: ...
Risk Reduction: ...

[ APPLY RECOMMENDED ROUTE ]
```

The route planner should use predicted iceberg positions and environmental risk rather than simply finding the shortest geographical path.

---

## 15. Alerts

Example:

```text
⚠ HIGH-RISK ALERT

Iceberg A76C predicted to approach
planned vessel route within 7.2 km.

Time to closest approach:
14h 32m

Recommended action:
Review Alternative Route A
```

Alert levels:
- INFO
- CAUTION
- WARNING
- CRITICAL

---

## 16. Responsive Design

Primary target:
- Desktop
- Laptop

Also support:
- Tablet

Mobile should provide a simplified view instead of displaying the complete command center.

---

## 17. Recommended Visual Style

Use a professional scientific/maritime aesthetic.

Characteristics:
- Dark navigation-dashboard style
- High-contrast map
- Clear typography
- Minimal decoration
- Large map area
- Compact information cards
- Clear status indicators
- Consistent icons
- Strong distinction between actual and predicted data

Avoid:
- Excessive animations
- Gaming-style UI
- Too many charts
- Decorative 3D elements without information value
- Overcrowded dashboards

The UI should feel like a serious decision-support system.

---

## 18. Main User Journey

```text
OPEN DASHBOARD
      ↓
SELECT VESSEL
      ↓
SELECT DESTINATION
      ↓
VIEW CURRENT ICEBERGS
      ↓
VIEW ENVIRONMENT
      ↓
RUN TRAJECTORY PREDICTION
      ↓
GENERATE RISK MAP
      ↓
CHECK ROUTE INTERSECTION
      ↓
CALCULATE ALTERNATIVE ROUTES
      ↓
RECOMMEND SAFEST FEASIBLE ROUTE
      ↓
DISPLAY ALERT
```

---

## 19. Recommended UI Technology

### Frontend
- React.js
- JavaScript/TypeScript
- HTML
- CSS

### Mapping
- Leaflet.js
- Mapbox (optional)

### Charts
- Plotly
- Recharts (optional)

### Backend
- FastAPI
- Python

### Database
- PostgreSQL
- PostGIS

### AI/ML
- XGBoost
- PyTorch
- LSTM/GRU
- YOLO
- OpenCV

### Geospatial
- GeoPandas
- Rasterio
- GDAL
- xarray

### Prototype
- ESP32-CAM
- Arduino/C++
- OpenCV

---

## 20. Final Homepage Story

```text
                 ICEGUARD AI
      Antarctic Iceberg Intelligence
             & Safe Navigation

                        ↓

        🚢 VESSEL + 🧊 ICEBERGS

                        ↓

          ENVIRONMENTAL DATA
      🌊 Current | 🌬 Wind | 🧊 Sea Ice

                        ↓

             🤖 AI PREDICTION

                        ↓

             ⚠️ RISK ASSESSMENT

                        ↓

             🧭 SAFE ROUTE
```

The homepage should communicate:

> A system that helps a vessel operator understand iceberg danger and make a safer navigation decision.

The website should therefore tell one clear story:

**Observe → Predict → Assess Risk → Optimize Route → Alert.**
