import React from 'react';
import { Waves, Wind, ShieldAlert, Thermometer, Eye, Gauge } from 'lucide-react';
import { formatBearing } from '../../utils/formatters';

export default function EnvironmentPanel({ environment }) {
  if (!environment) return null;

  return (
    <div className="bg-surface-container/90 border border-outline-variant/40 rounded-lg p-3.5 text-xs font-mono backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <Waves className="w-4 h-4 text-primary-container" />
          <span className="font-bold text-ice-white uppercase tracking-wide">ENVIRONMENTAL TELEMETRY</span>
        </div>
        <span className="text-[10px] text-on-surface-variant font-mono">ERA5 / CMEMS / NSIDC</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Ocean Current */}
        <div className="bg-surface-container-low p-2 rounded border border-outline-variant/30 text-center">
          <div className="text-[10px] text-on-surface-variant flex items-center justify-center gap-1 mb-1">
            <Waves className="w-3 h-3 text-primary-container" /> CURRENT
          </div>
          <div className="font-bold text-ice-white text-sm">
            {environment.ocean_current?.speed_ms} m/s
          </div>
          <div className="text-[10px] text-primary mt-0.5">
            → {formatBearing(environment.ocean_current?.direction_deg)}
          </div>
        </div>

        {/* Surface Wind */}
        <div className="bg-surface-container-low p-2 rounded border border-outline-variant/30 text-center">
          <div className="text-[10px] text-on-surface-variant flex items-center justify-center gap-1 mb-1">
            <Wind className="w-3 h-3 text-risk-medium" /> WIND
          </div>
          <div className="font-bold text-ice-white text-sm">
            {environment.surface_wind?.speed_ms} m/s
          </div>
          <div className="text-[10px] text-risk-medium mt-0.5">
            ↗ {formatBearing(environment.surface_wind?.direction_deg)}
          </div>
        </div>

        {/* Sea Ice Concentration */}
        <div className="bg-surface-container-low p-2 rounded border border-outline-variant/30 text-center">
          <div className="text-[10px] text-on-surface-variant flex items-center justify-center gap-1 mb-1">
            <ShieldAlert className="w-3 h-3 text-primary" /> SEA ICE
          </div>
          <div className="font-bold text-ice-white text-sm">
            {environment.sea_ice_concentration_pct}%
          </div>
          <div className="text-[10px] text-risk-medium mt-0.5">
            {environment.sea_ice_concentration_pct > 70 ? 'HIGH PACK' : 'MODERATE'}
          </div>
        </div>
      </div>

      {/* Atmospheric & Hydro Metrics */}
      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-outline-variant/20 text-[11px]">
        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <Thermometer className="w-3.5 h-3.5 text-primary" />
          <span>SST: <strong className="text-ice-white">{environment.sea_surface_temp_c}°C</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <Waves className="w-3.5 h-3.5 text-primary" />
          <span>Waves: <strong className="text-ice-white">{environment.wave_height_m} m</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <Eye className="w-3.5 h-3.5 text-primary" />
          <span>Vis: <strong className="text-ice-white">{environment.visibility_km} km</strong></span>
        </div>
      </div>
    </div>
  );
}
