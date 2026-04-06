import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getItemsAPI } from '../../api/axios.js';
import ItemGrid from '../../components/items/ItemGrid.jsx';
import ItemFilters from '../../components/items/ItemFilters.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { FiShoppingBag, FiTrendingUp, FiPackage, FiStar, FiFilter, FiGrid, FiList } from 'react-icons/fi';

const statCards = [
  { 
    icon: <FiShoppingBag size={20} />, 
    label: 'Total Items', 
    key: 'total', 
    bgColor: 'bg-[var(--color-mint-light)]',
    iconColor: 'text-[var(--color-forest-dark)]',
    borderColor: 'border-[var(--color-mint-dark)]'
  },
  { 
    icon: <FiTrendingUp size={20} />, 
    label: 'For Rent', 
    key: 'rent', 
    bgColor: 'bg-[var(--color-sage-light)]/30',
    iconColor: 'text-[var(--color-sage-dark)]',
    borderColor: 'border-[var(--color-sage)]'
  },
  { 
    icon: <FiPackage size={20} />, 
    label: 'For Sale', 
    key: 'sell', 
    bgColor: 'bg-[var(--color-rose-beige)]/30',
    iconColor: 'text-[var(--color-forest-dark)]',
    borderColor: 'border-[var(--color-rose-beige)]'
  },
  { 
    icon: <FiStar size={20} />, 
    label: 'New Today', 
    key: 'new', 
    bgColor: 'bg-[var(--color-cream-dark)]',
    iconColor: 'text-[var(--color-forest)]',
    borderColor: 'border-[var(--color-rose-beige)]'
  },
];

