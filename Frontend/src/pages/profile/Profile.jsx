import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { getUserReviewsAPI } from '../../api/axios.js';
import TrustBadge from '../../components/common/TrustBadge.jsx';
import StarRating from '../../components/common/StarRating.jsx';
import { format } from 'date-fns';
import {
  FiEdit, FiMail, FiBook, FiCalendar, FiShield,
  FiLock, FiUser, FiAward, FiStar, FiCheckCircle,
  FiTrendingUp, FiCreditCard, FiMessageSquare,
  FiCamera, FiChevronRight, FiClock
} from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    try {
      const { data } = await getUserReviewsAPI(user._id);
      if (data.success) {
        setReviews(data.reviews);
        setAvgRating(data.averageRating);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: 'Trust Score',
      value: user?.trustScore || 50,
      suffix: '/100',
      icon: <FiShield size={18} />,
      color: 'text-[var(--color-forest)]',
      bg: 'bg-[var(--color-mint-light)]'
    },
    {
      label: 'Transactions',
      value: user?.totalTransactions || 0,
      icon: <FiCreditCard size={18} />,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Successful',
      value: user?.successfulTransactions || 0,
      icon: <FiCheckCircle size={18} />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Avg Rating',
      value: avgRating?.toFixed(1) || '0.0',
      suffix: '/5',
      icon: <FiStar size={18} />,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiUser size={15} /> },
    { id: 'reviews', label: `Reviews (${reviews.length})`, icon: <FiStar size={15} /> },
    { id: 'idcard', label: 'ID Card', icon: <FiShield size={15} /> }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)]">

      {/* ══ HERO HEADER ══ */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-forest-dark)] via-[var(--color-forest)] to-[var(--color-sage)]" />
        <div className="
          absolute inset-0 opacity-10
          bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]
          bg-[size:40px_40px]
        " />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[var(--color-mint)]/20 translate-y-1/2 -translate-x-1/4 blur-2xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-24">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-white font-extrabold text-lg flex items-center gap-2">
              <FiUser size={20} />
              My Profile
            </h1>
            <Link
              to="/profile/edit"
              className="
                flex items-center gap-2 px-4 py-2.5 rounded-xl
                bg-white/15 backdrop-blur-sm border border-white/20
                text-white text-sm font-semibold
                hover:bg-white/25 transition-all duration-200
                cursor-pointer
              "
            >
              <FiEdit size={14} />
              Edit Profile
            </Link>
          </div>

          {/* Profile card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            {/* Avatar */}
            <div className="relative group">
              <div className="
                w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden
                border-4 border-white/30 shadow-2xl
                bg-white/20 backdrop-blur-sm
              ">
                {user?.profileImage?.url ? (
                  <img
                    src={user.profileImage.url}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-extrabold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>
              <Link
                to="/profile/edit"
                className="
                  absolute -bottom-1 -right-1
                  w-9 h-9 rounded-xl gradient-bg
                  flex items-center justify-center
                  text-white shadow-lg
                  opacity-0 group-hover:opacity-100
                  transition-all duration-200 cursor-pointer
                "
              >
                <FiCamera size={14} />
              </Link>
              {/* Verified badge */}
              {user?.isEmailVerified && (
                <div className="
                  absolute -top-1 -right-1
                  w-7 h-7 rounded-full bg-emerald-500
                  flex items-center justify-center text-white
                  shadow-md border-2 border-white
                ">
                  <FiCheckCircle size={12} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-center sm:text-left text-white flex-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-1">
                {user?.name}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-white/70 text-sm">
                <span className="flex items-center gap-1.5">
                  <FiMail size={13} />
                  {user?.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiBook size={13} />
                  {user?.department}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiCalendar size={13} />
                  Semester {user?.semester}
                </span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
                <TrustBadge score={user?.trustScore} />
                <span className="text-white/50 text-xs flex items-center gap-1">
                  <FiClock size={11} />
                  Joined {user?.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ STATS CARDS (overlapping hero) ══ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-14 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="
                bg-white/90 backdrop-blur-xl rounded-2xl p-4
                border border-[var(--color-rose-beige)]/40
                shadow-lg shadow-black/5
                hover:shadow-xl hover:-translate-y-0.5
                transition-all duration-200
                animate-slide-up
              "
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-extrabold text-gray-800">
                {stat.value}
                {stat.suffix && (
                  <span className="text-sm font-medium text-gray-400">{stat.suffix}</span>
                )}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</p>
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
          {tabs.map((tab) => (
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
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ══ TAB CONTENT ══ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-4 pb-10">

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-slide-up">

            {/* Profile Details Card */}
            <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl rounded-2xl border border-[var(--color-rose-beige)]/40 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[var(--color-rose-beige)]/30">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FiUser size={16} className="text-[var(--color-forest)]" />
                  Profile Details
                </h3>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: 'Full Name', value: user?.name, icon: <FiUser size={14} /> },
                  { label: 'Email', value: user?.email, icon: <FiMail size={14} /> },
                  { label: 'Department', value: user?.department, icon: <FiBook size={14} /> },
                  { label: 'Semester', value: `Semester ${user?.semester}`, icon: <FiCalendar size={14} /> },
                  { label: 'Account Status', value: user?.accountStatus, icon: <FiCheckCircle size={14} />,
                    badge: true,
                    badgeColor: user?.accountStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  },
                  { label: 'Email Verified', value: user?.isEmailVerified ? 'Yes' : 'No', icon: <FiShield size={14} />,
                    badge: true,
                    badgeColor: user?.isEmailVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  },
                  { label: 'Member Since', value: user?.createdAt ? format(new Date(user.createdAt), 'MMMM dd, yyyy') : 'N/A', icon: <FiClock size={14} /> }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="
                      flex items-center justify-between
                      py-3 px-4 rounded-xl
                      bg-[var(--color-cream)]/50
                      border border-[var(--color-rose-beige)]/20
                    "
                  >
                    <div className="flex items-center gap-3 text-gray-500">
                      <span className="text-[var(--color-forest)]">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.badgeColor}`}>
                        {item.value}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="space-y-4">
              {/* Trust Score Card */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-[var(--color-rose-beige)]/40 shadow-sm p-5">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <FiAward size={16} className="text-[var(--color-forest)]" />
                  Trust Score
                </h3>
                <div className="text-center">
                  <div className="relative w-28 h-28 mx-auto mb-3">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                      <circle
                        cx="60" cy="60" r="52" fill="none"
                        stroke="url(#trustGradient)" strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${(user?.trustScore || 50) * 3.27} 327`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="var(--color-forest)" />
                          <stop offset="100%" stopColor="var(--color-sage)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-extrabold text-gray-800">
                        {user?.trustScore || 50}
                      </span>
                    </div>
                  </div>
                  <TrustBadge score={user?.trustScore} />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-[var(--color-rose-beige)]/40 shadow-sm p-5">
                <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Edit Profile', icon: <FiEdit size={15} />, to: '/profile/edit', color: 'text-[var(--color-forest)]' },
                    { label: 'Change Password', icon: <FiLock size={15} />, to: '/profile/edit', color: 'text-amber-600' },
                    { label: 'My Listings', icon: <FiTrendingUp size={15} />, to: '/my-items', color: 'text-blue-600' },
                    { label: 'Messages', icon: <FiMessageSquare size={15} />, to: '/chat', color: 'text-purple-600' }
                  ].map((action, i) => (
                    <Link
                      key={i}
                      to={action.to}
                      className="
                        flex items-center justify-between
                        p-3 rounded-xl
                        hover:bg-[var(--color-cream)] border border-transparent
                        hover:border-[var(--color-rose-beige)]/30
                        transition-all duration-200 cursor-pointer group
                      "
                    >
                      <div className="flex items-center gap-3">
                        <span className={action.color}>{action.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{action.label}</span>
                      </div>
                      <FiChevronRight
                        size={14}
                        className="text-gray-300 group-hover:text-gray-500 transition-colors"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-[var(--color-rose-beige)]/40 shadow-sm overflow-hidden animate-slide-up">
            <div className="p-5 border-b border-[var(--color-rose-beige)]/30 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FiStar size={16} className="text-amber-500" />
                Reviews ({reviews.length})
              </h3>
              {avgRating > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating rating={avgRating} readonly size={16} />
                  <span className="text-sm font-bold text-gray-700">{avgRating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="p-12 text-center">
                <div className="
                  w-20 h-20 mx-auto mb-4 rounded-2xl
                  bg-[var(--color-cream)] flex items-center justify-center
                ">
                  <FiStar size={32} className="text-gray-300" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-1">No Reviews Yet</h4>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Complete transactions to receive reviews from other students.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-rose-beige)]/20">
                {reviews.map((review, i) => (
                  <div
                    key={review._id}
                    className="p-5 hover:bg-[var(--color-cream)]/30 transition-colors duration-200"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Reviewer avatar */}
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

        {/* ID Card Tab */}
        {activeTab === 'idcard' && (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-[var(--color-rose-beige)]/40 shadow-sm overflow-hidden animate-slide-up">
            <div className="p-5 border-b border-[var(--color-rose-beige)]/30">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FiShield size={16} className="text-[var(--color-forest)]" />
                Student ID Card
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Your verified SHUATS student identification
              </p>
            </div>
            <div className="p-5">
              {user?.idCardImage?.url ? (
                <div className="
                  rounded-2xl overflow-hidden border border-[var(--color-rose-beige)]/40
                  shadow-md max-w-lg mx-auto
                ">
                  <img
                    src={user.idCardImage.url}
                    alt="Student ID Card"
                    className="w-full h-auto object-contain"
                  />
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="
                    w-20 h-20 mx-auto mb-4 rounded-2xl
                    bg-[var(--color-cream)] flex items-center justify-center
                  ">
                    <FiShield size={32} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500">No ID card image uploaded</p>
                </div>
              )}
              <div className="
                mt-4 p-4 rounded-xl
                bg-[var(--color-mint-light)] border border-[var(--color-mint)]/30
              ">
                <p className="text-xs text-[var(--color-forest-dark)] flex items-center gap-2">
                  <FiShield size={13} />
                  Your ID card is securely stored and only visible to you and administrators.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;