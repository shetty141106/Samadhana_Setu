import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { JHARKHAND_MAP_CENTER, JHARKHAND_DEFAULT_ZOOM, DISTRICT_COORDINATES } from '../../utils/geoData';
import { MapPin, Navigation } from 'lucide-react';

const pickerIcon = L.divIcon({
  className: 'samadhan-location-picker',
  html: '<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#C45C26;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.35);"><div style="width:10px;height:10px;border-radius:50%;background:#fff;position:absolute;left:8px;top:8px;"></div></div>',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect({ lat: event.latlng.lat, lng: event.latlng.lng });
    }
  });
  return null;
}

function Recenter({ center, zoom }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

export const LocationPicker = ({ district, value, onChange, height = '300px' }) => {
  const districtCoord = DISTRICT_COORDINATES[district];
  const center = value
    ? [value.lat, value.lng]
    : districtCoord
      ? [districtCoord.lat, districtCoord.lng]
      : JHARKHAND_MAP_CENTER;
  const zoom = value || districtCoord ? 12 : JHARKHAND_DEFAULT_ZOOM;

  const handleUseDistrictCenter = () => {
    if (districtCoord) {
      onChange({ lat: districtCoord.lat, lng: districtCoord.lng });
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-jh-earth-300 bg-jh-earth-50">
      <div className="px-3.5 py-3 flex items-center justify-between gap-3 border-b border-jh-earth-200">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-jh-terracotta-700" />
          <div>
            <p className="text-xs font-bold text-jh-green-950">Pin the exact issue location</p>
            <p className="text-[11px] text-jh-earth-600">Click anywhere on the map to place the report marker.</p>
          </div>
        </div>
        {districtCoord && (
          <button
            type="button"
            onClick={handleUseDistrictCenter}
            className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold text-jh-green-900 hover:text-jh-terracotta-700"
          >
            <Navigation className="w-3.5 h-3.5" />
            Use district center
          </button>
        )}
      </div>

      <div style={{ height, width: '100%' }}>
        <MapContainer center={center} zoom={zoom} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
          <Recenter center={center} zoom={zoom} />
          <ClickHandler onSelect={onChange} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {value && <Marker position={[value.lat, value.lng]} icon={pickerIcon} />}
        </MapContainer>
      </div>

      <div className="px-3.5 py-2.5 bg-white border-t border-jh-earth-200 text-[11px]">
        {value ? (
          <span className="font-medium text-jh-green-900">
            Selected: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
          </span>
        ) : (
          <span className="text-jh-earth-600">No exact location selected yet.</span>
        )}
      </div>
    </div>
  );
};
