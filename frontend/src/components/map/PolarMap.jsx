import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Eye, EyeOff, Navigation, Shield, Compass, Landmark, Globe, Satellite, Moon, Sun, AlertTriangle } from 'lucide-react';
import { formatCoordinate, formatKnots, formatBearing } from '../../utils/formatters';

// Fix standard Leaflet default icon asset paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Polar Antarctic Research Stations Dataset (Indian & Key International Bases)
const POLAR_RESEARCH_STATIONS = [
  {
    id: 'maitri',
    name: 'Maitri Research Station',
    country: 'India',
    flag: '🇮🇳',
    lat: -70.766,
    lon: 11.736,
    commissioned: 1989,
    region: 'Schirmacher Oasis, Queen Maud Land',
    status: 'Active (Year-Round)',
    agency: 'NCPOR / Ministry of Earth Sciences, Govt of India',
    isIndian: true,
    description: "India's second permanent Antarctic research station. Key base for glaciology, meteorology, and human physiology research.",
  },
  {
    id: 'bharati',
    name: 'Bharati Research Station',
    country: 'India',
    flag: '🇮🇳',
    lat: -69.408,
    lon: 76.187,
    commissioned: 2012,
    region: 'Larsemann Hills, Prydz Bay',
    status: 'Active (State-of-the-Art Year-Round)',
    agency: 'NCPOR / Ministry of Earth Sciences, Govt of India',
    isIndian: true,
    description: "India's modern Antarctic station constructed from 134 prefabricated shipping containers. Specializes in oceanography, continental breakup, and satellite data reception.",
  },
  {
    id: 'dakshin-gangotri',
    name: 'Dakshin Gangotri (Historic Base)',
    country: 'India',
    flag: '🇮🇳',
    lat: -70.093,
    lon: 12.000,
    commissioned: 1983,
    region: 'Schirmacher Oasis Ice Shelf',
    status: 'Historical Monument & Transit Fuel Depot',
    agency: 'NCPOR / Govt of India',
    isIndian: true,
    description: "India's first historical research base in Antarctica (1983-1990). Now maintained as an Antarctic Treaty Historical Site and emergency supply transit depot.",
  },
  {
    id: 'maitri-coast-logistics',
    name: 'Princess Astrid Fast-Ice Bay',
    country: 'India (Maritime Offload Point)',
    flag: '⚓',
    lat: -69.82,
    lon: 11.21,
    commissioned: 1989,
    region: 'Princess Astrid Coastline',
    status: 'Active Vessel Offloading Waypoint for Maitri',
    agency: 'Indian Antarctic Expedition',
    isIndian: true,
    description: "Designated coastal fast-ice docking and cargo offloading corridor for chartered expedition vessels delivering fuel and food to Maitri.",
  },
  {
    id: 'bharati-coast-logistics',
    name: 'Prydz Bay Coastal Anchorage',
    country: 'India (Maritime Offload Point)',
    flag: '⚓',
    lat: -69.41,
    lon: 76.19,
    commissioned: 2012,
    region: 'Prydz Bay Anchorage',
    status: 'Active Vessel Anchorage for Bharati',
    agency: 'Indian Antarctic Expedition',
    isIndian: true,
    description: "Deep-water sheltered maritime approach and helipad offloading anchorage serving Bharati station.",
  },
  {
    id: 'neumayer',
    name: 'Neumayer-Station III',
    country: 'Germany',
    flag: '🇩🇪',
    lat: -70.67,
    lon: -8.27,
    commissioned: 2009,
    region: 'Ekström Ice Shelf',
    status: 'Active',
    agency: 'Alfred Wegener Institute (AWI)',
    isIndian: false,
  },
  {
    id: 'rothera',
    name: 'Rothera Research Station',
    country: 'United Kingdom',
    flag: '🇬🇧',
    lat: -67.57,
    lon: -68.13,
    commissioned: 1975,
    region: 'Adelaide Island',
    status: 'Active',
    agency: 'British Antarctic Survey (BAS)',
    isIndian: false,
  },
  {
    id: 'mcmurdo',
    name: 'McMurdo Station',
    country: 'United States',
    flag: '🇺🇸',
    lat: -77.85,
    lon: 166.67,
    commissioned: 1956,
    region: 'Ross Island',
    status: 'Active',
    agency: 'National Science Foundation (NSF)',
    isIndian: false,
  },
];

