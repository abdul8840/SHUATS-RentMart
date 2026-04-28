// ManageForumPosts.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminGetForumPostsAPI, handleForumPostAPI, togglePinPostAPI, adminDeleteForumPostAPI } from '../../api/axios.js';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiTrash2, FiEye, FiPlus, FiFilter, FiRefreshCw, FiMessageCircle, FiHeart } from 'react-icons/fi';
import { FaMapPin } from "react-icons/fa";

const ManageForumPosts = () => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', page: 1 });
  const [deleteModal, setDeleteModal] = useState({ open: false, post: null });
  const [deleting, setDeleting] = useState(false);
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await adminGetForumPostsAPI(filters);
      if (data.success) {
        setPosts(data.posts);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostAction = async (id, action) => {
    try {
      const { data } = await handleForumPostAPI(id, { action });
      if (data.success) {
        toast.success(data.message);
        fetchPosts();
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleTogglePin = async (id) => {
    try {
      const { data } = await togglePinPostAPI(id);
      if (data.success) {
        toast.success(data.message);
        fetchPosts();
      }
    } catch (error) {
      toast.error('Pin toggle failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.post) return;
    setDeleting(true);
    try {
      await adminDeleteForumPostAPI(deleteModal.post._id);
      toast.success('Post deleted');
      setDeleteModal({ open: false, post: null });
      fetchPosts();
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusStats = () => {
    const stats = { pending: 0, approved: 0, rejected: 0, total: posts.length };
    posts.forEach(post => {
      if (post.status === 'pending') stats.pending++;
      else if (post.status === 'approved') stats.approved++;
      else if (post.status === 'rejected') stats.rejected++;
    });
    return stats;
  };

  const stats = getStatusStats();

  const columns = [
    {
      header: 'Post',
      render: (row) => (
        <div className="min-w-[250px]">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-green-900">{row.title}</h4>
            {row.isPinned && <span className="text-amber-500 text-xs">📌</span>}
            {row.isAdminPost && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 text-xs rounded">Admin</span>}
          </div>
          <p className="text-sm text-green-600 line-clamp-2">{row.content?.substring(0, 100)}...</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">{row.category}</span>
        </div>
      )
    },
    {
      header: 'Author',
      render: (row) => (
        <Link to={`/users/${row.author?._id}`} className="text-green-700 hover:text-green-600 font-medium">
          {row.author?.name || 'Unknown'}
        </Link>
      )
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Engagement',
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-green-600 text-sm">
            <FiHeart className="w-3 h-3" /> {row.likes?.length || 0}
          </span>
          <span className="flex items-center gap-1 text-green-600 text-sm">
            <FiMessageCircle className="w-3 h-3" /> {row.comments?.length || 0}
          </span>
          <span className="flex items-center gap-1 text-green-600 text-sm">
            <FiEye className="w-3 h-3" /> {row.views}
          </span>
        </div>
      )
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
        <div className="flex items-center gap-1">
          <Link to={`/forum/post/${row._id}`} className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition cursor-pointer" title="View">
            <FiEye className="w-4 h-4" />
          </Link>
          {row.status === 'pending' && (
            <>
              <button onClick={() => handlePostAction(row._id, 'approve')} className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition cursor-pointer" title="Approve">
                <FiCheck className="w-4 h-4" />
              </button>
              <button onClick={() => handlePostAction(row._id, 'reject')} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition cursor-pointer" title="Reject">
                <FiX className="w-4 h-4" />
              </button>
            </>
          )}
          <button onClick={() => handleTogglePin(row._id)} className={`p-2 rounded-lg transition cursor-pointer ${row.isPinned ? 'text-amber-600 hover:bg-amber-100' : 'text-gray-400 hover:bg-gray-100'}`} title={row.isPinned ? 'Unpin' : 'Pin'}>
            <FaMapPin className="w-4 h-4" />
          </button>
          <button onClick={() => setDeleteModal({ open: true, post: row })} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition cursor-pointer" title="Delete">
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const PostCard = ({ post }) => (
    <div className="bg-white rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {post.isPinned && <span className="text-amber-500 text-sm">📌 Pinned</span>}
              {post.isAdminPost && <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">Admin Post</span>}
              <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">{post.category}</span>
              <StatusBadge status={post.status} />
            </div>
            <Link to={`/forum/post/${post._id}`}>
              <h3 className="font-semibold text-green-900 hover:text-green-600 transition line-clamp-1">{post.title}</h3>
            </Link>
            <p className="text-sm text-green-600 mt-2 line-clamp-2">{post.content?.substring(0, 120)}</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-green-100 flex items-center justify-between">
          <Link to={`/users/${post.author?._id}`} className="text-sm text-green-700 hover:text-green-600">
            By: {post.author?.name || 'Unknown'}
          </Link>
          <div className="flex items-center gap-3 text-xs text-green-500">
            <span>❤️ {post.likes?.length || 0}</span>
            <span>💬 {post.comments?.length || 0}</span>
            <span>👁️ {post.views}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-green-400">{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
          <div className="flex gap-1">
            {post.status === 'pending' && (
              <>
                <button onClick={() => handlePostAction(post._id, 'approve')} className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition cursor-pointer">
                  <FiCheck className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handlePostAction(post._id, 'reject')} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition cursor-pointer">
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </>
            )}
            <button onClick={() => handleTogglePin(post._id)} className={`p-1.5 rounded-lg transition cursor-pointer ${post.isPinned ? 'text-amber-600 hover:bg-amber-100' : 'text-gray-400 hover:bg-gray-100'}`}>
              <FaMapPin className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setDeleteModal({ open: true, post })} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition cursor-pointer">
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-green-900">Manage Forum Posts</h1>
            <p className="text-green-600 mt-1">Review, approve, and moderate forum discussions</p>
          </div>
          <Link
            to="/forum/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-sm cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            Create Admin Post
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-green-500">Total Posts</p>
            <p className="text-2xl font-bold text-green-800">{stats.total}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4">
            <p className="text-sm text-amber-500">Pending</p>
            <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-green-500">Approved</p>
            <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <p className="text-sm text-red-500">Rejected</p>
            <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-green-50/50 rounded-2xl p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 flex gap-3 flex-wrap">
              <button
                onClick={() => setFilters({ ...filters, status: '', page: 1 })}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${filters.status === '' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-green-600 hover:bg-green-100'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilters({ ...filters, status: 'pending', page: 1 })}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${filters.status === 'pending' ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-amber-600 hover:bg-amber-100'}`}
              >
                Pending Approval
              </button>
              <button
                onClick={() => setFilters({ ...filters, status: 'approved', page: 1 })}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${filters.status === 'approved' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-green-600 hover:bg-green-100'}`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilters({ ...filters, status: 'rejected', page: 1 })}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${filters.status === 'rejected' ? 'bg-red-500 text-white shadow-md' : 'bg-white text-red-600 hover:bg-red-100'}`}
              >
                Rejected
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchPosts}
                className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition cursor-pointer"
              >
                <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <div className="flex items-center gap-1 bg-white rounded-xl p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'table' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-green-600'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'cards' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-green-600'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-2xl border border-green-100 overflow-hidden shadow-sm">
            <DataTable
              columns={columns}
              data={posts}
              loading={loading}
              emptyMessage="No forum posts found"
              className="w-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-green-100 p-4 animate-pulse">
                  <div className="h-5 bg-green-100 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-green-50 rounded w-full mb-2" />
                  <div className="h-4 bg-green-50 rounded w-2/3" />
                  <div className="mt-3 pt-3 border-t border-green-100 flex justify-between">
                    <div className="h-4 bg-green-100 rounded w-24" />
                    <div className="h-4 bg-green-100 rounded w-20" />
                  </div>
                </div>
              ))
            ) : posts.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="text-5xl mb-4">📝</div>
                <p className="text-green-600 text-lg">No forum posts found</p>
              </div>
            ) : (
              posts.map(post => <PostCard key={post._id} post={post} />)
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              pagination={pagination}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          </div>
        )}

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, post: null })}
          onConfirm={handleDelete}
          title="Delete Forum Post"
          message={`Are you sure you want to delete "${deleteModal.post?.title}"? This action cannot be undone.`}
          confirmText="Delete Post"
          loading={deleting}
        />
      </div>
    </div>
  );
};

export default ManageForumPosts;