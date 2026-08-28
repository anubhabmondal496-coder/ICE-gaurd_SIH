import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Lock, X, KeyRound, CheckCircle2 } from 'lucide-react';
import { AuthAPI } from '../services/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, currentUser }) {
  const [username, setUsername] = useState('commander');
  const [password, setPassword] = useState('sih2026');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    AuthAPI.login({ username, password })
      .then((res) => {
        onLoginSuccess(res.data);
        onClose();
      })
      .catch((err) => {
        setError(err.response?.data?.detail || 'Authentication failed. Please check credentials.');
      })
      .finally(() => setLoading(false));
  };

  const handleQuickLogin = (roleUser) => {
    setUsername(roleUser);
    setPassword('sih2026');
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-container border border-primary-container/60 rounded-xl max-w-md w-full p-5 font-mono text-xs shadow-[0_0_40px_rgba(0,229,255,0.25)] relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary-container/20 border border-primary-container text-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary-container" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ice-white tracking-wide">
                POLAR OPS COMMANDER AUTHENTICATION
              </h2>
              <p className="text-[10px] text-on-surface-variant">
                Role-Based Access Control • NCPOR / MoES
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

        {error && (
          <div className="bg-risk-high/15 border border-risk-high/40 p-2.5 rounded text-risk-high text-[11px] mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="text-on-surface-variant block mb-1">Officer Username / Call-Sign</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded px-3 py-1.5 text-xs text-ice-white outline-none focus:border-primary-container"
              placeholder="e.g. commander, navigator"
            />
          </div>

          <div>
            <label className="text-on-surface-variant block mb-1">Access Passphrase</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded px-3 py-1.5 text-xs text-ice-white outline-none focus:border-primary-container"
              placeholder="••••••••"
            />
          </div>

          {/* Quick Login Presets */}
          <div className="pt-1">
            <span className="text-[10px] text-on-surface-variant block mb-1.5">QUICK DEMO ROLES:</span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { user: 'commander', label: '🇮🇳 Mission Director', role: 'Level-4' },
                { user: 'navigator', label: '🚢 Chief Navigator', role: 'Level-3' },
                { user: 'scientist', label: '🔬 Lead Scientist', role: 'Level-2' },
                { user: 'guest', label: '👁️ SIH Evaluator', role: 'Level-1' },
              ].map((item) => (
                <button
                  key={item.user}
                  type="button"
                  onClick={() => handleQuickLogin(item.user)}
                  className={`p-1.5 rounded text-left border text-[10px] transition-all ${
                    username === item.user
                      ? 'bg-primary-container/20 border-primary-container text-primary font-bold'
                      : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:text-white'
                  }`}
                >
                  <div className="font-bold truncate">{item.label}</div>
                  <div className="text-[9px] text-outline">{item.role}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-surface-container-high text-ice-white hover:bg-surface-bright"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-1.5 rounded bg-primary-container text-black font-bold flex items-center gap-1.5 hover:bg-white transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] disabled:opacity-50"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{loading ? 'AUTHENTICATING...' : 'AUTHORIZE OFFICER'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
