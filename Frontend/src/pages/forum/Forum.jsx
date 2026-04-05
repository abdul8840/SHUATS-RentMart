import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { getForumPostsAPI, requestForumAccessAPI, toggleLikePostAPI } from '../../api/axios.js';
import ForumPostCard from '../../components/forum/ForumPostCard.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import toast from 'react-hot-toast';
import { 
  FiPlus, 
  FiSend, 
  FiFilter,
  FiX,
  FiClock,
  FiMessageSquare
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';

const Forum = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', search: '', page: 1 });
  const [accessModal, setAccessModal] = useState(false);
  const [accessReason, setAccessReason] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: '', label: 'All Categories', icon: '🌐' },
    { value: 'Announcement', label: 'Announcements', icon: '📢' },
    { value: 'Article', label: 'Articles', icon: '📝' },
    { value: 'Notice', label: 'Notices', icon: '📌' },
    { value: 'Discussion', label: 'Discussions', icon: '💭' },
    { value: 'Event', label: 'Events', icon: '🎉' },
    { value: 'General', label: 'General', icon: '💬' },
  ];

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await getForumPostsAPI(filters);
      if (data.success) {
        setPosts(data.posts);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const { data } = await toggleLikePostAPI(postId);
      if (data.success) {
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post._id === postId) {
              return {
                ...post,
                likes: data.liked
                  ? [...(post.likes || []), { _id: user._id }]
                  : post.likes.filter(l => (l._id || l) !== user._id)
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleRequestAccess = async () => {
    if (!accessReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    setRequesting(true);
    try {
      const { data } = await requestForumAccessAPI({ reason: accessReason });
      if (data.success) {
        toast.success(data.message);
        setAccessModal(false);
        setAccessReason('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Request failed');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-light via-cream to-cream-dark">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-mint/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sage/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-forest/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 animate-slide-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-forest/20">
                <FiMessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-forest-dark">
                  Campus Forum
                </h1>
                <p className="text-sm text-rose-beige">
                  Connect with your community
                </p>
              </div>
            </div>

            {/* Action Button */}
            {user?.forumAccess ? (
              <Link
                to="/forum/create"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-forest to-sage 
                         text-white font-semibold shadow-lg shadow-forest/30 hover:shadow-xl 
                         hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <FiPlus className="w-5 h-5" />
                <span className="hidden sm:inline">New Post</span>
              </Link>
            ) : !user?.forumAccessRequested ? (
              <button
                onClick={() => setAccessModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-forest to-sage 
                         text-white font-semibold shadow-lg shadow-forest/30 hover:shadow-xl 
                         hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <FiSend className="w-5 h-5" />
                <span className="hidden sm:inline">Request Access</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-forest">
                <FiClock className="w-4 h-4 animate-pulse-soft" />
                <span className="text-sm font-medium hidden sm:inline">Pending</span>
              </div>
            )}
          </div>

          {/* Search & Filter Bar */}
          <div className="glass rounded-2xl p-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <SearchBar
                  onSearch={(q) => setFilters({ ...filters, search: q, page: 1 })}
                  placeholder="Search posts..."
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  flex items-center gap-2 px-4 rounded-xl font-medium transition-all duration-300
                  ${showFilters 
                    ? 'bg-forest text-white' 
                    : 'bg-white/80 text-forest hover:bg-mint/30'
                  }
                `}
              >
                <FiFilter className="w-5 h-5" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="mt-3 pt-3 border-t border-rose-beige/20 animate-slide-down">
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setFilters({ ...filters, category: cat.value, page: 1 });
                      }}
                      className={`
                        flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300
                        ${filters.category === cat.value
                          ? 'bg-forest text-white shadow-md'
                          : 'bg-white/80 text-forest hover:bg-mint/30'
                        }
                      `}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Filters */}
            {(filters.category || filters.search) && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-rose-beige/20">
                {filters.category && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest/10 text-forest text-sm">
                    {categories.find(c => c.value === filters.category)?.icon} {filters.category}
                    <button
                      onClick={() => setFilters({ ...filters, category: '', page: 1 })}
                      className="ml-1 p-0.5 rounded-full hover:bg-forest/20 transition-colors"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {filters.search && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest/10 text-forest text-sm">
                    "{filters.search}"
                    <button
                      onClick={() => setFilters({ ...filters, search: '', page: 1 })}
                      className="ml-1 p-0.5 rounded-full hover:bg-forest/20 transition-colors"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Posts Feed */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-mint/30 flex items-center justify-center mb-6">
              <HiOutlineSparkles className="w-10 h-10 text-sage" />
            </div>
            <h3 className="text-xl font-bold text-forest-dark mb-2">No posts found</h3>
            <p className="text-rose-beige max-w-md mx-auto text-sm">
              {filters.search || filters.category
                ? 'Try adjusting your filters or search terms'
                : 'Be the first to share something with the community!'}
            </p>
            {user?.forumAccess && (
              <Link
                to="/forum/create"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-2xl 
                         bg-gradient-to-r from-forest to-sage text-white font-semibold
                         shadow-lg shadow-forest/30 hover:shadow-xl transition-all duration-300"
              >
                <FiPlus className="w-5 h-5" />
                Create First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <ForumPostCard 
                key={post._id} 
                post={post} 
                index={index}
                onLike={handleLike}
                user={user}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 animate-fade-in">
            <Pagination
              pagination={pagination}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          </div>
        )}
      </div>

      {/* Access Request Modal */}
      <Modal
        isOpen={accessModal}
        onClose={() => setAccessModal(false)}
        title="Request Forum Access"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-mint to-sage 
                          flex items-center justify-center mb-4">
              <FiSend className="w-8 h-8 text-white" />
            </div>
            <p className="text-forest-dark">
              Tell us why you'd like to contribute to the campus forum:
            </p>
          </div>

          <textarea
            placeholder="I'd like to share my thoughts about..."
            value={accessReason}
            onChange={(e) => setAccessReason(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-cream border border-rose-beige/30
                     focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none
                     placeholder:text-rose-beige/60 text-forest-dark resize-none
                     transition-all duration-300"
          />

          <div className="flex gap-3">
            <button
              onClick={handleRequestAccess}
              disabled={requesting || !accessReason.trim()}
              className={`
                flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold
                transition-all duration-300
                ${requesting || !accessReason.trim()
                  ? 'bg-rose-beige/30 text-rose-beige cursor-not-allowed'
                  : 'bg-gradient-to-r from-forest to-sage text-white shadow-lg shadow-forest/30 hover:shadow-xl'
                }
              `}
            >
              {requesting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FiSend className="w-5 h-5" />
                  <span>Submit Request</span>
                </>
              )}
            </button>
            <button
              onClick={() => setAccessModal(false)}
              className="px-6 py-3 rounded-xl glass text-forest font-medium hover:bg-white/80 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Forum;