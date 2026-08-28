import React from 'react';
import { AlertTriangle, ShieldCheck, ArrowRight, Eye } from 'lucide-react';

export default function AlertBanner({ riskSummary, onViewSaferRoute, onAnalyzeTrajectory }) {
  if (!riskSummary || riskSummary.overall_risk_level === 'LOW') {
    return (
      <div className="bg-risk-low/10 border-y border-risk-low/30 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-risk-low">
          <ShieldCheck className="w-4 h-4 text-risk-low" />
          <span>NAVIGATION STATUS: SAFE. No immediate iceberg collision trajectories detected on active heading.</span>
        </div>
        <div className="text-[11px] font-mono text-on-surface-variant hidden md:block">
          CPA: {riskSummary?.closest_approach_km} km | TCPA: {riskSummary?.time_to_closest_approach}
        </div>
      </div>
    );
  }

  const isCritical = riskSummary.overall_risk_level === 'HIGH' || riskSummary.overall_risk_level === 'CRITICAL';

  return (
    <div
      className={`border-y px-4 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 transition-colors ${
        isCritical
          ? 'bg-risk-high/15 border-risk-high/50 text-risk-high shadow-[0_0_20px_rgba(255,61,0,0.15)]'
          : 'bg-risk-medium/15 border-risk-medium/50 text-risk-medium'
      }`}
    >
      <div className="flex items-start md:items-center gap-2.5">
        <div className={`p-1 rounded ${isCritical ? 'bg-risk-high text-white animate-bounce' : 'bg-risk-medium text-black'}`}>
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2 font-mono font-bold text-xs">
            <span>{isCritical ? '⚠ CRITICAL HAZARD ALERT' : '⚠ NAVIGATION CAUTION'}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 border border-current font-mono">
              COLLISION RISK: {riskSummary.composite_risk_score}%
            </span>
          </div>
          <p className="text-xs text-on-surface mt-0.5 font-sans">
            {riskSummary.active_alerts?.[0] ||
              `Iceberg ${riskSummary.target_iceberg_id || 'threat'} predicted to approach planned vessel route within ${riskSummary.closest_approach_km} km (TCPA: ${riskSummary.time_to_closest_approach}).`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-center">
        <button
          onClick={onViewSaferRoute}
          className="flex items-center gap-1 px-3 py-1.5 rounded bg-primary-container text-black text-xs font-mono font-bold hover:bg-white transition-all shadow-[0_0_10px_rgba(0,229,255,0.3)]"
        >
          <span>VIEW SAFER ROUTE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onAnalyzeTrajectory}
          className="flex items-center gap-1 px-3 py-1.5 rounded bg-surface-container-high border border-outline-variant/60 text-ice-white text-xs font-mono hover:bg-surface-bright transition-all"
        >
          <Eye className="w-3.5 h-3.5 text-primary" />
          <span>ANALYZE TRAJECTORY</span>
        </button>
      </div>
    </div>
  );
}
