import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStatsAPI } from '../../api/axios.js';
import StatsCard from '../../components/common/StatsCard.jsx';
import SimpleChart from '../../components/charts/SimpleChart.jsx';
import Loader from '../../components/common/Loader.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { format } from 'date-fns';
import {
  FiUsers, FiUserCheck, FiShoppingBag, FiRepeat,
  FiBookOpen, FiAlertTriangle, FiTrendingUp, FiClock,
  FiCheckCircle, FiXCircle, FiDollarSign, FiArrowRight,
  FiActivity, FiMapPin, FiBarChart2, FiFileText
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await getDashboardStatsAPI();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  
  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <FiAlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Failed to load dashboard</p>
          <button 
            onClick={fetchStats}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const alertCount = stats.users.pending + stats.forum.pendingPosts + stats.reports.pending + (stats.forum.pendingRequests || 0);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome to SHUATS RentMart Admin Control Panel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">System Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      {alertCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3 mb-3">
            <FiAlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900">Pending Actions Required</h3>
              <p className="text-sm text-amber-700 mt-0.5">
                You have {alertCount} item{alertCount > 1 ? 's' : ''} requiring your attention
              </p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {stats.users.pending > 0 && (
              <Link 
                to="/users/pending"
                className="flex items-center justify-between p-3 bg-white border border-amber-200 rounded-lg hover:shadow-md hover:border-amber-300 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <FiClock className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Pending Approvals</p>
                    <p className="font-semibold text-gray-900">{stats.users.pending}</p>
                  </div>
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </Link>
            )}
            {stats.forum.pendingPosts > 0 && (
              <Link 
                to="/forum/posts"
                className="flex items-center justify-between p-3 bg-white border border-amber-200 rounded-lg hover:shadow-md hover:border-amber-300 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <FiBookOpen className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Forum Posts</p>
                    <p className="font-semibold text-gray-900">{stats.forum.pendingPosts}</p>
                  </div>
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </Link>
            )}
            {stats.reports.pending > 0 && (
              <Link 
                to="/reports"
                className="flex items-center justify-between p-3 bg-white border border-amber-200 rounded-lg hover:shadow-md hover:border-amber-300 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <FiAlertTriangle className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Reports</p>
                    <p className="font-semibold text-gray-900">{stats.reports.pending}</p>
                  </div>
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </Link>
            )}
            {stats.forum.pendingRequests > 0 && (
              <Link 
                to="/forum/access-requests"
                className="flex items-center justify-between p-3 bg-white border border-amber-200 rounded-lg hover:shadow-md hover:border-amber-300 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <FiUserCheck className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Access Requests</p>
                    <p className="font-semibold text-gray-900">{stats.forum.pendingRequests}</p>
                  </div>
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          icon={<FiUsers />} 
          title="Total Students" 
          value={stats.users.total} 
          subtitle={`${stats.users.approved} approved`} 
          color="blue" 
        />
        <StatsCard 
          icon={<FiUserCheck />} 
          title="Pending Approvals" 
          value={stats.users.pending} 
          color="yellow" 
        />
        <StatsCard 
          icon={<FiShoppingBag />} 
          title="Total Items" 
          value={stats.items.total} 
          subtitle={`${stats.items.active} active`} 
          color="green" 
        />
        <StatsCard 
          icon={<FiDollarSign />} 
          title="Items Sold" 
          value={stats.items.sold} 
          color="purple" 
        />
        <StatsCard 
          icon={<FiRepeat />} 
          title="Total Requests" 
          value={stats.requests.total} 
          subtitle={`${stats.requests.completed} completed`} 
          color="teal" 
        />
        <StatsCard 
          icon={<FiCheckCircle />} 
          title="Completed" 
          value={stats.requests.completed} 
          color="green" 
        />
        <StatsCard 
          icon={<FiBookOpen />} 
          title="Forum Posts" 
          value={stats.forum.totalPosts} 
          subtitle={`${stats.forum.pendingPosts} pending`} 
          color="indigo" 
        />
        <StatsCard 
          icon={<FiAlertTriangle />} 
          title="Reports" 
          value={stats.reports.total} 
          subtitle={`${stats.reports.pending} pending`} 
          color="red" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiBarChart2 className="w-5 h-5 text-green-600" />
              Items by Category
            </h2>
          </div>
          <div className="p-6">
            <SimpleChart data={stats.categoryStats} title="" type="bar" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiActivity className="w-5 h-5 text-green-600" />
              Students by Department
            </h2>
          </div>
          <div className="p-6">
            <SimpleChart data={stats.departmentStats} title="" type="bar" />
          </div>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FiUsers className="w-5 h-5 text-green-600" />
            Recent Registrations
          </h2>
          <Link 
            to="/users" 
            className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 transition-colors group"
          >
            View All
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.recentUsers?.length > 0 ? (
                stats.recentUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/users/${u._id}`}
                        className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline"
                      >
                        {u.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{u.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{u.department}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={u.accountStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {format(new Date(u.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      <FiUsers className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No recent registrations</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FiActivity className="w-5 h-5 text-green-600" />
            Quick Actions
          </h2>
        </div>
        <div className="p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link 
              to="/users/pending"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all group"
            >
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <FiUserCheck className="w-5 h-5 text-green-700" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                  Review Pending Students
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Approve or reject registrations</p>
              </div>
              <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link 
              to="/forum/access-requests"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all group"
            >
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <FiBookOpen className="w-5 h-5 text-green-700" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                  Forum Access Requests
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Manage forum permissions</p>
              </div>
              <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link 
              to="/forum/create"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all group"
            >
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <FiFileText className="w-5 h-5 text-green-700" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                  Create Announcement
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Post important updates</p>
              </div>
              <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link 
              to="/reports"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all group"
            >
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <FiAlertTriangle className="w-5 h-5 text-green-700" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                  Review Reports
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Handle user reports</p>
              </div>
              <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link 
              to="/meetup-locations"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all group"
            >
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <FiMapPin className="w-5 h-5 text-green-700" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                  Manage Meetup Locations
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Add or edit locations</p>
              </div>
              <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link 
              to="/analytics"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all group"
            >
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <FiBarChart2 className="w-5 h-5 text-green-700" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                  View Analytics
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Detailed insights & reports</p>
              </div>
              <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;