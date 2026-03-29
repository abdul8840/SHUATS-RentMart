import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getItemsAPI } from '../../api/axios.js';
import ItemGrid from '../../components/items/ItemGrid.jsx';
import ItemFilters from '../../components/items/ItemFilters.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { FiShoppingBag, FiTrendingUp, FiPackage, FiStar } from 'react-icons/fi';

const statCards = [
  { icon: <FiShoppingBag size={18} />, label: 'Total Items', key: 'total', color: 'from-[var(--color-forest)] to-[var(--color-sage)]' },
  { icon: <FiTrendingUp size={18} />, label: 'For Rent', key: 'rent', color: 'from-blue-500 to-blue-400' },
  { icon: <FiPackage size={18} />, label: 'For Sale', key: 'sell', color: 'from-amber-500 to-amber-400' },
  { icon: <FiStar size={18} />, label: 'New Today', key: 'new', color: 'from-purple-500 to-purple-400' },
];

const BrowseItems = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems]           = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [filters, setFilters]       = useState({
    search:      searchParams.get('search')      || '',
    category:    searchParams.get('category')    || '',
    department:  searchParams.get('department')  || '',
    semester:    searchParams.get('semester')    || '',
    condition:   searchParams.get('condition')   || '',
    listingType: searchParams.get('listingType') || '',
    minPrice:    searchParams.get('minPrice')    || '',
    maxPrice:    searchParams.get('maxPrice')    || '',
    page:        parseInt(searchParams.get('page')) || 1,
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

  const handleSearch       = (q)  => setFilters(p => ({ ...p, search: q, page: 1 }));
  const handleFilterChange = (f)  => setFilters({ ...f, page: 1 });
  const handlePageChange   = (pg) => setFilters(p => ({ ...p, page: pg }));
  const handleReset        = ()   => setFilters({
    search: '', category: '', department: '', semester: '',
    condition: '', listingType: '', minPrice: '', maxPrice: '', page: 1,
  });

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)] animate-fade-in">

      {/* ── HERO HEADER ── */}
      <div className="
        relative overflow-hidden rounded-2xl mb-6
        bg-gradient-to-br from-[var(--color-forest)] via-[var(--color-sage)] to-[var(--color-mint-dark)]
        p-6 sm:p-8
      ">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="
              px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-semibold
              backdrop-blur-sm border border-white/20
            ">
              🎓 SHUATS Campus
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1.5 leading-tight">
            Browse Items
          </h1>
          <p className="text-[var(--color-mint-light)] text-sm max-w-md">
            Discover books, electronics, lab equipment and more from fellow students.
          </p>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {statCards.map((s, i) => (
          <div
            key={s.key}
            style={{ animationDelay: `${i * 80}ms` }}
            className="
              animate-slide-up flex items-center gap-3 p-4 rounded-2xl
              bg-[var(--color-cream-light)] border border-[var(--color-rose-beige)]/50
              hover:shadow-lg hover:shadow-[var(--color-forest)]/10
              hover:-translate-y-0.5 transition-all duration-300
            "
          >
            <div className={`
              w-10 h-10 rounded-xl bg-gradient-to-br ${s.color}
              flex items-center justify-center text-white flex-shrink-0 shadow-md
            `}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-lg font-bold text-gray-800">
                {loading ? (
                  <span className="inline-block w-8 h-4 rounded bg-[var(--color-rose-beige)]/50 animate-pulse" />
                ) : (
                  s.key === 'total' ? pagination?.total ?? items.length :
                  s.key === 'rent' ? items.filter(x => x.listingType === 'rent').length :
                  s.key === 'sell' ? items.filter(x => x.listingType === 'sell').length :
                  '—'
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── SEARCH + FILTERS ── */}
      <div className="
        bg-[var(--color-cream-light)] border border-[var(--color-rose-beige)]/50
        rounded-2xl p-4 sm:p-5 mb-6 shadow-sm space-y-4
      ">
        <SearchBar onSearch={handleSearch} placeholder="Search items, books, devices…" />
        <ItemFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      </div>

      {/* ── ITEMS GRID ── */}
      <ItemGrid items={items} loading={loading} />

      {/* ── PAGINATION ── */}
      {pagination && (
        <div className="mt-8">
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
};

export default BrowseItems;