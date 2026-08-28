import React from 'react';
import { Navigation, Compass, Gauge, Clock, ShieldCheck, Crosshair, Users, Globe } from 'lucide-react';
import { formatCoordinate, formatKnots, formatBearing } from '../../utils/formatters';

export default function FleetView({ fleet = [], onSelectVessel, activeVesselId }) {
  return (
    <div className="p-4 space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-primary-container/20 border border-primary-container text-primary flex items-center justify-center">
            <Navigation className="w-5 h-5 text-primary-container" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ice-white tracking-wide">
              POLAR EXPEDITION FLEET TELEMETRY & TRACKING
            </h2>
            <p className="text-[10px] text-on-surface-variant">
              Indian Antarctic Expedition & International Scientific Fleet (AIS / Satellite Stream)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded border border-outline-variant/40">
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span>Active Vessels: <strong className="text-ice-white">{fleet.length}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded border border-outline-variant/40">
            <Users className="w-3.5 h-3.5 text-risk-low" />
            <span>Total POB: <strong className="text-ice-white">{fleet.reduce((acc, v) => acc + (v.pob_count || 0), 0)}</strong></span>
          </div>
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {fleet.map((v) => {
          const isActive = v.id === activeVesselId;
          const isIndian = v.country === 'India';

          return (
            <div
              key={v.id}
              onClick={() => onSelectVessel && onSelectVessel(v.id)}
              className={`bg-surface-container-low border rounded-lg p-4 space-y-3 cursor-pointer transition-all hover:border-primary-container ${
                isActive
                  ? 'border-primary-container ring-1 ring-primary-container shadow-[0_0_20px_rgba(0,229,255,0.2)] bg-surface-container'
                  : 'border-outline-variant/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2 border-b border-outline-variant/30 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{v.flag}</span>
                  <div>
                    <h3 className="font-bold text-ice-white text-xs">{v.name}</h3>
                    <div className="text-[10px] text-primary">{v.country} • {v.ice_class}</div>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    v.status === 'UNDERWAY'
                      ? 'bg-risk-low/20 text-risk-low'
                      : v.status === 'SURVEY_OPS'
                      ? 'bg-primary-container/20 text-primary-container'
                      : 'bg-risk-medium/20 text-risk-medium'
                  }`}
                >
                  {v.status}
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] text-on-surface-variant">
                <div className="flex justify-between py-0.5 border-b border-outline-variant/20">
                  <span>Coordinates:</span>
                  <strong className="text-ice-white">{formatCoordinate(v.current_lat, v.current_lon)}</strong>
                </div>

                <div className="grid grid-cols-2 gap-2 py-1 border-b border-outline-variant/20">
                  <div className="bg-surface-container p-1.5 rounded">
                    <span className="text-[9px] text-outline block">SPEED</span>
                    <strong className="text-ice-white text-xs">{formatKnots(v.speed_knots)}</strong>
                  </div>
                  <div className="bg-surface-container p-1.5 rounded">
                    <span className="text-[9px] text-outline block">HEADING</span>
                    <strong className="text-ice-white text-xs">{formatBearing(v.heading_deg)}</strong>
                  </div>
                </div>

                <div className="flex justify-between py-0.5 border-b border-outline-variant/20">
                  <span>Destination:</span>
                  <strong className="text-primary truncate max-w-[170px]" title={v.destination_name}>
                    {v.destination_name}
                  </strong>
                </div>

                <div className="flex justify-between py-0.5 border-b border-outline-variant/20">
                  <span>ETA:</span>
                  <strong className="text-risk-low">{v.eta_utc}</strong>
                </div>

                <div className="flex justify-between py-0.5">
                  <span>Persons on Board (POB):</span>
                  <strong className="text-ice-white">{v.pob_count} personnel</strong>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectVessel && onSelectVessel(v.id);
                }}
                className={`w-full py-1.5 rounded text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-primary-container text-black'
                    : 'bg-surface-container-high hover:bg-surface-bright text-primary border border-outline-variant/50'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>{isActive ? 'ACTIVE COMMAND VESSEL' : 'TAKE NAVIGATION COMMAND'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
