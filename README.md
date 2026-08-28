# ICEGUARD AI — Antarctic Iceberg Intelligence & Safe Navigation System

**ICEGUARD AI** is an advanced polar maritime decision-support command platform engineered for Antarctic navigation. It provides real-time iceberg tracking, multi-horizon AI & physics-informed trajectory prediction (6h/12h/24h/48h/72h), dynamic collision risk assessment, multi-objective safe route optimization, and Sentinel-1 Synthetic Aperture Radar (SAR) satellite intelligence.

---

## 🚢 Core Visual Story
$$\text{Vessel} \longrightarrow \text{Iceberg} \longrightarrow \text{AI Prediction} \longrightarrow \text{Collision Risk} \longrightarrow \text{Safer Route}$$

---

## 🌟 Key Features

1. **Polar Geospatial Command Center Dashboard**
   - High-contrast polar dark oceanic bathymetry with Antarctic coordinates (-60° to -85° S).
   - Real-time layers: Active Icebergs (*A76C*, *A23A*, *D28*, *B15Y*, etc.), historical drift tracks, multi-horizon AI forecast cones, sea ice concentration pack polygons, vessel position (*INS Explorer*), planned route vs. AI recommended safe route.

2. **Physics + ML Hybrid Drift Engine**
   - Hydrodynamic current forcing (Copernicus Marine) + ERA5 10m surface wind drag (with Southern Hemisphere Coriolis deflection $\approx -30^\circ$).
   - XGBoost residual model predicting 6h, 12h, 24h, 48h, 72h horizons with dynamic 95% confidence uncertainty ellipses.

3. **Dynamic Navigation Risk & Collision Matrix**
   - Closest Point of Approach (CPA in km) & Time to CPA (TCPA in hours) between vessel heading and iceberg trajectories.
   - Multi-factor hazard evaluation: Collision probability, iceberg mass/dimensions, sea ice impedance, and weather severity.

4. **Multi-Objective Polar Safe Route Optimizer**
   - Polar maritime grid pathfinding balancing distance against iceberg collision corridors and pack ice concentration.
   - Computes Baseline Direct Route vs. Alternative A (Safest / Recommended with ~68% risk reduction) vs. Alternative B (Fast-Safe with favorable tail-currents).

5. **Sentinel-1 SAR Satellite Intelligence**
   - Orbital acquisition passes, radar cross-section backscatter (RCS in dB), target segmentations, and cross-validation against the USNIC database.

6. **Environmental & Telemetry Data Hub**
   - Live status and data quality tracking for USNIC, Copernicus Marine, ECMWF ERA5, NSIDC Sea Ice, and Sentinel-1.

---

## 🛠 Tech Stack

- **Backend**: FastAPI, Python 3.10+, Uvicorn, Pydantic, NumPy, Pandas, Scikit-learn, WebSockets.
- **Frontend**: React 18, Vite, Tailwind CSS, Leaflet, Recharts, Lucide Icons.

---

## 🚀 Quick Start Guide

### 1. Run the Backend
```bash
cd backend
python run.py
```
*The backend API will start at `http://127.0.0.1:8000` with interactive Swagger docs at `http://127.0.0.1:8000/docs`.*

### 2. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
*The frontend will start at `http://localhost:3000`.*

---

## 🧪 Testing
Run backend unit and integration test suites:
```bash
cd backend
python -m pytest tests/
```
