import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPublicProfileAPI, createChatAPI } from '../../api/axios.js';
import { useAuth } from '../../hooks/useAuth.js';
import TrustBadge from '../../components/common/TrustBadge.jsx';
import StarRating from '../../components/common/StarRating.jsx';
import ItemCard from '../../components/items/ItemCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  FiMessageSquare, FiAlertTriangle, FiUser, FiBook,
  FiCalendar, FiClock, FiShield, FiStar, FiCheckCircle,
  FiCreditCard, FiTrendingUp, FiArrowLeft, FiPackage
} from 'react-icons/fi';

const PublicProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('listings');

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data } = await getPublicProfileAPI(userId);
      if (data.success) {
        setProfile(data.user);
        setItems(data.items || []);
        setReviews(data.reviews || []);
      }
    } catch (error) {
      toast.error('User not found');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    setChatLoading(true);
    try {
      const { data } = await createChatAPI({ participantId: userId });
      if (data.success) {
        navigate('/chat', { state: { selectedChat: data.chat } });
      }
    } catch (error) {
      toast.error('Failed to start chat');
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (!profile) {
    return (
      <div className="min-h-screen bg-[var(--color-cream-light)] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[var(--color-cream)] flex items-center justify-center">
            <FiUser size={32} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">User Not Found</h2>
          <p className="text-sm text-gray-500 mb-4">This profile doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="
              inline-flex items-center gap-2 px-4 py-2.5
              rounded-xl text-sm font-semibold
              gradient-bg text-white cursor-pointer
              hover:scale-[1.02] transition-all
            "
          >
            <FiArrowLeft size={14} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === userId;

  const stats = [
    {
      label: 'Trust Score',
      value: profile.trustScore || 50,
      suffix: '/100',
      icon: <FiShield size={16} />,
      color: 'text-[var(--color-forest)]',
      bg: 'bg-[var(--color-mint-light)]'
    },
    {
      label: 'Transactions',
      value: profile.totalTransactions || 0,
      icon: <FiCreditCard size={16} />,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Successful',
      value: profile.successfulTransactions || 0,
      icon: <FiCheckCircle size={16} />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Listings',
      value: items.length,
      icon: <FiPackage size={16} />,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)]">

      {/* ══ HERO HEADER ══ */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-forest-dark)] via-[var(--color-forest)] to-[var(--color-sage)]" />
        <div className="
          absolute inset-0 opacity-10
          bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]
          bg-[size:40px_40px]
        " />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4 blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-24">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="
              inline-flex items-center gap-2 text-white/70 hover:text-white
              text-sm font-medium mb-6 transition-colors cursor-pointer
            "
          >
            <FiArrowLeft size={16} />
            Back
          </button>

          {/* Profile info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="
                w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden
                border-4 border-white/30 shadow-2xl
                bg-white/20 backdrop-blur-sm
              ">
                {profile.profileImage?.url ? (
                  <img
                    src={profile.profileImage.url}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-extrabold">
                    {profile.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="
                absolute -bottom-1 -right-1
                w-8 h-8 rounded-full bg-emerald-500
                flex items-center justify-center text-white
                shadow-lg border-2 border-white
              ">
                <FiCheckCircle size={13} />
              </div>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left text-white flex-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-1">
                {profile.name}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-white/70 text-sm">
                <span className="flex items-center gap-1.5">
                  <FiBook size={13} />
                  {profile.department}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiCalendar size={13} />
                  Semester {profile.semester}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiClock size={13} />
                  Joined {format(new Date(profile.createdAt), 'MMM yyyy')}
                </span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
                <TrustBadge score={profile.trustScore} />
              </div>
            </div>

            {/* Action buttons */}
            {!isOwnProfile && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleChat}
                  disabled={chatLoading}
                  className="
                    flex items-center gap-2 px-5 py-3 rounded-xl
                    bg-white text-[var(--color-forest)] font-bold text-sm
                    shadow-lg hover:shadow-xl hover:scale-[1.02]
                    active:scale-[0.98] disabled:opacity-60
                    cursor-pointer transition-all duration-200
                  "
                >
                  {chatLoading ? (
                    <div className="w-4 h-4 border-2 border-[var(--color-forest)]/30 border-t-[var(--color-forest)] rounded-full animate-spin" />
                  ) : (
                    <FiMessageSquare size={16} />
                  )}
                  Message
                </button>
                <Link
                  to={`/report?type=user&id=${userId}`}
                  className="
                    flex items-center gap-2 px-4 py-3 rounded-xl
                    bg-white/15 backdrop-blur-sm border border-white/20
                    text-white text-sm font-semibold
                    hover:bg-red-500/80 hover:border-red-400/50
                    transition-all duration-200 cursor-pointer
                  "
                >
                  <FiAlertTriangle size={15} />
                  <span className="hidden sm:inline">Report</span>
                </Link>
              </div>
            )}

            {isOwnProfile && (
              <Link
                to="/profile"
                className="
                  flex items-center gap-2 px-5 py-3 rounded-xl
                  bg-white/15 backdrop-blur-sm border border-white/20
                  text-white text-sm font-semibold
                  hover:bg-white/25 transition-all duration-200 cursor-pointer
                "
              >
                <FiUser size={15} />
                My Profile
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ══ STATS ══ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-14 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="
                bg-white/90 backdrop-blur-xl rounded-2xl p-4
                border border-[var(--color-rose-beige)]/40
                shadow-lg shadow-black/5
                animate-slide-up
              "
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-2`}>
                {stat.icon}
              </div>
              <p className="text-xl font-extrabold text-gray-800">
                {stat.value}
                {stat.suffix && (
                  <span className="text-xs font-medium text-gray-400">{stat.suffix}</span>
                )}
              </p>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ TABS ══ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
        <div className="
          flex gap-1 p-1.5 rounded-2xl
          bg-white/70 backdrop-blur-sm
          border border-[var(--color-rose-beige)]/40
          shadow-sm w-fit
        ">
          {[
            { id: 'listings', label: `Listings (${items.length})`, icon: <FiPackage size={15} /> },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: <FiStar size={15} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl
                text-sm font-semibold cursor-pointer
                transition-all duration-200
                ${activeTab === tab.id
                  ? 'gradient-bg text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-[var(--color-cream)]'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══ TAB CONTENT ══ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-4 pb-10">

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div className="animate-slide-up">
            {items.length === 0 ? (
              <div className="
                bg-white/90 backdrop-blur-xl rounded-2xl
                border border-[var(--color-rose-beige)]/40
                shadow-sm p-12 text-center
              ">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[var(--color-cream)] flex items-center justify-center">
                  <FiPackage size={32} className="text-gray-300" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-1">No Listings Yet</h4>
                <p className="text-sm text-gray-500">
                  {profile.name} hasn't listed any items yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, i) => (
                  <div
                    key={item._id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <ItemCard item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="
            bg-white/90 backdrop-blur-xl rounded-2xl
            border border-[var(--color-rose-beige)]/40
            shadow-sm overflow-hidden animate-slide-up
          ">
            <div className="p-5 border-b border-[var(--color-rose-beige)]/30 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FiStar size={16} className="text-amber-500" />
                Reviews ({reviews.length})
              </h3>
            </div>

            {reviews.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[var(--color-cream)] flex items-center justify-center">
                  <FiStar size={32} className="text-gray-300" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-1">No Reviews Yet</h4>
                <p className="text-sm text-gray-500">
                  {profile.name} hasn't received any reviews yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-rose-beige)]/20">
                {reviews.map((review, i) => (
                  <div
                    key={review._id}
                    className="p-5 hover:bg-[var(--color-cream)]/30 transition-colors duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="
                        w-10 h-10 rounded-xl flex-shrink-0
                        bg-gradient-to-br from-[var(--color-forest)] to-[var(--color-sage)]
                        flex items-center justify-center text-white font-bold text-sm
                      ">
                        {review.reviewer?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm">
                              {review.reviewer?.name || 'Anonymous'}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <StarRating rating={review.rating} readonly size={14} />
                              <span className="text-xs text-gray-400">
                                {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                              </span>
                            </div>
                          </div>
                          <span className={`
                            px-2.5 py-1 rounded-full text-xs font-bold
                            ${review.rating >= 4
                              ? 'bg-emerald-100 text-emerald-700'
                              : review.rating >= 3
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                            }
                          `}>
                            {review.rating}/5
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                            "{review.comment}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;