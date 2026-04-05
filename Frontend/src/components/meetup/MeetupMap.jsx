// MeetupMap.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getMeetupLocationsAPI } from '../../api/axios.js';
import {
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiNavigation,
  FiShield,
  FiInfo,
  FiMap,
  FiLoader,
} from 'react-icons/fi';

const typeConfig = {
  library: { emoji: '📚', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  cafeteria: { emoji: '☕', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  gate: { emoji: '🚪', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  building: { emoji: '🏢', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  ground: { emoji: '🏟️', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  hostel: { emoji: '🏠', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  default: { emoji: '📍', color: 'bg-cream-dark text-gray-700 border-cream' },
};

const MeetupMap = ({ onSelectLocation, selectedLocation }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const SHUATS_CENTER = [25.4136232689761, 81.8475342647948];

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data } = await getMeetupLocationsAPI();
      if (data.success) setLocations(data.locations);
    } catch (error) {
      console.error('Fetch locations error:', error);
    } finally {
      setLoading(false);
    }
  };

  const locationTypes = ['all', ...new Set(locations.map((loc) => loc.type).filter(Boolean))];
  const filteredLocations =
    activeFilter === 'all' ? locations : locations.filter((loc) => loc.type === activeFilter);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-8 sm:p-12 animate-pulse-soft">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 bg-cream-dark rounded-2xl flex items-center justify-center">
            <FiLoader className="w-8 h-8 text-rose-beige animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Loading map...</p>
            <p className="text-xs text-gray-400 mt-1">Fetching campus meetup locations</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-forest/10 rounded-xl">
            <FiMap className="w-5 h-5 text-forest" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Campus Meetup Points</h3>
            <p className="text-xs text-gray-500">
              {locations.length} verified location{locations.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>

        {/* Safe zone info */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
          <FiShield className="w-3.5 h-3.5" />
          Safe zones are marked with ✅
        </div>
      </div>

      {/* Type Filters */}
      {locationTypes.length > 2 && (
        <div className="flex flex-wrap gap-2">
          {locationTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer capitalize
                ${
                  activeFilter === type
                    ? 'bg-forest text-white shadow-md shadow-forest/25 scale-105'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-cream-dark hover:text-forest-dark'
                }`}
            >
              {type === 'all' ? '📍' : (typeConfig[type]?.emoji || '📍')}
              {type === 'all' ? 'All Locations' : type}
            </button>
          ))}
        </div>
      )}

      {/* Map Container */}
      <div className="glass rounded-2xl overflow-hidden shadow-lg">
        <div className="relative">
          <MapContainer
            center={SHUATS_CENTER}
            zoom={16}
            style={{ height: '400px', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {filteredLocations.map((loc) => (
              <Marker
                key={loc._id}
                position={[loc.coordinates.lat, loc.coordinates.lng]}
              >
                <Popup>
                  <div className="p-1 min-w-[200px]">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-lg">
                        {typeConfig[loc.type]?.emoji || typeConfig.default.emoji}
                      </span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{loc.name}</h4>
                        {loc.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{loc.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${
                          typeConfig[loc.type]?.color || typeConfig.default.color
                        }`}
                      >
                        {loc.type}
                      </span>
                      {loc.isSafe && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                          ✅ Safe Zone
                        </span>
                      )}
                    </div>

                    {onSelectLocation && (
                      <button
                        onClick={() => onSelectLocation(loc)}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-forest text-white rounded-lg text-xs font-medium
                          hover:bg-forest-dark transition-colors cursor-pointer mt-1"
                      >
                        <FiMapPin className="w-3 h-3" />
                        Select Location
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map overlay badge */}
          <div className="absolute top-3 left-3 z-[1000] px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-md text-xs font-medium text-gray-700 flex items-center gap-1.5">
            <FiNavigation className="w-3.5 h-3.5 text-forest" />
            SHUATS Campus
          </div>
        </div>
      </div>

      {/* Location List */}
      <div className="glass rounded-2xl overflow-hidden shadow-md">
        <div className="p-4 sm:p-5 border-b border-cream-dark/50">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <FiMapPin className="w-4 h-4 text-forest" />
            Available Meetup Points
            <span className="text-xs font-normal text-gray-400">
              ({filteredLocations.length})
            </span>
          </h4>
        </div>
        <div className="divide-y divide-cream-dark/40 max-h-80 overflow-y-auto">
          {filteredLocations.length === 0 ? (
            <div className="p-8 text-center">
              <FiMapPin className="w-8 h-8 text-rose-beige mx-auto mb-2" />
              <p className="text-sm text-gray-500">No locations found for this filter</p>
            </div>
          ) : (
            filteredLocations.map((loc) => {
              const isSelected = selectedLocation?._id === loc._id;
              const config = typeConfig[loc.type] || typeConfig.default;

              return (
                <button
                  key={loc._id}
                  onClick={() => onSelectLocation && onSelectLocation(loc)}
                  disabled={!onSelectLocation}
                  className={`w-full flex items-center gap-3 p-3.5 sm:p-4 text-left transition-all duration-300
                    ${onSelectLocation ? 'cursor-pointer hover:bg-cream/60' : 'cursor-default'}
                    ${isSelected ? 'bg-forest/5 border-l-4 border-l-forest' : 'border-l-4 border-l-transparent'}
                  `}
                >
                  {/* Location emoji */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0
                      ${isSelected ? 'bg-forest/10' : 'bg-cream-dark/60'}`}
                  >
                    {config.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold line-clamp-1 ${
                          isSelected ? 'text-forest-dark' : 'text-gray-800'
                        }`}
                      >
                        {loc.name}
                      </span>
                      {loc.isSafe && <span className="text-xs">✅</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${config.color}`}
                      >
                        {loc.type}
                      </span>
                      {loc.description && (
                        <span className="text-xs text-gray-400 line-clamp-1">
                          {loc.description}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="shrink-0 animate-scale-in">
                      <FiCheckCircle className="w-5 h-5 text-forest" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetupMap;