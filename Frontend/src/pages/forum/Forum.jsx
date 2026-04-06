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
  FiPlus, FiSend, FiFilter, FiX, FiClock, FiMessageSquare,
  FiTrendingUp, FiStar, FiUsers, FiZap, FiCheckCircle, FiAlertCircle
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
    { value: '', label: 'All Categories', icon: '🌐', color: 'from-gray-500 to-gray-400' },
    { value: 'Announcement', label: 'Announcements', icon: '📢', color: 'from-amber-500 to-amber-400' },
    { value: 'Article', label: 'Articles', icon: '📝', color: 'from-blue-500 to-blue-400' },
    { value: 'Notice', label: 'Notices', icon: '📌', color: 'from-red-500 to-red-400' },
    { value: 'Discussion', label: 'Discussions', icon: '💭', color: 'from-purple-500 to-purple-400' },
    { value: 'Event', label: 'Events', icon: '🎉', color: 'from-pink-500 to-pink-400' },
    { value: 'General', label: 'General', icon: '💬', color: 'from-[var(--color-forest)] to-[var(--color-sage)]' },
  ];

  useEffect(() => { fetchPosts(); }, [filters]);

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

  // Stats calculation
  const stats = {
    total: pagination?.total || 0,
    active: posts.filter(p => new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
    trending: posts.filter(p => p.likes?.length > 5).length,
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)]">

      {/* ═══════════════════════════════════════════════════════
          HERO HEADER
          ═══════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-[var(--color-forest-dark)] mb-8 py-20">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-mint)] rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-sage)] rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Left Content */}
            <div className="flex-1 animate-slide-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-sage)]/20 
                            backdrop-blur-sm rounded-full border border-[var(--color-mint)]/30 mb-4">
                <FiMessageSquare size={14} className="text-[var(--color-mint)] animate-pulse-soft" />
                <span className="text-[var(--color-mint-light)] text-sm font-medium">
                  Campus Community Hub
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
                Campus Forum
                <span className="block text-2xl sm:text-3xl text-[var(--color-mint-light)] 
                              font-normal mt-2">
                  Connect, Share & Discuss
                </span>
              </h1>

              <p className="text-[var(--color-cream)] text-base leading-relaxed max-w-2xl">
                Join the conversation with fellow students. Share knowledge, ask questions, 
                and stay updated with campus announcements.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl 
                              bg-white/10 backdrop-blur-sm border border-white/20">
                  <FiUsers size={16} className="text-[var(--color-mint)]" />
                  <span className="text-white text-sm font-medium">
                    {stats.total} Posts
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl 
                              bg-white/10 backdrop-blur-sm border border-white/20">
                  <FiTrendingUp size={16} className="text-[var(--color-mint)]" />
                  <span className="text-white text-sm font-medium">
                    {stats.trending} Trending
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0 animate-scale-in">
              {user?.forumAccess ? (
                <Link
                  to="/forum/create"
                  className="
                    group flex items-center gap-3 px-8 py-4 rounded-2xl
                    bg-white text-[var(--color-forest-dark)] font-bold text-base
                    hover:bg-[var(--color-mint-light)] hover:scale-105
                    active:scale-95 cursor-pointer shadow-2xl
                    transition-all duration-300
                  "
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-forest)] 
                                flex items-center justify-center text-white
                                group-hover:rotate-90 transition-transform duration-300">
                    <FiPlus size={20} />
                  </div>
                  <span>Create New Post</span>
                </Link>
              ) : !user?.forumAccessRequested ? (
                <button
                  onClick={() => setAccessModal(true)}
                  className="
                    group flex items-center gap-3 px-8 py-4 rounded-2xl
                    bg-white text-[var(--color-forest-dark)] font-bold text-base
                    hover:bg-[var(--color-mint-light)] hover:scale-105
                    active:scale-95 cursor-pointer shadow-2xl
                    transition-all duration-300
                  "
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-forest)] 
                                flex items-center justify-center text-white
                                group-hover:scale-110 transition-transform duration-300">
                    <FiSend size={18} />
                  </div>
                  <span>Request Access</span>
                </button>
              ) : (
                <div className="flex items-center gap-3 px-8 py-4 rounded-2xl
                              bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 
                                flex items-center justify-center text-white">
                    <FiClock size={18} className="animate-pulse-soft" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Request Pending</p>
                    <p className="text-[var(--color-mint-light)] text-xs">
                      We'll review your request soon
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
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
            SEARCH & FILTER BAR
            ═══════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-[var(--color-rose-beige)]/30 
                      p-5 mb-8 animate-slide-down">
          
          {/* Search Row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1">
              <SearchBar
                onSearch={(q) => setFilters({ ...filters, search: q, page: 1 })}
                placeholder="🔍 Search posts, topics, announcements..."
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                font-semibold text-sm transition-all duration-300
                border-2 cursor-pointer
                ${showFilters 
                  ? 'bg-[var(--color-forest)] text-white border-[var(--color-forest)] shadow-lg' 
                  : 'bg-white text-[var(--color-forest)] border-[var(--color-rose-beige)] hover:border-[var(--color-forest)] hover:bg-[var(--color-mint-light)]'
                }
              `}
            >
              <FiFilter size={18} />
              <span>Filters</span>
              {(filters.category || filters.search) && (
                <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs 
                               flex items-center justify-center font-bold">
                  {(filters.category ? 1 : 0) + (filters.search ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {/* Expandable Category Filters */}
          {showFilters && (
            <div className="pt-4 border-t-2 border-[var(--color-cream-dark)] animate-slide-down">
              <p className="text-sm font-bold text-gray-700 mb-3">Filter by Category</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setFilters({ ...filters, category: cat.value, page: 1 })}
                    className={`
                      group relative overflow-hidden p-4 rounded-2xl
                      border-2 cursor-pointer transition-all duration-300
                      hover:scale-105 hover:shadow-lg
                      ${filters.category === cat.value
                        ? 'border-[var(--color-forest)] bg-[var(--color-mint-light)] shadow-lg'
                        : 'border-[var(--color-rose-beige)]/40 bg-white hover:border-[var(--color-mint)]'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">{cat.icon}</span>
                      <span className="text-xs font-semibold text-gray-700 text-center">
                        {cat.label}
                      </span>
                    </div>
                    {filters.category === cat.value && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full 
                                    bg-[var(--color-forest)] flex items-center justify-center
                                    text-white animate-scale-in">
                        <FiCheckCircle size={14} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Filters Tags */}
          {(filters.category || filters.search) && (
            <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 
                          border-t-2 border-[var(--color-cream-dark)] animate-fade-in">
              <span className="text-sm font-semibold text-gray-600">Active Filters:</span>
              
              {filters.category && (
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                               bg-[var(--color-mint-light)] text-[var(--color-forest)]
                               border-2 border-[var(--color-mint)]/40 text-sm font-medium">
                  {categories.find(c => c.value === filters.category)?.icon}{' '}
                  {categories.find(c => c.value === filters.category)?.label}
                  <button
                    onClick={() => setFilters({ ...filters, category: '', page: 1 })}
                    className="p-0.5 rounded-full hover:bg-[var(--color-mint)] 
                             transition-colors cursor-pointer"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              )}
              
              {filters.search && (
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                               bg-blue-50 text-blue-700 border-2 border-blue-200 text-sm font-medium">
                  Search: "{filters.search}"
                  <button
                    onClick={() => setFilters({ ...filters, search: '', page: 1 })}
                    className="p-0.5 rounded-full hover:bg-blue-100 
                             transition-colors cursor-pointer"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              )}

              <button
                onClick={() => setFilters({ category: '', search: '', page: 1 })}
                className="ml-auto text-sm font-semibold text-red-600 hover:text-red-700
                         cursor-pointer transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════
            POSTS FEED
            ═══════════════════════════════════════════════════════ */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : posts.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-center py-24 animate-scale-in">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-3xl bg-[var(--color-mint-light)] 
                            flex items-center justify-center shadow-2xl">
                <HiOutlineSparkles size={64} className="text-[var(--color-forest)]" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full 
                            bg-[var(--color-forest)] flex items-center justify-center 
                            text-white shadow-lg">
                <FiMessageSquare size={24} />
              </div>
            </div>
            
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
              {filters.search || filters.category ? 'No Posts Found' : 'No Posts Yet'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
              {filters.search || filters.category
                ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
                : 'Be the first to share something amazing with the community!'}
            </p>
            
            {user?.forumAccess && !(filters.search || filters.category) && (
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
          /* POSTS GRID */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          <div className="mt-12 animate-slide-up">
            <Pagination
              pagination={pagination}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
          ACCESS REQUEST MODAL
          ═══════════════════════════════════════════════════════ */}
      <Modal
        isOpen={accessModal}
        onClose={() => setAccessModal(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-forest)] 
                          flex items-center justify-center text-white">
              <FiSend size={18} />
            </div>
            <span>Request Forum Access</span>
          </div>
        }
      >
        <div className="space-y-6 p-1">
          {/* Icon & Description */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br 
                          from-[var(--color-mint)] to-[var(--color-sage)] 
                          flex items-center justify-center mb-4 shadow-xl">
              <FiZap size={36} className="text-white" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              Join the Conversation
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
              Tell us why you'd like to contribute to the campus forum. 
              We review all requests to maintain a quality community.
            </p>
          </div>

          {/* Reason Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Your Reason *
            </label>
            <textarea
              placeholder="I'd like to share my knowledge about... / I want to help students with... / I'm interested in discussing..."
              value={accessReason}
              onChange={(e) => setAccessReason(e.target.value)}
              rows={5}
              maxLength={500}
              className="
                w-full px-4 py-3 rounded-xl text-sm
                bg-[var(--color-cream)] border-2 border-[var(--color-rose-beige)]/50
                text-gray-700 placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]
                focus:border-[var(--color-sage)]
                transition-all duration-200 resize-none
              "
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-400">
                {accessReason.length} / 500 characters
              </p>
              {accessReason.length >= 50 && accessReason.length <= 500 && (
                <span className="text-xs text-emerald-600 flex items-center gap-1">
                  <FiCheckCircle size={12} />
                  Good length
                </span>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
            <div className="flex gap-3">
              <FiAlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">Review Process</p>
                <p className="text-xs leading-relaxed">
                  Our team reviews requests within 24-48 hours. You'll receive a notification 
                  once your request is processed.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleRequestAccess}
              disabled={requesting || !accessReason.trim() || accessReason.length < 20}
              className={`
                flex-1 flex items-center justify-center gap-2 
                px-6 py-4 rounded-2xl font-bold text-base
                transition-all duration-300 shadow-lg
                ${requesting || !accessReason.trim() || accessReason.length < 20
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[var(--color-forest)] text-white hover:bg-[var(--color-forest-dark)] hover:scale-105 cursor-pointer shadow-[var(--color-forest)]/30'
                }
              `}
            >
              {requesting ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FiSend size={18} />
                  <span>Submit Request</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => setAccessModal(false)}
              className="px-6 py-4 rounded-2xl font-semibold text-base
                       bg-[var(--color-cream)] text-gray-700
                       border-2 border-[var(--color-rose-beige)]
                       hover:bg-[var(--color-rose-beige)]/30 cursor-pointer
                       transition-all duration-300"
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