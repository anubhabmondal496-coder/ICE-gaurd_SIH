import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AlertBanner from './components/AlertBanner';
import DashboardView from './components/views/DashboardView';
import FleetView from './components/views/FleetView';
import IcebergsView from './components/views/IcebergsView';
import PredictionView from './components/views/PredictionView';
import RiskMapView from './components/views/RiskMapView';
import RoutePlannerView from './components/views/RoutePlannerView';
import SatelliteView from './components/views/SatelliteView';
import DataSourcesView from './components/views/DataSourcesView';
import SOSModal from './components/SOSModal';
import LoginModal from './components/LoginModal';
import { ScenariosAPI, FleetAPI } from './services/api';
import { telemetryWS } from './services/websocket';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedIcebergId, setSelectedIcebergId] = useState('A76C');
  const [selectedRouteId, setSelectedRouteId] = useState('route-rec-a');
  const [theme, setTheme] = useState('dark');
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: 'commander',
    full_name: 'Dr. Rajeshwar Sharma (Mission Director)',
    role: 'MISSION_COMMANDER',
    agency: 'NCPOR / Ministry of Earth Sciences',
    clearance_level: 'LEVEL-4 TOP PRIORITY',
  });
  const [activeSOS, setActiveSOS] = useState(null);

  const [state, setState] = useState({
    vessel: null,
    fleet: [],
    icebergs: [],
    environment: null,
    sea_ice_zones: [],
    risk_summary: null,
    routes: null,
    simulation: {
      active_scenario_id: 'maitri-expedition',
      is_playing: false,
      speed_multiplier: 1.0,
      step: 0,
    },
  });

  // Apply Theme class
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch initial snapshot and connect WebSocket
  useEffect(() => {
    ScenariosAPI.getSnapshot()
      .then((res) => {
        setState((prev) => ({ ...prev, ...res.data }));
      })
      .catch((err) => console.error('Snapshot fetch error:', err));

    FleetAPI.getFleet()
      .then((res) => {
        setState((prev) => ({ ...prev, fleet: res.data.vessels }));
      })
      .catch((err) => console.error('Fleet fetch error:', err));

    telemetryWS.connect();
    const unsubscribe = telemetryWS.subscribe((liveState) => {
      setState((prev) => ({
        ...prev,
        ...liveState,
      }));
    });

    return () => {
      unsubscribe();
      telemetryWS.disconnect();
    };
  }, []);

  const handleSelectIceberg = (id) => {
    setSelectedIcebergId(id);
  };

  const handleSelectRoute = (routeId) => {
    setSelectedRouteId(routeId);
    if (state.vessel) {
      setState((prev) => ({
        ...prev,
        vessel: {
          ...prev.vessel,
          active_route_id: routeId,
        },
      }));
    }
  };

  const handleSelectVessel = (vesselId) => {
    FleetAPI.selectVessel(vesselId).then(() => {
      ScenariosAPI.getSnapshot().then((res) => {
        setState((prev) => ({ ...prev, ...res.data }));
      });
    });
  };

  const handleFocusIcebergFromCatalog = (id) => {
    setSelectedIcebergId(id);
    setActiveTab('dashboard');
  };

  const selectedIceberg =
    state.icebergs.find((b) => b.id === selectedIcebergId) || state.icebergs[0];

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans selection:bg-primary-container selection:text-black">
      {/* Top Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        simulationState={state.simulation}
        setSimulationState={(sim) =>
          setState((prev) => ({
            ...prev,
            simulation: typeof sim === 'function' ? sim(prev.simulation) : sim,
          }))
        }
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        currentUser={currentUser}
      />

      {/* Collision Risk & Hazard Alert Banner */}
      <AlertBanner
        riskSummary={state.risk_summary}
        onViewSaferRoute={() => setActiveTab('route-planner')}
        onAnalyzeTrajectory={() => setActiveTab('prediction')}
      />

      {/* Main Operational Views */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <DashboardView
            vessel={state.vessel}
            fleet={state.fleet}
            icebergs={state.icebergs}
            seaIceZones={state.sea_ice_zones}
            routesData={state.routes}
            riskSummary={state.risk_summary}
            environment={state.environment}
            selectedIcebergId={selectedIcebergId}
            onSelectIceberg={handleSelectIceberg}
            onSelectRoute={handleSelectRoute}
            onSelectVessel={handleSelectVessel}
            onNavigateToTab={setActiveTab}
            activeSOS={activeSOS}
          />
        )}

        {activeTab === 'fleet' && (
          <FleetView
            fleet={state.fleet}
            onSelectVessel={(id) => {
              handleSelectVessel(id);
              setActiveTab('dashboard');
            }}
            activeVesselId={state.vessel?.id}
          />
        )}

        {activeTab === 'icebergs' && (
          <IcebergsView
            icebergs={state.icebergs}
            selectedIcebergId={selectedIcebergId}
            onSelectIceberg={handleSelectIceberg}
            onFocusOnMap={handleFocusIcebergFromCatalog}
          />
        )}

        {activeTab === 'prediction' && (
          <PredictionView
            icebergs={state.icebergs}
            selectedIceberg={selectedIceberg}
            onSelectIceberg={handleSelectIceberg}
            onPredictionUpdated={handleSelectIceberg}
          />
        )}

        {activeTab === 'risk-map' && (
          <RiskMapView
            riskSummary={state.risk_summary}
            icebergs={state.icebergs}
            vessel={state.vessel}
            onSelectIceberg={handleSelectIceberg}
            onNavigateToRoutePlanner={() => setActiveTab('route-planner')}
          />
        )}

        {activeTab === 'route-planner' && (
          <RoutePlannerView
            vessel={state.vessel}
            routesData={state.routes}
            onSelectRoute={handleSelectRoute}
            selectedRouteId={selectedRouteId}
          />
        )}

        {activeTab === 'satellite' && <SatelliteView />}

        {activeTab === 'data-sources' && <DataSourcesView />}
      </main>

      {/* Emergency SOS Modal */}
      <SOSModal
        vessel={state.vessel}
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        onSOSBroadcasted={(sosData) => {
          setActiveSOS(sosData);
        }}
      />

      {/* Commander Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
        currentUser={currentUser}
      />
    </div>
  );
}
