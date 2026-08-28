import React from 'react';
import { ShieldAlert, AlertTriangle, Crosshair, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { getRiskBadgeClass, getRiskColorClass } from '../../utils/formatters';

export default function RiskMapView({ riskSummary, vessel, onNavigateToRoutePlanner }) {
  if (!riskSummary) return null;

  return (
    <div className="p-4 space-y-4">
      {/* Header Banner */}
      <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-risk-high" />
          <h2 className="font-bold text-ice-white font-mono text-base tracking-wide">
            DYNAMIC COLLISION RISK ASSESSMENT MATRIX
          </h2>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-on-surface-variant">Active Threat Level:</span>
          <span className={`px-2.5 py-0.5 rounded ${getRiskBadgeClass(riskSummary.overall_risk_level)}`}>
            {riskSummary.overall_risk_level}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-3.5">
          <div className="text-[11px] text-on-surface-variant flex items-center justify-between">
            <span>COMPOSITE RISK INDEX</span>
            <ShieldAlert className="w-4 h-4 text-risk-high" />
          </div>
          <div className="text-2xl font-bold text-ice-white mt-1">{riskSummary.composite_risk_score}%</div>
          <div className="text-[10px] text-risk-high mt-1">Multi-variable safety threshold</div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-3.5">
          <div className="text-[11px] text-on-surface-variant flex items-center justify-between">
            <span>CLOSEST APPROACH (CPA)</span>
            <Crosshair className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-ice-white mt-1">{riskSummary.closest_approach_km} km</div>
          <div className="text-[10px] text-primary mt-1">Minimum projected miss distance</div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-3.5">
          <div className="text-[11px] text-on-surface-variant flex items-center justify-between">
            <span>TIME TO CPA (TCPA)</span>
            <ShieldCheck className="w-4 h-4 text-risk-medium" />
          </div>
          <div className="text-2xl font-bold text-ice-white mt-1">{riskSummary.time_to_closest_approach}</div>
          <div className="text-[10px] text-risk-medium mt-1">Time remaining to closest point</div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-3.5">
          <div className="text-[11px] text-on-surface-variant flex items-center justify-between">
            <span>PRIMARY THREAT</span>
            <span className="text-sm">🧊</span>
          </div>
          <div className="text-xl font-bold text-risk-high mt-1 truncate">
            {riskSummary.target_iceberg_name || riskSummary.target_iceberg_id || 'None'}
          </div>
          <div className="text-[10px] text-on-surface-variant mt-1">Direct intercept trajectory</div>
        </div>
      </div>

      {/* Threat List Table & Action Banner */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Table of all icebergs evaluated */}
        <div className="xl:col-span-8 bg-surface-container-low border border-outline-variant/40 rounded-lg overflow-hidden font-mono text-xs">
          <div className="p-3 bg-surface-container border-b border-outline-variant/40 font-bold text-ice-white flex items-center justify-between">
            <span>ICEBERG THREAT INVENTORY (CPA & TCPA PROJECTIONS)</span>
            <span className="text-[10px] text-on-surface-variant">Real-time kinematic vector evaluation</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant/30 text-on-surface-variant text-[10px]">
                <tr>
                  <th className="px-3 py-2.5">ICEBERG ID</th>
                  <th className="px-3 py-2.5">NAME</th>
                  <th className="px-3 py-2.5">CPA (KM)</th>
                  <th className="px-3 py-2.5">TCPA</th>
                  <th className="px-3 py-2.5">PROBABILITY</th>
                  <th className="px-3 py-2.5">RISK</th>
                  <th className="px-3 py-2.5">ADVISORY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {riskSummary.detailed_threats?.map((th) => (
                  <tr key={th.iceberg_id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="px-3 py-2.5 font-bold text-primary">{th.iceberg_id}</td>
                    <td className="px-3 py-2.5 text-ice-white">{th.iceberg_name}</td>
                    <td className="px-3 py-2.5 font-bold text-ice-white">{th.cpa_km} km</td>
                    <td className="px-3 py-2.5 text-on-surface-variant">{th.tcpa_hours}h</td>
                    <td className="px-3 py-2.5 text-risk-high font-bold">{th.collision_probability_pct}%</td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${getRiskBadgeClass(th.risk_level)}`}>
                        {th.risk_level}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[11px] text-on-surface-variant">{th.recommended_action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Mitigation Callout */}
        <div className="xl:col-span-4 bg-surface-container-low border border-outline-variant/40 rounded-lg p-4 font-mono text-xs space-y-4">
          <div className="font-bold text-ice-white text-sm border-b border-outline-variant/40 pb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-risk-low" />
            <span>AI RISK MITIGATION PROTOCOL</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded bg-surface-container border border-outline-variant/30 space-y-1.5">
              <div className="font-bold text-primary text-xs">Recommended Action:</div>
              <p className="text-on-surface-variant text-[11px]">
                Shift planned vessel trajectory eastward via Waypoint Alpha to clear iceberg A76C uncertainty cone by &gt;45 km.
              </p>
            </div>

            <div className="p-3 rounded bg-surface-container border border-outline-variant/30 space-y-1.5">
              <div className="font-bold text-risk-low text-xs">Expected Outcome:</div>
              <ul className="text-[11px] text-on-surface-variant space-y-1 list-disc pl-4">
                <li>Risk reduction: <strong className="text-risk-low">68.0%</strong></li>
                <li>Collision probability: <strong className="text-risk-low">&lt; 0.5%</strong></li>
                <li>Distance penalty: <strong className="text-ice-white">+25 km (3.0%)</strong></li>
              </ul>
            </div>

            <button
              onClick={onNavigateToRoutePlanner}
              className="w-full py-2.5 rounded bg-primary-container text-black font-bold font-mono text-xs flex items-center justify-center gap-2 hover:bg-white transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
            >
              <span>OPEN SAFE ROUTE OPTIMIZER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
