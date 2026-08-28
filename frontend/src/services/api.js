import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const IcebergAPI = {
  getAll: () => api.get('/icebergs'),
  getById: (id) => api.get(`/icebergs/${id}`),
  triggerPrediction: (id) => api.post(`/icebergs/${id}/predict`),
};

export const TrajectoryAPI = {
  predictCustom: (payload) => api.post('/trajectory/predict', payload),
};

export const EnvironmentAPI = {
  getConditions: (lat, lon, useLive = true) =>
    api.get(`/environment?lat=${lat}&lon=${lon}&use_live=${useLive}`),
  getSeaIceZones: () => api.get('/environment/sea-ice'),
};

export const RiskAPI = {
  getCurrentRisk: () => api.get('/risk'),
  evaluateVessel: (vessel) => api.post('/risk/evaluate', vessel),
};

export const RoutesAPI = {
  getCurrentRoutes: () => api.get('/routes'),
  planCustom: (payload) => api.post('/routes/plan', payload),
};

export const SatelliteAPI = {
  getSARPasses: () => api.get('/satellite/sar-passes'),
  getDataSources: () => api.get('/satellite/data-sources'),
  getLiveStatus: () => api.get('/satellite/live-status'),
  syncLive: () => api.post('/satellite/sync-live'),
};

export const FleetAPI = {
  getFleet: () => api.get('/fleet'),
  getVessel: (id) => api.get(`/fleet/${id}`),
  selectVessel: (id) => api.post(`/fleet/${id}/select`),
};

export const EmergencyAPI = {
  triggerSOS: (payload) => api.post('/emergency/sos', payload),
};

export const AuthAPI = {
  login: (payload) => api.post('/auth/login', payload),
};

export const ScenariosAPI = {
  list: () => api.get('/scenarios'),
  select: (id) => api.post(`/scenarios/${id}/select`),
  controlSimulation: (payload) => api.post('/scenarios/simulation/control', payload),
  getSnapshot: () => api.get('/scenarios/state/snapshot'),
};

export default api;
