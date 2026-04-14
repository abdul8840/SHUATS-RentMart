import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserDetailAPI, approveUserAPI, rejectUserAPI, toggleUserStatusAPI, deleteUserAPI, revokeForumAccessAPI } from '../../api/axios.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/common/Modal.jsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  FiCheck, FiX, FiTrash2, FiToggleLeft, FiToggleRight, 
  FiUser, FiMail, FiBook, FiShield, FiBookOpen, FiArrowLeft,
  FiCalendar, FiActivity, FiTrendingUp, FiAlertTriangle, FiImage
} from 'react-icons/fi';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const { data } = await getUserDetailAPI(id);
      if (data.success) {
        setUser(data.user);
        setItems(data.items || []);
        setRequests(data.requests || []);
      }
    } catch (error) {
      toast.error('User not found');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setProcessing(true);
    try {
      await approveUserAPI(id);
      toast.success('User approved successfully');
      fetchUser();
    } catch (error) {
      toast.error('Approval failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    setProcessing(true);
    try {
      await rejectUserAPI(id, { reason: rejectReason });
      toast.success('User rejected');
      setRejectModal(false);
      fetchUser();
    } catch (error) {
      toast.error('Rejection failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleToggle = async () => {
    try {
      const { data } = await toggleUserStatusAPI(id);
      toast.success(data.message);
      fetchUser();
    } catch (error) {
      toast.error('Toggle failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Permanently delete this user and all their data? This action cannot be undone.')) return;
    try {
      await deleteUserAPI(id);
      toast.success('User deleted successfully');
      navigate('/users');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleRevokeForumAccess = async () => {
    if (!window.confirm('Revoke forum access for this user?')) return;
    try {
      await revokeForumAccessAPI(id);
      toast.success('Forum access revoked');
      fetchUser();
    } catch (error) {
      toast.error('Revoke failed');
    }
  };

  if (loading) return <Loader />;
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <FiAlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/users')}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              User Details
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Complete profile and activity information
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {user.accountStatus === 'pending' && (
            <>
              <button 
                onClick={handleApprove} 
                disabled={processing}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FiCheck className="w-4 h-4" />
                Approve
              </button>
              <button 
                onClick={() => setRejectModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all"
              >
                <FiX className="w-4 h-4" />
                Reject
              </button>
            </>
          )}
          <button 
            onClick={handleToggle}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all ${
              user.isActive 
                ? 'bg-amber-600 hover:bg-amber-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {user.isActive ? <FiToggleRight className="w-4 h-4" /> : <FiToggleLeft className="w-4 h-4" />}
            {user.isActive ? 'Suspend' : 'Activate'}
          </button>
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all"
          >
            <FiTrash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {user.profileImage?.url ? (
                <img 
                  src={user.profileImage.url} 
                  alt={user.name}
                  className="w-32 h-32 rounded-xl object-cover ring-4 ring-gray-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-xl bg-green-100 text-green-700 flex items-center justify-center ring-4 ring-gray-100">
                  <FiUser className="w-16 h-16" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiBook className="w-4 h-4 text-gray-400" />
                    {user.department} - Semester {user.semester}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiShield className="w-4 h-4 text-gray-400" />
                    Trust Score: <span className="font-semibold">{user.trustScore}/100</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    Account Status: <StatusBadge status={user.accountStatus} />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Active Status:</span>
                    <span className={`inline-flex items-center gap-1 font-medium ${
                      user.isActive ? 'text-green-700' : 'text-red-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        user.isActive ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FiBookOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Forum Access:</span>
                    <span className={user.forumAccess ? 'text-green-700 font-medium' : 'text-red-700'}>
                      {user.forumAccess ? '✅ Granted' : '❌ Not Granted'}
                    </span>
                    {user.forumAccess && (
                      <button 
                        onClick={handleRevokeForumAccess}
                        className="ml-2 text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCalendar className="w-4 h-4 text-gray-400" />
                    Joined: {format(new Date(user.createdAt), 'MMMM dd, yyyy HH:mm')}
                  </div>
                  {user.lastLogin && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiActivity className="w-4 h-4 text-gray-400" />
                      Last Login: {format(new Date(user.lastLogin), 'MMM dd, yyyy HH:mm')}
                    </div>
                  )}
                </div>
              </div>

              {user.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                  <p className="text-sm text-red-700">{user.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ID Card Section */}
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiImage className="w-5 h-5 text-green-600" />
            Student ID Card
          </h3>
          {user.idCardImage?.url ? (
            <div className="max-w-md border border-gray-200 rounded-lg overflow-hidden bg-white">
              <img 
                src={user.idCardImage.url} 
                alt="ID Card"
                className="w-full h-auto"
              />
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center max-w-md">
              <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No ID card uploaded</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Transactions</h4>
            <FiActivity className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{user.totalTransactions || 0}</p>
          <p className="text-xs text-gray-500 mt-1">
            {user.successfulTransactions || 0} successful
          </p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Rentals</h4>
            <FiTrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{user.totalRentals || 0}</p>
          <p className="text-xs text-gray-500 mt-1">
            {user.completedRentals || 0} completed
          </p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Reviews</h4>
            <FiShield className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {(user.positiveReviews || 0) + (user.negativeReviews || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {user.positiveReviews || 0} positive, {user.negativeReviews || 0} negative
          </p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Issues</h4>
            <FiAlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{user.totalReports || 0}</p>
          <p className="text-xs text-gray-500 mt-1">
            {user.cancellations || 0} cancellations
          </p>
        </div>
      </div>

      {/* User Listings */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Listings ({items.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">No listings found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{item.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{item.listingType}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{item.price}</td>
                    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Transaction History ({requests.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          {requests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">No transactions found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.slice(0, 20).map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">{req.requestType}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        req.seller?.toString() === id ? 'text-green-700' : 'text-blue-700'
                      }`}>
                        {req.seller?.toString() === id ? 'Seller' : 'Buyer'}
                      </span>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {format(new Date(req.createdAt), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <Modal 
        isOpen={rejectModal} 
        onClose={() => setRejectModal(false)} 
        title="Reject Registration"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              Rejecting: <span className="font-semibold">{user.name}</span> ({user.email})
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason
            </label>
            <textarea 
              placeholder="Rejection reason..." 
              value={rejectReason} 
              onChange={(e) => setRejectReason(e.target.value)} 
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              onClick={() => setRejectModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleReject} 
              disabled={processing}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {processing ? 'Rejecting...' : 'Confirm Reject'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserDetail;