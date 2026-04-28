// ManageItems.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminGetItemsAPI, adminRemoveItemAPI, adminDeleteItemAPI } from '../../api/axios.js';
import DataTable from '../../components/common/DataTable.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { FiEye, FiXCircle, FiTrash2, FiFilter, FiDownload, FiRefreshCw, FiGrid, FiList } from 'react-icons/fi';

const ManageItems = () => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', category: '', search: '', page: 1 });
  const [confirmModal, setConfirmModal] = useState({ open: false, item: null, action: '' });
  const [processing, setProcessing] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await adminGetItemsAPI(filters);
      if (data.success) {
        setItems(data.items);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!confirmModal.item) return;
    setProcessing(true);
    try {
      if (confirmModal.action === 'remove') {
        await adminRemoveItemAPI(confirmModal.item._id);
        toast.success('Item removed');
      } else if (confirmModal.action === 'delete') {
        await adminDeleteItemAPI(confirmModal.item._id);
        toast.success('Item deleted permanently');
      }
      setConfirmModal({ open: false, item: null, action: '' });
      fetchItems();
    } catch (error) {
      toast.error('Action failed');
    } finally {
      setProcessing(false);
    }
  };

  const resetFilters = () => {
    setFilters({ status: '', category: '', search: '', page: 1 });
  };

  const categories = ['Books', 'Previous Year Papers', 'Calculators', 'Electronic Devices', 'Lab Equipment', 'Stationery', 'Sports Equipment', 'Musical Instruments', 'Clothing', 'Furniture', 'Other'];

  const columns = [
    {
      header: 'Item',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-green-100 flex-shrink-0">
            {row.images?.[0]?.url ? (
              <img src={row.images[0].url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-green-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            )}
          </div>
          <div>
            <Link to={`/items/${row._id}`} className="font-medium text-green-800 hover:text-green-600 transition">
              {row.title}
            </Link>
            <p className="text-xs text-green-500">{row.category}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Seller',
      render: (row) => (
        <Link to={`/users/${row.seller?._id}`} className="text-green-700 hover:text-green-600 font-medium">
          {row.seller?.name || 'Unknown'}
        </Link>
      )
    },
    {
      header: 'Type',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.listingType === 'rent' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
          {row.listingType === 'rent' ? 'Rent' : 'Sale'}
        </span>
      )
    },
    {
      header: 'Price',
      render: (row) => (
        <span className="font-semibold text-green-800">₹{row.price.toLocaleString()}</span>
      )
    },
    { header: 'Condition', render: (row) => <span className="capitalize text-green-600">{row.condition}</span> },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Views', render: (row) => <span className="flex items-center gap-1 text-green-600"><FiEye className="w-3 h-3" /> {row.views}</span> },
    { header: 'Date', render: (row) => <span className="text-green-600 text-sm">{format(new Date(row.createdAt), 'MMM dd, yyyy')}</span> },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link to={`/items/${row._id}`} className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition">
            <FiEye className="w-4 h-4" />
          </Link>
          {row.status !== 'removed' && (
            <button
              onClick={() => setConfirmModal({ open: true, item: row, action: 'remove' })}
              className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition"
            >
              <FiXCircle className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setConfirmModal({ open: true, item: row, action: 'delete' })}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Grid card view for items
  const GridCard = ({ item }) => (
    <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative h-40 bg-green-50">
        {item.images?.[0]?.url ? (
          <img src={item.images[0].url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-green-300">
            <FiPackage className="w-12 h-12" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={item.status} />
        </div>
      </div>
      <div className="p-4">
        <Link to={`/items/${item._id}`}>
          <h3 className="font-semibold text-green-900 hover:text-green-600 transition line-clamp-1">{item.title}</h3>
        </Link>
        <p className="text-sm text-green-500 mt-1">{item.category}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-green-700">₹{item.price.toLocaleString()}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${item.listingType === 'rent' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
            {item.listingType === 'rent' ? 'Rent' : 'Sale'}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-green-500">
          <span>{item.views} views</span>
          <span>{format(new Date(item.createdAt), 'MMM dd')}</span>
        </div>
        <div className="mt-3 pt-3 border-t border-green-100 flex items-center justify-between">
          <Link to={`/users/${item.seller?._id}`} className="text-green-600 text-sm hover:underline">
            {item.seller?.name || 'Unknown'}
          </Link>
          <div className="flex gap-1">
            <Link to={`/items/${item._id}`} className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition">
              <FiEye className="w-3.5 h-3.5" />
            </Link>
            {item.status !== 'removed' && (
              <button onClick={() => setConfirmModal({ open: true, item, action: 'remove' })} className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition">
                <FiXCircle className="w-3.5 h-3.5" />
              </button>
            )}
            <button onClick={() => setConfirmModal({ open: true, item, action: 'delete' })} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition">
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-green-900">Manage Items</h1>
            <p className="text-green-600 mt-1">View, filter and manage all marketplace listings</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchItems}
              className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition"
            >
              <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-green-200 rounded-xl text-green-700 hover:bg-green-50 transition shadow-sm">
              <FiDownload className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-md border border-green-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <SearchInput
                onSearch={(q) => setFilters({ ...filters, search: q, page: 1 })}
                placeholder="Search items by title, category, seller..."
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                  className="appearance-none pl-10 pr-8 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                  <option value="removed">Removed</option>
                </select>
                <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 w-4 h-4" />
              </div>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
                className="px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {(filters.status || filters.category || filters.search) && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm transition"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 bg-green-50 rounded-xl p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition ${viewMode === 'table' ? 'bg-white shadow-sm text-green-700' : 'text-green-400 hover:text-green-600'}`}
              >
                <FiList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-green-700' : 'text-green-400 hover:text-green-600'}`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-green-600">
            {pagination?.totalItems !== undefined && (
              <>Showing {items.length} of {pagination.totalItems} items</>
            )}
          </p>
        </div>

        {/* Content */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
            <DataTable
              columns={columns}
              data={items}
              loading={loading}
              emptyMessage="No items found"
              className="w-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {loading ? (
              // Skeleton loaders for grid
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden animate-pulse">
                  <div className="h-40 bg-green-100" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-green-100 rounded w-3/4" />
                    <div className="h-4 bg-green-50 rounded w-1/2" />
                    <div className="h-6 bg-green-100 rounded w-1/3" />
                    <div className="h-4 bg-green-50 rounded w-full" />
                  </div>
                </div>
              ))
            ) : items.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="text-5xl mb-4">📦</div>
                <p className="text-green-600 text-lg">No items found</p>
                <button onClick={resetFilters} className="mt-4 text-green-500 hover:text-green-600 underline">
                  Clear filters
                </button>
              </div>
            ) : (
              items.map(item => <GridCard key={item._id} item={item} />)
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              pagination={pagination}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          </div>
        )}

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmModal.open}
          onClose={() => setConfirmModal({ open: false, item: null, action: '' })}
          onConfirm={handleAction}
          title={confirmModal.action === 'remove' ? 'Remove Item' : 'Delete Item'}
          message={`Are you sure you want to ${confirmModal.action} "${confirmModal.item?.title}"? ${confirmModal.action === 'delete' ? 'This action cannot be undone.' : ''}`}
          confirmText={confirmModal.action === 'remove' ? 'Remove' : 'Delete Permanently'}
          loading={processing}
        />
      </div>
    </div>
  );
};

export default ManageItems;