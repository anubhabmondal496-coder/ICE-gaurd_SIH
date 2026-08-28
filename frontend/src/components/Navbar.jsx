import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Compass, 
  Layers, 
  TrendingUp, 
  Radio, 
  Database, 
  Map, 
  Play, 
  Pause, 
  SkipForward, 
  Activity, 
  Satellite,
  Navigation,
  Sun,
  Moon,
  AlertTriangle,
  User,
  ShieldCheck
} from 'lucide-react';
import { ScenariosAPI } from '../services/api';

export default function Navbar({
  activeTab,
  setActiveTab,
  simulationState,
  setSimulationState,
  theme = 'dark',
  onToggleTheme,
  onOpenSOS,
  onOpenLogin,
  currentUser
}) {
  const [currentTime, setCurrentTime] = useState('');
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState('maitri-expedition');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utcStr = now.toISOString().substring(11, 19) + ' UTC';
      setCurrentTime(utcStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    ScenariosAPI.list()
      .then((res) => setScenarios(res.data))
      .catch((err) => console.error('Failed to load scenarios', err));
  }, []);

  const handleScenarioChange = (id) => {
    setSelectedScenario(id);
    ScenariosAPI.select(id).catch((err) => console.error(err));
  };

  const handlePlayPause = () => {
    const nextState = !simulationState.is_playing;
    ScenariosAPI.controlSimulation({
      action: nextState ? 'play' : 'pause',
      speed_multiplier: simulationState.speed_multiplier
    }).then((res) => {
      setSimulationState((prev) => ({ ...prev, ...res.data }));
    });
  };

  const handleStep = () => {
    ScenariosAPI.controlSimulation({ action: 'step' }).then((res) => {
      setSimulationState((prev) => ({ ...prev, ...res.data }));
    });
  };

  const handleSpeedChange = (multiplier) => {
    ScenariosAPI.controlSimulation({ action: 'set_speed', speed_multiplier: multiplier }).then((res) => {
      setSimulationState((prev) => ({ ...prev, ...res.data }));
    });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'fleet', label: 'Fleet Overview', icon: Navigation },
    { id: 'icebergs', label: 'Icebergs', icon: Layers },
    { id: 'prediction', label: 'AI Prediction', icon: TrendingUp },
    { id: 'risk-map', label: 'Risk Matrix', icon: ShieldAlert },
    { id: 'route-planner', label: 'Route Planner', icon: Map },
    { id: 'satellite', label: 'SAR Satellite', icon: Satellite },
    { id: 'data-sources', label: 'Data Feeds', icon: Database },
  ];

  return (
    <header className="bg-surface-container-low border-b border-outline-variant/50 px-4 py-2.5 sticky top-0 z-50 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-primary-container/10 border border-primary-container/40 flex items-center justify-center text-primary-container shadow-[0_0_12px_rgba(0,229,255,0.2)]">
            <Radio className="w-5 h-5 animate-pulse text-primary-container" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-wider text-ice-white font-mono">ICEGUARD AI</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-container/20 text-primary-container border border-primary-container/30 font-mono">
                POLAR OPS
              </span>
            </div>
            <p className="text-xs text-on-surface-variant hidden sm:block font-mono">
              Antarctic Iceberg Intelligence & Safe Navigation
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary-container text-black font-bold shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                    : 'text-on-surface-variant hover:text-ice-white hover:bg-surface-container'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls: SOS, Theme, Simulation, Auth */}
        <div className="flex items-center gap-2.5 self-end lg:self-center flex-wrap">
          {/* Emergency SOS Button */}
          <button
            onClick={onOpenSOS}
            className="px-2.5 py-1 rounded bg-risk-high hover:bg-red-600 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,61,0,0.5)] animate-pulse"
            title="Trigger Emergency Distress Beacon"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SOS</span>
          </button>

          {/* Mission Scenario Dropdown */}
          <div className="flex items-center gap-1.5 bg-surface-container px-2 py-1 rounded border border-outline-variant/40">
            <span className="text-[11px] text-on-surface-variant font-mono hidden xl:inline">Mission:</span>
            <select
              value={selectedScenario}
              onChange={(e) => handleScenarioChange(e.target.value)}
              className="bg-transparent text-xs font-mono text-primary-container outline-none cursor-pointer"
            >
              {scenarios.map((sc) => (
                <option key={sc.id} value={sc.id} className="bg-surface-container text-on-surface">
                  {sc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Simulation Time Player */}
          <div className="flex items-center gap-1 bg-surface-container px-2 py-1 rounded border border-outline-variant/40">
            <button
              onClick={handlePlayPause}
              title={simulationState?.is_playing ? 'Pause Simulation' : 'Play Simulation'}
              className={`p-1 rounded transition-colors ${
                simulationState?.is_playing
                  ? 'bg-risk-high text-white'
                  : 'bg-primary-container/20 text-primary-container hover:bg-primary-container/30'
              }`}
            >
              {simulationState?.is_playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleStep}
              title="Step Simulation Forward"
              className="p-1 rounded text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-0.5 ml-1">
              {[1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => handleSpeedChange(spd)}
                  className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                    simulationState?.speed_multiplier === spd
                      ? 'bg-primary-container/30 text-primary-container font-bold'
                      : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Glacial Light / Dark Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded bg-surface-container border border-outline-variant/40 text-on-surface-variant hover:text-white transition-all"
            title={theme === 'dark' ? 'Switch to Glacial Ice Light Mode' : 'Switch to Dark Command Center'}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-risk-medium" /> : <Moon className="w-3.5 h-3.5 text-primary" />}
          </button>

          {/* Officer Login / Status Badge */}
          <button
            onClick={onOpenLogin}
            className={`flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-mono transition-all ${
              currentUser
                ? 'bg-primary-container/20 border-primary-container text-primary-container font-bold'
                : 'bg-surface-container border-outline-variant/40 text-on-surface-variant hover:text-white'
            }`}
          >
            {currentUser ? <ShieldCheck className="w-3.5 h-3.5 text-risk-low" /> : <User className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{currentUser ? currentUser.username.toUpperCase() : 'LOGIN'}</span>
          </button>

          {/* Clock & Online Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/40 hidden sm:flex">
            <div className="flex items-center gap-1.5 text-xs font-mono text-risk-low">
              <span className="w-2 h-2 rounded-full bg-risk-low animate-ping" />
              <span className="hidden xl:inline">ONLINE</span>
            </div>
            <div className="text-xs font-mono text-primary font-medium">{currentTime}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
