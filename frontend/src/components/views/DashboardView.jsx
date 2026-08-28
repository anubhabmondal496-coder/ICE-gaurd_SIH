import React, { useState } from 'react';
import PolarMap from '../map/PolarMap';
import VesselPanel from '../panels/VesselPanel';
import IcebergPanel from '../panels/IcebergPanel';
import EnvironmentPanel from '../panels/EnvironmentPanel';
import RiskPanel from '../panels/RiskPanel';
import RouteAnalysisPanel from '../panels/RouteAnalysisPanel';

export default function DashboardView({
  vessel,
  fleet = [],
  icebergs,
  seaIceZones,
  routesData,
  riskSummary,
  environment,
  selectedIcebergId,
  onSelectIceberg,
  onSelectRoute,
  onSelectVessel,
  onNavigateToTab,
  activeSOS = null,
}) {
  const [focusVesselTrigger, setFocusVesselTrigger] = useState(0);
  const selectedIceberg = icebergs.find((b) => b.id === selectedIcebergId) || icebergs[0];

  const handleFocusVessel = () => {
    setFocusVesselTrigger((prev) => prev + 1);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top Main Section: Left Telemetry Panels + Center Polar Map + Right Decision Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left Column: Vessel & Environment */}
        <div className="xl:col-span-3 space-y-4">
          <VesselPanel vessel={vessel} onFocusVessel={handleFocusVessel} />
          <EnvironmentPanel environment={environment} />
        </div>

        {/* Center Column: Polar Interactive Map */}
        <div className="xl:col-span-6 h-[560px] xl:h-auto min-h-[500px]">
          <PolarMap
            vessel={vessel}
            fleet={fleet}
            icebergs={icebergs}
            seaIceZones={seaIceZones}
            routes={routesData?.routes}
            selectedIcebergId={selectedIcebergId}
            onSelectIceberg={onSelectIceberg}
            onSelectVessel={onSelectVessel}
            focusVesselTrigger={focusVesselTrigger}
            activeSOS={activeSOS}
          />
        </div>

        {/* Right Column: Selected Iceberg, Risk Matrix & Route Analysis */}
        <div className="xl:col-span-3 space-y-4">
          <IcebergPanel iceberg={selectedIceberg} onPredictionUpdated={onSelectIceberg} />
          <RiskPanel
            riskSummary={riskSummary}
            onGenerateSaferRoute={() => onNavigateToTab('route-planner')}
          />
          <RouteAnalysisPanel
            routesData={routesData}
            onSelectRoute={onSelectRoute}
            selectedRouteId={vessel?.active_route_id}
          />
        </div>
      </div>
    </div>
  );
}
