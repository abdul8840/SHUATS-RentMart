// MeetupLocations.jsx
import { useState, useEffect } from 'react';
import { getMeetupLocationsAPI } from '../../api/axios.js';
import MeetupMap from '../../components/meetup/MeetupMap.jsx';
import Loader from '../../components/common/Loader.jsx';
import {
  FiMapPin,
  FiShield,
  FiSun,
  FiUsers,
  FiAlertTriangle,
  FiClock,
  FiCheckCircle,
  FiEye,
  FiNavigation,
  FiInfo,
  FiSearch,
  FiFilter,
  FiStar,
} from 'react-icons/fi';

const typeConfig = {
  library: { emoji: '📚', label: 'Library', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  cafeteria: { emoji: '☕', label: 'Cafeteria', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  gate: { emoji: '🚪', label: 'Gate', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  building: { emoji: '🏢', label: 'Building', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  ground: { emoji: '🏟️', label: 'Ground', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  hostel: { emoji: '🏠', label: 'Hostel', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  parking: { emoji: '🅿️', label: 'Parking', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  default: { emoji: '📍', label: 'Other', color: 'bg-cream-dark text-gray-700 border-cream' },
};

const safetyTips = [
  {
    icon: <FiSun className="w-5 h-5" />,
    title: 'Meet During Daylight',
    description: 'Always schedule meetups during daylight hours for maximum visibility and safety.',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    iconBg: 'bg-amber-100',
  },
  {
    icon: <FiUsers className="w-5 h-5" />,
    title: 'Inform a Friend',
    description: 'Let a friend or roommate know about your meetup details, time, and location.',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    iconBg: 'bg-blue-100',
  },
  {
    icon: <FiEye className="w-5 h-5" />,
    title: 'Verify Before Paying',
    description: 'Carefully inspect the item and verify its condition before completing the transaction.',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    iconBg: 'bg-emerald-100',
  },
  {
    icon: <FiShield className="w-5 h-5" />,
    title: 'Stay in Public Areas',
    description: 'Choose locations with security personnel nearby and avoid isolated spots.',
    color: 'bg-purple-50 text-purple-600 border-purple-100',
    iconBg: 'bg-purple-100',
  },
  {
    icon: <FiClock className="w-5 h-5" />,
    title: 'Avoid Late Hours',
    description: 'Never schedule meetups late at night. Stick to campus operating hours.',
    color: 'bg-red-50 text-red-600 border-red-100',
    iconBg: 'bg-red-100',
  },
  {
    icon: <FiCheckCircle className="w-5 h-5" />,
    title: 'Use Safe Zones',
    description: 'Prefer marked safe zones with high foot traffic and good lighting.',
    color: 'bg-forest/5 text-forest border-forest/10',
    iconBg: 'bg-forest/10',
  },
];

const MeetupLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data } = await getMeetupLocationsAPI();
      if (data.success) setLocations(data.locations);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const locationTypes = ['all', ...new Set(locations.map((loc) => loc.type).filter(Boolean))];

  const filteredLocations = locations.filter((loc) => {
    const matchesSearch =
      !searchTerm ||
      loc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || loc.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const safeCount = locations.filter((l) => l.isSafe).length;
  const totalUsage = locations.reduce((sum, l) => sum + (l.usageCount || 0), 0);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-cream-light">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest-dark to-sage opacity-95" />
        {/* Decorative map pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-8 right-16 w-48 h-48 border-4 border-white rounded-full" />
          <div className="absolute top-24 right-32 w-32 h-32 border-4 border-white rounded-full" />
          <div className="absolute bottom-12 left-16 w-40 h-40 border-4 border-white rounded-full" />
          <div className="absolute top-16 left-1/3 w-20 h-20 border-4 border-white rounded-full" />
          {/* Grid lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-20 sm:pb-28">
          <div className="animate-fade-in">
            {/* Breadcrumb */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/70 text-xs font-medium mb-6">
              <FiNavigation className="w-3 h-3" />
              Campus Resources
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <FiMapPin className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                    Campus Meetup
                    <br className="sm:hidden" />
                    <span className="text-mint"> Locations</span>
                  </h1>
                </div>
                <p className="text-white/75 text-sm sm:text-base max-w-xl ml-16 leading-relaxed">
                  Safe and recommended meetup points within SHUATS campus for secure item exchanges
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-4 sm:gap-6 ml-16 lg:ml-0">
                {[
                  { value: locations.length, label: 'Locations', icon: '📍' },
                  { value: safeCount, label: 'Safe Zones', icon: '✅' },
                  { value: totalUsage, label: 'Total Meetups', icon: '🤝' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="animate-slide-up"
                    style={{ animationDelay: `${0.2 + i * 0.1}s`, animationFillMode: 'both' }}
                  >
                    <div className="px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 text-center">
                      <p className="text-xs text-white/60 mb-0.5">{stat.icon} {stat.label}</p>
                      <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path
              d="M0 60L80 50C160 40 320 20 480 15C640 10 800 20 960 25C1120 30 1280 30 1360 30L1440 30V60H0Z"
              fill="var(--color-cream-light)"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 pb-16">
        {/* Map Section */}
        <div className="mb-8 sm:mb-10 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <MeetupMap
            onSelectLocation={(loc) => setSelectedLocation(loc)}
            selectedLocation={selectedLocation}
          />
        </div>

        {/* Locations Grid Section */}
        <div className="mb-12 sm:mb-16">
          {/* Section Header with Search & Filters */}
          <div className="glass rounded-2xl p-4 sm:p-5 mb-6 shadow-lg animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className="flex flex-col gap-4">
              {/* Title & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FiMapPin className="w-5 h-5 text-forest" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    All Campus Meetup Points
                  </h2>
                  <span className="px-2 py-0.5 bg-forest/10 text-forest text-xs font-bold rounded-full">
                    {filteredLocations.length}
                  </span>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border-2 border-cream-dark rounded-xl text-sm
                      focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all
                      placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mr-1">
                  <FiFilter className="w-3.5 h-3.5" />
                  Filter:
                </span>
                {locationTypes.map((type) => {
                  const config = typeConfig[type] || typeConfig.default;
                  return (
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
                      {type === 'all' ? '📍' : config.emoji}
                      {type === 'all' ? 'All' : config.label || type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Location Cards Grid */}
          {filteredLocations.length === 0 ? (
            <div className="glass rounded-2xl p-10 sm:p-16 text-center animate-scale-in shadow-md">
              <div className="w-20 h-20 bg-cream-dark rounded-full flex items-center justify-center mx-auto mb-5">
                <FiMapPin className="w-10 h-10 text-rose-beige" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No locations found</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                {searchTerm
                  ? `No meetup points match "${searchTerm}". Try a different search term.`
                  : 'No locations available for the selected filter.'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('all');
                }}
                className="mt-5 px-5 py-2 bg-forest text-white rounded-xl text-sm font-medium hover:bg-forest-dark transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredLocations.map((loc, index) => {
                const config = typeConfig[loc.type] || typeConfig.default;
                const isSelected = selectedLocation?._id === loc._id;

                return (
                  <div
                    key={loc._id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`glass rounded-2xl overflow-hidden shadow-md card-hover cursor-pointer animate-slide-up relative group
                      ${isSelected ? 'ring-2 ring-forest ring-offset-2 ring-offset-cream-light' : ''}
                    `}
                    style={{ animationDelay: `${index * 0.06}s`, animationFillMode: 'both' }}
                  >
                    {/* Top accent gradient */}
                    <div className="h-1.5 bg-gradient-to-r from-forest via-sage to-mint" />

                    {/* Selected badge */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 z-10 animate-scale-in">
                        <div className="p-1.5 bg-forest text-white rounded-full shadow-md">
                          <FiCheckCircle className="w-4 h-4" />
                        </div>
                      </div>
                    )}

                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-300 group-hover:scale-110
                            ${isSelected ? 'bg-forest/10' : 'bg-cream-dark/60'}`}
                        >
                          {config.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-forest transition-colors">
                            {loc.name}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${config.color}`}
                          >
                            {config.label || loc.type}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      {loc.description && (
                        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                          {loc.description}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-cream-dark/50">
                        <div className="flex items-center gap-3">
                          {loc.isSafe && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-semibold border border-emerald-200">
                              <FiShield className="w-3 h-3" />
                              Safe Zone
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <FiUsers className="w-3 h-3" />
                          <span>{loc.usageCount || 0} meetups</span>
                        </div>
                      </div>

                      {/* Popularity bar */}
                      {loc.usageCount > 0 && (
                        <div className="mt-3">
                          <div className="w-full h-1 bg-cream-dark rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-forest to-sage rounded-full transition-all duration-700"
                              style={{
                                width: `${Math.min(100, ((loc.usageCount || 0) / Math.max(...locations.map((l) => l.usageCount || 1))) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Safety Tips Section */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-amber-100 rounded-xl">
              <FiAlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Safety Tips</h2>
              <p className="text-gray-500 text-sm mt-0.5">
                Follow these guidelines for safe transactions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {safetyTips.map((tip, index) => (
              <div
                key={index}
                className={`rounded-2xl p-5 border ${tip.color} card-hover animate-slide-up group`}
                style={{ animationDelay: `${0.35 + index * 0.07}s`, animationFillMode: 'both' }}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 ${tip.iconBg} rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {tip.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{tip.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Safety notice banner */}
          <div className="mt-6 p-4 sm:p-5 bg-gradient-to-r from-forest/5 to-sage/5 rounded-2xl border border-forest/10 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-forest/10 rounded-xl shrink-0">
                <FiInfo className="w-5 h-5 text-forest" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-forest-dark mb-1">
                  Report Unsafe Locations
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  If you encounter any safety concerns at a meetup location, please report it
                  immediately to the campus security or use our in-app reporting feature. Your
                  safety is our top priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetupLocations;