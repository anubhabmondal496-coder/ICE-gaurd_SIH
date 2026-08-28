import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, RefreshCw, ExternalLink, Activity, Radio, Key, Zap } from 'lucide-react';
import { SatelliteAPI } from '../../services/api';

export default function DataSourcesView() {
  const [dataSources, setDataSources] = useState([]);
  const [liveStatus, setLiveStatus] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      SatelliteAPI.getDataSources(),
      SatelliteAPI.getLiveStatus(),
    ])
      .then(([sourcesRes, statusRes]) => {
        setDataSources(sourcesRes.data);
        setLiveStatus(statusRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleManualSync = () => {
    setIsSyncing(true);
    SatelliteAPI.syncLive()
      .then((res) => {
        setSyncResult(res.data);
        setTimeout(() => setSyncResult(null), 5000);
      })
      .finally(() => setIsSyncing(false));
  };

  return (
    <div className="p-4 space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary-container" />
          <h2 className="font-bold text-ice-white text-base tracking-wide">
            POLAR GEOSPATIAL & ENVIRONMENTAL DATA INGESTION FEEDS
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded bg-primary-container text-black font-bold flex items-center gap-1.5 hover:bg-white transition-all shadow-[0_0_12px_rgba(0,229,255,0.3)] disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'SYNCING SATELLITES...' : 'POLL LIVE SATELLITES'}</span>
          </button>
        </div>
      </div>

      {/* Sync Success Alert */}
      {syncResult && (
        <div className="bg-risk-low/15 border border-risk-low/50 rounded-lg p-3 flex items-center justify-between text-risk-low">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>
              LIVE TELEMETRY INGESTED: Synced at {syncResult.synced_at}. Live ECMWF atmospheric vectors active.
            </span>
          </div>
          <span className="text-[10px] font-bold">STATUS: 200 OK</span>
        </div>
      )}

      {/* Live Pipeline Credentials Status Banner */}
      <div className="bg-surface-container border border-outline-variant/50 rounded-lg p-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-risk-low" />
          <span>
            ECMWF ERA5 Live: <strong className="text-risk-low">Active</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-risk-low" />
          <span>
            USNIC Polar Tracking: <strong className="text-risk-low">Online</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${liveStatus?.copernicus_marine ? 'bg-risk-low' : 'bg-risk-medium'}`} />
          <span>
            CMEMS Currents: <strong className="text-ice-white">{liveStatus?.copernicus_marine ? 'Custom Key' : 'Public ACC Feed'}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${liveStatus?.sentinel1_cdse ? 'bg-risk-low' : 'bg-risk-medium'}`} />
          <span>
            Sentinel-1 CDSE: <strong className="text-ice-white">{liveStatus?.sentinel1_cdse ? 'Authenticated' : 'Calibrated Swaths'}</strong>
          </span>
        </div>
      </div>

      {/* Feeds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataSources.map((src) => (
          <div
            key={src.name}
            className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-4 space-y-3 flex flex-col justify-between hover:border-primary-container/60 transition-all shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-2 border-b border-outline-variant/30 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-ice-white text-sm">{src.name}</h3>
                  <div className="text-[10px] text-primary">{src.agency}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-risk-low/20 text-risk-low font-bold text-[10px] whitespace-nowrap">
                  {src.status}
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] text-on-surface-variant">
                <div>
                  Dataset: <strong className="text-ice-white block mt-0.5">{src.dataset_type}</strong>
                </div>

                <div className="py-1">
                  <span className="text-[10px] text-on-surface-variant block mb-1">Ingested Variables:</span>
                  <div className="flex flex-wrap gap-1">
                    {src.variables.map((v, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-surface-container text-[10px] text-ice-white border border-outline-variant/30"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between py-1 border-t border-outline-variant/20 text-[10px]">
                  <span>Cadence:</span>
                  <strong className="text-ice-white">{src.update_frequency}</strong>
                </div>

                <div className="flex justify-between py-1 border-t border-outline-variant/20 text-[10px]">
                  <span>Last Ingest:</span>
                  <strong className="text-primary">{src.last_ingested_utc}</strong>
                </div>

                <div className="flex justify-between py-1 border-t border-outline-variant/20 text-[10px]">
                  <span>Pipeline Latency:</span>
                  <strong className="text-risk-low">{src.latency_seconds}s</strong>
                </div>

                <div className="flex justify-between py-1 border-t border-outline-variant/20 text-[10px]">
                  <span>Data Quality Index:</span>
                  <strong className="text-risk-low font-bold">{src.data_quality_pct}%</strong>
                </div>
              </div>
            </div>

            <a
              href={src.api_endpoint}
              target="_blank"
              rel="noreferrer"
              className="w-full py-1.5 rounded bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 text-primary text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all mt-2"
            >
              <span>ACCESS REPOSITORY PORTAL</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
