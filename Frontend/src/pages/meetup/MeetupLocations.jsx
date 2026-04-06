import { useState, useEffect } from 'react';
import { getMeetupLocationsAPI } from '../../api/axios.js';
import MeetupMap from '../../components/meetup/MeetupMap.jsx';
import Loader from '../../components/common/Loader.jsx';
import {
  FiMapPin, FiShield, FiSun, FiUsers, FiAlertTriangle, FiClock,
  FiCheckCircle, FiEye, FiNavigation, FiInfo, FiSearch, FiFilter,
  FiStar, FiGrid, FiList, FiMap, FiTrendingUp, FiZap
} from 'react-icons/fi';

const typeConfig = {
  library: { 
    emoji: '📚', 
    label: 'Library', 
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    gradient: 'from-blue-500 to-blue-400',
    iconBg: 'bg-blue-100'
  },
  cafeteria: { 
    emoji: '☕', 
    label: 'Cafeteria', 
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    gradient: 'from-amber-500 to-amber-400',
    iconBg: 'bg-amber-100'
  },
  gate: { 
    emoji: '🚪', 
    label: 'Gate', 
    color: 'bg-gray-50 text-gray-700 border-gray-200',
    gradient: 'from-gray-500 to-gray-400',
    iconBg: 'bg-gray-100'
  },
  building: { 
    emoji: '🏢', 
    label: 'Building', 
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    gradient: 'from-purple-500 to-purple-400',
    iconBg: 'bg-purple-100'
  },
  ground: { 
    emoji: '🏟️', 
    label: 'Ground', 
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    gradient: 'from-emerald-500 to-emerald-400',
    iconBg: 'bg-emerald-100'
  },
  hostel: { 
    emoji: '🏠', 
    label: 'Hostel', 
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    gradient: 'from-rose-500 to-rose-400',
    iconBg: 'bg-rose-100'
  },
  parking: { 
    emoji: '🅿️', 
    label: 'Parking', 
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    gradient: 'from-cyan-500 to-cyan-400',
    iconBg: 'bg-cyan-100'
  },
  default: { 
    emoji: '📍', 
    label: 'Other', 
    color: 'bg-[var(--color-mint-light)] text-[var(--color-forest)] border-[var(--color-mint)]',
    gradient: 'from-[var(--color-forest)] to-[var(--color-sage)]',
    iconBg: 'bg-[var(--color-mint-light)]'
  },
};

const safetyTips = [
  {
    icon: <FiSun size={20} />,
    title: 'Meet During Daylight',
    description: 'Always schedule meetups during daylight hours for maximum visibility and safety.',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-100',
    textColor: 'text-amber-600'
  },
  {
    icon: <FiUsers size={20} />,
    title: 'Inform a Friend',
    description: 'Let a friend or roommate know about your meetup details, time, and location.',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-100',
    textColor: 'text-blue-600'
  },
  {
    icon: <FiEye size={20} />,
    title: 'Verify Before Paying',
    description: 'Carefully inspect the item and verify its condition before completing the transaction.',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-100',
    textColor: 'text-emerald-600'
  },
  {
    icon: <FiShield size={20} />,
    title: 'Stay in Public Areas',
    description: 'Choose locations with security personnel nearby and avoid isolated spots.',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    iconBg: 'bg-purple-100',
    textColor: 'text-purple-600'
  },
  {
    icon: <FiClock size={20} />,
    title: 'Avoid Late Hours',
    description: 'Never schedule meetups late at night. Stick to campus operating hours.',
    color: 'bg-red-50 text-red-700 border-red-200',
    iconBg: 'bg-red-100',
    textColor: 'text-red-600'
  },
  {
    icon: <FiCheckCircle size={20} />,
    title: 'Use Safe Zones',
    description: 'Prefer marked safe zones with high foot traffic and good lighting.',
    color: 'bg-[var(--color-mint-light)] text-[var(--color-forest)] border-[var(--color-mint)]',
    iconBg: 'bg-[var(--color-mint)]',
    textColor: 'text-[var(--color-forest)]'
  },
];

const MeetupLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => { fetchLocations(); }, []);

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
  const popularLocation = locations.reduce((max, loc) => 
    (loc.usageCount || 0) > (max.usageCount || 0) ? loc : max, locations[0]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)]">

      {/* ═══════════════════════════════════════════════════════
          HERO HEADER
          ═══════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-[var(--color-forest-dark)] mb-8 py-20">
        {/* Animated Map Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-16 w-48 h-48 border-4 border-white rounded-full animate-pulse-soft" />
          <div className="absolute top-24 right-32 w-32 h-32 border-4 border-white rounded-full animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-12 left-16 w-40 h-40 border-4 border-white rounded-full animate-pulse-soft" style={{ animationDelay: '1s' }} />
          <div className="absolute top-16 left-1/3 w-20 h-20 border-4 border-white rounded-full animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
          {/* Grid lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            
            {/* Left Content */}
            <div className="flex-1 animate-slide-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-sage)]/20 
                            backdrop-blur-sm rounded-full border border-[var(--color-mint)]/30 mb-4">
                <FiNavigation size={14} className="text-[var(--color-mint)] animate-pulse-soft" />
                <span className="text-[var(--color-mint-light)] text-sm font-medium">
                  Campus Resources
                </span>
              </div>

              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm
                              flex items-center justify-center border-2 border-white/20 shadow-2xl">
                  <FiMapPin size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 leading-tight">
                    Campus Meetup
                    <span className="block text-[var(--color-mint-light)] mt-1">
                      Locations
                    </span>
                  </h1>
                  <p className="text-[var(--color-cream)] text-base leading-relaxed max-w-2xl">
                    Safe and recommended meetup points within SHUATS campus for secure item exchanges
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl 
                              bg-white/10 backdrop-blur-sm border border-white/20">
                  <FiMap size={16} className="text-[var(--color-mint)]" />
                  <span className="text-white text-sm font-medium">
                    {locations.length} Locations
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl 
                              bg-white/10 backdrop-blur-sm border border-white/20">
                  <FiShield size={16} className="text-[var(--color-mint)]" />
                  <span className="text-white text-sm font-medium">
                    {safeCount} Safe Zones
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl 
                              bg-white/10 backdrop-blur-sm border border-white/20">
                  <FiUsers size={16} className="text-[var(--color-mint)]" />
                  <span className="text-white text-sm font-medium">
                    {totalUsage} Total Meetups
                  </span>
                </div>
              </div>
            </div>

            {/* Right Stats Cards */}
            <div className="hidden lg:flex flex-col gap-4 animate-scale-in">
              {[
                { 
                  value: locations.length, 
                  label: 'Total Locations', 
                  icon: <FiMapPin size={24} />,
                  color: 'from-[var(--color-forest)] to-[var(--color-sage)]'
                },
                { 
                  value: safeCount, 
                  label: 'Safe Zones', 
                  icon: <FiShield size={24} />,
                  color: 'from-emerald-500 to-emerald-400'
                },
                { 
                  value: totalUsage, 
                  label: 'Total Meetups', 
                  icon: <FiTrendingUp size={24} />,
                  color: 'from-blue-500 to-blue-400'
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{ animationDelay: `${i * 0.1}s` }}
                  className="animate-slide-left bg-white/10 backdrop-blur-sm 
                           rounded-2xl p-4 border border-white/20 min-w-[200px]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color}
                                  flex items-center justify-center text-white shadow-lg`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-white/70">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" 
               className="w-full h-auto">
            <path d="M0 48L60 42C120 36 240 24 360 20C480 16 600 20 720 28C840 36 960 48 1080 50C1200 52 1320 44 1380 40L1440 36V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V48Z" 
                  fill="var(--color-cream-light)"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 -mt-12 relative z-20">

        {/* ═══════════════════════════════════════════════════════
            INTERACTIVE MAP SECTION
            ═══════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-[var(--color-rose-beige)]/30 
                      p-6 mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-mint-light)] 
                            flex items-center justify-center text-[var(--color-forest)]">
                <FiMap size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Interactive Campus Map</h2>
            </div>
            
            {selectedLocation && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl 
                            bg-[var(--color-mint-light)] border-2 border-[var(--color-mint)]/40
                            animate-scale-in">
                <FiCheckCircle size={16} className="text-[var(--color-forest)]" />
                <span className="text-sm font-semibold text-[var(--color-forest)]">
                  {selectedLocation.name}
                </span>
              </div>
            )}
          </div>

          <MeetupMap
            onSelectLocation={(loc) => setSelectedLocation(loc)}
            selectedLocation={selectedLocation}
          />

          {/* Map Legend */}
          <div className="mt-6 p-4 rounded-2xl bg-[var(--color-cream)]/50">
            <p className="text-xs font-bold text-gray-700 mb-3">Map Legend</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-gray-600">Safe Zone</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs text-gray-600">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[var(--color-forest)]" />
                <span className="text-xs text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs text-gray-600">Popular</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SEARCH & FILTER BAR
            ═══════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl shadow-lg border-2 border-[var(--color-rose-beige)]/30 
                      p-5 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          
          {/* Search & View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 mb-5">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search locations by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[var(--color-cream)] 
                         border-2 border-[var(--color-rose-beige)]/50 rounded-xl text-sm
                         focus:border-[var(--color-sage)] focus:ring-2 focus:ring-[var(--color-sage)]/20 
                         outline-none transition-all placeholder-gray-400"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 p-1.5 bg-[var(--color-cream)] 
                          rounded-xl border-2 border-[var(--color-rose-beige)]/30">
              <button
                onClick={() => setViewMode('grid')}
                className={`
                  p-2.5 rounded-lg transition-all duration-300 cursor-pointer
                  ${viewMode === 'grid'
                    ? 'bg-[var(--color-forest)] text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-white'
                  }
                `}
                title="Grid View"
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`
                  p-2.5 rounded-lg transition-all duration-300 cursor-pointer
                  ${viewMode === 'list'
                    ? 'bg-[var(--color-forest)] text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-white'
                  }
                `}
                title="List View"
              >
                <FiList size={18} />
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <FiFilter size={16} className="text-[var(--color-forest)]" />
              <span className="text-sm font-bold text-gray-800">Filter by Type:</span>
            </div>
            
            {locationTypes.map((type) => {
              const config = typeConfig[type] || typeConfig.default;
              return (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-xl 
                    text-sm font-semibold transition-all duration-300 cursor-pointer
                    border-2 capitalize
                    ${activeFilter === type
                      ? 'bg-[var(--color-forest)] text-white border-[var(--color-forest)] shadow-lg scale-105'
                      : 'bg-white text-gray-700 border-[var(--color-rose-beige)]/50 hover:border-[var(--color-forest)] hover:bg-[var(--color-mint-light)]'
                    }
                  `}
                >
                  <span className="text-base">{type === 'all' ? '🗺️' : config.emoji}</span>
                  {type === 'all' ? 'All Locations' : config.label || type}
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-bold
                    ${activeFilter === type ? 'bg-white/20' : 'bg-[var(--color-mint-light)]'}
                  `}>
                    {type === 'all' 
                      ? locations.length 
                      : locations.filter(l => l.type === type).length
                    }
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Search/Filter Indicator */}
          {(searchTerm || activeFilter !== 'all') && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-[var(--color-cream-dark)] animate-fade-in">
              <span className="text-sm font-semibold text-gray-600">Showing:</span>
              <span className="px-3 py-1.5 rounded-xl bg-[var(--color-mint-light)] 
                             text-[var(--color-forest)] text-sm font-semibold">
                {filteredLocations.length} {filteredLocations.length === 1 ? 'location' : 'locations'}
              </span>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('all');
                }}
                className="ml-auto text-sm font-semibold text-red-600 hover:text-red-700
                         cursor-pointer transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════
            LOCATIONS GRID/LIST
            ═══════════════════════════════════════════════════════ */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Meetup Locations ({filteredLocations.length})
            </h2>
            
            {popularLocation && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl 
                            bg-amber-50 border-2 border-amber-200">
                <FiZap size={16} className="text-amber-600" />
                <span className="text-sm font-semibold text-amber-700">
                  Most Popular: {popularLocation.name}
                </span>
              </div>
            )}
          </div>

          {filteredLocations.length === 0 ? (
            /* EMPTY STATE */
            <div className="bg-white rounded-3xl p-16 text-center shadow-lg 
                          border-2 border-[var(--color-rose-beige)]/30 animate-scale-in">
              <div className="w-24 h-24 bg-[var(--color-mint-light)] rounded-full 
                            flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FiMapPin size={48} className="text-[var(--color-forest)]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Locations Found</h3>
              <p className="text-gray-500 text-base max-w-md mx-auto mb-6">
                {searchTerm
                  ? `No meetup points match "${searchTerm}". Try a different search term.`
                  : 'No locations available for the selected filter.'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('all');
                }}
                className="px-6 py-3 bg-[var(--color-forest)] text-white rounded-xl 
                         font-semibold hover:bg-[var(--color-forest-dark)] 
                         cursor-pointer transition-all hover:scale-105"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredLocations.map((loc, index) => {
                const config = typeConfig[loc.type] || typeConfig.default;
                const isSelected = selectedLocation?._id === loc._id;
                const popularityPercent = Math.min(100, ((loc.usageCount || 0) / Math.max(...locations.map(l => l.usageCount || 1))) * 100);

                return viewMode === 'grid' ? (
                  /* GRID VIEW */
                  <div
                    key={loc._id}
                    onClick={() => setSelectedLocation(loc)}
                    style={{ animationDelay: `${index * 60}ms` }}
                    className={`
                      group bg-white rounded-3xl overflow-hidden shadow-lg
                      border-2 cursor-pointer transition-all duration-300
                      hover:shadow-2xl hover:-translate-y-1 animate-slide-up
                      ${isSelected
                        ? 'border-[var(--color-forest)] ring-2 ring-[var(--color-forest)]/20 scale-105'
                        : 'border-[var(--color-rose-beige)]/30 hover:border-[var(--color-mint)]'
                      }
                    `}
                  >
                    {/* Top Gradient Bar */}
                    <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />

                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 z-10 animate-scale-in">
                        <div className="p-2 bg-[var(--color-forest)] text-white rounded-full shadow-lg">
                          <FiCheckCircle size={18} />
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`
                          w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
                          shadow-lg transition-transform duration-300
                          ${config.iconBg}
                          ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
                        `}>
                          {config.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-1 
                                       group-hover:text-[var(--color-forest)] transition-colors
                                       line-clamp-1">
                            {loc.name}
                          </h3>
                          <span className={`
                            inline-flex items-center px-3 py-1 rounded-full 
                            text-xs font-bold border-2 capitalize ${config.color}
                          `}>
                            {config.label || loc.type}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      {loc.description && (
                        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                          {loc.description}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-4 
                                    border-t-2 border-[var(--color-cream-dark)] mb-3">
                        {loc.isSafe && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 
                                       bg-emerald-50 text-emerald-700 rounded-xl 
                                       text-xs font-bold border-2 border-emerald-200">
                            <FiShield size={14} />
                            Safe Zone
                          </span>
                        )}
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <FiUsers size={14} />
                          <span className="font-medium">{loc.usageCount || 0}</span>
                        </div>
                      </div>

                      {/* Popularity Bar */}
                      {loc.usageCount > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500">Popularity</span>
                            <span className="text-xs font-bold text-[var(--color-forest)]">
                              {Math.round(popularityPercent)}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-[var(--color-cream)] rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${config.gradient} rounded-full 
                                       transition-all duration-700`}
                              style={{ width: `${popularityPercent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* LIST VIEW */
                  <div
                    key={loc._id}
                    onClick={() => setSelectedLocation(loc)}
                    style={{ animationDelay: `${index * 40}ms` }}
                    className={`
                      group bg-white rounded-2xl p-5 shadow-md
                      border-2 cursor-pointer transition-all duration-300
                      hover:shadow-xl animate-slide-up
                      ${isSelected
                        ? 'border-[var(--color-forest)] bg-[var(--color-mint-light)]/20'
                        : 'border-[var(--color-rose-beige)]/30 hover:border-[var(--color-mint)]'
                      }
                    `}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
                        shadow-md transition-transform duration-300
                        ${config.iconBg}
                        ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
                      `}>
                        {config.emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 
                                       group-hover:text-[var(--color-forest)] transition-colors">
                            {loc.name}
                          </h3>
                          {isSelected && (
                            <FiCheckCircle size={20} className="text-[var(--color-forest)] animate-scale-in" />
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className={`
                            inline-flex items-center px-3 py-1 rounded-xl 
                            text-xs font-bold border-2 capitalize ${config.color}
                          `}>
                            {config.label || loc.type}
                          </span>
                          {loc.isSafe && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 
                                         bg-emerald-50 text-emerald-700 rounded-xl 
                                         text-xs font-bold border-2 border-emerald-200">
                              <FiShield size={12} />
                              Safe Zone
                            </span>
                          )}
                          <span className="flex items-center gap-1.5 text-sm text-gray-500">
                            <FiUsers size={14} />
                            {loc.usageCount || 0} meetups
                          </span>
                        </div>

                        {loc.description && (
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-1">
                            {loc.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════
            SAFETY TIPS SECTION
            ═══════════════════════════════════════════════════════ */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 
                          flex items-center justify-center shadow-lg">
              <FiAlertTriangle size={24} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Safety Guidelines</h2>
              <p className="text-gray-500 text-sm mt-1">
                Follow these essential tips for secure campus transactions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {safetyTips.map((tip, index) => (
              <div
                key={index}
                style={{ animationDelay: `${250 + index * 70}ms` }}
                className={`
                  group rounded-3xl p-6 border-2 transition-all duration-300
                  hover:shadow-xl hover:-translate-y-1 animate-slide-up
                  ${tip.color}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    p-3 ${tip.iconBg} rounded-2xl shadow-md
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    <div className={tip.textColor}>
                      {tip.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {tip.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Safety Notice Banner */}
          <div className="p-6 bg-gradient-to-r from-[var(--color-mint-light)]/50 to-[var(--color-sage)]/20 
                        rounded-3xl border-2 border-[var(--color-mint)] animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-forest)] 
                            flex items-center justify-center shadow-lg flex-shrink-0">
                <FiInfo size={24} className="text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[var(--color-forest-dark)] mb-2">
                  Report Unsafe Locations
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  If you encounter any safety concerns at a meetup location, please report it
                  immediately to campus security or use our in-app reporting feature. Your
                  safety is our top priority, and your feedback helps us maintain a secure
                  campus marketplace environment.
                </p>
                <button className="mt-4 px-5 py-2.5 rounded-xl bg-[var(--color-forest)] 
                                 text-white font-semibold hover:bg-[var(--color-forest-dark)]
                                 cursor-pointer transition-all hover:scale-105 shadow-lg">
                  Report a Safety Concern
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetupLocations;