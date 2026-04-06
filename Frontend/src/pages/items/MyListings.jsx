import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyListingsAPI, deleteItemAPI } from '../../api/axios.js';
import Pagination from '../../components/common/Pagination.jsx';
import Loader from '../../components/common/Loader.jsx';
import toast from 'react-hot-toast';
import {
  FiPlus, FiEdit, FiTrash2, FiEye, FiShoppingBag,
  FiPackage, FiChevronDown, FiAlertTriangle,
  FiCheckCircle, FiXCircle, FiRefreshCw, FiTrendingUp, FiFilter, FiGrid, FiList, FiClock, 
} from 'react-icons/fi';

const statusConfig = {
  active:  { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', icon: <FiCheckCircle size={11} /> },
  sold:    { color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500', icon: <FiPackage size={11} /> },
  rented:  { color: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500', icon: <FiRefreshCw size={11} /> },
  removed: { color: 'bg-red-100 text-red-600 border-red-200', dot: 'bg-red-400', icon: <FiXCircle size={11} /> },
};

const StyledSelect = ({ value, onChange, children }) => (
  <div className="relative">
    <select
      value={value} onChange={onChange}
      className="
        appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm cursor-pointer
        bg-[var(--color-cream-light)] border border-[var(--color-rose-beige)]/70
        text-gray-700 focus:outline-none focus:ring-2
        focus:ring-[var(--color-sage)] hover:border-[var(--color-mint)]
        transition-all duration-200
      "
    >
      {children}
    </select>
    <FiChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
);

/* skeleton row */
const SkeletonRow = () => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-cream-light)] border border-[var(--color-rose-beige)]/40 animate-pulse">
    <div className="w-16 h-16 rounded-xl bg-[var(--color-rose-beige)]/50 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-[var(--color-rose-beige)]/50 rounded-lg w-3/4" />
      <div className="h-3 bg-[var(--color-rose-beige)]/30 rounded-lg w-1/2" />
      <div className="flex gap-2">
        <div className="h-5 w-14 bg-[var(--color-rose-beige)]/40 rounded-md" />
        <div className="h-5 w-16 bg-[var(--color-rose-beige)]/30 rounded-md" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="w-8 h-8 rounded-xl bg-[var(--color-rose-beige)]/40" />
      <div className="w-8 h-8 rounded-xl bg-[var(--color-rose-beige)]/40" />
      <div className="w-8 h-8 rounded-xl bg-[var(--color-rose-beige)]/40" />
    </div>
  </div>
);

