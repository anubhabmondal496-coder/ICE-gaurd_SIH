import React, { useState, useEffect } from 'react';
import { Satellite, Radio, Crosshair, Eye, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SatelliteAPI } from '../../services/api';
import { formatCoordinate } from '../../utils/formatters';

export default function SatelliteView() {
  const [sarPasses, setSarPasses] = useState([]);
  const [selectedPass, setSelectedPass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SatelliteAPI.getSARPasses()
      .then((res) => {
        setSarPasses(res.data);
        if (res.data.length > 0) setSelectedPass(res.data[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Satellite className="w-5 h-5 text-primary-container" />
          <h2 className="font-bold text-ice-white text-base tracking-wide">
            SENTINEL-1 SYNTHETIC APERTURE RADAR (SAR) INTELLIGENCE
          </h2>
        </div>
        <div className="text-[11px] text-on-surface-variant flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-risk-low animate-ping" />
          <span>ESA Copernicus Sentinel-1 Constellation Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left Column: Orbital SAR Passes */}
        <div className="xl:col-span-4 bg-surface-container-low border border-outline-variant/40 rounded-lg p-4 space-y-3">
          <div className="font-bold text-ice-white text-sm border-b border-outline-variant/40 pb-2 flex items-center justify-between">
            <span>ORBITAL ACQUISITIONS</span>
            <span className="text-[10px] text-primary">{sarPasses.length} PASSES</span>
          </div>

          <div className="space-y-2.5">
            {sarPasses.map((sp) => {
              const isSelected = selectedPass?.pass_id === sp.pass_id;
              return (
                <div
                  key={sp.pass_id}
                  onClick={() => setSelectedPass(sp)}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-surface-container border-primary-container ring-1 ring-primary-container shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                      : 'bg-surface-container-low border-outline-variant/30 hover:border-outline-variant'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-ice-white">{sp.satellite}</span>
                    <span className="px-1.5 py-0.2 rounded bg-primary-container/20 text-primary-container text-[10px] font-bold">
                      {sp.swath_mode}
                    </span>
                  </div>
                  <div className="text-[10px] text-on-surface-variant truncate">ID: {sp.pass_id}</div>
                  <div className="text-[10px] text-on-surface-variant mt-1">
                    Time: <strong className="text-ice-white">{sp.acquisition_time_utc}</strong>
                  </div>
                  <div className="text-[10px] text-primary mt-0.5">
                    Resolution: {sp.resolution_m}m | Pol: {sp.polarization}
                  </div>
                  <div className="mt-2 text-[10px] text-risk-low flex items-center gap-1 font-bold">
                    <Crosshair className="w-3 h-3" />
                    <span>{sp.detected_targets_count} Targets Segmented</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: SAR Target Segmentation Breakdown */}
        <div className="xl:col-span-8 space-y-4">
          {selectedPass && (
            <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                <div>
                  <h3 className="font-bold text-ice-white text-sm">
                    SAR TARGET DETECTION INVENTORY ({selectedPass.pass_id})
                  </h3>
                  <div className="text-[10px] text-on-surface-variant">
                    Polarimetric Radar Cross-Section (RCS) Backscatter Analysis
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-risk-low/20 text-risk-low font-bold text-[10px]">
                  RADAR CALIBRATION: HIGH Q
                </span>
              </div>

              {/* Targets Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container text-on-surface-variant text-[10px]">
                    <tr>
                      <th className="px-3 py-2">TARGET ID</th>
                      <th className="px-3 py-2">COORDINATES</th>
                      <th className="px-3 py-2">DIMENSIONS</th>
                      <th className="px-3 py-2">AREA</th>
                      <th className="px-3 py-2">RCS (dB)</th>
                      <th className="px-3 py-2">CLASSIFICATION</th>
                      <th className="px-3 py-2">MATCHED USNIC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {selectedPass.targets.map((tgt) => (
                      <tr key={tgt.target_id} className="hover:bg-surface-container/50">
                        <td className="px-3 py-2.5 font-bold text-primary">{tgt.target_id}</td>
                        <td className="px-3 py-2.5 text-on-surface-variant">{formatCoordinate(tgt.lat, tgt.lon)}</td>
                        <td className="px-3 py-2.5 text-ice-white font-medium">
                          {(tgt.length_m / 1000).toFixed(1)} x {(tgt.width_m / 1000).toFixed(1)} km
                        </td>
                        <td className="px-3 py-2.5 text-ice-white">{tgt.area_sq_km} km²</td>
                        <td className="px-3 py-2.5 text-primary font-bold">{tgt.radar_cross_section_db} dB</td>
                        <td className="px-3 py-2.5">
                          <span className="px-1.5 py-0.5 rounded bg-surface-container-high border border-outline-variant/50 text-ice-white text-[10px]">
                            {tgt.classification}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-bold text-risk-low">
                          {tgt.matched_iceberg_id ? `✓ ${tgt.matched_iceberg_id}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Radar Physics Explainer */}
              <div className="bg-surface-container p-3 rounded border border-outline-variant/30 text-[11px] text-on-surface-variant space-y-1">
                <strong className="text-ice-white block">SAR Processing Pipeline:</strong>
                <p>
                  Sentinel-1 C-band Synthetic Aperture Radar penetrates polar cloud cover and 24-hour polar winter darkness. Dual-polarization ($HH + HV$) cross-ratio thresholding detects freeboard ice-water dielectric contrast to extract sub-kilometer growlers and mega-tabular icebergs with &gt;98% classification certainty.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
