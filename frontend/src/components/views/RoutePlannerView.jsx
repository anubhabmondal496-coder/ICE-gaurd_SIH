import React, { useState } from 'react';
import { Map, CheckCircle2, Navigation, AlertTriangle, ShieldCheck, ArrowRight, CornerDownRight } from 'lucide-react';
import { RoutesAPI } from '../../services/api';
import { formatCoordinate, getRiskBadgeClass } from '../../utils/formatters';

export default function RoutePlannerView({ routesData, onRouteApplied }) {
  const [originName, setOriginName] = useState('INS Explorer (Current Position)');
  const [originLat, setOriginLat] = useState(-62.50);
  const [originLon, setOriginLon] = useState(15.00);

  const [destPreset, setDestPreset] = useState('maitri');
  const [destName, setDestName] = useState('Maitri Coastal Fast-Ice Waypoint');
  const [destLat, setDestLat] = useState(-69.82);
  const [destLon, setDestLon] = useState(11.21);

  const [routes, setRoutes] = useState(routesData?.routes || []);
  const [selectedRouteId, setSelectedRouteId] = useState(routesData?.best_route_id || 'route-rec-a');
  const [loading, setLoading] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState(false);

  const handleDestPresetChange = (preset) => {
    setDestPreset(preset);
    if (preset === 'maitri') {
      setDestName('Maitri Coastal Fast-Ice Waypoint');
      setDestLat(-69.82);
      setDestLon(11.21);
    } else if (preset === 'bharati') {
      setDestName('Bharati Coastal Anchorage (Larsemann Hills)');
      setDestLat(-69.41);
      setDestLon(76.19);
    } else if (preset === 'rothera') {
      setDestName('Rothera Antarctic Coastal Terminal');
      setDestLat(-67.57);
      setDestLon(-68.13);
    }
  };

  const handleCalculateRoutes = () => {
    setLoading(true);
    RoutesAPI.planCustom({
      origin_name: originName,
      origin_lat: Number(originLat),
      origin_lon: Number(originLon),
      dest_name: destName,
      dest_lat: Number(destLat),
      dest_lon: Number(destLon),
      vessel_id: 'INS-EXPLORER',
    })
      .then((res) => {
        setRoutes(res.data.routes);
        setSelectedRouteId(res.data.best_route_id);
      })
      .finally(() => setLoading(false));
  };

  const handleApplyRoute = (routeId) => {
    setSelectedRouteId(routeId);
    setAppliedNotice(true);
    if (onRouteApplied) onRouteApplied(routeId);
    setTimeout(() => setAppliedNotice(false), 3000);
  };

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-primary-container" />
          <h2 className="font-bold text-ice-white font-mono text-base tracking-wide">
            POLAR MARITIME SAFE ROUTE OPTIMIZATION PLANNER
          </h2>
        </div>
        {appliedNotice && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-risk-low/20 text-risk-low font-mono text-xs border border-risk-low/40 animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ROUTE TRANSMITTED TO SHIP NAVIGATION BRIDGE</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left Column: Route Configuration & Planning Inputs */}
        <div className="xl:col-span-4 bg-surface-container-low border border-outline-variant/40 rounded-lg p-4 font-mono text-xs space-y-4">
          <div className="font-bold text-ice-white text-sm border-b border-outline-variant/40 pb-2">
            NAVIGATION WAYPOINT SETTINGS
          </div>

          <div className="space-y-3">
            {/* Origin */}
            <div className="space-y-1.5 bg-surface-container p-2.5 rounded border border-outline-variant/30">
              <label className="text-primary font-bold block">ORIGIN (STARTING WAYPOINT)</label>
              <input
                type="text"
                value={originName}
                onChange={(e) => setOriginName(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded px-2.5 py-1 text-xs text-ice-white outline-none focus:border-primary-container mb-1"
              />
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-on-surface-variant">Lat:</span>
                  <input
                    type="number"
                    step="0.01"
                    value={originLat}
                    onChange={(e) => setOriginLat(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded px-2 py-0.5 text-ice-white"
                  />
                </div>
                <div>
                  <span className="text-on-surface-variant">Lon:</span>
                  <input
                    type="number"
                    step="0.01"
                    value={originLon}
                    onChange={(e) => setOriginLon(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded px-2 py-0.5 text-ice-white"
                  />
                </div>
              </div>
            </div>

            {/* Destination Preset */}
            <div className="space-y-1.5 bg-surface-container p-2.5 rounded border border-outline-variant/30">
              <div className="flex justify-between items-center">
                <label className="text-risk-low font-bold block">DESTINATION WAYPOINT</label>
                <select
                  value={destPreset}
                  onChange={(e) => handleDestPresetChange(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/50 rounded px-2 py-0.5 text-[10px] text-primary outline-none cursor-pointer"
                >
                  <option value="maitri">Maitri Station (-69.82° S)</option>
                  <option value="bharati">Bharati Station (-69.41° S)</option>
                  <option value="rothera">Rothera Station (-67.57° S)</option>
                </select>
              </div>

              <input
                type="text"
                value={destName}
                onChange={(e) => setDestName(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded px-2.5 py-1 text-xs text-ice-white outline-none focus:border-primary-container mb-1"
              />

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-on-surface-variant">Lat:</span>
                  <input
                    type="number"
                    step="0.01"
                    value={destLat}
                    onChange={(e) => setDestLat(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded px-2 py-0.5 text-ice-white"
                  />
                </div>
                <div>
                  <span className="text-on-surface-variant">Lon:</span>
                  <input
                    type="number"
                    step="0.01"
                    value={destLon}
                    onChange={(e) => setDestLon(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded px-2 py-0.5 text-ice-white"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleCalculateRoutes}
              disabled={loading}
              className="w-full py-2.5 rounded bg-primary-container text-black font-bold font-mono text-xs flex items-center justify-center gap-2 hover:bg-white transition-all shadow-[0_0_12px_rgba(0,229,255,0.3)] mt-2"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{loading ? 'CALCULATING POLAR ISOCHRONES...' : 'ANALYZE MULTI-OBJECTIVE ROUTES'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Route Comparison Cards & Waypoint Breakdown */}
        <div className="xl:col-span-8 space-y-4">
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
            {routes.map((r) => {
              const isSelected = r.id === selectedRouteId;
              const isRec = r.is_recommended;

              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRouteId(r.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-surface-container border-primary-container ring-1 ring-primary-container shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                      : 'bg-surface-container-low border-outline-variant/30 hover:border-outline-variant'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] ${getRiskBadgeClass(r.risk_level)}`}>
                        {r.risk_level} RISK
                      </span>
                      {isRec && (
                        <span className="text-risk-low text-[10px] font-bold">★ RECOMMENDED</span>
                      )}
                    </div>
                    <h3 className="font-bold text-ice-white text-xs mb-2">{r.name}</h3>

                    <div className="space-y-1 text-[11px] text-on-surface-variant mb-2">
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <strong className="text-ice-white">{r.total_distance_km} km</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <strong className="text-ice-white">{r.estimated_duration_hours} hours</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Risk Score:</span>
                        <strong className={isRec ? 'text-risk-low' : 'text-risk-high'}>{r.composite_risk_score}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Fuel Cons:</span>
                        <strong className="text-ice-white">{r.fuel_consumption_tons} tons</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyRoute(r.id);
                    }}
                    className={`w-full py-1.5 rounded text-[11px] font-bold transition-all mt-2 ${
                      isRec
                        ? 'bg-risk-low text-black hover:bg-white'
                        : 'bg-surface-container-high text-ice-white hover:bg-surface-bright border border-outline-variant/50'
                    }`}
                  >
                    {isRec ? 'APPLY RECOMMENDED ROUTE' : 'SELECT THIS ROUTE'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Active Route Waypoints Table */}
          {activeRoute && (
            <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-4 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                <div className="font-bold text-ice-white text-sm flex items-center gap-2">
                  <CornerDownRight className="w-4 h-4 text-primary" />
                  <span>WAYPOINT SEQUENCE: {activeRoute.name}</span>
                </div>
                <span className="text-[11px] text-primary">
                  Total Waypoints: {activeRoute.waypoints?.length || 0}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container text-on-surface-variant text-[10px]">
                    <tr>
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">WAYPOINT NAME</th>
                      <th className="px-3 py-2">COORDINATES</th>
                      <th className="px-3 py-2">CUMULATIVE DISTANCE</th>
                      <th className="px-3 py-2">SEGMENT RISK</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {activeRoute.waypoints?.map((wp, idx) => (
                      <tr key={idx} className="hover:bg-surface-container/50">
                        <td className="px-3 py-2 text-primary font-bold">{idx + 1}</td>
                        <td className="px-3 py-2 text-ice-white font-medium">{wp.name}</td>
                        <td className="px-3 py-2 text-on-surface-variant">{formatCoordinate(wp.lat, wp.lon)}</td>
                        <td className="px-3 py-2 text-ice-white">{wp.segment_distance_km} km</td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              wp.segment_risk > 50
                                ? 'bg-risk-high/20 text-risk-high'
                                : wp.segment_risk > 25
                                ? 'bg-risk-medium/20 text-risk-medium'
                                : 'bg-risk-low/20 text-risk-low'
                            }`}
                          >
                            {wp.segment_risk}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
