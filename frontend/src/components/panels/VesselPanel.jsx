import React from 'react';
import { Navigation, Compass, Gauge, Clock, ShieldCheck, Fuel, Crosshair } from 'lucide-react';
import { formatCoordinate, formatKnots, formatBearing } from '../../utils/formatters';

export default function VesselPanel({ vessel, onFocusVessel }) {
  if (!vessel) return null;

  return (
    <div className="bg-surface-container/90 border border-outline-variant/40 rounded-lg p-3.5 text-xs font-mono backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-primary-container" />
          <span className="font-bold text-ice-white uppercase tracking-wide">ACTIVE VESSEL STATUS</span>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-primary-container/20 text-primary-container text-[10px] font-bold">
          {vessel.status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center py-0.5 border-b border-outline-variant/20">
          <span className="text-on-surface-variant">Vessel:</span>
          <span className="font-bold text-ice-white text-xs truncate max-w-[170px]" title={vessel.name}>
            {vessel.name}
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5 border-b border-outline-variant/20">
          <span className="text-on-surface-variant">Ice Class:</span>
          <span className="text-primary font-medium">{vessel.ice_class}</span>
        </div>

        <div className="flex justify-between items-center py-0.5 border-b border-outline-variant/20">
          <span className="text-on-surface-variant">Position:</span>
          <span className="font-bold text-ice-white">{formatCoordinate(vessel.current_lat, vessel.current_lon)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 py-1 border-b border-outline-variant/20">
          <div className="bg-surface-container-low p-1.5 rounded border border-outline-variant/30">
            <div className="text-[10px] text-on-surface-variant flex items-center gap-1">
              <Gauge className="w-3 h-3 text-primary" /> Speed
            </div>
            <div className="font-bold text-ice-white text-sm mt-0.5">{formatKnots(vessel.speed_knots)}</div>
          </div>
          <div className="bg-surface-container-low p-1.5 rounded border border-outline-variant/30">
            <div className="text-[10px] text-on-surface-variant flex items-center gap-1">
              <Compass className="w-3 h-3 text-primary" /> Heading
            </div>
            <div className="font-bold text-ice-white text-sm mt-0.5">{formatBearing(vessel.heading_deg)}</div>
          </div>
        </div>

        <div className="flex justify-between items-center py-0.5 border-b border-outline-variant/20">
          <span className="text-on-surface-variant">Destination:</span>
          <span className="text-primary font-medium text-right max-w-[160px] truncate" title={vessel.destination_name}>
            {vessel.destination_name}
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5 border-b border-outline-variant/20">
          <span className="text-on-surface-variant flex items-center gap-1">
            <Clock className="w-3 h-3 text-primary" /> ETA:
          </span>
          <span className="font-bold text-risk-low">{vessel.eta_utc}</span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span className="text-on-surface-variant flex items-center gap-1">
            <Fuel className="w-3 h-3 text-risk-medium" /> Fuel Reserves:
          </span>
          <span className="font-bold text-ice-white">{vessel.fuel_pct}%</span>
        </div>

        {/* Focus Button */}
        {onFocusVessel && (
          <button
            onClick={onFocusVessel}
            className="w-full py-1.5 px-2 rounded bg-surface-container-high hover:bg-primary-container hover:text-black text-primary font-bold transition-all flex items-center justify-center gap-1.5 text-[11px] border border-outline-variant/50 mt-2"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>FOCUS SHIP ON MAP</span>
          </button>
        )}
      </div>
    </div>
  );
}
