// RequestDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getRequestAPI,
  acceptRequestAPI,
  rejectRequestAPI,
  completeRequestAPI,
  cancelRequestAPI,
  createChatAPI,
  canReviewAPI,
} from '../../api/axios.js';
import { useAuth } from '../../hooks/useAuth.js';
import TrustBadge from '../../components/common/TrustBadge.jsx';
import Loader from '../../components/common/Loader.jsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  FiCheck,
  FiX,
  FiMessageSquare,
  FiStar,
  FiMapPin,
  FiArrowLeft,
  FiPackage,
  FiClock,
  FiCalendar,
  FiTag,
  FiUser,
  FiDollarSign,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiShield,
} from 'react-icons/fi';

const statusConfig = {
  pending: {
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: <FiClock className="w-5 h-5" />,
    label: 'Pending',
    description: 'Waiting for seller response',
    bgGradient: 'from-amber-50 to-orange-50',
  },
  accepted: {
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: <FiCheckCircle className="w-5 h-5" />,
    label: 'Accepted',
    description: 'Request has been accepted',
    bgGradient: 'from-emerald-50 to-green-50',
  },
  completed: {
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: <FiCheck className="w-5 h-5" />,
    label: 'Completed',
    description: 'Transaction completed successfully',
    bgGradient: 'from-blue-50 to-indigo-50',
  },
  rejected: {
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: <FiXCircle className="w-5 h-5" />,
    label: 'Rejected',
    description: 'Request was declined',
    bgGradient: 'from-red-50 to-pink-50',
  },
  cancelled: {
    color: 'bg-gray-100 text-gray-600 border-gray-300',
    icon: <FiAlertCircle className="w-5 h-5" />,
    label: 'Cancelled',
    description: 'Request was cancelled',
    bgGradient: 'from-gray-50 to-slate-50',
  },
};

const RequestDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      const { data } = await getRequestAPI(id);
      if (data.success) {
        setRequest(data.request);
        if (data.request.status === 'completed') {
          const reviewRes = await canReviewAPI(id);
          setCanReview(reviewRes.data.canReview);
        }
      }
    } catch (error) {
      toast.error('Request not found');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    setActionLoading(action);
    try {
      if (action === 'accept') await acceptRequestAPI(id);
      else if (action === 'reject') await rejectRequestAPI(id);
      else if (action === 'complete') await completeRequestAPI(id);
      else if (action === 'cancel') await cancelRequestAPI(id, {});
      toast.success(
        `Request ${action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : action === 'complete' ? 'completed' : 'cancelled'} successfully!`
      );
      setShowCancelConfirm(false);
      fetchRequest();
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleChat = async (otherUserId) => {
    try {
      const { data } = await createChatAPI({
        participantId: otherUserId,
        itemId: request.item?._id,
      });
      if (data.success) navigate('/chat', { state: { selectedChat: data.chat } });
    } catch (error) {
      toast.error('Failed to start chat');
    }
  };

  if (loading) return <Loader />;
  if (!request)
    return (
      <div className="min-h-screen bg-cream-light flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-10 text-center max-w-md">
          <FiAlertCircle className="w-16 h-16 text-rose-beige mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Request Not Found</h2>
          <p className="text-gray-500 mb-6">
            This request may have been removed or doesn't exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-forest text-white rounded-xl font-medium hover:bg-forest-dark transition-colors cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const isSeller = request.seller?._id === user?._id;
  const isRequester = request.requester?._id === user?._id;
  const otherPerson = isSeller ? request.requester : request.seller;
  const status = statusConfig[request.status] || statusConfig.pending;

  // Timeline steps
  const timelineSteps = [
    {
      label: 'Requested',
      date: request.createdAt,
      done: true,
      icon: <FiPackage className="w-4 h-4" />,
    },
    {
      label: 'Accepted',
      date: request.status !== 'pending' && request.status !== 'rejected' ? request.updatedAt : null,
      done: ['accepted', 'completed'].includes(request.status),
      icon: <FiCheck className="w-4 h-4" />,
    },
    {
      label: 'Completed',
      date: request.completedAt,
      done: request.status === 'completed',
      icon: <FiCheckCircle className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-cream-light">
      {/* Header */}
      <div className="gradient-bg px-4 sm:px-6 lg:px-8 pt-6 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors text-sm cursor-pointer"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Requests
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Request Details</h1>
              <p className="text-white/70 text-sm mt-1">
                ID: {request._id?.slice(-8)?.toUpperCase()}
              </p>
            </div>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border backdrop-blur-sm ${status.color}`}
            >
              {status.icon}
              {status.label}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Status Banner */}
            <div
              className={`rounded-2xl p-4 sm:p-5 bg-gradient-to-r ${status.bgGradient} border ${status.color.split(' ')[2]} animate-slide-up shadow-sm`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/70">{status.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{status.label}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{status.description}</p>
                </div>
              </div>
            </div>

            {/* Item Card */}
            <div className="glass rounded-2xl overflow-hidden shadow-md animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="p-4 sm:p-5 border-b border-cream-dark/50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FiPackage className="w-4 h-4 text-forest" />
                  Item Details
                </h3>
              </div>
              <div className="p-4 sm:p-5">
                <Link
                  to={`/items/${request.item?._id}`}
                  className="flex flex-col sm:flex-row gap-4 group"
                >
                  <div className="w-full sm:w-36 h-44 sm:h-36 rounded-xl overflow-hidden bg-cream-dark shrink-0 relative">
                    {request.item?.images?.[0]?.url ? (
                      <img
                        src={request.item.images[0].url}
                        alt={request.item?.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiPackage className="w-10 h-10 text-rose-beige" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-forest transition-colors mb-2">
                      {request.item?.title || 'Untitled Item'}
                    </h4>
                    <div className="space-y-2">
                      {request.item?.price && (
                        <div className="flex items-center gap-2 text-sm">
                          <FiDollarSign className="w-4 h-4 text-sage" />
                          <span className="font-semibold text-forest-dark text-lg">
                            ₹{request.item.price}
                          </span>
                        </div>
                      )}
                      {request.item?.condition && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiShield className="w-4 h-4 text-sage" />
                          <span className="capitalize">{request.item.condition}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Request Information */}
            <div
              className="glass rounded-2xl overflow-hidden shadow-md animate-slide-up"
              style={{ animationDelay: '0.15s' }}
            >
              <div className="p-4 sm:p-5 border-b border-cream-dark/50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FiInfo className="w-4 h-4 text-forest" />
                  Request Information
                </h3>
              </div>
              <div className="p-4 sm:p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Request Type */}
                  <div className="flex items-center gap-3 p-3 bg-cream/50 rounded-xl">
                    <div className="p-2 bg-forest/10 rounded-lg">
                      <FiTag className="w-4 h-4 text-forest" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Request Type
                      </p>
                      <p className="text-sm font-semibold text-gray-900 capitalize">
                        {request.requestType}
                      </p>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="flex items-center gap-3 p-3 bg-cream/50 rounded-xl">
                    <div className="p-2 bg-forest/10 rounded-lg">
                      <FiCalendar className="w-4 h-4 text-forest" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Created</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {format(new Date(request.createdAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {request.message && (
                  <div className="p-4 bg-cream/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FiMessageSquare className="w-4 h-4 text-sage" />
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Message
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{request.message}</p>
                  </div>
                )}

                {/* Meetup Location */}
                {request.meetupLocation && (
                  <div className="p-4 bg-cream/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FiMapPin className="w-4 h-4 text-sage" />
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Meetup Location
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">{request.meetupLocation}</p>
                  </div>
                )}

                {/* Rental Dates */}
                {request.rentalStartDate && (
                  <div className="p-4 bg-cream/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCalendar className="w-4 h-4 text-sage" />
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Rental Period
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">
                      {format(new Date(request.rentalStartDate), 'MMM dd, yyyy')} —{' '}
                      {format(new Date(request.rentalEndDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                )}

                {/* Completed Date */}
                {request.completedAt && (
                  <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                      <p className="text-xs text-emerald-600 uppercase tracking-wide font-medium">
                        Completed
                      </p>
                    </div>
                    <p className="text-sm text-emerald-800 font-medium">
                      {format(new Date(request.completedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            {!['rejected', 'cancelled'].includes(request.status) && (
              <div
                className="glass rounded-2xl overflow-hidden shadow-md animate-slide-up"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="p-4 sm:p-5 border-b border-cream-dark/50">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FiClock className="w-4 h-4 text-forest" />
                    Progress Timeline
                  </h3>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-cream-dark mx-8">
                      <div
                        className="h-full bg-gradient-to-r from-forest to-sage transition-all duration-700 ease-out rounded-full"
                        style={{
                          width:
                            request.status === 'completed'
                              ? '100%'
                              : request.status === 'accepted'
                                ? '50%'
                                : '0%',
                        }}
                      />
                    </div>

                    {timelineSteps.map((step, i) => (
                      <div key={i} className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                            step.done
                              ? 'bg-forest text-white border-forest shadow-md shadow-forest/20'
                              : 'bg-white text-gray-400 border-cream-dark'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <p
                          className={`text-xs font-medium mt-2 ${step.done ? 'text-forest-dark' : 'text-gray-400'}`}
                        >
                          {step.label}
                        </p>
                        {step.date && step.done && (
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {format(new Date(step.date), 'MMM dd')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-5">
            {/* Other Person Card */}
            <div
              className="glass rounded-2xl overflow-hidden shadow-md animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="p-4 sm:p-5 border-b border-cream-dark/50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FiUser className="w-4 h-4 text-forest" />
                  {isSeller ? 'Requester' : 'Seller'}
                </h3>
              </div>
              <div className="p-4 sm:p-5">
                <Link
                  to={`/user/${otherPerson?._id}`}
                  className="block text-center group mb-4"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-forest to-sage flex items-center justify-center mx-auto mb-3 shadow-lg shadow-forest/20 group-hover:shadow-xl group-hover:shadow-forest/30 transition-shadow">
                    {otherPerson?.avatar?.url ? (
                      <img
                        src={otherPerson.avatar.url}
                        alt={otherPerson?.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {otherPerson?.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-forest transition-colors">
                    {otherPerson?.name || 'Unknown User'}
                  </h4>
                  {otherPerson?.department && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      {otherPerson.department}
                      {otherPerson?.semester && ` • Sem ${otherPerson.semester}`}
                    </p>
                  )}
                </Link>

                <div className="flex justify-center mb-4">
                  <TrustBadge score={otherPerson?.trustScore} />
                </div>

                <button
                  onClick={() => handleChat(otherPerson?._id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-forest text-white rounded-xl font-medium
                    hover:bg-forest-dark shadow-md shadow-forest/20 hover:shadow-lg hover:shadow-forest/30
                    transition-all duration-300 cursor-pointer btn-ripple"
                >
                  <FiMessageSquare className="w-4 h-4" />
                  Start Chat
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className="glass rounded-2xl overflow-hidden shadow-md animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="p-4 sm:p-5 border-b border-cream-dark/50">
                <h3 className="font-semibold text-gray-900">Actions</h3>
              </div>
              <div className="p-4 sm:p-5 space-y-3">
                {/* Seller pending actions */}
                {isSeller && request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction('accept')}
                      disabled={actionLoading === 'accept'}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
                        bg-gradient-to-r from-forest to-sage text-white
                        shadow-md shadow-forest/25 hover:shadow-lg hover:shadow-forest/35
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-300 cursor-pointer btn-ripple"
                    >
                      <FiCheck className="w-5 h-5" />
                      {actionLoading === 'accept' ? 'Accepting...' : 'Accept Request'}
                    </button>
                    <button
                      onClick={() => handleAction('reject')}
                      disabled={actionLoading === 'reject'}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
                        bg-white text-red-600 border-2 border-red-200
                        hover:bg-red-50 hover:border-red-300
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-300 cursor-pointer"
                    >
                      <FiX className="w-5 h-5" />
                      {actionLoading === 'reject' ? 'Rejecting...' : 'Reject Request'}
                    </button>
                  </>
                )}

                {/* Accepted actions */}
                {request.status === 'accepted' && (
                  <>
                    <button
                      onClick={() => handleAction('complete')}
                      disabled={actionLoading === 'complete'}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
                        bg-gradient-to-r from-forest to-sage text-white
                        shadow-md shadow-forest/25 hover:shadow-lg hover:shadow-forest/35
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-300 cursor-pointer btn-ripple"
                    >
                      <FiCheckCircle className="w-5 h-5" />
                      {actionLoading === 'complete' ? 'Completing...' : 'Mark as Complete'}
                    </button>

                    {!showCancelConfirm ? (
                      <button
                        onClick={() => setShowCancelConfirm(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
                          bg-white text-gray-600 border-2 border-gray-200
                          hover:bg-gray-50 hover:border-gray-300 hover:text-red-600
                          transition-all duration-300 cursor-pointer"
                      >
                        <FiX className="w-5 h-5" />
                        Cancel Request
                      </button>
                    ) : (
                      <div className="p-3 bg-red-50 rounded-xl border border-red-200 animate-scale-in">
                        <p className="text-sm text-red-700 mb-3 font-medium">
                          Are you sure you want to cancel?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction('cancel')}
                            disabled={actionLoading === 'cancel'}
                            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700
                              disabled:opacity-50 transition-colors cursor-pointer"
                          >
                            {actionLoading === 'cancel' ? 'Cancelling...' : 'Yes, Cancel'}
                          </button>
                          <button
                            onClick={() => setShowCancelConfirm(false)}
                            className="flex-1 px-3 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200
                              hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            No, Keep
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Completed - Review */}
                {request.status === 'completed' && canReview && (
                  <Link
                    to={`/review/${request._id}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
                      bg-gradient-to-r from-amber-400 to-orange-400 text-white
                      shadow-md shadow-amber-400/25 hover:shadow-lg hover:shadow-amber-400/35
                      transition-all duration-300"
                  >
                    <FiStar className="w-5 h-5" />
                    Write a Review
                  </Link>
                )}

                {/* Terminal states */}
                {['rejected', 'cancelled'].includes(request.status) && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">No actions available</p>
                  </div>
                )}

                {request.status === 'completed' && !canReview && (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiCheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-sm text-gray-500">This transaction is complete</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Overlay Background (Mobile) */}
      {showCancelConfirm && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setShowCancelConfirm(false)}
        />
      )}
    </div>
  );
};

export default RequestDetail;