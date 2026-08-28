import React, { useState } from 'react';
import { Layers, RefreshCw, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { formatCoordinate, formatKnots, formatBearing, getRiskBadgeClass } from '../../utils/formatters';
import { IcebergAPI } from '../../services/api';

export default function IcebergPanel({ iceberg, onPredictionUpdated }) {
  const [isPredicting, setIsPredicting] = useState(false);

  if (!iceberg) {
    return (
      <div className="bg-surface-container/90 border border-outline-variant/40 rounded-lg p-3.5 text-xs font-mono backdrop-blur-md flex flex-col items-center justify-center min-h-[220px] text-center text-on-surface-variant">
        <Layers className="w-8 h-8 text-outline mb-2 opacity-50" />
        <p>No iceberg selected.</p>
        <p className="text-[11px] text-outline mt-1">Click an iceberg marker on the Antarctic map to inspect telemetry.</p>
      </div>
    );
  }

  const handleRecalculate = () => {
    setIsPredicting(true);
    IcebergAPI.triggerPrediction(iceberg.id)
      .then((res) => {
        if (onPredictionUpdated) onPredictionUpdated(res.data);
      })
      .finally(() => setIsPredicting(false));
  };

  return (
    <div className="bg-surface-container/90 border border-outline-variant/40 rounded-lg p-3.5 text-xs font-mono backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-base">🧊</span>
          <div>
            <div className="font-bold text-ice-white text-sm">{iceberg.name}</div>
            <div className="text-[10px] text-on-surface-variant font-mono">ID: {iceberg.id}</div>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] ${getRiskBadgeClass(iceberg.risk_level)}`}>
          {iceberg.risk_level} RISK
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center py-0.5 border-b border-outline-variant/20">
          <span className="text-on-surface-variant">Current Position:</span>
          <span className="font-bold text-ice-white">{formatCoordinate(iceberg.lat, iceberg.lon)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 py-1 border-b border-outline-variant/20">
          <div className="bg-surface-container-low p-1.5 rounded border border-outline-variant/30">
            <span className="text-[10px] text-on-surface-variant">Dimensions</span>
            <div className="font-bold text-ice-white mt-0.5">{iceberg.length_km} x {iceberg.width_km} km</div>
            <div className="text-[9px] text-primary">Area: {iceberg.area_sq_km} km²</div>
          </div>
          <div className="bg-surface-container-low p-1.5 rounded border border-outline-variant/30">
            <span className="text-[10px] text-on-surface-variant">Mass & Thickness</span>
            <div className="font-bold text-ice-white mt-0.5">{(iceberg.mass_megatons / 1000).toFixed(1)}k MT</div>
            <div className="text-[9px] text-primary">Draft: ~{iceberg.thickness_m} m</div>
          </div>
        </div>

        <div className="flex justify-between items-center py-0.5 border-b border-outline-variant/20">
          <span className="text-on-surface-variant">Drift Velocity:</span>
          <span className="font-bold text-primary">
            {formatKnots(iceberg.drift_speed_knots)} @ {formatBearing(iceberg.drift_heading_deg)}
          </span>
        </div>

        {/* AI Multi-Horizon Trajectory Forecast */}
        <div className="mt-2 pt-1 border-t border-outline-variant/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-ice-white flex items-center gap-1 text-[11px]">
              <TrendingUp className="w-3 h-3 text-primary-container" /> AI DRIFT PREDICTIONS (XGBoost + Hydro)
            </span>
            <button
              onClick={handleRecalculate}
              disabled={isPredicting}
              title="Re-run AI Drift Engine"
              className="p-1 rounded bg-surface-container-high hover:bg-surface-bright text-primary transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isPredicting ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1 text-center font-mono">
            {iceberg.predictions?.map((pred) => (
              <div key={pred.horizon_hours} className="bg-surface-container-low p-1 rounded border border-outline-variant/30">
                <div className="text-[10px] text-primary font-bold">+{pred.horizon_hours}h</div>
                <div className="text-[10px] text-ice-white font-medium">+{pred.drift_distance_km}km</div>
                <div className="text-[9px] text-risk-low">{pred.confidence_pct}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[10px] text-on-surface-variant bg-surface-container-low p-2 rounded border border-outline-variant/30 flex items-start gap-1.5 mt-2">
          <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
          <span>{iceberg.notes || 'Source: USNIC / Sentinel-1 SAR.'}</span>
        </div>
      </div>
    </div>
  );
}
