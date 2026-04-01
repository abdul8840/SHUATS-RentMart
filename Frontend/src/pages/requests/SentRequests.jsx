// SentRequests.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSentRequestsAPI, cancelRequestAPI } from '../../api/axios.js';
import Pagination from '../../components/common/Pagination.jsx';
import Loader from '../../components/common/Loader.jsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  FiSend,
  FiFilter,
  FiClock,
  FiCheck,
  FiX,
  FiPackage,
  FiChevronRight,
  FiCalendar,
  FiTag,
  FiUser,
  FiAlertCircle,
  FiAlertTriangle,
  FiExternalLink,
} from 'react-icons/fi';

const statusConfig = {
  pending: {
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
    icon: <FiClock className="w-3.5 h-3.5" />,
    label: 'Pending',
  },
  accepted: {
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: <FiCheck className="w-3.5 h-3.5" />,
    label: 'Accepted',
  },
  completed: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    dot: 'bg-blue-500',
    icon: <FiPackage className="w-3.5 h-3.5" />,
    label: 'Completed',
  },
  rejected: {
    color: 'bg-red-100 text-red-800 border-red-200',
    dot: 'bg-red-500',
    icon: <FiX className="w-3.5 h-3.5" />,
    label: 'Rejected',
  },
  cancelled: {
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    dot: 'bg-gray-400',
    icon: <FiAlertCircle className="w-3.5 h-3.5" />,
    label: 'Cancelled',
  },
};

const SentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, page]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await getSentRequestsAPI({ status: statusFilter, page });
      if (data.success) {
        setRequests(data.requests);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await cancelRequestAPI(id, { reason: 'Cancelled by requester' });
      toast.success('Request cancelled successfully');
      setConfirmCancelId(null);
      fetchRequests();
    } catch (error) {
      toast.error('Failed to cancel request');
    } finally {
      setCancellingId(null);
    }
  };

  const filterOptions = [
    { value: '', label: 'All', icon: <FiSend className="w-3.5 h-3.5" /> },
    { value: 'pending', label: 'Pending', icon: <FiClock className="w-3.5 h-3.5" /> },
    { value: 'accepted', label: 'Accepted', icon: <FiCheck className="w-3.5 h-3.5" /> },
    { value: 'completed', label: 'Completed', icon: <FiPackage className="w-3.5 h-3.5" /> },
    { value: 'rejected', label: 'Rejected', icon: <FiX className="w-3.5 h-3.5" /> },
    { value: 'cancelled', label: 'Cancelled', icon: <FiAlertCircle className="w-3.5 h-3.5" /> },
  ];

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-cream-light">
      {/* Header Section */}
      <div className="gradient-bg px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
              <FiSend className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Sent Requests
            </h1>
          </div>
          <p className="text-white/80 text-sm sm:text-base ml-14">
            Track the status of requests you've sent to other users
          </p>

          {/* Stats Row */}
          {requests.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-5 ml-14">
              {(() => {
                const pending = requests.filter((r) => r.status === 'pending').length;
                const accepted = requests.filter((r) => r.status === 'accepted').length;
                return (
                  <>
                    {pending > 0 && (
                      <div className="px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                        ⏳ {pending} Pending
                      </div>
                    )}
                    {accepted > 0 && (
                      <div className="px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                        ✅ {accepted} Accepted
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 pb-12">
        {/* Filter Card */}
        <div className="glass rounded-2xl p-4 sm:p-5 mb-6 animate-slide-up shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 text-forest-dark font-semibold text-sm shrink-0">
              <FiFilter className="w-4 h-4" />
              <span>Filter</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setStatusFilter(opt.value);
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer
                    ${
                      statusFilter === opt.value
                        ? 'bg-forest text-white shadow-md shadow-forest/25 scale-105'
                        : 'bg-white text-gray-600 hover:bg-cream-dark hover:text-forest-dark border border-gray-200'
                    }`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        {requests.length > 0 && (
          <p className="text-sm text-gray-500 mb-4 animate-fade-in px-1">
            Showing{' '}
            <span className="font-semibold text-forest-dark">{requests.length}</span>{' '}
            request{requests.length !== 1 ? 's' : ''}
            {pagination?.total && <span> of {pagination.total}</span>}
          </p>
        )}

        {/* Empty State */}
        {requests.length === 0 ? (
          <div className="glass rounded-2xl p-10 sm:p-16 text-center animate-scale-in shadow-md">
            <div className="w-20 h-20 bg-cream-dark rounded-full flex items-center justify-center mx-auto mb-5">
              <FiSend className="w-10 h-10 text-rose-beige" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No sent requests</h3>
            <p className="text-gray-500 max-w-md mx-auto text-sm mb-6">
              {statusFilter
                ? `You don't have any ${statusFilter} requests.`
                : "You haven't sent any requests yet. Browse items and send requests to get started!"}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {statusFilter && (
                <button
                  onClick={() => setStatusFilter('')}
                  className="px-5 py-2.5 bg-white text-forest-dark border border-forest/20 rounded-xl text-sm font-medium hover:bg-cream transition-colors cursor-pointer"
                >
                  View All Requests
                </button>
              )}
              <Link
                to="/items"
                className="px-5 py-2.5 bg-forest text-white rounded-xl text-sm font-medium hover:bg-forest-dark shadow-md shadow-forest/20 transition-all"
              >
                Browse Items
              </Link>
            </div>
          </div>
        ) : (
          /* Request Cards */
          <div className="space-y-4">
            {requests.map((req, index) => {
              const status = statusConfig[req.status] || statusConfig.pending;
              const canCancel = req.status === 'pending' || req.status === 'accepted';
              const isConfirming = confirmCancelId === req._id;

              return (
                <div
                  key={req._id}
                  className="glass rounded-2xl overflow-hidden shadow-md card-hover animate-slide-up"
                  style={{ animationDelay: `${index * 0.07}s`, animationFillMode: 'both' }}
                >
                  <div className="p-4 sm:p-5 lg:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Item Image */}
                      <Link to={`/items/${req.item?._id}`} className="shrink-0 group">
                        <div className="w-full sm:w-28 lg:w-32 h-40 sm:h-28 lg:h-32 rounded-xl overflow-hidden bg-cream-dark relative">
                          {req.item?.images?.[0]?.url ? (
                            <img
                              src={req.item.images[0].url}
                              alt={req.item?.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiPackage className="w-8 h-8 text-rose-beige" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                          {/* Status overlay badge on image (mobile) */}
                          <div className="absolute top-2 right-2 sm:hidden">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-sm ${status.color}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                              {status.label}
                            </span>
                          </div>
                        </div>
                      </Link>

                      {/* Request Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/items/${req.item?._id}`}
                              className="text-base lg:text-lg font-semibold text-gray-900 hover:text-forest transition-colors line-clamp-1"
                            >
                              {req.item?.title || 'Untitled Item'}
                            </Link>
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              {/* Status (desktop) */}
                              <span
                                className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}
                              >
                                {status.icon}
                                {status.label}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cream-dark text-forest-dark border border-cream">
                                <FiTag className="w-3 h-3" />
                                {req.requestType?.charAt(0).toUpperCase() +
                                  req.requestType?.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-gray-400 whitespace-nowrap shrink-0">
                            <FiCalendar className="w-3.5 h-3.5" />
                            {format(new Date(req.createdAt), 'MMM dd, yyyy')}
                          </div>
                        </div>

                        {/* Seller Info */}
                        <div className="flex items-center gap-2.5 p-2.5 bg-cream/60 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                            <FiUser className="w-4 h-4 text-forest" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500">Seller</p>
                            <Link
                              to={`/user/${req.seller?._id}`}
                              className="text-sm font-medium text-gray-800 hover:text-forest transition-colors line-clamp-1"
                            >
                              {req.seller?.name || 'Unknown Seller'}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cancel Confirmation */}
                    {isConfirming && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-scale-in">
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 bg-red-100 rounded-lg shrink-0">
                            <FiAlertTriangle className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-800 mb-1">
                              Cancel this request?
                            </p>
                            <p className="text-xs text-red-600 mb-3">
                              This action cannot be undone. The seller will be notified.
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCancel(req._id)}
                                disabled={cancellingId === req._id}
                                className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium
                                  hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed
                                  transition-colors cursor-pointer"
                              >
                                {cancellingId === req._id ? (
                                  <span className="flex items-center gap-1.5">
                                    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Cancelling...
                                  </span>
                                ) : (
                                  'Yes, Cancel'
                                )}
                              </button>
                              <button
                                onClick={() => setConfirmCancelId(null)}
                                className="px-4 py-1.5 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200
                                  hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                Keep Request
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions Row */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-dark/60">
                      <Link
                        to={`/requests/${req._id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:text-forest-dark transition-colors group"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        View Details
                        <FiChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>

                      {canCancel && !isConfirming && (
                        <button
                          onClick={() => setConfirmCancelId(req._id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                            bg-white text-gray-600 border border-gray-200
                            hover:bg-red-50 hover:text-red-600 hover:border-red-200
                            transition-all duration-200 cursor-pointer"
                        >
                          <FiX className="w-4 h-4" />
                          <span className="hidden sm:inline">Cancel</span>
                        </button>
                      )}

                      {req.status === 'completed' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          <FiCheck className="w-3.5 h-3.5" />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-8 animate-fade-in">
            <Pagination pagination={pagination} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SentRequests;