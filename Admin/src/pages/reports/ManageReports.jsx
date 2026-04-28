// ManageReports.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminGetReportsAPI, resolveReportAPI } from '../../api/axios.js';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import Modal from '../../components/common/Modal.jsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiFilter, FiRefreshCw, FiAlertCircle, FiUser, FiPackage, FiMessageSquare, FiEye, FiFlag } from 'react-icons/fi';

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', reportType: '', page: 1 });
  const [resolveModal, setResolveModal] = useState({ open: false, report: null });
  const [resolveData, setResolveData] = useState({ status: 'resolved', adminNote: '' });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data } = await adminGetReportsAPI(filters);
      if (data.success) {
        setReports(data.reports);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!resolveModal.report) return;
    setProcessing(true);
    try {
      const { data } = await resolveReportAPI(resolveModal.report._id, resolveData);
      if (data.success) {
        toast.success(`Report ${resolveData.status}`);
        setResolveModal({ open: false, report: null });
        setResolveData({ status: 'resolved', adminNote: '' });
        fetchReports();
      }
    } catch (error) {
      toast.error('Failed to resolve report');
    } finally {
      setProcessing(false);
    }
  };

  const getReportTypeIcon = (type) => {
    switch (type) {
      case 'user': return <FiUser className="w-4 h-4" />;
      case 'item': return <FiPackage className="w-4 h-4" />;
      case 'forum_post': return <FiMessageSquare className="w-4 h-4" />;
      default: return <FiFlag className="w-4 h-4" />;
    }
  };

  const getReportTypeColor = (type) => {
    switch (type) {
      case 'user': return 'bg-blue-100 text-blue-700';
      case 'item': return 'bg-purple-100 text-purple-700';
      case 'forum_post': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusStats = () => {
    const stats = { pending: 0, reviewed: 0, resolved: 0, dismissed: 0 };
    reports.forEach(report => {
      if (report.status === 'pending') stats.pending++;
      else if (report.status === 'reviewed') stats.reviewed++;
      else if (report.status === 'resolved') stats.resolved++;
      else if (report.status === 'dismissed') stats.dismissed++;
    });
    return stats;
  };

  const stats = getStatusStats();

  const columns = [
    {
      header: 'Reporter',
      render: (row) => (
        <Link to={`/users/${row.reporter?._id}`} className="flex items-center gap-2 text-green-700 hover:text-green-600">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-xs font-bold">
            {row.reporter?.name?.charAt(0) || '?'}
          </div>
          <span>{row.reporter?.name || 'Unknown'}</span>
        </Link>
      )
    },
    {
      header: 'Type',
      render: (row) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getReportTypeColor(row.reportType)}`}>
          {getReportTypeIcon(row.reportType)}
          {row.reportType === 'forum_post' ? 'Forum Post' : row.reportType?.charAt(0).toUpperCase() + row.reportType?.slice(1)}
        </span>
      )
    },
    {
      header: 'Target',
      render: (row) => {
        if (row.reportType === 'user') 
          return <Link to={`/users/${row.reportedUser?._id}`} className="text-green-600 hover:underline">{row.reportedUser?.name || 'User'}</Link>;
        if (row.reportType === 'item') 
          return <Link to={`/items/${row.reportedItem?._id}`} className="text-green-600 hover:underline">{row.reportedItem?.title || 'Item'}</Link>;
        if (row.reportType === 'forum_post') 
          return <span className="text-green-600">{row.reportedPost?.title || 'Post'}</span>;
        return '-';
      }
    },
    {
      header: 'Reason',
      render: (row) => <span className="text-sm text-green-700">{row.reason}</span>
    },
    {
      header: 'Description',
      render: (row) => (
        <span className="text-sm text-green-600 line-clamp-2">
          {row.description || '-'}
        </span>
      )
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Date',
      render: (row) => (
        <span className="text-sm text-green-600">{format(new Date(row.createdAt), 'MMM dd, yyyy')}</span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        (row.status === 'pending' || row.status === 'reviewed') ? (
          <button
            onClick={() => setResolveModal({ open: true, report: row })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm cursor-pointer"
          >
            <FiCheck className="w-3.5 h-3.5" />
            Resolve
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-green-500 text-sm">
            <FiCheck className="w-4 h-4" />
            {row.status}
          </span>
        )
      )
    }
  ];

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-green-900">Manage Reports & Disputes</h1>
            <p className="text-green-600 mt-1">Review and resolve user reports</p>
          </div>
          <button
            onClick={fetchReports}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition cursor-pointer"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <div className="flex items-center justify-between">
              <FiAlertCircle className="w-8 h-8 text-amber-500" />
              <span className="text-2xl font-bold text-amber-700">{stats.pending}</span>
            </div>
            <p className="text-sm text-amber-600 mt-1">Pending</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <FiEye className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-blue-700">{stats.reviewed}</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">Reviewed</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <FiCheck className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-green-700">{stats.resolved}</span>
            </div>
            <p className="text-sm text-green-600 mt-1">Resolved</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <FiX className="w-8 h-8 text-gray-500" />
              <span className="text-2xl font-bold text-gray-700">{stats.dismissed}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Dismissed</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-green-50/50 rounded-2xl p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="px-4 py-2 bg-white border border-green-200 rounded-xl text-green-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
            <select
              value={filters.reportType}
              onChange={(e) => setFilters({ ...filters, reportType: e.target.value, page: 1 })}
              className="px-4 py-2 bg-white border border-green-200 rounded-xl text-green-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="user">User Reports</option>
              <option value="item">Item Reports</option>
              <option value="forum_post">Forum Post Reports</option>
            </select>
            {(filters.status || filters.reportType) && (
              <button
                onClick={() => setFilters({ status: '', reportType: '', page: 1 })}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm transition cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-green-100 overflow-hidden shadow-sm">
          <DataTable
            columns={columns}
            data={reports}
            loading={loading}
            emptyMessage="No reports found"
            className="w-full"
          />
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              pagination={pagination}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          </div>
        )}

        {/* Resolve Modal */}
        <Modal isOpen={resolveModal.open} onClose={() => setResolveModal({ open: false, report: null })} title="Resolve Report">
          {resolveModal.report && (
            <div className="space-y-5">
              <div className="bg-green-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-green-700 w-24">Reporter:</span>
                  <span className="text-green-900">{resolveModal.report.reporter?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-green-700 w-24">Type:</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getReportTypeColor(resolveModal.report.reportType)}`}>
                    {getReportTypeIcon(resolveModal.report.reportType)}
                    {resolveModal.report.reportType}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-green-700 w-24">Reason:</span>
                  <span className="text-green-900 flex-1">{resolveModal.report.reason}</span>
                </div>
                {resolveModal.report.description && (
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-green-700 w-24">Description:</span>
                    <span className="text-green-600 flex-1 text-sm">{resolveModal.report.description}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">Resolution Status</label>
                <select
                  value={resolveData.status}
                  onChange={(e) => setResolveData({ ...resolveData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
                >
                  <option value="resolved">Resolved (Issue fixed)</option>
                  <option value="dismissed">Dismissed (No action needed)</option>
                  <option value="reviewed">Mark as Reviewed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">Admin Note</label>
                <textarea
                  placeholder="Add a note about how this report was handled..."
                  value={resolveData.adminNote}
                  onChange={(e) => setResolveData({ ...resolveData, adminNote: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setResolveModal({ open: false, report: null })}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolve}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 cursor-pointer"
                >
                  {processing ? 'Processing...' : 'Confirm Resolution'}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ManageReports;