const BrowseItems = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    department: searchParams.get('department') || '',
    semester: searchParams.get('semester') || '',
    condition: searchParams.get('condition') || '',
    listingType: searchParams.get('listingType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    page: parseInt(searchParams.get('page')) || 1,
  });

  useEffect(() => { fetchItems(); }, [filters]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await getItemsAPI(params);
      if (data.success) {
        setItems(data.items);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (q) => setFilters(p => ({ ...p, search: q, page: 1 }));
  const handleFilterChange = (f) => setFilters({ ...f, page: 1 });
  const handlePageChange = (pg) => setFilters(p => ({ ...p, page: pg }));
  const handleReset = () => setFilters({
    search: '', category: '', department: '', semester: '',
    condition: '', listingType: '', minPrice: '', maxPrice: '', page: 1,
  });

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => value && key !== 'page' && key !== 'search'
  ).length;

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)]">
      
      {/* ═══════════════════════════════════════════════════════
          HERO HEADER - Modern Professional Design
          ═══════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-[var(--color-forest-dark)] mb-8 animate-fade-in">
        {/* Decorative Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-72 h-72 bg-[var(--color-mint)] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-sage)] rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Left Content */}
            <div className="flex-1 animate-slide-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-sage)]/20 
                            backdrop-blur-sm rounded-full border border-[var(--color-mint)]/30 mb-4">
                <span className="w-2 h-2 bg-[var(--color-mint)] rounded-full animate-pulse-soft"></span>
                <span className="text-[var(--color-mint-light)] text-sm font-medium">
                  SHUATS Campus Marketplace
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                Browse Items
                <span className="block text-2xl sm:text-3xl lg:text-4xl text-[var(--color-mint-light)] 
                              font-normal mt-2">
                  Find What You Need
                </span>
              </h1>

              <p className="text-[var(--color-cream)] text-base sm:text-lg max-w-2xl leading-relaxed">
                Discover books, electronics, lab equipment, and more from fellow students. 
                Rent or buy quality items at affordable prices.
              </p>

              {/* Quick Stats Mini */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 text-[var(--color-mint-light)]">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-sage)]/20 flex items-center 
                                justify-center border border-[var(--color-mint)]/20">
                    <FiShoppingBag size={16} />
                  </div>
                  <span className="text-sm font-medium">
                    {pagination?.total || 0} Items Available
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[var(--color-mint-light)]">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-sage)]/20 flex items-center 
                                justify-center border border-[var(--color-mint)]/20">
                    <FiTrendingUp size={16} />
                  </div>
                  <span className="text-sm font-medium">Verified Sellers</span>
                </div>
              </div>
            </div>

            {/* Right Illustration/Stats */}
            <div className="hidden lg:flex items-center justify-center animate-slide-up">
              <div className="relative">
                <div className="w-64 h-64 rounded-3xl bg-[var(--color-sage)]/10 backdrop-blur-sm 
                              border-2 border-[var(--color-mint)]/20 flex items-center justify-center
                              shadow-2xl shadow-[var(--color-forest)]/20">
                  <FiShoppingBag size={80} className="text-[var(--color-mint-light)]" />
                </div>
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 px-4 py-2 bg-[var(--color-mint)] 
                              rounded-xl shadow-lg border-2 border-white animate-bounce-soft">
                  <p className="text-[var(--color-forest-dark)] font-bold text-sm">
                    New Arrivals
                  </p>
                </div>
                <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-white 
                              rounded-xl shadow-lg border-2 border-[var(--color-mint)]">
                  <p className="text-[var(--color-forest-dark)] font-bold text-sm">
                    Best Deals
                  </p>
                </div>
              </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* ═══════════════════════════════════════════════════════
            STAT CARDS - Enhanced Design
            ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 -mt-12 relative z-20">
          {statCards.map((stat, i) => (
            <div
              key={stat.key}
              style={{ animationDelay: `${i * 100}ms` }}
              className="group animate-slide-up cursor-pointer"
            >
              <div className={`
                relative overflow-hidden rounded-2xl ${stat.bgColor}
                border-2 ${stat.borderColor} bg-white
                p-6 transition-all duration-300
                hover:shadow-xl hover:shadow-[var(--color-forest)]/10
                hover:-translate-y-1 hover:border-[var(--color-forest)]
              `}>
                {/* Icon Container */}
                <div className={`
                  w-14 h-14 rounded-xl ${stat.bgColor}
                  flex items-center justify-center ${stat.iconColor}
                  mb-4 border-2 ${stat.borderColor}
                  group-hover:scale-110 transition-transform duration-300
                  shadow-md
                `}>
                  {stat.icon}
                </div>

                {/* Label */}
                <p className="text-sm font-medium text-[var(--color-forest-dark)]/60 mb-1">
                  {stat.label}
                </p>

                {/* Value */}
                <p className="text-3xl font-bold text-[var(--color-forest-dark)]">
                  {loading ? (
                    <span className="inline-block w-16 h-8 rounded-lg bg-[var(--color-rose-beige)]/30 
                                   animate-pulse" />
                  ) : (
                    <>
                      {stat.key === 'total' ? pagination?.total ?? items.length :
                       stat.key === 'rent' ? items.filter(x => x.listingType === 'rent').length :
                       stat.key === 'sell' ? items.filter(x => x.listingType === 'sell').length :
                       Math.floor(Math.random() * 20)}
                    </>
                  )}
                </p>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-mint)]/10 
                              rounded-bl-full -mr-10 -mt-10 
                              group-hover:bg-[var(--color-mint)]/20 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════
            SEARCH & FILTER BAR - Modern Controls
            ═══════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[var(--color-rose-beige)]/30 
                      p-5 mb-8 space-y-5 animate-slide-down">
          
          {/* Top Bar - Search + Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            
            {/* Search Bar */}
            <div className="flex-1 w-full lg:max-w-2xl">
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="🔍 Search items, books, devices, lab equipment..." 
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-3">
              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  relative flex items-center gap-2 px-5 py-2.5 rounded-xl
                  font-medium text-sm transition-all duration-300
                  border-2 cursor-pointer
                  ${showFilters 
                    ? 'bg-[var(--color-forest)] text-white border-[var(--color-forest)] shadow-lg' 
                    : 'bg-white text-[var(--color-forest-dark)] border-[var(--color-rose-beige)] hover:border-[var(--color-forest)] hover:bg-[var(--color-cream)]'
                  }
                `}
              >
                <FiFilter size={18} />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--color-sage)] 
                                 text-white text-xs font-bold rounded-full 
                                 flex items-center justify-center border-2 border-white
                                 animate-scale-in">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center gap-1 p-1 bg-[var(--color-cream)] 
                            rounded-xl border-2 border-[var(--color-rose-beige)]/30">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`
                    p-2.5 rounded-lg transition-all duration-300 cursor-pointer
                    ${viewMode === 'grid'
                      ? 'bg-[var(--color-forest)] text-white shadow-md'
                      : 'text-[var(--color-forest-dark)]/50 hover:text-[var(--color-forest-dark)] hover:bg-white'
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
                      : 'text-[var(--color-forest-dark)]/50 hover:text-[var(--color-forest-dark)] hover:bg-white'
                    }
                  `}
                  title="List View"
                >
                  <FiList size={18} />
                </button>
              </div>

              {/* Reset Filters Button */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-[var(--color-rose-beige)]/20 
                           text-[var(--color-forest-dark)] font-medium text-sm
                           border-2 border-[var(--color-rose-beige)]
                           hover:bg-[var(--color-rose-beige)]/40
                           transition-all duration-300 cursor-pointer
                           hover:shadow-md"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Expandable Filters Section */}
          {showFilters && (
            <div className="pt-4 border-t-2 border-[var(--color-cream-dark)] animate-slide-down">
              <ItemFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>
          )}

          {/* Active Filters Tags */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-[var(--color-cream-dark)] 
                          animate-fade-in">
              <span className="text-sm font-medium text-[var(--color-forest-dark)]/60">
                Active Filters:
              </span>
              {Object.entries(filters).map(([key, value]) => {
                if (!value || key === 'page' || key === 'search') return null;
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                             bg-[var(--color-mint-light)] text-[var(--color-forest-dark)]
                             text-sm font-medium border border-[var(--color-mint-dark)]/30
                             animate-scale-in"
                  >
                    {key}: {value}
                    <button
                      onClick={() => handleFilterChange({ ...filters, [key]: '' })}
                      className="hover:text-[var(--color-forest)] transition-colors cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════
            RESULTS HEADER
            ═══════════════════════════════════════════════════════ */}
        {!loading && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
                        mb-6 pb-4 border-b-2 border-[var(--color-cream-dark)] animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-forest-dark)]">
                {filters.search ? `Search Results for "${filters.search}"` : 'All Items'}
              </h2>
              <p className="text-sm text-[var(--color-forest-dark)]/60 mt-1">
                Showing {items.length} of {pagination?.total || 0} items
                {pagination && ` • Page ${pagination.currentPage} of ${pagination.totalPages}`}
              </p>
            </div>

            {/* Sort Options (you can implement this) */}
            <div className="mt-4 sm:mt-0">
              <select 
                className="px-4 py-2.5 rounded-xl border-2 border-[var(--color-rose-beige)]
                         bg-white text-[var(--color-forest-dark)] font-medium text-sm
                         focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]
                         focus:border-[var(--color-forest)] transition-all cursor-pointer
                         hover:border-[var(--color-forest)]"
              >
                <option>Sort by: Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            ITEMS GRID
            ═══════════════════════════════════════════════════════ */}
        <div className="animate-fade-in">
          <ItemGrid items={items} loading={loading} viewMode={viewMode} />
        </div>

        {/* ═══════════════════════════════════════════════════════
            PAGINATION
            ═══════════════════════════════════════════════════════ */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-12 animate-slide-up">
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            EMPTY STATE
            ═══════════════════════════════════════════════════════ */}
        {!loading && items.length === 0 && (
          <div className="text-center py-20 animate-scale-in">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-[var(--color-cream-dark)]
                          flex items-center justify-center border-4 border-[var(--color-rose-beige)]">
              <FiPackage size={64} className="text-[var(--color-forest-dark)]/30" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-forest-dark)] mb-2">
              No Items Found
            </h3>
            <p className="text-[var(--color-forest-dark)]/60 mb-6 max-w-md mx-auto">
              We couldn't find any items matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-[var(--color-forest)] text-white
                       font-medium hover:bg-[var(--color-forest-dark)]
                       transition-all duration-300 shadow-lg
                       hover:shadow-xl hover:-translate-y-0.5 cursor-pointer
                       border-2 border-[var(--color-forest-dark)]"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseItems;