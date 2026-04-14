import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStatsAPI } from '../../api/axios.js';
import StatsCard from '../../components/common/StatsCard.jsx';
import SimpleChart from '../../components/charts/SimpleChart.jsx';
import Loader from '../../components/common/Loader.jsx';
import { format } from 'date-fns';
import {
  FiUsers, FiUserCheck, FiShoppingBag, FiRepeat,
  FiBookOpen, FiAlertTriangle, FiTrendingUp, FiClock,
  FiCheckCircle, FiXCircle, FiDollarSign
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
  if (!stats) return <p>Failed to load dashboard</p>;

  return (
    <div>
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome to SHUATS RentMart Admin Control Panel</p>
      </div>

      {/* Alert Cards */}
      {(stats.users.pending > 0 || stats.forum.pendingPosts > 0 || stats.reports.pending > 0) && (
        <div>
          {stats.users.pending > 0 && (
            <Link to="/users/pending">
              <div>
                <FiClock />
                <span>{stats.users.pending} pending approval{stats.users.pending > 1 ? 's' : ''}</span>
              </div>
            </Link>
          )}
          {stats.forum.pendingPosts > 0 && (
            <Link to="/forum/posts">
              <div>
                <FiBookOpen />
                <span>{stats.forum.pendingPosts} pending forum post{stats.forum.pendingPosts > 1 ? 's' : ''}</span>
              </div>
            </Link>
          )}
          {stats.reports.pending > 0 && (
            <Link to="/reports">
              <div>
                <FiAlertTriangle />
                <span>{stats.reports.pending} pending report{stats.reports.pending > 1 ? 's' : ''}</span>
              </div>
            </Link>
          )}
          {stats.forum.pendingRequests > 0 && (
            <Link to="/forum/access-requests">
              <div>
                <FiUserCheck />
                <span>{stats.forum.pendingRequests} forum access request{stats.forum.pendingRequests > 1 ? 's' : ''}</span>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Main Stats */}
      <div>
        <StatsCard icon={<FiUsers />} title="Total Students" value={stats.users.total} subtitle={`${stats.users.approved} approved`} color="blue" />
        <StatsCard icon={<FiUserCheck />} title="Pending Approvals" value={stats.users.pending} color="yellow" />
        <StatsCard icon={<FiShoppingBag />} title="Total Items" value={stats.items.total} subtitle={`${stats.items.active} active`} color="green" />
        <StatsCard icon={<FiDollarSign />} title="Items Sold" value={stats.items.sold} color="purple" />
        <StatsCard icon={<FiRepeat />} title="Total Requests" value={stats.requests.total} subtitle={`${stats.requests.completed} completed`} color="teal" />
        <StatsCard icon={<FiCheckCircle />} title="Completed" value={stats.requests.completed} color="green" />
        <StatsCard icon={<FiBookOpen />} title="Forum Posts" value={stats.forum.totalPosts} subtitle={`${stats.forum.pendingPosts} pending`} color="indigo" />
        <StatsCard icon={<FiAlertTriangle />} title="Reports" value={stats.reports.total} subtitle={`${stats.reports.pending} pending`} color="red" />
      </div>

      {/* Charts Row */}
      <div>
        <SimpleChart data={stats.categoryStats} title="Items by Category" type="bar" />
        <SimpleChart data={stats.departmentStats} title="Students by Department" type="bar" />
      </div>

      {/* Recent Registrations */}
      <div>
        <div>
          <h2>Recent Registrations</h2>
          <Link to="/users">View All</Link>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers?.map((u) => (
                <tr key={u._id}>
                  <td>
                    <Link to={`/users/${u._id}`}>{u.name}</Link>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.department}</td>
                  <td><span>{u.accountStatus}</span></td>
                  <td>{format(new Date(u.createdAt), 'MMM dd, yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2>Quick Actions</h2>
        <div>
          <Link to="/users/pending">Review Pending Students</Link>
          <Link to="/forum/access-requests">Forum Access Requests</Link>
          <Link to="/forum/create">Create Announcement</Link>
          <Link to="/reports">Review Reports</Link>
          <Link to="/meetup-locations">Manage Meetup Locations</Link>
          <Link to="/analytics">View Analytics</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;