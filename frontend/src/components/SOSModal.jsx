import React, { useState } from 'react';
import { AlertTriangle, Radio, ShieldAlert, X, CheckCircle2, PhoneCall, Volume2, VolumeX } from 'lucide-react';
import { EmergencyAPI } from '../services/api';
import { formatCoordinate } from '../utils/formatters';

export default function SOSModal({ vessel, isOpen, onClose, onSOSBroadcasted }) {
  const [distressNature, setDistressNature] = useState('ICE_ENTRAPMENT');
  const [pob, setPob] = useState(vessel?.pob_count || 64);
  const [notes, setNotes] = useState('Vessel experiencing heavy pack-ice pressure and approaching mega-iceberg collision boundary.');
  const [sosResult, setSosResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  if (!isOpen) return null;

  const handleBroadcastSOS = () => {
    setLoading(true);
    EmergencyAPI.triggerSOS({
      vessel_id: vessel?.id || 'IND-EXP-01',
      vessel_name: vessel?.name || 'MV Vasiliy Golovnin (NCPOR Flagship)',
      lat: vessel?.current_lat || -62.50,
      lon: vessel?.current_lon || 15.00,
      distress_nature: distressNature,
      pob: Number(pob),
      additional_notes: notes,
    })
      .then((res) => {
        setSosResult(res.data);
        if (onSOSBroadcasted) onSOSBroadcasted(res.data);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-container border-2 border-risk-high rounded-xl max-w-2xl w-full p-5 font-mono text-xs shadow-[0_0_50px_rgba(255,61,0,0.4)] relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-risk-high/40 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-risk-high text-white flex items-center justify-center animate-bounce">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-risk-high tracking-wider">
                🚨 GMDSS / IRIDIUM POLAR DISTRESS BEACON (SOS)
              </h2>
              <p className="text-[10px] text-on-surface-variant">
                National Centre for Polar and Ocean Research (NCPOR) Maritime Rescue Hub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!sosResult ? (
          <div className="space-y-3.5">
            <div className="bg-risk-high/10 border border-risk-high/40 p-3 rounded text-risk-high text-[11px] flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                WARNING: Triggering this distress beacon dispatches priority search-and-rescue (SAR) advisories to Indian Antarctic Stations (*Maitri* & *Bharati*) and all nearby icebreakers via Iridium GMDSS Ch 16.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-on-surface-variant block mb-1">Distress Vessel</label>
                <input
                  type="text"
                  readOnly
                  value={vessel?.name || 'MV Vasiliy Golovnin'}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded px-2.5 py-1.5 text-ice-white font-bold"
                />
              </div>
              <div>
                <label className="text-on-surface-variant block mb-1">GPS Location</label>
                <input
                  type="text"
                  readOnly
                  value={formatCoordinate(vessel?.current_lat, vessel?.current_lon)}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded px-2.5 py-1.5 text-ice-white font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-on-surface-variant block mb-1">Nature of Emergency</label>
                <select
                  value={distressNature}
                  onChange={(e) => setDistressNature(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded px-2.5 py-1.5 text-xs text-primary font-bold outline-none cursor-pointer"
                >
                  <option value="ICE_ENTRAPMENT">Ice Entrapment / Pack Besetment</option>
                  <option value="IMMINENT_COLLISION">Imminent Iceberg Collision Hazard</option>
                  <option value="HULL_DAMAGE">Hull Breach / Polar Keel Stress</option>
                  <option value="ENGINE_FAILURE">Propulsion Loss in Pack Ice</option>
                  <option value="MEDICAL_EVAC">Critical Polar Medical Evac</option>
                </select>
              </div>
              <div>
                <label className="text-on-surface-variant block mb-1">Persons On Board (POB)</label>
                <input
                  type="number"
                  value={pob}
                  onChange={(e) => setPob(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded px-2.5 py-1.5 text-xs text-ice-white"
                />
              </div>
            </div>

            <div>
              <label className="text-on-surface-variant block mb-1">Tactical Situation Remarks</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded px-2.5 py-1.5 text-xs text-ice-white outline-none focus:border-risk-high"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center gap-1.5 text-[11px] text-on-surface-variant hover:text-white"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-primary" /> : <VolumeX className="w-3.5 h-3.5 text-outline" />}
                <span>{soundEnabled ? 'Siren Active' : 'Siren Muted'}</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded bg-surface-container-high hover:bg-surface-bright text-ice-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBroadcastSOS}
                  disabled={loading}
                  className="px-5 py-2 rounded bg-risk-high hover:bg-red-600 text-white font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,61,0,0.6)] disabled:opacity-50"
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>{loading ? 'TRANSMITTING MAYDAY...' : 'BROADCAST MAYDAY DISTRESS'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* SOS Result view */
          <div className="space-y-4">
            <div className="bg-risk-high/15 border border-risk-high p-3.5 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-risk-high font-bold text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-risk-high animate-ping" />
                  MAYDAY BROADCAST ACTIVE ({sosResult.distress_id})
                </span>
                <span className="text-[10px]">{sosResult.broadcast_timestamp_utc}</span>
              </div>

              <div className="bg-black/60 p-2.5 rounded font-mono text-[11px] text-green-400 whitespace-pre-line border border-green-500/30">
                {sosResult.gmdss_message}
              </div>
            </div>

            {/* Nearest Rescue Assets Table */}
            <div>
              <h4 className="font-bold text-ice-white text-xs mb-2">NEAREST SEARCH & RESCUE ASSETS</h4>
              <div className="space-y-1.5">
                {sosResult.nearest_rescue_assets?.map((asset, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-container-low p-2 rounded border border-outline-variant/40 flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-primary text-xs">{asset.asset_name}</strong>
                      <div className="text-[10px] text-on-surface-variant">Freq: {asset.contact_freq}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-ice-white font-bold text-xs">{asset.distance_km} km</div>
                      <div className="text-[10px] text-risk-medium">Est. ETA: ~{asset.estimated_transit_hours}h</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-primary-container text-black font-bold hover:bg-white transition-all"
              >
                Acknowledge & Return to Command Center
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
