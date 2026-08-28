import React from 'react';
import { Map, CheckCircle2, ShieldCheck, Fuel, Clock } from 'lucide-react';
import { getRiskBadgeClass } from '../../utils/formatters';

export default function RouteAnalysisPanel({ routesData, onSelectRoute, selectedRouteId }) {
  if (!routesData || !routesData.routes || routesData.routes.length === 0) return null;

  const routes = routesData.routes;
  const recommendedRoute = routes.find((r) => r.is_recommended);

  return (
    <div className="bg-surface-container/90 border border-outline-variant/40 rounded-lg p-3.5 text-xs font-mono backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-primary-container" />
          <span className="font-bold text-ice-white uppercase tracking-wide">ROUTE SAFETY ANALYSIS</span>
        </div>
        {recommendedRoute && (
          <span className="px-2 py-0.5 rounded bg-risk-low/20 text-risk-low font-bold text-[10px]">
            ★ RISK REDUCTION: {recommendedRoute.risk_reduction_pct}%
          </span>
        )}
      </div>

      <div className="space-y-2">
        {routes.map((route) => {
          const isSelected = route.id === selectedRouteId || (route.is_recommended && !selectedRouteId);
          const isRec = route.is_recommended;

          return (
            <div
              key={route.id}
              onClick={() => onSelectRoute && onSelectRoute(route.id)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-surface-container-high border-primary-container shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                  : 'bg-surface-container-low border-outline-variant/30 hover:border-outline-variant'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 font-bold text-ice-white">
                  {isRec && <span className="text-risk-low text-xs">★</span>}
                  <span>{route.name}</span>
                </div>
                <span className={`px-1.5 py-0.2 rounded text-[9px] ${getRiskBadgeClass(route.risk_level)}`}>
                  {route.risk_level}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-[10px] text-on-surface-variant my-1.5">
                <div>
                  Dist: <strong className="text-ice-white">{route.total_distance_km} km</strong>
                </div>
                <div>
                  Time: <strong className="text-ice-white">{route.estimated_duration_hours}h</strong>
                </div>
                <div>
                  Fuel: <strong className="text-ice-white">{route.fuel_consumption_tons} t</strong>
                </div>
              </div>

              <div className="text-[10px] text-on-surface-variant line-clamp-2">
                {route.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
