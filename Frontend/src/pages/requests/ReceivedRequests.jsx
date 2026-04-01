// ReceivedRequests.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReceivedRequestsAPI, acceptRequestAPI, rejectRequestAPI } from '../../api/axios.js';
import Pagination from '../../components/common/Pagination.jsx';
import Loader from '../../components/common/Loader.jsx';
import TrustBadge from '../../components/common/TrustBadge.jsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  FiCheck,
  FiX,
  FiInbox,
  FiFilter,
  FiClock,
  FiPackage,
  FiMapPin,
  FiMessageCircle,
  FiChevronRight,
  FiUser,
  FiCalendar,
  FiTag,
  FiAlertCircle,
} from 'react-icons/fi';

const statusConfig = {
  pending: {
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
    icon: <FiClock className="w-3 h-3" />,
  },
  accepted: {
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: <FiCheck className="w-3 h-3" />,
  },
  completed: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    dot: 'bg-blue-500',
    icon: <FiPackage className="w-3 h-3" />,
  },
  rejected: {
    color: 'bg-red-100 text-red-800 border-red-200',
    dot: 'bg-red-500',
    icon: <FiX className="w-3 h-3" />,
  },
  cancelled: {
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    dot: 'bg-gray-400',
    icon: <FiAlertCircle className="w-3 h-3" />,
  },
};

const ReceivedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, page]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await getReceivedRequestsAPI({ status: statusFilter, page });
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

  const handleAccept = async (id) => {
    setActionLoading(id + '-accept');
    try {
      await acceptRequestAPI(id);
      toast.success('Request accepted successfully!');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to accept request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id + '-reject');
    try {
      await rejectRequestAPI(id);
      toast.success('Request rejected');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to reject request');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Loader />;

  const filterOptions = [
    { value: '', label: 'All Requests' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="min-h-screen bg-cream-light">
      {/* Header Section */}
      <div className="gradient-bg px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
              <FiInbox className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Received Requests
            </h1>
          </div>
          <p className="text-white/80 text-sm sm:text-base ml-14">
            Manage incoming requests for your listed items
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 pb-12">
        {/* Filter Card */}
        <div className="glass rounded-2xl p-4 sm:p-5 mb-6 animate-slide-up shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 text-forest-dark font-semibold text-sm">
              <FiFilter className="w-4 h-4" />
              <span>Filter by Status</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setStatusFilter(opt.value);
                    setPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer
                    ${
                      statusFilter === opt.value
                        ? 'bg-forest text-white shadow-md shadow-forest/25 scale-105'
                        : 'bg-white text-gray-600 hover:bg-cream-dark hover:text-forest-dark border border-gray-200'
                    }`}
                >
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
            {pagination?.total && (
              <span> of {pagination.total}</span>
            )}
          </p>
        )}

        {/* Empty State */}
        {requests.length === 0 ? (
          <div className="glass rounded-2xl p-10 sm:p-16 text-center animate-scale-in shadow-md">
            <div className="w-20 h-20 bg-cream-dark rounded-full flex items-center justify-center mx-auto mb-5">
              <FiInbox className="w-10 h-10 text-rose-beige" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No requests found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              {statusFilter
                ? `You don't have any ${statusFilter} requests at the moment.`
                : "You haven't received any requests yet. Once someone is interested in your items, their requests will appear here."}
            </p>
            {statusFilter && (
              <button
                onClick={() => setStatusFilter('')}
                className="mt-5 px-5 py-2 bg-forest text-white rounded-xl text-sm font-medium hover:bg-forest-dark transition-colors cursor-pointer"
              >
                View All Requests
              </button>
            )}
          </div>
        ) : (
          /* Request Cards */
          <div className="space-y-4">
            {requests.map((req, index) => {
              const status = statusConfig[req.status] || statusConfig.pending;
              return (
                <div
                  key={req._id}
                  className="glass rounded-2xl overflow-hidden shadow-md card-hover animate-slide-up"
                  style={{ animationDelay: `${index * 0.07}s`, animationFillMode: 'both' }}
                >
                  <div className="p-4 sm:p-5 lg:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Item Image */}
                      <Link
                        to={`/items/${req.item?._id}`}
                        className="shrink-0 group"
                      >
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
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </Link>

                      {/* Request Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                          <div>
                            <Link
                              to={`/items/${req.item?._id}`}
                              className="text-base lg:text-lg font-semibold text-gray-900 hover:text-forest transition-colors line-clamp-1"
                            >
                              {req.item?.title || 'Untitled Item'}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}
                              >
                                {status.icon}
                                {req.status?.charAt(0).toUpperCase() + req.status?.slice(1)}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cream-dark text-forest-dark border border-cream">
                                <FiTag className="w-3 h-3" />
                                {req.requestType?.charAt(0).toUpperCase() +
                                  req.requestType?.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 whitespace-nowrap">
                            <FiCalendar className="w-3.5 h-3.5" />
                            {format(new Date(req.createdAt), 'MMM dd, yyyy')}
                          </div>
                        </div>

                        {/* Requester Info */}
                        <div className="flex items-center gap-3 p-2.5 bg-cream/60 rounded-xl mb-3">
                          <div className="w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                            <FiUser className="w-4 h-4 text-forest" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Link
                                to={`/user/${req.requester?._id}`}
                                className="text-sm font-medium text-gray-800 hover:text-forest transition-colors"
                              >
                                {req.requester?.name || 'Unknown'}
                              </Link>
                              <TrustBadge score={req.requester?.trustScore} />
                            </div>
                          </div>
                        </div>

                        {/* Message & Location */}
                        <div className="space-y-1.5">
                          {req.message && (
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <FiMessageCircle className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                              <p className="line-clamp-2">{req.message}</p>
                            </div>
                          )}
                          {req.meetupLocation && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FiMapPin className="w-4 h-4 text-sage shrink-0" />
                              <span className="line-clamp-1">{req.meetupLocation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-dark/60">
                      <Link
                        to={`/requests/${req._id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:text-forest-dark transition-colors group"
                      >
                        View Details
                        <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>

                      {req.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReject(req._id)}
                            disabled={actionLoading === req._id + '-reject'}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                              bg-red-50 text-red-600 border border-red-200
                              hover:bg-red-100 hover:border-red-300
                              disabled:opacity-50 disabled:cursor-not-allowed
                              transition-all duration-200 cursor-pointer btn-ripple"
                          >
                            <FiX className="w-4 h-4" />
                            <span className="hidden sm:inline">Reject</span>
                          </button>
                          <button
                            onClick={() => handleAccept(req._id)}
                            disabled={actionLoading === req._id + '-accept'}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                              bg-forest text-white shadow-md shadow-forest/25
                              hover:bg-forest-dark hover:shadow-lg hover:shadow-forest/30
                              disabled:opacity-50 disabled:cursor-not-allowed
                              transition-all duration-200 cursor-pointer btn-ripple"
                          >
                            <FiCheck className="w-4 h-4" />
                            <span className="hidden sm:inline">Accept</span>
                          </button>
                        </div>
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

export default ReceivedRequests;