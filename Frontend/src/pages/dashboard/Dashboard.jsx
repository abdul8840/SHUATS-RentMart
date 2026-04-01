// Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStatsAPI } from '../../api/axios.js';
import TrustBadge from '../../components/common/TrustBadge.jsx';
import Loader from '../../components/common/Loader.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import {
  FiShoppingBag,
  FiDollarSign,
  FiRepeat,
  FiStar,
  FiPlus,
  FiInbox,
  FiSend,
  FiTrendingUp,
  FiChevronRight,
  FiCalendar,
  FiCheckCircle,
  FiActivity,
  FiAward,
  FiBarChart2,
  FiLayout,
  FiZap,
  FiArrowUpRight,
} from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await getDashboardStatsAPI();
      if (data.success) setStats(data.stats);
    } catch (error) {
      console.error('Dashboard stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const statCards = [
    {
      icon: <FiShoppingBag className="w-6 h-6" />,
      value: stats?.activeListings || 0,
      label: 'Active Listings',
      color: 'from-forest to-sage',
      iconBg: 'bg-forest/10 text-forest',
      change: '+3 this week',
    },
    {
      icon: <FiDollarSign className="w-6 h-6" />,
      value: stats?.soldItems || 0,
      label: 'Items Sold',
      color: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-50 text-blue-600',
      change: 'Total sales',
    },
    {
      icon: <FiRepeat className="w-6 h-6" />,
      value: stats?.rentedItems || 0,
      label: 'Items Rented',
      color: 'from-amber-500 to-orange-500',
      iconBg: 'bg-amber-50 text-amber-600',
      change: 'Active rentals',
    },
    {
      icon: <FiStar className="w-6 h-6" />,
      value: stats?.trustScore || 50,
      label: 'Trust Score',
      color: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-50 text-purple-600',
      isTrust: true,
    },
  ];

  const quickActions = [
    {
      icon: <FiPlus className="w-5 h-5" />,
      label: 'Create New Listing',
      description: 'List a new item for sale or rent',
      to: '/items/create',
      color: 'from-forest to-sage',
      iconBg: 'bg-forest text-white',
    },
    {
      icon: <FiInbox className="w-5 h-5" />,
      label: 'Received Requests',
      description: 'View and manage incoming requests',
      to: '/requests/received',
      color: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-500 text-white',
    },
    {
      icon: <FiSend className="w-5 h-5" />,
      label: 'Sent Requests',
      description: 'Track requests you\'ve sent',
      to: '/requests/sent',
      color: 'from-amber-500 to-orange-500',
      iconBg: 'bg-amber-500 text-white',
    },
    {
      icon: <FiShoppingBag className="w-5 h-5" />,
      label: 'Manage Listings',
      description: 'Edit or remove your listings',
      to: '/my-listings',
      color: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-500 text-white',
    },
  ];

  const trustPercentage = Math.min(100, Math.max(0, stats?.trustScore || 50));
  const successRate =
    stats?.totalTransactions > 0
      ? Math.round(((stats?.successfulTransactions || 0) / stats.totalTransactions) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-cream-light">
      {/* Header */}
      <div className="gradient-bg px-4 sm:px-6 lg:px-8 pt-8 pb-20 sm:pb-24 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FiLayout className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  Dashboard
                </h1>
              </div>
              <p className="text-white/70 text-sm sm:text-base ml-14">
                Welcome back, {user?.name?.split(' ')[0]}! Here's your overview.
              </p>
            </div>
            <Link
              to="/items/create"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-forest-dark rounded-xl
                font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <FiPlus className="w-4 h-4" />
              New Listing
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 sm:-mt-16 pb-12">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-4 sm:p-5 shadow-lg card-hover animate-slide-up relative overflow-hidden group"
              style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}
            >
              {/* Gradient accent */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`}
              />

              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 ${stat.iconBg} rounded-xl`}>{stat.icon}</div>
                {!stat.isTrust && (
                  <FiArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-forest transition-colors" />
                )}
              </div>

              <div className="mb-1">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {stat.value}
                  {stat.isTrust && <span className="text-lg text-gray-400">/100</span>}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 font-medium">{stat.label}</p>

              {stat.isTrust && (
                <div className="mt-3">
                  <TrustBadge score={stat.value} />
                </div>
              )}

              {stat.change && !stat.isTrust && (
                <p className="text-[11px] text-sage-dark font-medium mt-2 flex items-center gap-1">
                  <FiTrendingUp className="w-3 h-3" />
                  {stat.change}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Transaction Summary */}
          <div
            className="lg:col-span-2 glass rounded-2xl overflow-hidden shadow-md animate-slide-up"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            <div className="p-4 sm:p-5 border-b border-cream-dark/50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FiBarChart2 className="w-5 h-5 text-forest" />
                Transaction Summary
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
                {/* Total Transactions */}
                <div className="flex items-center gap-4 p-4 bg-cream/50 rounded-xl">
                  <div className="p-2.5 bg-forest/10 rounded-xl shrink-0">
                    <FiActivity className="w-5 h-5 text-forest" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.totalTransactions || 0}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">Total Transactions</p>
                  </div>
                </div>

                {/* Successful */}
                <div className="flex items-center gap-4 p-4 bg-emerald-50/80 rounded-xl">
                  <div className="p-2.5 bg-emerald-100 rounded-xl shrink-0">
                    <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.successfulTransactions || 0}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">Successful</p>
                  </div>
                </div>

                {/* Success Rate */}
                <div className="flex items-center gap-4 p-4 bg-blue-50/80 rounded-xl">
                  <div className="p-2.5 bg-blue-100 rounded-xl shrink-0">
                    <FiAward className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{successRate}%</p>
                    <p className="text-xs text-gray-500 font-medium">Success Rate</p>
                  </div>
                </div>
              </div>

              {/* Trust Score Progress */}
              <div className="p-4 bg-cream/50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FiStar className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-semibold text-gray-800">Trust Score Progress</span>
                  </div>
                  <span className="text-sm font-bold text-forest-dark">{trustPercentage}/100</span>
                </div>
                <div className="w-full h-3 bg-cream-dark rounded-full overflow-hidden">
                  <div
                    className="h-full trust-bar rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${trustPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <FiCalendar className="w-3 h-3" />
                  Member since{' '}
                  {stats?.memberSince
                    ? new Date(stats.memberSince).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div
            className="glass rounded-2xl overflow-hidden shadow-md animate-slide-up"
            style={{ animationDelay: '0.35s', animationFillMode: 'both' }}
          >
            <div className="p-4 sm:p-5 border-b border-cream-dark/50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FiZap className="w-5 h-5 text-amber-500" />
                Quick Actions
              </h3>
            </div>
            <div className="p-3 sm:p-4 space-y-2">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.to}
                  className="group flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-cream/70 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Hover gradient background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`}
                  />

                  <div
                    className={`p-2.5 ${action.iconBg} rounded-xl shrink-0 shadow-sm
                      group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}
                  >
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0 relative z-10">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                      {action.label}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-1">{action.description}</p>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-gray-300 group-hover:text-forest group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;