import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { JHARKHAND_MAP_CENTER, JHARKHAND_DEFAULT_ZOOM, DISTRICT_COORDINATES } from '../../utils/geoData';
import { StatusBadge } from '../ui/StatusBadge';
import { JHARKHAND_DISTRICTS } from '../../utils/constants';
import { MapPin, Eye } from 'lucide-react';

// Custom Pin Icons for Leaflet
const createPinIcon = (category, priority) => {
  const normalizedPriority = String(priority ?? '').trim().toLowerCase();
  const isHigh = normalizedPriority === 'critical' || normalizedPriority === 'high';
  const color = isHigh ? '#C45C26' : '#0B3D2E';
  const border = '#D4AF37';

  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div style="
        background: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid ${border};
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });
};

function ChangeMapView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export const IssueMap = ({ 
  issues = [], 
  onSelectIssue, 
  height = '480px',
  selectedDistrict = 'all',
  onDistrictChange
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [mapCenter, setMapCenter] = useState(JHARKHAND_MAP_CENTER);
  const [zoomLevel, setZoomLevel] = useState(JHARKHAND_DEFAULT_ZOOM);

  const safeIssues = Array.isArray(issues) ? issues : [];
  const normalizedSelectedDistrict = String(selectedDistrict ?? 'all').trim().toLowerCase();
  const normalizedActiveCategory = String(activeCategory ?? 'all').trim().toLowerCase();

  const filteredIssues = safeIssues.filter(issue => {
    if (!issue || typeof issue !== 'object') return false;

    const issueCategory = String(issue.category ?? '').trim().toLowerCase();
    const issueDistrict = String(issue.district ?? '').trim().toLowerCase();
    const matchCat = normalizedActiveCategory === 'all' || issueCategory === normalizedActiveCategory;
    const matchDist = normalizedSelectedDistrict === 'all' || issueDistrict.includes(normalizedSelectedDistrict);
    return matchCat && matchDist;
  });

  const handleDistrictFilter = (district) => {
    if (onDistrictChange) onDistrictChange(district);
    if (district === 'all') {
      setMapCenter(JHARKHAND_MAP_CENTER);
      setZoomLevel(JHARKHAND_DEFAULT_ZOOM);
    } else if (DISTRICT_COORDINATES[district]) {
      const coord = DISTRICT_COORDINATES[district];
      setMapCenter([coord.lat, coord.lng]);
      setZoomLevel(11);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-jh-earth-200 overflow-hidden shadow-jh-soft flex flex-col">
      
      {/* Map Control Toolbar */}
      <div className="p-3.5 bg-jh-earth-50 border-b border-jh-earth-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-jh-green-900 text-white flex items-center justify-center shadow-xs">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-jh-green-950">
              Jharkhand GIS Heatmap
            </h4>
            <p className="text-[11px] text-jh-earth-600">
              Showing {filteredIssues.length} active geolocated civic & environmental interventions
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={selectedDistrict}
            onChange={(e) => handleDistrictFilter(e.target.value)}
            className="text-xs bg-white border border-jh-earth-200 rounded-lg px-2.5 py-1.5 font-medium text-jh-charcoal focus:outline-none focus:ring-2 focus:ring-jh-green-700"
          >
            <option value="all">All 24 Districts</option>
            {JHARKHAND_DISTRICTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="text-xs bg-white border border-jh-earth-200 rounded-lg px-2.5 py-1.5 font-medium text-jh-charcoal focus:outline-none focus:ring-2 focus:ring-jh-green-700"
          >
            <option value="all">All Domains</option>
            <option value="water">Water & Rivers</option>
            <option value="forest">Forestry & Ecology</option>
            <option value="mining">Mining Reclamation</option>
            <option value="solar">Solar Microgrids</option>
            <option value="sanitation">Civic Sanitation</option>
            <option value="agritech">Tribal AgriTech</option>
          </select>
        </div>
      </div>

      {/* Interactive Leaflet Map Container */}
      <div style={{ height, width: '100%' }} className="relative z-10">
        <MapContainer
          center={mapCenter}
          zoom={zoomLevel}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <ChangeMapView center={mapCenter} zoom={zoomLevel} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Jharkhand Survey'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredIssues.map((issue) => {
            const coordinates = issue.coordinates;
            const lat = Number(coordinates?.lat);
            const lng = Number(coordinates?.lng);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

            return (
              <Marker
                key={issue.id ?? `${lat}-${lng}-${issue.title ?? 'issue'}`}
                position={[lat, lng]}
                icon={createPinIcon(issue.category, issue.priority)}
              >
                <Popup>
                  <div className="w-64 p-3 font-sans">
                    {issue.images && issue.images[0] && (
                      <img
                        src={issue.images[0]}
                        alt={issue.title || 'Issue evidence'}
                        className="w-full h-28 object-cover rounded-lg mb-2"
                      />
                    )}
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-bold text-jh-green-800 uppercase tracking-wider">
                        {issue.district || 'District not specified'}
                      </span>
                      <StatusBadge status={issue.status || 'REPORTED'} />
                    </div>
                    <h5 className="text-xs font-bold text-jh-charcoal line-clamp-2 mb-1">
                      {issue.title || 'Untitled issue'}
                    </h5>
                    <p className="text-[11px] text-jh-earth-700 line-clamp-2 mb-2">
                      {issue.description || 'No description available.'}
                    </p>
                    <div className="pt-2 border-t border-jh-earth-200 flex items-center justify-between">
                      <span className="text-[10px] text-jh-earth-600">
                        {Number(issue.upvotes) || 0} citizens supported
                      </span>
                      {onSelectIssue && (
                        <button
                          onClick={() => onSelectIssue(issue)}
                          className="text-[11px] font-bold text-jh-green-900 hover:text-jh-terracotta-600 flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

    </div>
  );
};
