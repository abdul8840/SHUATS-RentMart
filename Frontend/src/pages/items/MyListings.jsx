import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyListingsAPI, deleteItemAPI } from '../../api/axios.js';
import Pagination from '../../components/common/Pagination.jsx';
import Loader from '../../components/common/Loader.jsx';
import toast from 'react-hot-toast';
import {
  FiPlus, FiEdit, FiTrash2, FiEye, FiShoppingBag,
  FiPackage, FiChevronDown, FiAlertTriangle,
  FiCheckCircle, FiXCircle, FiRefreshCw
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
    <div className="max-w-4xl mx-auto animate-fade-in pb-10">

      {/* ── HEADER ── */}
      <div className="
        relative overflow-hidden rounded-2xl mb-6
        gradient-bg p-6 sm:p-8
      ">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">My Listings</h1>
            <p className="text-[var(--color-mint-light)] text-sm">Manage all your items for rent or sale</p>
          </div>
          <Link
            to="/items/create"
            className="
              flex items-center gap-2 px-5 py-3 rounded-xl
              bg-white text-[var(--color-forest)] font-bold text-sm
              hover:bg-[var(--color-mint-light)] hover:scale-105
              active:scale-95 cursor-pointer shadow-lg
              transition-all duration-200 flex-shrink-0
            "
          >
            <FiPlus size={16} />
            New Listing
          </Link>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-800', bg: 'bg-[var(--color-cream-light)]' },
          { label: 'Active', value: stats.active, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Sold', value: stats.sold, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'For Rent', value: stats.rent, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((s, i) => (
          <div
            key={s.label}
            style={{ animationDelay: `${i * 60}ms` }}
            className={`
              animate-slide-up ${s.bg} rounded-2xl p-4
              border border-[var(--color-rose-beige)]/40 text-center
              hover:shadow-md transition-all duration-200
            `}
          >
            <p className={`text-2xl font-extrabold ${s.color}`}>
              {loading ? (
                <span className="inline-block w-8 h-6 rounded bg-[var(--color-rose-beige)]/30 animate-pulse" />
              ) : s.value}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── FILTERS ── */}
      <div className="
        flex flex-wrap items-center gap-3 p-4 mb-5 rounded-2xl
        bg-[var(--color-cream-light)] border border-[var(--color-rose-beige)]/50 shadow-sm
      ">
        <FiShoppingBag size={15} className="text-[var(--color-forest)]" />
        <span className="text-sm font-semibold text-gray-700 mr-1">Filter:</span>

        <StyledSelect
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value, page: 1 })}
        >
          <option value="">All Status</option>
          <option value="active">✅ Active</option>
          <option value="sold">📦 Sold</option>
          <option value="rented">🔄 Rented</option>
          <option value="removed">❌ Removed</option>
        </StyledSelect>

        <StyledSelect
          value={filter.listingType}
          onChange={(e) => setFilter({ ...filter, listingType: e.target.value, page: 1 })}
        >
          <option value="">All Types</option>
          <option value="sell">🏷️ For Sale</option>
          <option value="rent">🔄 For Rent</option>
        </StyledSelect>

        {(filter.status || filter.listingType) && (
          <button
            onClick={() => setFilter({ status: '', listingType: '', page: 1 })}
            className="
              px-3 py-2 rounded-xl text-xs font-semibold
              text-red-500 bg-red-50 hover:bg-red-100
              cursor-pointer transition-all duration-200
            "
          >
            Clear
          </button>
        )}
      </div>

      {/* ── LISTINGS ── */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : items.length === 0 ? (
        /* Empty state */
        <div className="
          flex flex-col items-center justify-center py-20 gap-5
          bg-[var(--color-cream-light)] border border-[var(--color-rose-beige)]/50
          rounded-2xl animate-fade-in
        ">
          <div className="
            w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center
            text-white shadow-lg animate-bounce-soft
          ">
            <FiPackage size={36} />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-gray-800 text-lg mb-1">No listings found</h3>
            <p className="text-sm text-gray-500 mb-5">
              {filter.status || filter.listingType
                ? 'Try changing the filters above'
                : "You haven't listed anything yet"
              }
            </p>
            <Link
              to="/items/create"
              className="
                inline-flex items-center gap-2 px-5 py-3 rounded-xl
                gradient-bg text-white font-bold text-sm
                hover:shadow-lg hover:shadow-[var(--color-forest)]/30
                hover:scale-105 cursor-pointer
                transition-all duration-200
              "
            >
              <FiPlus size={16} />
              Create Your First Listing
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => {
            const sc = statusConfig[item.status] ?? statusConfig.active;

            return (
              <div
                key={item._id}
                style={{ animationDelay: `${i * 60}ms` }}
                className="
                  animate-slide-up group flex items-center gap-4 p-4 rounded-2xl
                  bg-[var(--color-cream-light)] border border-[var(--color-rose-beige)]/50
                  hover:border-[var(--color-mint)]/60 hover:shadow-lg
                  hover:shadow-[var(--color-forest)]/8
                  transition-all duration-300
                "
              >
                {/* Thumbnail */}
                <div className="
                  relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden
                  flex-shrink-0 bg-gradient-to-br from-[var(--color-cream)] to-[var(--color-mint-light)]
                  border border-[var(--color-rose-beige)]/40
                ">
                  {item.images?.[0]?.url ? (
                    <img
                      src={item.images[0].url} alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--color-rose-beige)]">
                      <FiShoppingBag size={20} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h3 className="
                    font-bold text-gray-800 text-sm leading-snug line-clamp-1
                    group-hover:text-[var(--color-forest)] transition-colors duration-200
                  ">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
                    <span className="font-bold text-[var(--color-forest)]">₹{item.price}</span>
                    <span className="text-gray-300">·</span>
                    <span className="capitalize">{item.listingType === 'rent' ? '🔄 Rent' : '🏷️ Sale'}</span>
                    <span className="text-gray-300">·</span>
                    <span>{item.condition}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status badge */}
                    <span className={`
                      inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md
                      text-[10px] font-semibold border capitalize
                      ${sc.color}
                    `}>
                      {sc.icon}
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/items/${item._id}`}
                    title="View"
                    className="
                      w-9 h-9 rounded-xl flex items-center justify-center
                      bg-[var(--color-mint-light)] text-[var(--color-forest)]
                      hover:bg-[var(--color-mint)] hover:scale-110
                      cursor-pointer transition-all duration-200
                    "
                  >
                    <FiEye size={15} />
                  </Link>
                  <Link
                    to={`/items/${item._id}/edit`}
                    title="Edit"
                    className="
                      w-9 h-9 rounded-xl flex items-center justify-center
                      bg-[var(--color-cream)] text-gray-600
                      border border-[var(--color-rose-beige)]/60
                      hover:bg-[var(--color-mint-light)] hover:text-[var(--color-forest)]
                      hover:border-[var(--color-mint)] hover:scale-110
                      cursor-pointer transition-all duration-200
                    "
                  >
                    <FiEdit size={15} />
                  </Link>
                  <button
                    onClick={() => setConfirmDelete(item)}
                    title="Delete"
                    className="
                      w-9 h-9 rounded-xl flex items-center justify-center
                      bg-red-50 text-red-400 border border-red-200/60
                      hover:bg-red-500 hover:text-white hover:border-red-500
                      hover:scale-110 cursor-pointer
                      transition-all duration-200
                    "
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="mt-6">
          <Pagination
            pagination={pagination}
            onPageChange={(page) => setFilter({ ...filter, page })}
          />
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          />
          <div className="
            relative w-full max-w-sm bg-[var(--color-cream-light)]
            rounded-2xl p-6 shadow-2xl animate-scale-in
            border border-[var(--color-rose-beige)]/50
          ">
            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <div className="
                w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center
                text-red-500 animate-bounce-soft
              ">
                <FiAlertTriangle size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Delete Listing?</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Are you sure you want to delete{' '}
                <strong className="text-gray-700">"{confirmDelete.title}"</strong>?
                This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="
                  flex-1 py-3 rounded-xl text-sm font-semibold
                  bg-[var(--color-cream)] text-gray-700
                  border border-[var(--color-rose-beige)]/60
                  hover:bg-[var(--color-rose-beige)]/30
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
                  py-3 rounded-xl text-sm font-semibold
                  bg-red-500 text-white hover:bg-red-600
                  shadow-lg shadow-red-500/30
                  disabled:opacity-60 cursor-pointer
                  transition-all duration-200
                "
              >
                {deletingId ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiTrash2 size={15} />
                )}
                {deletingId ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;