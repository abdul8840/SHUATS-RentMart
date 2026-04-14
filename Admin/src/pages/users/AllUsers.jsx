import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsersAPI, toggleUserStatusAPI, deleteUserAPI } from '../../api/axios.js';
import DataTable from '../../components/common/DataTable.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { FiEye, FiToggleLeft, FiToggleRight, FiTrash2, FiUsers, FiFilter } from 'react-icons/fi';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', search: '', page: 1 });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAllUsersAPI(filters);
      if (data.success) {
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const { data } = await toggleUserStatusAPI(id);
      if (data.success) {
        toast.success(data.message);
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to toggle status');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    setDeleting(true);
    try {
      await deleteUserAPI(deleteModal.user._id);
      toast.success('User deleted successfully');
      setDeleteModal({ open: false, user: null });
      fetchUsers();
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.profileImage?.url ? (
            <img 
              src={row.profileImage.url} 
              alt={row.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold text-sm">
              {row.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <Link 
              to={`/users/${row._id}`}
              className="font-medium text-gray-900 hover:text-green-600 transition-colors block truncate"
            >
              {row.name}
            </Link>
            <p className="text-xs text-gray-500 truncate">{row.email}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Department', 
      render: (row) => (
        <span className="text-sm text-gray-700">{row.department}</span>
      )
    },
    { 
      header: 'Semester', 
      render: (row) => (
        <span className="text-sm text-gray-700">{row.semester}</span>
      )
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.accountStatus} />
    },
    {
      header: 'Active',
      render: (row) => (
        <span className={`inline-flex items-center gap-1 text-xs font-medium ${
          row.isActive ? 'text-green-700' : 'text-red-700'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            row.isActive ? 'bg-green-500' : 'bg-red-500'
          }`} />
          {row.isActive ? 'Active' : 'Suspended'}
        </span>
      )
    },
    {
      header: 'Trust Score',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 max-w-[60px] bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                row.trustScore >= 70 ? 'bg-green-500' : 
                row.trustScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${row.trustScore}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-700">{row.trustScore}</span>
        </div>
      )
    },
    {
      header: 'Forum',
      render: (row) => (
        <span className="text-sm">
          {row.forumAccess ? '✅' : '❌'}
        </span>
      )
    },
    {
      header: 'Joined',
      render: (row) => (
        <span className="text-xs text-gray-600">
          {format(new Date(row.createdAt), 'MMM dd, yyyy')}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Link 
            to={`/users/${row._id}`}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
            title="View Details"
          >
            <FiEye className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => handleToggleStatus(row._id)}
            className={`p-2 rounded-lg transition-all ${
              row.isActive 
                ? 'text-green-600 hover:text-red-600 hover:bg-red-50' 
                : 'text-red-600 hover:text-green-600 hover:bg-green-50'
            }`}
            title={row.isActive ? 'Suspend User' : 'Activate User'}
          >
            {row.isActive ? <FiToggleRight className="w-4 h-4" /> : <FiToggleLeft className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setDeleteModal({ open: true, user: row })}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Delete User"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FiUsers className="w-7 h-7 text-green-600" />
            All Students
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and monitor all registered students
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput 
              onSearch={(q) => setFilters({ ...filters, search: q, page: 1 })} 
              placeholder="Search by name, email, department..." 
            />
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select 
                value={filters.status} 
                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
              >
                <option value="">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <DataTable 
          columns={columns} 
          data={users} 
          loading={loading} 
          emptyMessage="No students found" 
        />
        <Pagination 
          pagination={pagination} 
          onPageChange={(page) => setFilters({ ...filters, page })} 
        />
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteModal.user?.name}? This action will permanently remove this user and all their listings, requests, and data. This cannot be undone.`}
        confirmText="Delete User"
        confirmColor="red"
        loading={deleting}
      />
    </div>
  );
};

export default AllUsers;