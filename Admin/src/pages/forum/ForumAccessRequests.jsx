// ForumAccessRequests.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getForumAccessRequestsAPI, handleForumAccessAPI } from '../../api/axios.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiUser, FiRefreshCw, FiMail, FiBookOpen, FiCalendar, FiMessageSquare } from 'react-icons/fi';

const ForumAccessRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [rejectModal, setRejectModal] = useState({ open: false, request: null });
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await getForumAccessRequestsAPI({ status: statusFilter });
      if (data.success) setRequests(data.requests);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessing(true);
    try {
      const { data } = await handleForumAccessAPI(id, { action: 'approve' });
      if (data.success) {
        toast.success(data.message);
        fetchRequests();
      }
    } catch (error) {
      toast.error('Approval failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectModal.request) return;
    setProcessing(true);
    try {
      const { data } = await handleForumAccessAPI(rejectModal.request._id, {
        action: 'reject',
        adminNote
      });
      if (data.success) {
        toast.success(data.message);
        setRejectModal({ open: false, request: null });
        setAdminNote('');
        fetchRequests();
      }
    } catch (error) {
      toast.error('Rejection failed');
    } finally {
      setProcessing(false);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'amber' },
    { value: 'approved', label: 'Approved', color: 'green' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
    { value: '', label: 'All', color: 'gray' }
  ];

  const getStatusCounts = () => {
    const counts = { pending: 0, approved: 0, rejected: 0, total: 0 };
    requests.forEach(req => {
      if (req.status === 'pending') counts.pending++;
      else if (req.status === 'approved') counts.approved++;
      else if (req.status === 'rejected') counts.rejected++;
      counts.total++;
    });
    return counts;
  };

  const counts = getStatusCounts();

  if (loading) return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <Loader />
    </div>
  );

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-green-900">Forum Access Requests</h1>
            <p className="text-green-600 mt-1">Review and manage user forum access requests</p>
          </div>
          <button
            onClick={fetchRequests}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition cursor-pointer"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div 
            className={`rounded-2xl p-4 border-2 transition cursor-pointer ${statusFilter === '' ? 'border-green-500 bg-green-50' : 'border-green-100 bg-white hover:border-green-300'}`}
            onClick={() => setStatusFilter('')}
          >
            <p className="text-sm text-green-500">Total Requests</p>
            <p className="text-2xl font-bold text-green-800">{counts.total}</p>
          </div>
          <div 
            className={`rounded-2xl p-4 border-2 transition cursor-pointer ${statusFilter === 'pending' ? 'border-amber-500 bg-amber-50' : 'border-amber-100 bg-white hover:border-amber-300'}`}
            onClick={() => setStatusFilter('pending')}
          >
            <p className="text-sm text-amber-500">Pending</p>
            <p className="text-2xl font-bold text-amber-700">{counts.pending}</p>
          </div>
          <div 
            className={`rounded-2xl p-4 border-2 transition cursor-pointer ${statusFilter === 'approved' ? 'border-green-500 bg-green-50' : 'border-green-100 bg-white hover:border-green-300'}`}
            onClick={() => setStatusFilter('approved')}
          >
            <p className="text-sm text-green-500">Approved</p>
            <p className="text-2xl font-bold text-green-700">{counts.approved}</p>
          </div>
          <div 
            className={`rounded-2xl p-4 border-2 transition cursor-pointer ${statusFilter === 'rejected' ? 'border-red-500 bg-red-50' : 'border-red-100 bg-white hover:border-red-300'}`}
            onClick={() => setStatusFilter('rejected')}
          >
            <p className="text-sm text-red-500">Rejected</p>
            <p className="text-2xl font-bold text-red-700">{counts.rejected}</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          {statusOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                statusFilter === opt.value
                  ? `bg-${opt.color}-500 text-white shadow-md`
                  : `bg-${opt.color}-50 text-${opt.color}-600 hover:bg-${opt.color}-100`
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="text-center py-16 bg-green-50/30 rounded-2xl">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-green-600 text-lg">No {statusFilter || ''} forum access requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req._id} className="bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    {/* User Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {req.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/users/${req.user?._id}`} className="group">
                          <h3 className="font-semibold text-green-900 group-hover:text-green-600 transition text-lg">
                            {req.user?.name}
                          </h3>
                        </Link>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <p className="text-sm text-green-600 flex items-center gap-1">
                            <FiMail className="w-3 h-3" />
                            {req.user?.email}
                          </p>
                          <p className="text-sm text-green-600">
                            {req.user?.department} - Sem {req.user?.semester}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      <StatusBadge status={req.status} />
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mt-4 bg-green-50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                      <FiMessageSquare className="w-4 h-4" />
                      Reason for access:
                    </h4>
                    <p className="text-green-800">{req.reason}</p>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs text-green-500">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        Requested: {format(new Date(req.createdAt), 'MMM dd, yyyy HH:mm')}
                      </span>
                      {req.adminNote && (
                        <span className="flex items-center gap-1 text-amber-600">
                          <FiBookOpen className="w-3 h-3" />
                          Admin Note: {req.adminNote}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {req.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(req._id)}
                          disabled={processing}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition disabled:opacity-50 cursor-pointer text-sm font-medium"
                        >
                          <FiCheck className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectModal({ open: true, request: req })}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition cursor-pointer text-sm font-medium"
                        >
                          <FiX className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reject Modal */}
        <Modal isOpen={rejectModal.open} onClose={() => setRejectModal({ open: false, request: null })} title="Reject Forum Access">
          <div className="space-y-4">
            <div className="bg-red-50 rounded-xl p-3 text-red-700 text-sm">
              Rejecting forum access for: <strong>{rejectModal.request?.user?.name}</strong>
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Admin Note (optional)</label>
              <textarea
                placeholder="Provide a reason for rejection..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setRejectModal({ open: false, request: null })}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition disabled:opacity-50 cursor-pointer"
              >
                {processing ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ForumAccessRequests;