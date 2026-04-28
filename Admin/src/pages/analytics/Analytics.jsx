// Analytics.tsx
import { useState, useEffect } from 'react';
import { getDashboardStatsAPI } from '../../api/axios.js';
import StatsCard from '../../components/common/StatsCard.jsx';
import SimpleChart from '../../components/charts/SimpleChart.jsx';
import Loader from '../../components/common/Loader.jsx';
import {
  FiUsers, FiShoppingBag, FiRepeat, FiBookOpen,
  FiAlertTriangle, FiTrendingUp, FiCheckCircle, FiDollarSign,
  FiBarChart2, FiPieChart, FiActivity, FiCalendar
} from 'react-icons/fi';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await getDashboardStatsAPI();
      if (data.success) setStats(data.stats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <Loader />
    </div>
  );
  
  if (!stats) return (
    <div className="min-h-screen bg-white py-8 sm:py-12 flex items-center justify-center">
      <p className="text-green-600">Failed to load analytics</p>
    </div>
  );

  const userCompletionRate = stats.users.total > 0
    ? Math.round((stats.users.approved / stats.users.total) * 100)
    : 0;

  const itemActiveRate = stats.items.total > 0
    ? Math.round((stats.items.active / stats.items.total) * 100)
    : 0;

  const requestCompletionRate = stats.requests.total > 0
    ? Math.round((stats.requests.completed / stats.requests.total) * 100)
    : 0;

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-green-900 flex items-center gap-2">
              <FiBarChart2 className="w-7 h-7 text-green-600" />
              Platform Analytics
            </h1>
            <p className="text-green-600 mt-1">Comprehensive insights and metrics</p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 rounded-xl p-1">
            <button
              onClick={() => setTimeframe('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${timeframe === 'week' ? 'bg-white shadow-sm text-green-700' : 'text-green-500 hover:text-green-700'}`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${timeframe === 'month' ? 'bg-white shadow-sm text-green-700' : 'text-green-500 hover:text-green-700'}`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeframe('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${timeframe === 'all' ? 'bg-white shadow-sm text-green-700' : 'text-green-500 hover:text-green-700'}`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Users</p>
                <p className="text-3xl font-bold text-blue-800">{stats.users.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="text-blue-600">Approved: {stats.users.approved}</span>
              <span className="text-amber-600">Pending: {stats.users.pending}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Marketplace Items</p>
                <p className="text-3xl font-bold text-purple-800">{stats.items.total}</p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                <FiShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="text-green-600">Active: {stats.items.active}</span>
              <span className="text-blue-600">Sold: {stats.items.sold}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-600">Total Requests</p>
                <p className="text-3xl font-bold text-indigo-800">{stats.requests.total}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-200 rounded-xl flex items-center justify-center">
                <FiRepeat className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="text-green-600">Completed: {stats.requests.completed}</span>
              <span className="text-amber-600">Pending: {stats.requests.pending}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Forum Posts</p>
                <p className="text-3xl font-bold text-orange-800">{stats.forum.totalPosts}</p>
              </div>
              <div className="w-12 h-12 bg-orange-200 rounded-xl flex items-center justify-center">
                <FiBookOpen className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="text-green-600">Approved: {stats.forum.totalPosts - stats.forum.pendingPosts}</span>
              <span className="text-amber-600">Pending: {stats.forum.pendingPosts}</span>
            </div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-green-800">User Approval</h3>
              <FiCheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-800">{userCompletionRate}%</div>
            <div className="mt-2 h-2 bg-green-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${userCompletionRate}%` }} />
            </div>
            <p className="text-xs text-green-500 mt-2">{stats.users.approved}/{stats.users.total} students approved</p>
          </div>

          <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-green-800">Active Listings</h3>
              <FiTrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-800">{itemActiveRate}%</div>
            <div className="mt-2 h-2 bg-green-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${itemActiveRate}%` }} />
            </div>
            <p className="text-xs text-green-500 mt-2">{stats.items.active}/{stats.items.total} items active</p>
          </div>

          <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-green-800">Request Completion</h3>
              <FiActivity className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-800">{requestCompletionRate}%</div>
            <div className="mt-2 h-2 bg-green-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${requestCompletionRate}%` }} />
            </div>
            <p className="text-xs text-green-500 mt-2">{stats.requests.completed}/{stats.requests.total} completed</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
              <FiPieChart className="w-4 h-4" />
              Items by Category
            </h3>
            <SimpleChart data={stats.categoryStats} title="Items Distribution by Category" type="bar" />
          </div>
          <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
              <FiUsers className="w-4 h-4" />
              Students by Department
            </h3>
            <SimpleChart data={stats.departmentStats} title="Students Distribution by Department" type="bar" />
          </div>
        </div>

        {/* Platform Health */}
        <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <FiActivity className="w-5 h-5" />
            Platform Health Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">🟢</div>
              <div>
                <h4 className="font-medium text-green-800">Users</h4>
                <p className="text-sm text-green-600">{stats.users.approved} active students</p>
              </div>
            </div>
            <div className={`flex items-start gap-3 p-3 rounded-xl ${stats.reports.pending > 0 ? 'bg-amber-50' : 'bg-green-50'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${stats.reports.pending > 0 ? 'bg-amber-100' : 'bg-green-100'}`}>
                {stats.reports.pending > 0 ? '🟡' : '🟢'}
              </div>
              <div>
                <h4 className="font-medium text-green-800">Reports</h4>
                <p className="text-sm text-green-600">
                  {stats.reports.pending > 0 ? `${stats.reports.pending} need attention` : 'All reports resolved'}
                </p>
              </div>
            </div>
            <div className={`flex items-start gap-3 p-3 rounded-xl ${stats.users.pending > 0 ? 'bg-amber-50' : 'bg-green-50'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${stats.users.pending > 0 ? 'bg-amber-100' : 'bg-green-100'}`}>
                {stats.users.pending > 0 ? '🟡' : '🟢'}
              </div>
              <div>
                <h4 className="font-medium text-green-800">Approvals</h4>
                <p className="text-sm text-green-600">
                  {stats.users.pending > 0 ? `${stats.users.pending} waiting` : 'No pending approvals'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">📊</div>
              <div>
                <h4 className="font-medium text-green-800">Marketplace</h4>
                <p className="text-sm text-green-600">{stats.items.active} active listings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;