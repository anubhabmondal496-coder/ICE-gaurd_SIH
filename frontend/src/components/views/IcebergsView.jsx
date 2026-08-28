import React, { useState } from 'react';
import { Search, Filter, Layers, ExternalLink, RefreshCw } from 'lucide-react';
import { formatCoordinate, formatKnots, formatBearing, getRiskBadgeClass } from '../../utils/formatters';
import { IcebergAPI } from '../../services/api';

export default function IcebergsView({ icebergs = [], onFocusIceberg }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [selectedIceberg, setSelectedIceberg] = useState(icebergs[0] || null);

  const filteredIcebergs = icebergs.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.notes && b.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRisk = riskFilter === 'ALL' || b.risk_level === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const handleSelect = (berg) => {
    setSelectedIceberg(berg);
  };

  const handleRecalculate = (id) => {
    IcebergAPI.triggerPrediction(id).then((res) => {
      setSelectedIceberg(res.data);
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header Controls */}
      <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary-container" />
          <h2 className="font-bold text-ice-white font-mono text-base tracking-wide">
            ANTARCTIC ICEBERG CATALOG & TELEMETRY
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-outline absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search Iceberg ID, Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-surface-container border border-outline-variant/50 rounded pl-8 pr-3 py-1.5 text-xs font-mono text-ice-white outline-none focus:border-primary-container w-48 sm:w-64"
            />
          </div>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-surface-container border border-outline-variant/50 rounded px-2.5 py-1.5 text-xs font-mono text-ice-white outline-none cursor-pointer"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Table on Left + Inspector on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Table */}
        <div className="xl:col-span-8 bg-surface-container-low border border-outline-variant/40 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface-container border-b border-outline-variant/40 text-on-surface-variant uppercase text-[10px]">
                <tr>
                  <th className="px-3 py-2.5">ID</th>
                  <th className="px-3 py-2.5">Name</th>
                  <th className="px-3 py-2.5">Position</th>
                  <th className="px-3 py-2.5">Dimensions</th>
                  <th className="px-3 py-2.5">Mass (MT)</th>
                  <th className="px-3 py-2.5">Velocity</th>
                  <th className="px-3 py-2.5">Risk</th>
                  <th className="px-3 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredIcebergs.map((b) => {
                  const isCurrent = selectedIceberg?.id === b.id;
                  return (
                    <tr
                      key={b.id}
                      onClick={() => handleSelect(b)}
                      className={`hover:bg-surface-container/60 cursor-pointer transition-colors ${
                        isCurrent ? 'bg-primary-container/10 border-l-2 border-primary-container' : ''
                      }`}
                    >
                      <td className="px-3 py-3 font-bold text-primary">{b.id}</td>
                      <td className="px-3 py-3 text-ice-white font-medium">{b.name}</td>
                      <td className="px-3 py-3 text-on-surface-variant">{formatCoordinate(b.lat, b.lon)}</td>
                      <td className="px-3 py-3 text-on-surface-variant">
                        {b.length_km} x {b.width_km} km
                      </td>
                      <td className="px-3 py-3 text-on-surface-variant">{b.mass_megatons.toLocaleString()}</td>
                      <td className="px-3 py-3 text-primary">
                        {formatKnots(b.drift_speed_knots)} @ {formatBearing(b.drift_heading_deg)}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${getRiskBadgeClass(b.risk_level)}`}>
                          {b.risk_level}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onFocusIceberg) onFocusIceberg(b.id);
                          }}
                          className="px-2 py-1 rounded bg-surface-container-high hover:bg-primary-container hover:text-black transition-all text-[11px] font-bold text-primary"
                        >
                          Focus Map
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Iceberg Deep Inspector */}
        <div className="xl:col-span-4 bg-surface-container-low border border-outline-variant/40 rounded-lg p-4 font-mono text-xs space-y-3">
          {selectedIceberg ? (
            <>
              <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧊</span>
                  <div>
                    <h3 className="font-bold text-ice-white text-sm">{selectedIceberg.name}</h3>
                    <div className="text-[10px] text-on-surface-variant">Sector: Antarctic Maritime</div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] ${getRiskBadgeClass(selectedIceberg.risk_level)}`}>
                  {selectedIceberg.risk_level}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-outline-variant/20">
                  <span className="text-on-surface-variant">Coordinates:</span>
                  <span className="font-bold text-ice-white">{formatCoordinate(selectedIceberg.lat, selectedIceberg.lon)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/20">
                  <span className="text-on-surface-variant">Dimensions / Area:</span>
                  <span className="text-ice-white font-medium">
                    {selectedIceberg.length_km} x {selectedIceberg.width_km} km ({selectedIceberg.area_sq_km} km²)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/20">
                  <span className="text-on-surface-variant">Estimated Thickness:</span>
                  <span className="text-ice-white font-medium">{selectedIceberg.thickness_m} m</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/20">
                  <span className="text-on-surface-variant">Telemetry Source:</span>
                  <span className="text-primary font-medium">{selectedIceberg.source}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant/20">
                  <span className="text-on-surface-variant">Last Observation:</span>
                  <span className="text-on-surface-variant">{selectedIceberg.last_updated}</span>
                </div>
              </div>

              {/* Multi-Horizon Predictions Table */}
              <div className="pt-2 border-t border-outline-variant/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-ice-white text-xs">AI TRAJECTORY HORIZONS</span>
                  <button
                    onClick={() => handleRecalculate(selectedIceberg.id)}
                    className="flex items-center gap-1 text-[10px] text-primary hover:underline"
                  >
                    <RefreshCw className="w-3 h-3" /> Re-predict
                  </button>
                </div>

                <div className="space-y-1.5">
                  {selectedIceberg.predictions?.map((pred) => (
                    <div
                      key={pred.horizon_hours}
                      className="bg-surface-container p-2 rounded border border-outline-variant/30 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-primary text-[11px]">+{pred.horizon_hours} Hours Forecast</div>
                        <div className="text-[10px] text-on-surface-variant">{formatCoordinate(pred.lat, pred.lon)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-ice-white font-bold text-[11px]">+{pred.drift_distance_km} km</div>
                        <div className="text-[9px] text-risk-low">Confidence: {pred.confidence_pct}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tactical Notes */}
              <div className="bg-surface-container p-2.5 rounded border border-outline-variant/40 text-[11px] text-on-surface-variant">
                <strong className="text-ice-white block mb-1">Operational Notes:</strong>
                {selectedIceberg.notes}
              </div>
            </>
          ) : (
            <div className="text-center text-outline py-8">Select an iceberg to inspect details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
