export function formatCoordinate(lat, lon) {
  if (lat === undefined || lon === undefined) return 'N/A';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}° ${latDir}, ${Math.abs(lon).toFixed(2)}° ${lonDir}`;
}

export function formatKnots(knots) {
  if (knots === undefined) return '0.0 kts';
  return `${Number(knots).toFixed(1)} kts`;
}

export function formatDistanceKm(km) {
  if (km === undefined) return '0.0 km';
  return `${Number(km).toFixed(1)} km`;
}

export function formatBearing(deg) {
  if (deg === undefined) return '000°';
  return `${Math.round(deg).toString().padStart(3, '0')}°`;
}

export function getRiskColorClass(level) {
  switch (level?.toUpperCase()) {
    case 'CRITICAL':
    case 'HIGH':
      return 'text-risk-high bg-risk-high/10 border-risk-high/40';
    case 'MEDIUM':
      return 'text-risk-medium bg-risk-medium/10 border-risk-medium/40';
    case 'LOW':
    default:
      return 'text-risk-low bg-risk-low/10 border-risk-low/40';
  }
}

export function getRiskBadgeClass(level) {
  switch (level?.toUpperCase()) {
    case 'CRITICAL':
    case 'HIGH':
      return 'bg-risk-high text-white font-bold';
    case 'MEDIUM':
      return 'bg-risk-medium text-black font-bold';
    case 'LOW':
    default:
      return 'bg-risk-low text-black font-bold';
  }
}