const MyListings = () => {
  const [items, setItems]           = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState({ status: '', listingType: '', page: 1 });
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // item to delete

  useEffect(() => { fetchListings(); }, [filter]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data } = await getMyListingsAPI(filter);
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

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteItemAPI(id);
      toast.success('Listing deleted successfully');
      setConfirmDelete(null);
      fetchListings();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  /* summary stats */
  const stats = {
    total:  items.length,
    active: items.filter(x => x.status === 'active').length,
    sold:   items.filter(x => x.status === 'sold').length,
    rent:   items.filter(x => x.listingType === 'rent').length,
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)]">
      
      {/* ═══════════════════════════════════════════════════════
          HERO HEADER WITH STATS
          ═══════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-[var(--color-forest-dark)] mb-8 py-10">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-mint)] rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-sage)] rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            
            {/* Left Content */}
            <div className="flex-1 animate-slide-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-sage)]/20 
                            backdrop-blur-sm rounded-full border border-[var(--color-mint)]/30 mb-4">
                <FiShoppingBag size={14} className="text-[var(--color-mint)]" />
                <span className="text-[var(--color-mint-light)] text-sm font-medium">
                  Listing Management
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
                My Listings
                <span className="block text-2xl sm:text-3xl text-[var(--color-mint-light)] 
                              font-normal mt-2">
                  {loading ? '...' : `${stats.total} Active Items`}
                </span>
              </h1>

              <p className="text-[var(--color-cream)] text-base leading-relaxed max-w-2xl">
                Manage all your rental and sale listings in one place. Track performance, 
                update details, and connect with interested buyers.
              </p>
            </div>

            {/* Quick Action Button */}
            <Link
              to="/items/create"
              className="
                group flex items-center gap-3 px-8 py-4 rounded-2xl
                bg-white text-[var(--color-forest-dark)] font-bold text-base
                hover:bg-[var(--color-mint-light)] hover:scale-105
                active:scale-95 cursor-pointer shadow-2xl
                transition-all duration-300 flex-shrink-0 animate-bounce-soft
              "
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-forest)] 
                            flex items-center justify-center text-white
                            group-hover:rotate-90 transition-transform duration-300">
                <FiPlus size={20} />
              </div>
              <span>Create New Listing</span>
            </Link>
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
            ENHANCED STATS CARDS
            ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Total Listings', 
              value: stats.total, 
              icon: <FiPackage size={24} />,
              gradient: 'from-[var(--color-forest)] to-[var(--color-sage)]',
              bgColor: 'bg-[var(--color-mint-light)]/50'
            },
            { 
              label: 'Active Items', 
              value: stats.active, 
              icon: <FiCheckCircle size={24} />,
              gradient: 'from-emerald-500 to-emerald-400',
              bgColor: 'bg-emerald-50'
            },
            { 
              label: 'Items Sold', 
              value: stats.sold, 
              icon: <FiTrendingUp size={24} />,
              gradient: 'from-blue-500 to-blue-400',
              bgColor: 'bg-blue-50'
            },
            { 
              label: 'For Rent', 
              value: stats.rent, 
              icon: <FiRefreshCw size={24} />,
              gradient: 'from-purple-500 to-purple-400',
              bgColor: 'bg-purple-50'
            },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{ animationDelay: `${i * 80}ms` }}
              className="group animate-slide-up cursor-pointer"
            >
              <div className={`
                relative overflow-hidden rounded-3xl ${stat.bgColor}
                border-2 border-white shadow-xl
                p-6 transition-all duration-300
                hover:shadow-2xl hover:-translate-y-1 hover:scale-105
              `}>
                {/* Icon */}
                <div className={`
                  w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient}
                  flex items-center justify-center text-white
                  mb-4 shadow-lg
                  group-hover:scale-110 group-hover:rotate-6
                  transition-transform duration-300
                `}>
                  {stat.icon}
                </div>

                {/* Value */}
                <p className="text-4xl font-extrabold text-gray-900 mb-1">
                  {loading ? (
                    <span className="inline-block w-16 h-10 rounded-lg bg-gray-200 animate-pulse" />
                  ) : (
                    <span className="animate-scale-in">{stat.value}</span>
                  )}
                </p>

                {/* Label */}
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>

                {/* Decorative Circle */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/20 
                              rounded-full group-hover:scale-150 transition-transform duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════
            FILTERS & SEARCH BAR
            ═══════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl shadow-lg border-2 border-[var(--color-rose-beige)]/30 
                      p-6 mb-8 animate-slide-down">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            
            {/* Filter Icon & Label */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-mint-light)] 
                            flex items-center justify-center text-[var(--color-forest)]">
                <FiFilter size={18} />
              </div>
              <span className="text-base font-bold text-gray-800">Filter By:</span>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value, page: 1 })}
                className="
                  px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer
                  bg-[var(--color-cream)] border-2 border-[var(--color-rose-beige)]/50
                  text-gray-700 focus:outline-none focus:ring-2
                  focus:ring-[var(--color-sage)] focus:border-[var(--color-sage)]
                  hover:border-[var(--color-mint)] transition-all duration-200
                "
              >
                <option value="">All Status</option>
                <option value="active">✅ Active</option>
                <option value="sold">📦 Sold</option>
                <option value="rented">🔄 Rented</option>
                <option value="removed">❌ Removed</option>
              </select>

              <select
                value={filter.listingType}
                onChange={(e) => setFilter({ ...filter, listingType: e.target.value, page: 1 })}
                className="
                  px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer
                  bg-[var(--color-cream)] border-2 border-[var(--color-rose-beige)]/50
                  text-gray-700 focus:outline-none focus:ring-2
                  focus:ring-[var(--color-sage)] focus:border-[var(--color-sage)]
                  hover:border-[var(--color-mint)] transition-all duration-200
                "
              >
                <option value="">All Types</option>
                <option value="sell">🏷️ For Sale</option>
                <option value="rent">🔄 For Rent</option>
              </select>

              {(filter.status || filter.listingType) && (
                <button
                  onClick={() => setFilter({ status: '', listingType: '', page: 1 })}
                  className="
                    px-4 py-2.5 rounded-xl text-sm font-semibold
                    bg-red-50 text-red-600 border-2 border-red-200
                    hover:bg-red-100 hover:scale-105
                    cursor-pointer transition-all duration-200
                    flex items-center gap-2
                  "
                >
                  <FiXCircle size={16} />
                  Clear Filters
                </button>
              )}
            </div>

            {/* View Toggle (Optional) */}
            <div className="flex items-center gap-2 p-1.5 bg-[var(--color-cream)] 
                          rounded-xl border-2 border-[var(--color-rose-beige)]/30">
              <button className="p-2 rounded-lg bg-[var(--color-forest)] text-white cursor-pointer">
                <FiGrid size={16} />
              </button>
              <button className="p-2 rounded-lg text-gray-400 hover:text-gray-700 
                               hover:bg-white cursor-pointer transition-all">
                <FiList size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            LISTINGS GRID/LIST
            ═══════════════════════════════════════════════════════ */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : items.length === 0 ? (
          /* EMPTY STATE */
          <div className="
            flex flex-col items-center justify-center py-24 gap-6
            bg-white border-2 border-[var(--color-rose-beige)]/30
            rounded-3xl animate-scale-in shadow-lg
          ">
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-[var(--color-mint-light)] 
                            flex items-center justify-center text-[var(--color-forest)]
                            shadow-2xl animate-bounce-soft">
                <FiPackage size={56} />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full 
                            bg-[var(--color-forest)] flex items-center justify-center 
                            text-white shadow-lg">
                <FiPlus size={24} />
              </div>
            </div>
            
            <div className="text-center max-w-md">
              <h3 className="font-extrabold text-gray-900 text-2xl mb-2">
                {filter.status || filter.listingType ? 'No Matching Listings' : 'No Listings Yet'}
              </h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                {filter.status || filter.listingType
                  ? 'Try adjusting your filters to see more results.'
                  : 'Start your journey by creating your first listing. Share items with the SHUATS community!'
                }
              </p>
              
              {!(filter.status || filter.listingType) && (
                <Link
                  to="/items/create"
                  className="
                    inline-flex items-center gap-3 px-8 py-4 rounded-2xl
                    bg-[var(--color-forest)] text-white font-bold text-base
                    hover:bg-[var(--color-forest-dark)] hover:scale-105
                    cursor-pointer shadow-2xl shadow-[var(--color-forest)]/30
                    transition-all duration-300 group
                  "
                >
                  <FiPlus size={20} className="group-hover:rotate-90 transition-transform" />
                  Create Your First Listing
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* LISTINGS GRID */
          <div className="grid grid-cols-1 gap-5">
            {items.map((item, i) => {
              const sc = statusConfig[item.status] ?? statusConfig.active;

              return (
                <div
                  key={item._id}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="
                    group animate-slide-up bg-white rounded-3xl
                    border-2 border-[var(--color-rose-beige)]/30
                    hover:border-[var(--color-mint)] hover:shadow-2xl
                    transition-all duration-300 overflow-hidden
                    hover:-translate-y-1
                  "
                >
                  <div className="flex items-center gap-5 p-5">
                    
                    {/* Thumbnail */}
                    <div className="
                      relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden
                      flex-shrink-0 bg-[var(--color-cream)]
                      border-2 border-[var(--color-rose-beige)]/30
                      group-hover:scale-105 transition-transform duration-300
                    ">
                      {item.images?.[0]?.url ? (
                        <img
                          src={item.images[0].url} alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-rose-beige)]">
                          <FiShoppingBag size={32} />
                        </div>
                      )}

                      {/* Status Badge on Image */}
                      <span className={`
                        absolute top-2 left-2 px-2 py-1 rounded-lg
                        text-[10px] font-bold border ${sc.color}
                        backdrop-blur-sm flex items-center gap-1
                      `}>
                        {sc.icon}
                        {item.status}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <h3 className="
                        font-bold text-gray-900 text-lg leading-snug line-clamp-1
                        group-hover:text-[var(--color-forest)] transition-colors duration-200
                      ">
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-3 text-sm flex-wrap">
                        <span className="font-extrabold text-xl text-[var(--color-forest)]">
                          ₹{item.price}
                        </span>
                        <span className="text-gray-300">·</span>
                        <span className="px-2 py-1 rounded-lg bg-[var(--color-mint-light)] 
                                     text-[var(--color-forest)] text-xs font-semibold">
                          {item.listingType === 'rent' ? '🔄 Rent' : '🏷️ Sale'}
                        </span>
                        <span className="text-gray-300">·</span>
                        <span className="text-gray-600">{item.condition}</span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiEye size={12} />
                          {item.views ?? 0} views
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock size={12} />
                          {new Date(item.createdAt).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Link
                        to={`/items/${item._id}`}
                        title="View Details"
                        className="
                          w-12 h-12 rounded-2xl flex items-center justify-center
                          bg-[var(--color-mint-light)] text-[var(--color-forest)]
                          hover:bg-[var(--color-mint)] hover:scale-110 hover:rotate-6
                          cursor-pointer transition-all duration-300
                          shadow-md hover:shadow-lg
                        "
                      >
                        <FiEye size={18} />
                      </Link>
                      <Link
                        to={`/items/${item._id}/edit`}
                        title="Edit Listing"
                        className="
                          w-12 h-12 rounded-2xl flex items-center justify-center
                          bg-white text-gray-600
                          border-2 border-[var(--color-rose-beige)]/50
                          hover:bg-[var(--color-mint-light)] hover:text-[var(--color-forest)]
                          hover:border-[var(--color-mint)] hover:scale-110 hover:rotate-6
                          cursor-pointer transition-all duration-300
                          shadow-md hover:shadow-lg
                        "
                      >
                        <FiEdit size={18} />
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(item)}
                        title="Delete Listing"
                        className="
                          w-12 h-12 rounded-2xl flex items-center justify-center
                          bg-red-50 text-red-400 border-2 border-red-200
                          hover:bg-red-500 hover:text-white hover:border-red-500
                          hover:scale-110 hover:rotate-6 cursor-pointer
                          transition-all duration-300
                          shadow-md hover:shadow-lg
                        "
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-10 animate-slide-up">
            <Pagination
              pagination={pagination}
              onPageChange={(page) => setFilter({ ...filter, page })}
            />
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          />
          <div className="
            relative w-full max-w-md bg-white
            rounded-3xl p-8 shadow-2xl animate-scale-in
            border-2 border-[var(--color-rose-beige)]/30
          ">
            <div className="flex flex-col items-center text-center gap-5 mb-8">
              <div className="
                w-20 h-20 rounded-3xl bg-red-100 flex items-center justify-center
                text-red-500 animate-bounce-soft shadow-xl
              ">
                <FiAlertTriangle size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                  Delete Listing?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Are you sure you want to permanently delete{' '}
                  <strong className="text-gray-900">"{confirmDelete.title}"</strong>?
                  This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="
                  flex-1 py-3.5 rounded-2xl text-base font-bold
                  bg-[var(--color-cream)] text-gray-700
                  border-2 border-[var(--color-rose-beige)]
                  hover:bg-[var(--color-rose-beige)]/30 hover:scale-105
                  cursor-pointer transition-all duration-200
                "
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete._id)}
                disabled={!!deletingId}
                className="
                  flex-1 flex items-center justify-center gap-2
                  py-3.5 rounded-2xl text-base font-bold
                  bg-red-500 text-white hover:bg-red-600
                  shadow-2xl shadow-red-500/40
                  hover:scale-105 disabled:opacity-60 cursor-pointer
                  transition-all duration-200
                "
              >
                {deletingId ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={18} />
                    Delete Forever
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;