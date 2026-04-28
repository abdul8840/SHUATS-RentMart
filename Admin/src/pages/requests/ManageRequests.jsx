// ManageRequests.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminGetRequestsAPI } from '../../api/axios.js';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { format } from 'date-fns';
import { 
  FiFilter, 
  FiRefreshCw, 
  FiDownload, 
  FiCalendar, 
  FiMapPin, 
  FiUser, 
  FiPackage,
  FiChevronDown,
  FiEye
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', page: 1 });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await adminGetRequestsAPI(filters);
      if (data.success) {
        setRequests(data.requests);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({ status: '', page: 1 });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      accepted: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      cancelled: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getRequestTypeBadge = (type) => {
    const types = {
      purchase: 'bg-purple-100 text-purple-700',
      rent: 'bg-indigo-100 text-indigo-700'
    };
    return types[type] || 'bg-gray-100 text-gray-700';
  };

  const columns = [
    {
      header: 'Item',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-green-100 flex-shrink-0">
            {row.item?.images?.[0]?.url ? (
              <img src={row.item.images[0].url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-green-400">
                <FiPackage className="w-4 h-4" />
              </div>
            )}
          </div>
          <Link 
            to={`/items/${row.item?._id}`} 
            className="font-medium text-green-800 hover:text-green-600 transition cursor-pointer"
          >
            {row.item?.title || 'Deleted Item'}
          </Link>
        </div>
      )
    },
    {
      header: 'Requester',
      render: (row) => (
        <Link 
          to={`/users/${row.requester?._id}`} 
          className="flex items-center gap-2 text-green-700 hover:text-green-600 transition cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-xs font-bold">
            {row.requester?.name?.charAt(0) || '?'}
          </div>
          <span>{row.requester?.name || 'Unknown'}</span>
        </Link>
      )
    },
    {
      header: 'Seller',
      render: (row) => (
        <Link 
          to={`/users/${row.seller?._id}`} 
          className="flex items-center gap-2 text-green-700 hover:text-green-600 transition cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-xs font-bold">
            {row.seller?.name?.charAt(0) || '?'}
          </div>
          <span>{row.seller?.name || 'Unknown'}</span>
        </Link>
      )
    },
    {
      header: 'Type',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRequestTypeBadge(row.requestType)}`}>
          {row.requestType === 'purchase' ? 'Purchase' : 'Rent'}
        </span>
      )
    },
    {
      header: 'Price',
      render: (row) => (
        <span className="font-semibold text-green-800">₹{row.item?.price?.toLocaleString() || 0}</span>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(row.status)}`}>
          {row.status?.charAt(0).toUpperCase() + row.status?.slice(1) || 'Unknown'}
        </span>
      )
    },
    {
      header: 'Meetup',
      render: (row) => (
        <div className="flex items-center gap-1 text-green-600 text-sm">
          <FiMapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate max-w-[120px]">{row.meetupLocation || '-'}</span>
        </div>
      )
    },
    {
      header: 'Date',
      render: (row) => (
        <div className="flex items-center gap-1 text-green-600 text-sm">
          <FiCalendar className="w-3 h-3" />
          <span>{format(new Date(row.createdAt), 'MMM dd, yyyy')}</span>
        </div>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <Link 
          to={`/requests/${row._id}`} 
          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition cursor-pointer inline-flex items-center gap-1"
        >
          <FiEye className="w-4 h-4" />
          <span className="text-xs">View</span>
        </Link>
      )
    }
  ];

  // Card view component
  const RequestCard = ({ request }) => (
    <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="p-4">
        {/* Header with item image and title */}
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-green-100 flex-shrink-0">
            {request.item?.images?.[0]?.url ? (
              <img src={request.item.images[0].url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-green-400">
                <FiPackage className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Link 
              to={`/items/${request.item?._id}`} 
              className="font-semibold text-green-900 hover:text-green-600 transition line-clamp-1 cursor-pointer"
            >
              {request.item?.title || 'Deleted Item'}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRequestTypeBadge(request.requestType)}`}>
                {request.requestType === 'purchase' ? 'Purchase' : 'Rent'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="mt-3 pt-3 border-t border-green-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-500">Price</span>
            <span className="text-lg font-bold text-green-700">₹{request.item?.price?.toLocaleString() || 0}</span>
          </div>
        </div>

        {/* Users */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-500">Requester</span>
            <Link 
              to={`/users/${request.requester?._id}`} 
              className="flex items-center gap-1 text-green-700 hover:text-green-600 cursor-pointer"
            >
              <FiUser className="w-3 h-3" />
              <span>{request.requester?.name || 'Unknown'}</span>
            </Link>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-500">Seller</span>
            <Link 
              to={`/users/${request.seller?._id}`} 
              className="flex items-center gap-1 text-green-700 hover:text-green-600 cursor-pointer"
            >
              <FiUser className="w-3 h-3" />
              <span>{request.seller?.name || 'Unknown'}</span>
            </Link>
          </div>
        </div>

        {/* Meetup Location */}
        {request.meetupLocation && (
          <div className="mt-2 flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
            <FiMapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{request.meetupLocation}</span>
          </div>
        )}

        {/* Date and Action */}
        <div className="mt-3 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-green-500">
            <FiCalendar className="w-3 h-3" />
            <span>{format(new Date(request.createdAt), 'MMM dd, yyyy')}</span>
          </div>
          <Link 
            to={`/requests/${request._id}`} 
            className="px-3 py-1.5 text-sm text-green-600 hover:bg-green-100 rounded-lg transition cursor-pointer flex items-center gap-1"
          >
            <FiEye className="w-3.5 h-3.5" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );

  // Skeleton loader for cards
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden animate-pulse">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 bg-green-100 rounded-xl" />
          <div className="flex-1">
            <div className="h-5 bg-green-100 rounded w-3/4" />
            <div className="flex gap-2 mt-2">
              <div className="h-5 bg-green-100 rounded w-16" />
              <div className="h-5 bg-green-100 rounded w-16" />
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-green-100">
          <div className="flex justify-between">
            <div className="h-4 bg-green-100 rounded w-12" />
            <div className="h-6 bg-green-100 rounded w-20" />
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <div className="flex justify-between">
            <div className="h-4 bg-green-100 rounded w-16" />
            <div className="h-4 bg-green-100 rounded w-24" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-green-100 rounded w-16" />
            <div className="h-4 bg-green-100 rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  );

  // Status options for filter
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-green-900">Manage Requests</h1>
            <p className="text-green-600 mt-1">View and track all marketplace requests</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchRequests}
              className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition cursor-pointer"
              disabled={loading}
            >
              <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-green-200 rounded-xl text-green-700 hover:bg-green-50 transition shadow-sm cursor-pointer">
              <FiDownload className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total', value: pagination?.totalItems || 0, color: 'bg-green-100 text-green-700' },
            { label: 'Pending', value: requests.filter(r => r.status === 'pending').length, color: 'bg-amber-100 text-amber-700' },
            { label: 'Accepted', value: requests.filter(r => r.status === 'accepted').length, color: 'bg-blue-100 text-blue-700' },
            { label: 'Completed', value: requests.filter(r => r.status === 'completed').length, color: 'bg-emerald-100 text-emerald-700' },
            { label: 'Rejected', value: requests.filter(r => r.status === 'rejected').length, color: 'bg-red-100 text-red-700' }
          ].map((stat, idx) => (
            <div key={idx} className={`${stat.color} rounded-xl p-3 text-center shadow-sm`}>
              <p className="text-xs font-medium">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-md border border-green-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              {/* Search input placeholder - can be expanded */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by item, requester, or seller..."
                  className="w-full pl-10 pr-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onChange={(e) => {
                    // Implement search if API supports it
                    console.log(e.target.value);
                  }}
                />
                <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                  className="appearance-none pl-4 pr-10 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-4 h-4 pointer-events-none" />
              </div>
              {filters.status && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm transition cursor-pointer"
                >
                  Clear Filter
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 bg-green-50 rounded-xl p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'table' ? 'bg-white shadow-sm text-green-700' : 'text-green-400 hover:text-green-600'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'cards' ? 'bg-white shadow-sm text-green-700' : 'text-green-400 hover:text-green-600'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-green-600">
            {pagination?.totalItems !== undefined && (
              <>Showing {requests.length} of {pagination.totalItems} requests</>
            )}
          </p>
        </div>

        {/* Content - Table View */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
            <DataTable
              columns={columns}
              data={requests}
              loading={loading}
              emptyMessage="No requests found"
              className="w-full"
            />
          </div>
        ) : (
          // Content - Card View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : requests.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-green-600 text-lg">No requests found</p>
                {filters.status && (
                  <button onClick={resetFilters} className="mt-4 text-green-500 hover:text-green-600 underline cursor-pointer">
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              requests.map(request => <RequestCard key={request._id} request={request} />)
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
      </div>
    </div>
  );
};

export default ManageRequests;