export default function PolarMap({
  vessel,
  fleet = [],
  icebergs = [],
  seaIceZones = [],
  routes = [],
  selectedIcebergId,
  onSelectIceberg,
  onSelectVessel,
  activeRouteId = 'route-rec-a',
  focusVesselTrigger = 0,
  activeSOS = null,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const baseLayersRef = useRef({
    dark: null,
    satellite: null,
    glacial: null,
    labels: null,
  });

  const layerGroupsRef = useRef({
    vessel: null,
    fleet: null,
    icebergs: null,
    history: null,
    predictions: null,
    uncertainty: null,
    seaIce: null,
    routes: null,
    stations: null,
    sos: null,
  });

  const [basemapMode, setBasemapMode] = useState('dark'); // 'dark' | 'satellite' | 'glacial'

  const [layersVisibility, setLayersVisibility] = useState({
    icebergs: true,
    fleet: true,
    history: true,
    predictions: true,
    uncertainty: true,
    seaIce: true,
    vessel: true,
    plannedRoute: true,
    recommendedRoute: true,
    stations: true,
  });

  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Initialize Map instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Antarctic maritime operational zone (-64.0° S, 30.0° E)
    const map = L.map(mapContainerRef.current, {
      center: [-64.0, 30.0],
      zoom: 4,
      minZoom: 2,
      maxZoom: 14,
      zoomControl: true,
      attributionControl: false,
    });

    // 1. Dark Ocean Bathymetry Layer
    baseLayersRef.current.dark = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 16 }
    );

    // 2. True-Color Optical Satellite Imagery (ESRI World Imagery / NASA)
    baseLayersRef.current.satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 16 }
    );

    // 3. Glacial Light Canvas Layer
    baseLayersRef.current.glacial = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 16 }
    );

    // 4. Dark Reference Labels
    baseLayersRef.current.labels = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 16, opacity: 0.75 }
    );

    baseLayersRef.current.dark.addTo(map);
    baseLayersRef.current.labels.addTo(map);

    // Initialize Feature Layer Groups
    layerGroupsRef.current = {
      seaIce: L.layerGroup().addTo(map),
      uncertainty: L.layerGroup().addTo(map),
      history: L.layerGroup().addTo(map),
      predictions: L.layerGroup().addTo(map),
      routes: L.layerGroup().addTo(map),
      stations: L.layerGroup().addTo(map),
      fleet: L.layerGroup().addTo(map),
      icebergs: L.layerGroup().addTo(map),
      vessel: L.layerGroup().addTo(map),
      sos: L.layerGroup().addTo(map),
    };

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Basemap Switching
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { dark, satellite, glacial, labels } = baseLayersRef.current;
    if (!dark || !satellite || !glacial) return;

    map.removeLayer(dark);
    map.removeLayer(satellite);
    map.removeLayer(glacial);

    if (basemapMode === 'satellite') {
      satellite.addTo(map);
      if (labels) labels.addTo(map);
    } else if (basemapMode === 'glacial') {
      glacial.addTo(map);
      if (labels) map.removeLayer(labels);
    } else {
      dark.addTo(map);
      if (labels) labels.addTo(map);
    }
  }, [basemapMode]);

  // Update Dynamic Map Features
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const {
      vessel: vesselGroup,
      fleet: fleetGroup,
      icebergs: iceGroup,
      history: histGroup,
      predictions: predGroup,
      uncertainty: uncertGroup,
      seaIce: icePackGroup,
      routes: routeGroup,
      stations: stationsGroup,
      sos: sosGroup,
    } = layerGroupsRef.current;

    // Clear all feature layers
    vesselGroup.clearLayers();
    fleetGroup.clearLayers();
    iceGroup.clearLayers();
    histGroup.clearLayers();
    predGroup.clearLayers();
    uncertGroup.clearLayers();
    icePackGroup.clearLayers();
    routeGroup.clearLayers();
    stationsGroup.clearLayers();
    sosGroup.clearLayers();

    // 1. Render SOS Emergency Beacon Strobe
    if (activeSOS) {
      const sosCoord = activeSOS.coordinates || [vessel?.current_lat || -62.5, vessel?.current_lon || 15.0];
      const sosPulseCircle = L.circle(sosCoord, {
        radius: 35000, // 35 km beacon strobe
        color: '#FF3D00',
        weight: 2,
        fillColor: '#FF3D00',
        fillOpacity: 0.25,
        dashArray: '4, 4',
      });
      sosPulseCircle.bindTooltip(`🚨 <strong>EMERGENCY SOS ACTIVE: ${activeSOS.vessel_name}</strong><br/>${activeSOS.gmdss_message}`, {
        className: 'leaflet-popup-content-wrapper text-xs font-mono text-risk-high',
        permanent: true,
      });
      sosGroup.addLayer(sosPulseCircle);
    }

    // 2. Render Indian & International Polar Research Stations
    if (layersVisibility.stations) {
      POLAR_RESEARCH_STATIONS.forEach((st) => {
        const isIndian = st.isIndian;
        const stationHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="px-1.5 py-0.5 rounded-full ${
              isIndian
                ? 'bg-gradient-to-r from-orange-500/80 via-white/80 to-green-500/80 text-black font-bold ring-2 ring-orange-400 shadow-[0_0_12px_rgba(255,152,0,0.5)]'
                : 'bg-surface-container-high border border-outline-variant/60 text-ice-white'
            } flex items-center gap-1 text-[10px] font-mono whitespace-nowrap">
              <span>${st.flag}</span>
              <span class="${isIndian ? 'text-black font-extrabold' : 'text-ice-white'}">${st.name.split(' ')[0]}</span>
            </div>
          </div>
        `;

        const stationIcon = L.divIcon({
          html: stationHtml,
          className: 'custom-station-icon',
          iconSize: [60, 24],
          iconAnchor: [30, 12],
        });

        const marker = L.marker([st.lat, st.lon], { icon: stationIcon });
        marker.bindPopup(
          `<div class="p-1 font-mono text-xs max-w-xs">
            <div class="flex items-center justify-between border-b border-outline-variant/40 pb-1 mb-1.5">
              <strong class="text-primary-container text-sm flex items-center gap-1">
                <span>${st.flag}</span>
                <span>${st.name}</span>
              </strong>
              <span class="px-1.5 py-0.2 rounded text-[9px] ${
                st.isIndian ? 'bg-orange-500/20 text-orange-400 font-bold border border-orange-500/40' : 'bg-surface-container text-on-surface'
              }">${st.country}</span>
            </div>
            <div>Coordinates: <strong>${formatCoordinate(st.lat, st.lon)}</strong></div>
            <div>Commissioned: <strong class="text-ice-white">${st.commissioned}</strong></div>
            <div>Region: ${st.region}</div>
            <div>Agency: <strong class="text-primary">${st.agency}</strong></div>
            <div class="mt-2 pt-1 border-t border-outline-variant/40 text-[10px] text-on-surface-variant">${st.description || ''}</div>
          </div>`
        );

        stationsGroup.addLayer(marker);
      });
    }

    // 3. Render Sea-Ice Zones
    if (layersVisibility.seaIce && seaIceZones) {
      seaIceZones.forEach((zone) => {
        const poly = L.polygon(zone.polygon_coords, {
          color: '#00e5ff',
          weight: 1,
          opacity: 0.4,
          fillColor: '#00e5ff',
          fillOpacity: zone.concentration_pct > 80 ? 0.25 : 0.12,
          dashArray: '4, 4',
        });
        poly.bindTooltip(
          `<strong>${zone.region_name}</strong><br/>Concentration: ${zone.concentration_pct}% (${zone.category})`,
          { className: 'leaflet-popup-content-wrapper text-xs font-mono', sticky: true }
        );
        icePackGroup.addLayer(poly);
      });
    }

    // 4. Render Routes
    if (routes && routes.length > 0) {
      routes.forEach((route) => {
        const isRec = route.is_recommended;
        const isDirect = route.route_type === 'DIRECT_PLANNED';

        if (isRec && !layersVisibility.recommendedRoute) return;
        if (!isRec && !layersVisibility.plannedRoute) return;

        const lineColor = isRec ? '#00E676' : isDirect ? '#FF3D00' : '#FFC400';
        const lineWeight = isRec ? 3.5 : 2.5;
        const dash = isDirect ? '6, 6' : null;

        const polyline = L.polyline(route.path_coordinates, {
          color: lineColor,
          weight: lineWeight,
          opacity: 0.85,
          dashArray: dash,
        });

        polyline.bindTooltip(
          `<strong>${route.name}</strong><br/>Distance: ${route.total_distance_km} km<br/>Risk: ${route.risk_level} (${route.composite_risk_score}%)<br/>Reduction: ${route.risk_reduction_pct}%`,
          { className: 'leaflet-popup-content-wrapper text-xs font-mono' }
        );
        routeGroup.addLayer(polyline);

        route.waypoints.forEach((wp) => {
          const wpMarker = L.circleMarker([wp.lat, wp.lon], {
            radius: isRec ? 4 : 3,
            color: lineColor,
            fillColor: '#0d1516',
            fillOpacity: 1,
            weight: 2,
          });
          wpMarker.bindPopup(
            `<div class="p-1 font-mono text-xs">
              <strong class="text-primary">${wp.name}</strong><br/>
              Coord: ${formatCoordinate(wp.lat, wp.lon)}<br/>
              Cumulative: ${wp.segment_distance_km} km<br/>
              Risk: ${wp.segment_risk}%
            </div>`
          );
          routeGroup.addLayer(wpMarker);
        });
      });
    }

    // 5. Render Icebergs, Historical Tracks, Predictions & Uncertainty
    if (icebergs && icebergs.length > 0) {
      icebergs.forEach((berg) => {
        const isSelected = berg.id === selectedIcebergId;
        const riskColor =
          berg.risk_level === 'HIGH' || berg.risk_level === 'CRITICAL'
            ? '#FF3D00'
            : berg.risk_level === 'MEDIUM'
            ? '#FFC400'
            : '#00E676';

        // Historical Track
        if (layersVisibility.history && berg.historical_track && berg.historical_track.length > 0) {
          const histCoords = berg.historical_track.map((h) => [h.lat, h.lon]);
          const histLine = L.polyline(histCoords, {
            color: '#849396',
            weight: 1.5,
            opacity: 0.7,
          });
          histGroup.addLayer(histLine);
        }

        // Predicted Trajectory & Uncertainty Cones
        if (berg.predictions && berg.predictions.length > 0) {
          const predCoords = [[berg.lat, berg.lon], ...berg.predictions.map((p) => [p.lat, p.lon])];

          if (layersVisibility.predictions) {
            const predLine = L.polyline(predCoords, {
              color: '#00daf3',
              weight: isSelected ? 3 : 2,
              dashArray: '5, 5',
              opacity: 0.9,
            });
            predGroup.addLayer(predLine);
          }

          // Uncertainty Ellipses
          berg.predictions.forEach((pred) => {
            if (layersVisibility.uncertainty && pred.uncertainty) {
              const radiusMeters = pred.uncertainty.semi_major_km * 1000;
              const ellipse = L.circle([pred.lat, pred.lon], {
                radius: radiusMeters,
                color: '#00daf3',
                weight: 1,
                opacity: 0.3,
                fillColor: '#00daf3',
                fillOpacity: 0.08,
                dashArray: '2, 4',
              });
              ellipse.bindTooltip(
                `+${pred.horizon_hours}h Uncertainty Cone (±${pred.position_error_km} km)<br/>Confidence: ${pred.confidence_pct}%`,
                { className: 'leaflet-popup-content-wrapper text-xs font-mono' }
              );
              uncertGroup.addLayer(ellipse);
            }

            if (layersVisibility.predictions) {
              const pMarker = L.circleMarker([pred.lat, pred.lon], {
                radius: 3.5,
                color: '#00daf3',
                fillColor: '#00daf3',
                fillOpacity: 0.8,
                weight: 1,
              });
              pMarker.bindTooltip(
                `<strong>+${pred.horizon_hours}h Horizon</strong><br/>${formatCoordinate(pred.lat, pred.lon)}<br/>Dist: +${pred.drift_distance_km} km | Conf: ${pred.confidence_pct}%`,
                { className: 'leaflet-popup-content-wrapper text-xs font-mono' }
              );
              predGroup.addLayer(pMarker);
            }
          });
        }

        // Main Iceberg Marker Icon
        if (layersVisibility.icebergs) {
          const icebergHtml = `
            <div class="relative flex items-center justify-center cursor-pointer group">
              <div class="w-7 h-7 rounded-sm rotate-45 flex items-center justify-center ${
                isSelected ? 'ring-2 ring-primary-container ring-offset-2 ring-offset-black scale-125' : ''
              }" style="background-color: ${riskColor}33; border: 1.5px solid ${riskColor};">
                <span class="-rotate-45 text-[11px] font-bold font-mono" style="color: ${riskColor};">🧊</span>
              </div>
              <div class="absolute -bottom-5 whitespace-nowrap bg-black/80 border border-outline-variant/50 px-1 py-0.2 text-[9px] font-mono text-ice-white rounded">
                ${berg.id}
              </div>
            </div>
          `;

          const customIcon = L.divIcon({
            html: icebergHtml,
            className: 'custom-iceberg-icon',
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const marker = L.marker([berg.lat, berg.lon], { icon: customIcon });
          marker.on('click', () => {
            if (onSelectIceberg) onSelectIceberg(berg.id);
          });

          marker.bindPopup(
            `<div class="p-1 font-mono text-xs">
              <div class="flex items-center justify-between border-b border-outline-variant/40 pb-1 mb-1.5">
                <strong class="text-primary-container text-sm font-bold">${berg.name}</strong>
                <span class="px-1.5 py-0.5 rounded text-[10px] font-bold" style="background-color: ${riskColor}33; color: ${riskColor};">${berg.risk_level}</span>
              </div>
              <div>Coord: <strong>${formatCoordinate(berg.lat, berg.lon)}</strong></div>
              <div>Dimensions: ${berg.length_km} x ${berg.width_km} km (${berg.area_sq_km} km²)</div>
              <div>Mass: ${berg.mass_megatons.toLocaleString()} MT</div>
              <div>Drift: ${formatKnots(berg.drift_speed_knots)} @ ${formatBearing(berg.drift_heading_deg)}</div>
              <div>Source: ${berg.source}</div>
              <div class="mt-2 pt-1 border-t border-outline-variant/40 text-[10px] text-on-surface-variant">${berg.notes || ''}</div>
            </div>`
          );

          iceGroup.addLayer(marker);
        }
      });
    }

    // 6. Render Full Fleet Vessels on Map
    if (layersVisibility.fleet && fleet && fleet.length > 0) {
      fleet.forEach((fVessel) => {
        const isPrimaryActive = fVessel.id === vessel?.id;

        // Wake trail
        if (fVessel.trail && fVessel.trail.length > 0) {
          const fTrail = L.polyline(fVessel.trail, {
            color: isPrimaryActive ? '#00e5ff' : '#849396',
            weight: isPrimaryActive ? 2 : 1.5,
            opacity: 0.5,
            dashArray: '3, 6',
          });
          fleetGroup.addLayer(fTrail);
        }

        const fleetHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            ${isPrimaryActive ? '<div class="w-8 h-8 rounded-full bg-primary-container/20 border border-primary-container animate-radar-ping absolute"></div>' : ''}
            <div class="w-7 h-7 rounded-full ${
              isPrimaryActive
                ? 'bg-surface-container-high border-2 border-primary-container shadow-[0_0_12px_#00e5ff]'
                : 'bg-surface-container border border-outline-variant/60'
            } flex items-center justify-center text-xs">
              <span>${fVessel.flag}</span>
            </div>
            <div class="absolute -bottom-5 whitespace-nowrap bg-black/90 border ${
              isPrimaryActive ? 'border-primary-container/80 text-primary-container' : 'border-outline-variant/50 text-ice-white'
            } px-1.5 py-0.2 text-[9px] font-mono rounded font-bold">
              ${fVessel.name.split(' ')[0]}
            </div>
          </div>
        `;

        const fleetIcon = L.divIcon({
          html: fleetHtml,
          className: 'custom-fleet-icon',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const fMarker = L.marker([fVessel.current_lat, fVessel.current_lon], { icon: fleetIcon });
        fMarker.on('click', () => {
          if (onSelectVessel) onSelectVessel(fVessel.id);
        });

        fMarker.bindPopup(
          `<div class="p-1 font-mono text-xs">
            <div class="flex items-center justify-between border-b border-outline-variant/40 pb-1 mb-1.5">
              <strong class="text-primary-container text-sm flex items-center gap-1">
                <span>${fVessel.flag}</span>
                <span>${fVessel.name}</span>
              </strong>
              <span class="px-1.5 py-0.5 rounded text-[10px] bg-primary-container/20 text-primary-container font-bold">${fVessel.status}</span>
            </div>
            <div>Nation: <strong>${fVessel.country}</strong></div>
            <div>Class: <strong>${fVessel.ice_class}</strong></div>
            <div>Position: ${formatCoordinate(fVessel.current_lat, fVessel.current_lon)}</div>
            <div>Speed: ${formatKnots(fVessel.speed_knots)} | Heading: ${formatBearing(fVessel.heading_deg)}</div>
            <div>Destination: <strong>${fVessel.destination_name}</strong></div>
            <div>ETA: ${fVessel.eta_utc}</div>
            <div>POB: ${fVessel.pob_count} personnel</div>
          </div>`
        );

        fleetGroup.addLayer(fMarker);
      });
    }
  }, [vessel, fleet, icebergs, seaIceZones, routes, selectedIcebergId, layersVisibility, activeSOS]);

  // Center map on vessel if focus triggered
  useEffect(() => {
    if (focusVesselTrigger > 0 && mapInstanceRef.current && vessel) {
      mapInstanceRef.current.flyTo([vessel.current_lat, vessel.current_lon], 6, { duration: 1.2 });
    }
  }, [focusVesselTrigger]);

  // Center map on selected iceberg if triggered
  useEffect(() => {
    if (!selectedIcebergId || !mapInstanceRef.current || !icebergs) return;
    const target = icebergs.find((b) => b.id === selectedIcebergId);
    if (target) {
      mapInstanceRef.current.flyTo([target.lat, target.lon], 6, { duration: 1.2 });
    }
  }, [selectedIcebergId]);

  return (
    <div className="relative w-full h-full min-h-[460px] bg-deep-ocean rounded-lg overflow-hidden border border-outline-variant/40 shadow-2xl">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Polar Map Header Overlay */}
      <div className="absolute top-3 left-3 z-[400] bg-surface-container-low/90 backdrop-blur-md px-3 py-1.5 rounded border border-outline-variant/50 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono font-bold text-ice-white">ANTARCTIC POLAR SECTOR</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-risk-low/20 border border-risk-low/40 text-risk-low text-[10px] font-mono font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-ping" />
          <span>OFFLINE RESILIENT (LOCAL SHIPBOARD ENGINE)</span>
        </div>
        <div className="text-[10px] font-mono text-on-surface-variant hidden lg:inline">
          View: {basemapMode === 'satellite' ? 'Optical Satellite' : basemapMode === 'glacial' ? 'Glacial Light' : 'Dark Ocean Bathymetry'}
        </div>
      </div>

      {/* Basemap & Layer Visibility Floating Controls */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-2">
        {/* Basemap Mode Switcher */}
        <div className="flex items-center bg-surface-container-low/90 backdrop-blur-md border border-outline-variant/50 rounded p-0.5 text-xs font-mono">
          <button
            onClick={() => setBasemapMode('satellite')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all ${
              basemapMode === 'satellite' ? 'bg-primary-container text-black font-bold' : 'text-on-surface-variant hover:text-white'
            }`}
            title="Real-Time High Resolution Satellite View"
          >
            <Satellite className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Satellite</span>
          </button>
          <button
            onClick={() => setBasemapMode('dark')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all ${
              basemapMode === 'dark' ? 'bg-primary-container text-black font-bold' : 'text-on-surface-variant hover:text-white'
            }`}
            title="Dark Oceanic Bathymetry"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Dark</span>
          </button>
          <button
            onClick={() => setBasemapMode('glacial')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all ${
              basemapMode === 'glacial' ? 'bg-primary-container text-black font-bold' : 'text-on-surface-variant hover:text-white'
            }`}
            title="Glacial Ice Light Canvas"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Glacial</span>
          </button>
        </div>

        {/* Layers Menu Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-low/90 backdrop-blur-md border border-outline-variant/50 text-xs font-mono text-ice-white hover:bg-surface-container transition-all shadow-lg"
          >
            <Layers className="w-3.5 h-3.5 text-primary-container" />
            <span>Layers</span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-surface-container/95 backdrop-blur-xl border border-outline-variant/60 rounded-md p-2.5 shadow-2xl z-[450] text-xs font-mono">
              <div className="text-[11px] font-bold text-primary border-b border-outline-variant/40 pb-1 mb-2">
                MAP OVERLAYS & STATIONS
              </div>
              <div className="space-y-1.5">
                {[
                  { id: 'stations', label: '🇮🇳 Indian & Polar Stations' },
                  { id: 'fleet', label: '🚢 Polar Expedition Fleet' },
                  { id: 'icebergs', label: '🧊 Icebergs Active' },
                  { id: 'history', label: 'Historical Drift Tracks' },
                  { id: 'predictions', label: 'AI Predicted Tracks' },
                  { id: 'uncertainty', label: 'Uncertainty Cones' },
                  { id: 'seaIce', label: 'Sea-Ice Pack Zones' },
                  { id: 'plannedRoute', label: 'Direct Planned Route' },
                  { id: 'recommendedRoute', label: 'Recommended Safe Route' },
                ].map((layer) => (
                  <label key={layer.id} className="flex items-center justify-between cursor-pointer hover:text-white">
                    <span className="text-on-surface-variant">{layer.label}</span>
                    <input
                      type="checkbox"
                      checked={layersVisibility[layer.id]}
                      onChange={(e) =>
                        setLayersVisibility((prev) => ({ ...prev, [layer.id]: e.target.checked }))
                      }
                      className="accent-primary-container rounded cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Legend Bar */}
      <div className="absolute bottom-3 left-3 z-[400] bg-surface-container-low/90 backdrop-blur-md px-3 py-1.5 rounded border border-outline-variant/50 flex items-center gap-4 text-[10px] font-mono text-on-surface-variant hidden md:flex">
        <div className="flex items-center gap-1">
          <span>🇮🇳</span>
          <span className="text-orange-400 font-bold">Indian Station</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-risk-low" />
          <span>Low Risk</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-risk-medium" />
          <span>Medium Risk</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-risk-high" />
          <span>High Risk</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-risk-low" />
          <span>Recommended Route</span>
        </div>
      </div>
    </div>
  );
}
