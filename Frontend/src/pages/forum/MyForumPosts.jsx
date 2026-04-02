import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyForumPostsAPI, deleteForumPostAPI } from '../../api/axios.js';
import Loader from '../../components/common/Loader.jsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  FiEye, 
  FiTrash2, 
  FiPlus, 
  FiEdit, 
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';

const MyForumPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const handleDelete = async (id) => {
    if (!confirm('Delete this post? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteForumPostAPI(id);
      toast.success('Post deleted');
      setPosts(prev => prev.filter(p => p._id !== id));
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
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: FiCheckCircle,
          label: 'Approved'
        };
      case 'pending':
        return {
          color: 'bg-amber-100 text-amber-700 border-amber-200',
          icon: FiClock,
          label: 'Pending Review'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-700 border-red-200',
          icon: FiXCircle,
          label: 'Rejected'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: FiClock,
          label: status
        };
    }
  };

  const categoryColors = {
    Announcement: 'bg-amber-50 text-amber-700',
    Article: 'bg-blue-50 text-blue-700',
    Notice: 'bg-red-50 text-red-700',
    Discussion: 'bg-mint/30 text-forest',
    Event: 'bg-purple-50 text-purple-700',
    General: 'bg-sage/20 text-forest',
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-light via-cream to-cream-dark">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-mint/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sage/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-slide-down">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-forest/20">
              <FiFileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-forest-dark">My Forum Posts</h1>
              <p className="text-rose-beige">{posts.length} post{posts.length !== 1 ? 's' : ''} created</p>
            </div>
          </div>

          <Link
            to="/forum/create"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl 
                     bg-gradient-to-r from-forest to-sage text-white font-semibold 
                     shadow-lg shadow-forest/30 hover:shadow-xl hover:scale-105 
                     active:scale-95 transition-all duration-300"
          >
            <FiPlus className="w-5 h-5" />
            <span>New Post</span>
          </Link>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-mint/30 flex items-center justify-center mb-6">
              <HiOutlineSparkles className="w-12 h-12 text-sage" />
            </div>
            <h3 className="text-2xl font-bold text-forest-dark mb-2">No posts yet</h3>
            <p className="text-rose-beige max-w-md mx-auto mb-6">
              You haven't created any forum posts yet. Share your thoughts with the campus community!
            </p>
            <Link
              to="/forum/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl 
                       bg-gradient-to-r from-forest to-sage text-white font-semibold
                       shadow-lg shadow-forest/30 hover:shadow-xl transition-all duration-300"
            >
              <FiPlus className="w-5 h-5" />
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => {
              const statusConfig = getStatusConfig(post.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div
                  key={post._id}
                  className="glass rounded-2xl p-5 hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Post Image (if exists) */}
                    {post.image?.url && (
                      <div className="flex-shrink-0">
                        <img 
                          src={post.image.url}
                          alt={post.title}
                          className="w-full lg:w-32 h-32 object-cover rounded-xl"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {/* Category */}
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-semibold
                          ${categoryColors[post.category] || categoryColors.General}
                        `}>
                          {post.category}
                        </span>

                        {/* Status */}
                        <span className={`
                          flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border
                          ${statusConfig.color}
                        `}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-forest-dark mb-1 truncate">
                        {post.title}
                      </h3>

                      <p className="text-sm text-rose-beige line-clamp-2 mb-3">
                        {post.content.substring(0, 150)}...
                      </p>

                      <div className="flex items-center gap-4 text-xs text-rose-beige">
                        <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                        <span className="flex items-center gap-1">
                          <FiEye className="w-3 h-3" />
                          {post.views || 0} views
                        </span>
                        <span>{post.likes?.length || 0} likes</span>
                        <span>{post.comments?.length || 0} comments</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 lg:ml-4">
                      <Link
                        to={`/forum/${post._id}`}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                                 glass hover:bg-mint/30 text-forest transition-all duration-300"
                      >
                        <FiEye className="w-4 h-4" />
                        <span className="lg:hidden">View</span>
                      </Link>

                      <Link
                        to={`/forum/${post._id}/edit`}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                                 glass hover:bg-mint/30 text-forest transition-all duration-300"
                      >
                        <FiEdit className="w-4 h-4" />
                        <span className="lg:hidden">Edit</span>
                      </Link>

                      <button
                        onClick={() => handleDelete(post._id)}
                        disabled={deletingId === post._id}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                                 glass hover:bg-red-50 text-red-500 transition-all duration-300"
                      >
                        {deletingId === post._id ? (
                          <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                        ) : (
                          <FiTrash2 className="w-4 h-4" />
                        )}
                        <span className="lg:hidden">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyForumPosts;