import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { getForumPostAPI, toggleLikePostAPI, deleteForumPostAPI } from '../../api/axios.js';
import CommentSection from '../../components/forum/CommentSection.jsx';
import Loader from '../../components/common/Loader.jsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  FiHeart, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiArrowLeft,
  FiShare2,
  FiBookmark,
  FiMoreHorizontal,
  FiMessageCircle
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

  useEffect(() => {
    fetchPost();
  }, [id]);

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

  const handleDelete = async () => {
    if (!confirm('Delete this post? This action cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteForumPostAPI(id);
      toast.success('Post deleted');
      navigate('/forum');
    } catch (error) {
      toast.error('Delete failed');
      setDeleting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post.title,
        url: window.location.href
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    toast.success(saved ? 'Removed from saved' : 'Saved to collection');
  };

  const isLiked = post?.likes?.some(l => (l._id || l) === user?._id);
  const isAuthor = post?.author?._id === user?._id;

  const categoryBadgeColors = {
    Announcement: 'bg-amber-50 text-amber-700 border-amber-200',
    Article: 'bg-blue-50 text-blue-700 border-blue-200',
    Notice: 'bg-red-50 text-red-700 border-red-200',
    Discussion: 'bg-mint/30 text-forest border-mint',
    Event: 'bg-purple-50 text-purple-700 border-purple-200',
    General: 'bg-sage/20 text-forest border-sage/30',
  };

  if (loading) return <Loader />;
  if (!post) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-light via-cream to-cream-dark">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-mint/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sage/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Link 
          to="/forum"
          className="inline-flex items-center gap-2 text-forest hover:text-forest-dark 
                   transition-colors mb-6 group animate-fade-in"
        >
          <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Forum</span>
        </Link>

        {/* Main Post Card */}
        <article className="glass rounded-3xl overflow-hidden shadow-xl shadow-forest/10 animate-scale-in mb-6">
          {/* Header - Author Info */}
          <div className="flex items-center justify-between p-4 border-b border-rose-beige/20">
            <Link 
              to={`/user/${post.author?._id}`}
              className="flex items-center gap-3 flex-1 min-w-0"
            >
              {post.author?.profileImage?.url ? (
                <img 
                  src={post.author.profileImage.url} 
                  alt={post.author.name}
                  className="w-11 h-11 rounded-xl object-cover ring-2 ring-mint/30 flex-shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-mint to-sage 
                              flex items-center justify-center text-white font-bold flex-shrink-0">
                  {post.author?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-forest-dark truncate">
                    {post.author?.name}
                  </span>
                  {post.isAdminPost && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full 
                                   bg-forest/10 text-forest text-xs font-medium flex-shrink-0">
                      <HiOutlineSparkles className="w-3 h-3" />
                      Admin
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-rose-beige">
                  <span>{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</span>
                  {post.isPinned && (
                    <span className="flex items-center gap-1 text-amber-600">
                      <IoPin className="w-3 h-3" />
                      Pinned
                    </span>
                  )}
                </div>
              </div>
            </Link>

            {/* More Menu */}
            {isAuthor && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-xl hover:bg-mint/20 transition-colors"
                >
                  <FiMoreHorizontal className="w-5 h-5 text-rose-beige" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 glass rounded-2xl shadow-xl 
                                overflow-hidden z-20 animate-scale-in">
                    <Link
                      to={`/forum/${id}/edit`}
                      className="flex items-center gap-3 px-4 py-3 text-forest hover:bg-mint/30 
                               transition-colors border-b border-rose-beige/20"
                    >
                      <FiEdit className="w-4 h-4" />
                      <span className="font-medium">Edit Post</span>
                    </Link>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-500 
                               hover:bg-red-50 transition-colors"
                    >
                      {deleting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                          <span className="font-medium">Deleting...</span>
                        </>
                      ) : (
                        <>
                          <FiTrash2 className="w-4 h-4" />
                          <span className="font-medium">Delete Post</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Post Image */}
          {post.image?.url && (
            <div className="relative w-full aspect-square bg-cream-dark">
              <img 
                src={post.image.url} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-rose-beige/20">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                disabled={liking}
                className={`
                  group flex items-center gap-2 transition-all duration-300
                  ${liking ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
                `}
              >
                <FiHeart 
                  className={`
                    w-7 h-7 transition-all cursor-pointer
                    ${isLiked 
                      ? 'text-red-500 fill-red-500' 
                      : 'text-rose-beige group-hover:text-red-500'
                    }
                    ${liking ? 'animate-bounce-soft' : ''}
                  `}
                />
                <span className="text-sm font-semibold text-forest-dark">
                  {post.likes?.length || 0}
                </span>
              </button>
              
              <button 
                onClick={() => document.getElementById('comment-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center gap-2 transition-all duration-300 hover:scale-110 cursor-pointer"
              >
                <FiMessageCircle className="w-7 h-7 text-rose-beige group-hover:text-forest transition-colors" />
                <span className="text-sm font-semibold text-forest-dark">
                  {post.comments?.length || 0}
                </span>
              </button>

              <button 
                onClick={handleShare}
                className="transition-all duration-300 hover:scale-110 cursor-pointer"
              >
                <FiShare2 className="w-7 h-7 text-rose-beige hover:text-forest transition-colors" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-rose-beige cursor-not-allowed">
                <FiEye className="w-5 h-5" />
                <span className="text-sm font-medium">{post.views || 0}</span>
              </div>
              
              <button 
                onClick={handleSave}
                className="transition-all duration-300 hover:scale-110"
              >
                <FiBookmark 
                  className={`
                    w-6 h-6 transition-colors cursor-pointer
                    ${saved ? 'text-forest fill-forest' : 'text-rose-beige hover:text-forest'}
                  `}
                />
              </button>
            </div>
          </div>

          {/* Post Content */}
          <div className="px-4 py-4">
            {/* Category Badge */}
            <div className="mb-3">
              <span className={`
                inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border
                ${categoryBadgeColors[post.category] || categoryBadgeColors.General}
              `}>
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-forest-dark mb-3 leading-tight">
              {post.title}
            </h1>

            {/* Content */}
            <div className="prose prose-sm max-w-none">
              <p className="text-forest-dark/90 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          </div>

          {/* Likes Info */}
          {post.likes?.length > 0 && (
            <div className="px-4 pb-3">
              <p className="text-sm font-semibold text-forest-dark">
                {post.likes.length === 1 
                  ? '1 like' 
                  : `${post.likes.length} likes`
                }
              </p>
            </div>
          )}

          {/* Timestamp */}
          <div className="px-4 pb-4">
            <p className="text-xs text-rose-beige uppercase">
              {format(new Date(post.createdAt), 'MMMM dd, yyyy • h:mm a')}
            </p>
          </div>
        </article>

        {/* Comments Section */}
        <div 
          id="comment-section"
          className="glass rounded-3xl p-4 sm:p-6 shadow-xl shadow-forest/10 animate-slide-up"
          style={{ animationDelay: '200ms' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <FiMessageCircle className="w-5 h-5 text-forest" />
            <h2 className="text-lg font-bold text-forest-dark">
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
    </div>
  );
};

export default ForumPostDetail;