import React, { useState } from 'react';
import { TrendingUp, Play, Cpu, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { TrajectoryAPI } from '../../services/api';
import { formatCoordinate } from '../../utils/formatters';

export default function PredictionView({ selectedIceberg }) {
  const [lat, setLat] = useState(selectedIceberg?.lat || -64.23);
  const [lon, setLon] = useState(selectedIceberg?.lon || 45.72);
  const [driftSpeed, setDriftSpeed] = useState(selectedIceberg?.drift_speed_knots || 0.25);
  const [driftHeading, setDriftHeading] = useState(selectedIceberg?.drift_heading_deg || 37.0);
  const [mass, setMass] = useState(selectedIceberg?.mass_megatons || 28400.0);
  const [predictions, setPredictions] = useState(selectedIceberg?.predictions || []);
  const [loading, setLoading] = useState(false);

  const handleSimulate = () => {
    setLoading(true);
    TrajectoryAPI.predictCustom({
      lat: Number(lat),
      lon: Number(lon),
      drift_speed_knots: Number(driftSpeed),
      drift_heading_deg: Number(driftHeading),
      horizons_hours: [6, 12, 24, 48, 72],
      mass_megatons: Number(mass),
    })
      .then((res) => {
        setPredictions(res.data);
      })
      .finally(() => setLoading(false));
  };

  const chartData = predictions.map((p) => ({
    horizon: `+${p.horizon_hours}h`,
    distance: p.drift_distance_km,
    error: p.position_error_km,
    confidence: p.confidence_pct,
  }));

  const featureImportanceData = [
    { name: 'Deep Ocean Current (CMEMS)', importance: 42 },
    { name: 'Surface Wind Drag (ERA5 10m)', importance: 28 },
    { name: 'Coriolis Deflection Force', importance: 14 },
    { name: 'Sea-Ice Concentration Pack', importance: 10 },
    { name: 'Iceberg Keel Geometry & Mass', importance: 6 },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-container" />
          <h2 className="font-bold text-ice-white font-mono text-base tracking-wide">
            AI TRAJECTORY & DRIFT PREDICTION STUDIO
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-primary">
          <Cpu className="w-4 h-4" />
          <span>Model: XGBoost Hydrodynamic Residual Engine v2.4</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left Column: Simulation Inputs */}
        <div className="xl:col-span-4 bg-surface-container-low border border-outline-variant/40 rounded-lg p-4 font-mono text-xs space-y-3">
          <div className="font-bold text-ice-white text-sm border-b border-outline-variant/40 pb-2 flex items-center justify-between">
            <span>MODEL PARAMETERS</span>
            <span className="text-[10px] text-primary">INITIAL STATE</span>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="text-on-surface-variant block mb-1">Origin Latitude (° S)</label>
              <input
                type="number"
                step="0.01"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/50 rounded px-3 py-1.5 text-xs text-ice-white outline-none focus:border-primary-container"
              />
            </div>

            <div>
              <label className="text-on-surface-variant block mb-1">Origin Longitude (° E/W)</label>
              <input
                type="number"
                step="0.01"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/50 rounded px-3 py-1.5 text-xs text-ice-white outline-none focus:border-primary-container"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-on-surface-variant block mb-1">Drift Speed (kts)</label>
                <input
                  type="number"
                  step="0.05"
                  value={driftSpeed}
                  onChange={(e) => setDriftSpeed(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded px-3 py-1.5 text-xs text-ice-white outline-none focus:border-primary-container"
                />
              </div>
              <div>
                <label className="text-on-surface-variant block mb-1">Heading (°)</label>
                <input
                  type="number"
                  step="1"
                  value={driftHeading}
                  onChange={(e) => setDriftHeading(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded px-3 py-1.5 text-xs text-ice-white outline-none focus:border-primary-container"
                />
              </div>
            </div>

            <div>
              <label className="text-on-surface-variant block mb-1">Estimated Iceberg Mass (Megatons)</label>
              <input
                type="number"
                step="500"
                value={mass}
                onChange={(e) => setMass(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/50 rounded px-3 py-1.5 text-xs text-ice-white outline-none focus:border-primary-container"
              />
            </div>

            <button
              onClick={handleSimulate}
              disabled={loading}
              className="w-full py-2.5 rounded bg-primary-container text-black font-bold font-mono text-xs flex items-center justify-center gap-2 hover:bg-white transition-all shadow-[0_0_12px_rgba(0,229,255,0.3)] mt-3 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{loading ? 'COMPUTING HYDRODYNAMICS...' : 'EXECUTE PREDICTION HORIZON'}</span>
            </button>
          </div>

          {/* Model Description Box */}
          <div className="bg-surface-container p-3 rounded border border-outline-variant/40 text-[11px] text-on-surface-variant space-y-1 mt-4">
            <strong className="text-ice-white block">Algorithmic Basis:</strong>
            <p>
              Kinematic hydrodynamic current forcing coupled with 10m ERA5 wind drag deflected 30° left (Southern Hemisphere Coriolis acceleration) + XGBoost non-linear eddy residual model.
            </p>
          </div>
        </div>

        {/* Right Column: Prediction Horizons & Charts */}
        <div className="xl:col-span-8 space-y-4">
          {/* Horizon Output Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {predictions.map((p) => (
              <div
                key={p.horizon_hours}
                className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-3 font-mono text-xs relative overflow-hidden"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-primary text-sm">+{p.horizon_hours}h</span>
                  <span className="text-[10px] text-risk-low">{p.confidence_pct}% Conf</span>
                </div>
                <div className="text-[11px] text-ice-white font-medium">{formatCoordinate(p.lat, p.lon)}</div>
                <div className="text-[10px] text-on-surface-variant mt-1">
                  Displacement: <strong className="text-ice-white">+{p.drift_distance_km} km</strong>
                </div>
                <div className="text-[9px] text-risk-medium mt-0.5">
                  Uncertainty: ±{p.position_error_km} km
                </div>
              </div>
            ))}
          </div>

          {/* Recharts Trajectory Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chart 1: Distance & Position Error */}
            <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-4">
              <div className="text-xs font-mono font-bold text-ice-white mb-3">
                PROJECTED DRIFT DISTANCE & ERROR CONE (KM)
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#242b2d" />
                    <XAxis dataKey="horizon" stroke="#849396" tick={{ fontSize: 10, fill: '#849396' }} />
                    <YAxis stroke="#849396" tick={{ fontSize: 10, fill: '#849396' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#151d1e', borderColor: '#00daf3', fontSize: 11 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="distance"
                      name="Drift (km)"
                      stroke="#00e5ff"
                      fill="#00e5ff"
                      fillOpacity={0.25}
                    />
                    <Area
                      type="monotone"
                      dataKey="error"
                      name="Pos Error (km)"
                      stroke="#FFC400"
                      fill="#FFC400"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Feature Importance */}
            <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-4">
              <div className="text-xs font-mono font-bold text-ice-white mb-3">
                PHYSICS & ML FEATURE WEIGHT IMPORTANCE (%)
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureImportanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#242b2d" />
                    <XAxis type="number" stroke="#849396" tick={{ fontSize: 10, fill: '#849396' }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#849396"
                      width={120}
                      tick={{ fontSize: 9, fill: '#bac9cc' }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#151d1e', borderColor: '#00daf3', fontSize: 11 }}
                    />
                    <Bar dataKey="importance" name="Weight %" fill="#00daf3" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
