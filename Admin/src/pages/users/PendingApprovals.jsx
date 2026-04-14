import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPendingUsersAPI, approveUserAPI, rejectUserAPI } from '../../api/axios.js';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiEye, FiUser, FiMail, FiBook, FiImage, FiClock, FiCheckCircle } from 'react-icons/fi';

const PendingApprovals = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [idCardModal, setIdCardModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const { data } = await getPendingUsersAPI();
      if (data.success) setUsers(data.users);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch pending users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessing(true);
    try {
      const { data } = await approveUserAPI(id);
      if (data.success) {
        toast.success(data.message);
        setUsers(prev => prev.filter(u => u._id !== id));
        setIdCardModal(false);
        setSelectedUser(null);
      }
    } catch (error) {
      toast.error('Approval failed');
    } finally {
      setProcessing(false);
    }
  };

  const openRejectModal = (user) => {
    setSelectedUser(user);
    setRejectReason('');
    setRejectModal(true);
  };

  const handleReject = async () => {
    if (!selectedUser) return;
    setProcessing(true);
    try {
      const { data } = await rejectUserAPI(selectedUser._id, { reason: rejectReason || 'ID verification failed' });
      if (data.success) {
        toast.success(data.message);
        setUsers(prev => prev.filter(u => u._id !== selectedUser._id));
        setRejectModal(false);
        setSelectedUser(null);
        setIdCardModal(false);
      }
    } catch (error) {
      toast.error('Rejection failed');
    } finally {
      setProcessing(false);
    }
  };

  const viewIdCard = (user) => {
    setSelectedUser(user);
    setIdCardModal(true);
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FiClock className="w-7 h-7 text-amber-600" />
            Pending Approvals
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Review and approve student registrations
          </p>
        </div>
        <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="text-sm font-semibold text-amber-700">
            {users.length} Pending
          </span>
        </div>
      </div>

      {/* Empty State */}
      {users.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12">
          <div className="text-center max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-sm text-gray-600">
              No pending student registrations at the moment.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <div 
              key={user._id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* User Info */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {user.profileImage?.url ? (
                      <img 
                        src={user.profileImage.url} 
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xl">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-1">
                      <FiUser className="w-4 h-4 text-gray-400" />
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                      <FiMail className="w-4 h-4 text-gray-400" />
                      {user.email}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                      <FiBook className="w-4 h-4 text-gray-400" />
                      {user.department} - Semester {user.semester}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <FiClock className="w-3 h-3" />
                      Registered: {format(new Date(user.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-stretch">
                  <button 
                    onClick={() => viewIdCard(user)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <FiImage className="w-4 h-4" />
                    View ID Card
                  </button>
                  <button 
                    onClick={() => handleApprove(user._id)} 
                    disabled={processing}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <FiCheck className="w-4 h-4" />
                    Approve
                  </button>
                  <button 
                    onClick={() => openRejectModal(user)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all"
                  >
                    <FiX className="w-4 h-4" />
                    Reject
                  </button>
                  <Link 
                    to={`/users/${user._id}`}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <FiEye className="w-4 h-4" />
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ID Card View Modal */}
      <Modal 
        isOpen={idCardModal} 
        onClose={() => setIdCardModal(false)} 
        title={`ID Card Verification - ${selectedUser?.name}`} 
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Name</p>
                  <p className="text-sm font-medium text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Department</p>
                  <p className="text-sm font-medium text-gray-900">{selectedUser.department}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Semester</p>
                  <p className="text-sm font-medium text-gray-900">{selectedUser.semester}</p>
                </div>
              </div>
            </div>

            {/* ID Card Image */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiImage className="w-4 h-4 text-green-600" />
                Student ID Card
              </h4>
              {selectedUser.idCardImage?.url ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={selectedUser.idCardImage.url} 
                    alt="Student ID Card" 
                    className="w-full h-auto"
                  />
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No ID card image uploaded</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button 
                onClick={() => { setIdCardModal(false); openRejectModal(selectedUser); }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all"
              >
                <FiX className="inline w-4 h-4 mr-1" />
                Reject Student
              </button>
              <button 
                onClick={() => handleApprove(selectedUser._id)} 
                disabled={processing}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FiCheck className="inline w-4 h-4 mr-1" />
                {processing ? 'Processing...' : 'Approve Student'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal 
        isOpen={rejectModal} 
        onClose={() => setRejectModal(false)} 
        title="Reject Registration"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              Rejecting: <span className="font-semibold">{selectedUser?.name}</span> ({selectedUser?.email})
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason
            </label>
            <textarea
              placeholder="e.g., ID card is unclear, not a valid SHUATS ID, incomplete information..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              This reason will be sent to the student via email
            </p>
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
              {processing ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PendingApprovals;