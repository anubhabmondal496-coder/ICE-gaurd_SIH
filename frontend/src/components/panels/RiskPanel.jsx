import React from 'react';
import { ShieldAlert, AlertTriangle, Crosshair, ArrowRight, ShieldCheck } from 'lucide-react';
import { getRiskBadgeClass } from '../../utils/formatters';

export default function RiskPanel({ riskSummary, onGenerateSaferRoute }) {
  if (!riskSummary) return null;

  const isHigh = riskSummary.overall_risk_level === 'HIGH' || riskSummary.overall_risk_level === 'CRITICAL';
  const isMed = riskSummary.overall_risk_level === 'MEDIUM';

  return (
    <div className="bg-surface-container/90 border border-outline-variant/40 rounded-lg p-3.5 text-xs font-mono backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-risk-high" />
          <span className="font-bold text-ice-white uppercase tracking-wide">NAVIGATION RISK MATRIX</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] ${getRiskBadgeClass(riskSummary.overall_risk_level)}`}>
          {riskSummary.overall_risk_level}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center py-0.5 border-b border-outline-variant/20">
          <span className="text-on-surface-variant">Composite Collision Risk:</span>
          <span className={`font-bold text-base ${isHigh ? 'text-risk-high' : isMed ? 'text-risk-medium' : 'text-risk-low'}`}>
            {riskSummary.composite_risk_score}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 py-1 border-b border-outline-variant/20">
          <div className="bg-surface-container-low p-2 rounded border border-outline-variant/30">
            <div className="text-[10px] text-on-surface-variant flex items-center gap-1">
              <Crosshair className="w-3 h-3 text-primary" /> Closest Approach (CPA)
            </div>
            <div className="font-bold text-ice-white text-sm mt-0.5">{riskSummary.closest_approach_km} km</div>
          </div>
          <div className="bg-surface-container-low p-2 rounded border border-outline-variant/30">
            <div className="text-[10px] text-on-surface-variant">Time to CPA (TCPA)</div>
            <div className="font-bold text-ice-white text-sm mt-0.5">{riskSummary.time_to_closest_approach}</div>
          </div>
        </div>

        {riskSummary.target_iceberg_id && (
          <div className="flex justify-between items-center py-0.5 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">Primary Hazard Iceberg:</span>
            <span className="font-bold text-risk-high">{riskSummary.target_iceberg_name || riskSummary.target_iceberg_id}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onGenerateSaferRoute}
          className="w-full mt-2 py-2 px-3 rounded bg-primary-container text-black font-bold font-mono text-xs flex items-center justify-center gap-2 hover:bg-white transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
        >
          <span>GENERATE SAFER ROUTE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
