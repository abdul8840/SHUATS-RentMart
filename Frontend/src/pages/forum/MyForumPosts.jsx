import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyForumPostsAPI, deleteForumPostAPI } from '../../api/axios.js';
import Loader from '../../components/common/Loader.jsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  FiEye, FiTrash2, FiPlus, FiEdit, FiFileText, FiClock,
  FiCheckCircle, FiXCircle, FiHeart, FiMessageCircle,
  FiAlertTriangle, FiTrendingUp, FiFilter
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';

const MyForumPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, approved, pending, rejected

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await getMyForumPostsAPI();
      if (data.success) setPosts(data.posts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (post) => {
    setConfirmDelete(post);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete._id);
    try {
      await deleteForumPostAPI(confirmDelete._id);
      toast.success('Post deleted successfully');
      setPosts(prev => prev.filter(p => p._id !== confirmDelete._id));
      setConfirmDelete(null);
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: FiCheckCircle,
          label: 'Approved',
          dotColor: 'bg-emerald-500'
        };
      case 'pending':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: FiClock,
          label: 'Pending Review',
          dotColor: 'bg-amber-500'
        };
      case 'rejected':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: FiXCircle,
          label: 'Rejected',
          dotColor: 'bg-red-500'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: FiClock,
          label: status,
          dotColor: 'bg-gray-500'
        };
    }
  };

  const categoryConfig = {
    Announcement: { color: 'bg-amber-50 text-amber-700', icon: '📢' },
    Article: { color: 'bg-blue-50 text-blue-700', icon: '📝' },
    Notice: { color: 'bg-red-50 text-red-700', icon: '📌' },
    Discussion: { color: 'bg-[var(--color-mint-light)] text-[var(--color-forest)]', icon: '💭' },
    Event: { color: 'bg-purple-50 text-purple-700', icon: '🎉' },
    General: { color: 'bg-[var(--color-mint-light)]/50 text-[var(--color-forest)]', icon: '💬' },
  };

  const filteredPosts = filterStatus === 'all' 
    ? posts 
    : posts.filter(p => p.status === filterStatus);

  // Stats
  const stats = {
    total: posts.length,
    approved: posts.filter(p => p.status === 'approved').length,
    pending: posts.filter(p => p.status === 'pending').length,
    rejected: posts.filter(p => p.status === 'rejected').length,
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)]">

      {/* ═══════════════════════════════════════════════════════
          HERO HEADER
          ═══════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-[var(--color-forest-dark)] mb-8 py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-mint)] rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[var(--color-sage)] rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            <div className="flex-1 animate-slide-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-sage)]/20 
                            backdrop-blur-sm rounded-full border border-[var(--color-mint)]/30 mb-4">
                <FiFileText size={14} className="text-[var(--color-mint)]" />
                <span className="text-[var(--color-mint-light)] text-sm font-medium">
                  Post Management
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
                My Forum Posts
                <span className="block text-2xl sm:text-3xl text-[var(--color-mint-light)] 
                              font-normal mt-2">
                  {posts.length} {posts.length === 1 ? 'Post' : 'Posts'} Created
                </span>
              </h1>

              <p className="text-[var(--color-cream)] text-base leading-relaxed">
                Manage all your forum posts, track their status, and engage with your community
              </p>
            </div>

            <Link
              to="/forum/create"
              className="
                group flex items-center gap-3 px-8 py-4 rounded-2xl
                bg-white text-[var(--color-forest-dark)] font-bold text-base
                hover:bg-[var(--color-mint-light)] hover:scale-105
                active:scale-95 cursor-pointer shadow-2xl
                transition-all duration-300 flex-shrink-0 animate-bounce-soft
              "
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-forest)] 
                            flex items-center justify-center text-white
                            group-hover:rotate-90 transition-transform duration-300">
                <FiPlus size={20} />
              </div>
              <span>Create New Post</span>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" 
               className="w-full h-auto">
            <path d="M0 48L60 42C120 36 240 24 360 20C480 16 600 20 720 28C840 36 960 48 1080 50C1200 52 1320 44 1380 40L1440 36V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V48Z" 
                  fill="var(--color-cream-light)"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 -mt-12 relative z-20">

        {/* ═══════════════════════════════════════════════════════
            STATS CARDS
            ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Posts', value: stats.total, icon: FiFileText, color: 'from-[var(--color-forest)] to-[var(--color-sage)]', bgColor: 'bg-[var(--color-mint-light)]' },
            { label: 'Approved', value: stats.approved, icon: FiCheckCircle, color: 'from-emerald-500 to-emerald-400', bgColor: 'bg-emerald-50' },
            { label: 'Pending', value: stats.pending, icon: FiClock, color: 'from-amber-500 to-amber-400', bgColor: 'bg-amber-50' },
            { label: 'Rejected', value: stats.rejected, icon: FiXCircle, color: 'from-red-500 to-red-400', bgColor: 'bg-red-50' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{ animationDelay: `${i * 80}ms` }}
              className="group animate-slide-up cursor-pointer"
            >
              <div className={`
                relative overflow-hidden rounded-3xl ${stat.bgColor}
                border-2 border-white shadow-xl p-6
                transition-all duration-300
                hover:shadow-2xl hover:-translate-y-1 hover:scale-105
              `}>
                <div className={`
                  w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color}
                  flex items-center justify-center text-white mb-4
                  shadow-lg group-hover:scale-110 group-hover:rotate-6
                  transition-transform duration-300
                `}>
                  <stat.icon size={24} />
                </div>

                <p className="text-3xl font-extrabold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>

                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/20 
                              rounded-full group-hover:scale-150 transition-transform duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════
            FILTER BAR
            ═══════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl shadow-lg border-2 border-[var(--color-rose-beige)]/30 
                      p-5 mb-8 animate-slide-down">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <FiFilter size={18} className="text-[var(--color-forest)]" />
              <span className="font-semibold text-gray-800">Filter by Status:</span>
            </div>

            {[
              { value: 'all', label: 'All Posts', count: stats.total },
              { value: 'approved', label: 'Approved', count: stats.approved },
              { value: 'pending', label: 'Pending', count: stats.pending },
              { value: 'rejected', label: 'Rejected', count: stats.rejected },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-semibold
                  transition-all duration-300 cursor-pointer
                  border-2
                  ${filterStatus === filter.value
                    ? 'bg-[var(--color-forest)] text-white border-[var(--color-forest)] shadow-lg'
                    : 'bg-white text-gray-700 border-[var(--color-rose-beige)]/50 hover:border-[var(--color-forest)] hover:bg-[var(--color-mint-light)]'
                  }
                `}
              >
                {filter.label}
                {filter.count > 0 && (
                  <span className={`
                    ml-2 px-2 py-0.5 rounded-full text-xs
                    ${filterStatus === filter.value ? 'bg-white/20' : 'bg-[var(--color-mint-light)]'}
                  `}>
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            POSTS LIST
            ═══════════════════════════════════════════════════════ */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-24 animate-scale-in">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-3xl bg-[var(--color-mint-light)] 
                            flex items-center justify-center shadow-2xl">
                <HiOutlineSparkles size={64} className="text-[var(--color-forest)]" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full 
                            bg-[var(--color-forest)] flex items-center justify-center 
                            text-white shadow-lg">
                <FiFileText size={24} />
              </div>
            </div>
            
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
              {filterStatus === 'all' ? 'No Posts Yet' : `No ${filterStatus} Posts`}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
              {filterStatus === 'all'
                ? "You haven't created any forum posts yet. Share your thoughts with the campus community!"
                : `You don't have any ${filterStatus} posts at the moment.`
              }
            </p>
            
            {filterStatus === 'all' && (
              <Link
                to="/forum/create"
                className="
                  inline-flex items-center gap-3 px-8 py-4 rounded-2xl
                  bg-[var(--color-forest)] text-white font-bold text-base
                  hover:bg-[var(--color-forest-dark)] hover:scale-105
                  cursor-pointer shadow-2xl shadow-[var(--color-forest)]/30
                  transition-all duration-300 group
                "
              >
                <FiPlus size={20} className="group-hover:rotate-90 transition-transform" />
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {filteredPosts.map((post, index) => {
              const statusConfig = getStatusConfig(post.status);
              const StatusIcon = statusConfig.icon;
              const catConfig = categoryConfig[post.category] || categoryConfig.General;
              
              return (
                <div
                  key={post._id}
                  style={{ animationDelay: `${index * 60}ms` }}
                  className="
                    group bg-white rounded-3xl overflow-hidden
                    border-2 border-[var(--color-rose-beige)]/30
                    hover:border-[var(--color-mint)] hover:shadow-2xl
                    transition-all duration-300 animate-slide-up
                    hover:-translate-y-1
                  "
                >
                  <div className="flex flex-col lg:flex-row gap-5 p-6">
                    
                    {/* Post Image */}
                    {post.image?.url && (
                      <div className="flex-shrink-0">
                        <div className="w-full lg:w-40 h-40 rounded-2xl overflow-hidden 
                                      border-2 border-[var(--color-rose-beige)]/30
                                      group-hover:scale-105 transition-transform duration-300">
                          <img 
                            src={post.image.url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {/* Category */}
                        <span className={`
                          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl 
                          text-xs font-bold ${catConfig.color}
                        `}>
                          <span>{catConfig.icon}</span>
                          {post.category}
                        </span>

                        {/* Status */}
                        <span className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-xl 
                          text-xs font-bold border-2 ${statusConfig.color}
                        `}>
                          <StatusIcon size={14} />
                          {statusConfig.label}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 
                                   group-hover:text-[var(--color-forest)] transition-colors
                                   line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                        {post.content}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <FiClock size={14} />
                          {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FiEye size={14} />
                          {post.views || 0} views
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FiHeart size={14} />
                          {post.likes?.length || 0} likes
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FiMessageCircle size={14} />
                          {post.comments?.length || 0} comments
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-3 lg:ml-4 flex-shrink-0">
                      <Link
                        to={`/forum/${post._id}`}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                                 bg-[var(--color-mint-light)] text-[var(--color-forest)]
                                 hover:bg-[var(--color-mint)] hover:scale-110
                                 cursor-pointer transition-all duration-300 shadow-md
                                 min-w-[100px]"
                      >
                        <FiEye size={18} />
                        <span className="font-semibold text-sm">View</span>
                      </Link>

                      <Link
                        to={`/forum/${post._id}/edit`}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                                 bg-white text-gray-700 border-2 border-[var(--color-rose-beige)]
                                 hover:bg-[var(--color-mint-light)] hover:border-[var(--color-mint)]
                                 hover:scale-110 cursor-pointer transition-all duration-300
                                 shadow-md min-w-[100px]"
                      >
                        <FiEdit size={18} />
                        <span className="font-semibold text-sm">Edit</span>
                      </Link>

                      <button
                        onClick={() => handleDeleteClick(post)}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                                 bg-red-50 text-red-600 border-2 border-red-200
                                 hover:bg-red-500 hover:text-white hover:border-red-500
                                 hover:scale-110 cursor-pointer transition-all duration-300
                                 shadow-md min-w-[100px]"
                      >
                        <FiTrash2 size={18} />
                        <span className="font-semibold text-sm">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
          ═══════════════════════════════════════════════════════ */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          />
          <div className="
            relative w-full max-w-md bg-white
            rounded-3xl p-8 shadow-2xl animate-scale-in
            border-2 border-[var(--color-rose-beige)]/30
          ">
            <div className="flex flex-col items-center text-center gap-6 mb-8">
              <div className="
                w-24 h-24 rounded-3xl bg-red-100 flex items-center justify-center
                text-red-500 animate-bounce-soft shadow-2xl
              ">
                <FiAlertTriangle size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
                  Delete This Post?
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  Are you sure you want to permanently delete{' '}
                  <strong className="text-gray-900">"{confirmDelete.title}"</strong>?
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="
                  flex-1 py-4 rounded-2xl text-base font-bold
                  bg-[var(--color-cream)] text-gray-700
                  border-2 border-[var(--color-rose-beige)]
                  hover:bg-[var(--color-rose-beige)]/30 hover:scale-105
                  cursor-pointer transition-all duration-200
                "
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deletingId === confirmDelete._id}
                className="
                  flex-1 flex items-center justify-center gap-3
                  py-4 rounded-2xl text-base font-bold
                  bg-red-500 text-white hover:bg-red-600
                  shadow-2xl shadow-red-500/40
                  hover:scale-105 disabled:opacity-60 cursor-pointer
                  transition-all duration-200
                "
              >
                {deletingId === confirmDelete._id ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={20} />
                    Delete Forever
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyForumPosts;