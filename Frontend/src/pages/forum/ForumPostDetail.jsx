import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { getForumPostAPI, toggleLikePostAPI, deleteForumPostAPI } from '../../api/axios.js';
import CommentSection from '../../components/forum/CommentSection.jsx';
import Loader from '../../components/common/Loader.jsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  FiHeart, FiEdit, FiTrash2, FiEye, FiArrowLeft, FiShare2,
  FiBookmark, FiMoreHorizontal, FiMessageCircle, FiClock,
  FiCheckCircle, FiAlertTriangle, FiUser, FiCalendar
} from 'react-icons/fi';
import { IoPin } from 'react-icons/io5';
import { HiOutlineSparkles } from 'react-icons/hi2';

const ForumPostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => { fetchPost(); }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const fetchPost = async () => {
    try {
      const { data } = await getForumPostAPI(id);
      if (data.success) setPost(data.post);
    } catch (error) {
      toast.error('Post not found');
      navigate('/forum');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    try {
      const { data } = await toggleLikePostAPI(id);
      if (data.success) {
        setPost(prev => ({
          ...prev,
          likes: data.liked
            ? [...(prev.likes || []), { _id: user._id }]
            : prev.likes.filter(l => (l._id || l) !== user._id)
        }));
      }
    } catch (error) {
      toast.error('Failed to like');
    } finally {
      setLiking(false);
    }
  };

  const handleDeleteClick = () => {
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteForumPostAPI(id);
      toast.success('Post deleted successfully');
      navigate('/forum');
    } catch (error) {
      toast.error('Delete failed');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.content.substring(0, 100) + '...',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard! 📋');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard! 📋');
      }
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    toast.success(saved ? '📌 Removed from saved' : '💾 Saved to collection');
  };

  const isLiked = post?.likes?.some(l => (l._id || l) === user?._id);
  const isAuthor = post?.author?._id === user?._id;

  const categoryConfig = {
    Announcement: { 
      color: 'bg-amber-50 text-amber-700 border-amber-200', 
      gradient: 'from-amber-500 to-amber-400',
      icon: '📢'
    },
    Article: { 
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      gradient: 'from-blue-500 to-blue-400',
      icon: '📝'
    },
    Notice: { 
      color: 'bg-red-50 text-red-700 border-red-200',
      gradient: 'from-red-500 to-red-400',
      icon: '📌'
    },
    Discussion: { 
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      gradient: 'from-purple-500 to-purple-400',
      icon: '💭'
    },
    Event: { 
      color: 'bg-pink-50 text-pink-700 border-pink-200',
      gradient: 'from-pink-500 to-pink-400',
      icon: '🎉'
    },
    General: { 
      color: 'bg-[var(--color-mint-light)] text-[var(--color-forest)] border-[var(--color-mint)]',
      gradient: 'from-[var(--color-forest)] to-[var(--color-sage)]',
      icon: '💬'
    },
  };

  const catConfig = categoryConfig[post?.category] || categoryConfig.General;

  if (loading) return <Loader />;
  if (!post) return null;

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)]">

      {/* ═══════════════════════════════════════════════════════
          NAVIGATION BAR
          ═══════════════════════════════════════════════════════ */}
      <div className="bg-white border-b-2 border-[var(--color-cream-dark)] shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/forum"
              className="group flex items-center gap-2 text-[var(--color-forest)] 
                       hover:text-[var(--color-forest-dark)] transition-colors cursor-pointer"
            >
              <FiArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back to Forum</span>
            </Link>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className={`
                  p-2.5 rounded-xl transition-all duration-300 cursor-pointer
                  ${saved 
                    ? 'bg-[var(--color-forest)] text-white shadow-lg' 
                    : 'bg-[var(--color-cream)] text-gray-600 hover:bg-[var(--color-mint-light)]'
                  }
                `}
                title={saved ? 'Remove from saved' : 'Save post'}
              >
                <FiBookmark size={18} className={saved ? 'fill-current' : ''} />
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-[var(--color-cream)] text-gray-600
                         hover:bg-[var(--color-mint-light)] transition-all cursor-pointer"
                title="Share post"
              >
                <FiShare2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ═══════════════════════════════════════════════════════
            MAIN POST CARD
            ═══════════════════════════════════════════════════════ */}
        <article className="bg-white rounded-3xl overflow-hidden shadow-2xl 
                          border-2 border-[var(--color-rose-beige)]/30 mb-8 animate-scale-in">
          
          {/* Header - Author & Meta */}
          <div className="p-6 border-b-2 border-[var(--color-cream-dark)]">
            <div className="flex items-start justify-between gap-4">
              
              {/* Author Info */}
              <Link 
                to={`/user/${post.author?._id}`}
                className="flex items-center gap-4 flex-1 min-w-0 group cursor-pointer"
              >
                {post.author?.profileImage?.url ? (
                  <img 
                    src={post.author.profileImage.url} 
                    alt={post.author.name}
                    className="w-14 h-14 rounded-2xl object-cover shadow-lg 
                             border-2 border-[var(--color-mint)]/30 flex-shrink-0
                             group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br 
                                from-[var(--color-mint)] to-[var(--color-sage)] 
                                flex items-center justify-center text-white font-bold 
                                text-xl shadow-lg flex-shrink-0
                                group-hover:scale-110 transition-transform">
                    {post.author?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 text-lg truncate
                                   group-hover:text-[var(--color-forest)] transition-colors">
                      {post.author?.name}
                    </span>
                    {post.isAdminPost && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full 
                                     bg-gradient-to-r from-purple-500 to-purple-400
                                     text-white text-xs font-bold shadow-md flex-shrink-0">
                        <HiOutlineSparkles size={12} />
                        ADMIN
                      </span>
                    )}
                    {post.isPinned && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full 
                                     bg-amber-100 text-amber-700 text-xs font-bold 
                                     border border-amber-200 flex-shrink-0">
                        <IoPin size={12} />
                        PINNED
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiCalendar size={14} />
                      {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FiClock size={14} />
                      {format(new Date(post.createdAt), 'h:mm a')}
                    </span>
                  </div>
                </div>
              </Link>

              {/* More Menu (Author Only) */}
              {isAuthor && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 rounded-xl hover:bg-[var(--color-cream)] 
                             transition-colors cursor-pointer"
                  >
                    <FiMoreHorizontal size={20} className="text-gray-600" />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white 
                                  rounded-2xl shadow-2xl overflow-hidden z-20 
                                  border-2 border-[var(--color-rose-beige)]/30
                                  animate-scale-in">
                      <Link
                        to={`/forum/${id}/edit`}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700
                                 hover:bg-[var(--color-mint-light)] transition-colors
                                 border-b border-[var(--color-cream-dark)] cursor-pointer"
                      >
                        <FiEdit size={16} />
                        <span className="font-medium">Edit Post</span>
                      </Link>
                      <button
                        onClick={handleDeleteClick}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600
                                 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <FiTrash2 size={16} />
                        <span className="font-medium">Delete Post</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Category & Title */}
          <div className="px-6 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <span className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-xl 
                text-sm font-bold border-2 ${catConfig.color}
              `}>
                <span className="text-base">{catConfig.icon}</span>
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 
                         leading-tight mb-6">
              {post.title}
            </h1>
          </div>

          {/* Post Image */}
          {post.image?.url && (
            <div className="px-6 mb-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl 
                            border-2 border-[var(--color-rose-beige)]/30">
                <img 
                  src={post.image.url} 
                  alt={post.title}
                  className="w-full object-cover max-h-[600px]"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-6 pb-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                {post.content}
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="px-6 py-4 bg-[var(--color-cream)]/30 
                        border-t-2 border-[var(--color-cream-dark)]">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <FiHeart size={16} className={isLiked ? 'text-red-500' : ''} />
                  <strong>{post.likes?.length || 0}</strong> likes
                </span>
                <span className="flex items-center gap-1.5">
                  <FiMessageCircle size={16} />
                  <strong>{post.comments?.length || 0}</strong> comments
                </span>
              </div>
              <span className="flex items-center gap-1.5">
                <FiEye size={16} />
                <strong>{post.views || 0}</strong> views
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t-2 border-[var(--color-cream-dark)]">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleLike}
                disabled={liking}
                className={`
                  flex items-center justify-center gap-2 py-3 rounded-xl
                  font-semibold text-sm transition-all duration-300
                  border-2 cursor-pointer
                  ${isLiked
                    ? 'bg-red-50 text-red-500 border-red-200 shadow-md'
                    : 'bg-white text-gray-700 border-[var(--color-rose-beige)]/50 hover:border-red-300 hover:bg-red-50 hover:text-red-500'
                  }
                  ${liking ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                `}
              >
                <FiHeart size={18} className={`${isLiked ? 'fill-current' : ''} ${liking ? 'animate-bounce-soft' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </button>

              <button
                onClick={() => document.getElementById('comment-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-2 py-3 rounded-xl
                         font-semibold text-sm bg-white text-gray-700
                         border-2 border-[var(--color-rose-beige)]/50
                         hover:border-[var(--color-forest)] hover:bg-[var(--color-mint-light)]
                         hover:scale-105 transition-all cursor-pointer"
              >
                <FiMessageCircle size={18} />
                Comment
              </button>

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 py-3 rounded-xl
                         font-semibold text-sm bg-white text-gray-700
                         border-2 border-[var(--color-rose-beige)]/50
                         hover:border-[var(--color-sage)] hover:bg-[var(--color-mint-light)]
                         hover:scale-105 transition-all cursor-pointer"
              >
                <FiShare2 size={18} />
                Share
              </button>
            </div>
          </div>
        </article>

        {/* ═══════════════════════════════════════════════════════
            COMMENTS SECTION
            ═══════════════════════════════════════════════════════ */}
        <div 
          id="comment-section"
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl 
                   border-2 border-[var(--color-rose-beige)]/30 animate-slide-up"
          style={{ animationDelay: '200ms' }}
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[var(--color-cream-dark)]">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-mint-light)] 
                          flex items-center justify-center text-[var(--color-forest)]">
              <FiMessageCircle size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Comments ({post.comments?.length || 0})
            </h2>
          </div>
          
          <CommentSection
            postId={id}
            comments={post.comments || []}
            onUpdate={(comments) => setPost(prev => ({ ...prev, comments }))}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
          ═══════════════════════════════════════════════════════ */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
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
                  This will permanently delete your post{' '}
                  <strong className="text-gray-900">"{post.title}"</strong>.
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
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
                disabled={deleting}
                className="
                  flex-1 flex items-center justify-center gap-3
                  py-4 rounded-2xl text-base font-bold
                  bg-red-500 text-white hover:bg-red-600
                  shadow-2xl shadow-red-500/40
                  hover:scale-105 disabled:opacity-60 cursor-pointer
                  transition-all duration-200
                "
              >
                {deleting ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white 
                                  rounded-full animate-spin" />
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

export default ForumPostDetail;