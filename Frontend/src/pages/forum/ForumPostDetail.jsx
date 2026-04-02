import { useState, useEffect } from 'react';
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
  FiMoreHorizontal
} from 'react-icons/fi';
import { IoPin } from 'react-icons/io5';
import { HiOutlineSparkles } from 'react-icons/hi2';

const ForumPostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

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

  const isLiked = post?.likes?.some(l => (l._id || l) === user?._id);
  const isAuthor = post?.author?._id === user?._id;

  const categoryColors = {
    Announcement: 'from-amber-500 to-orange-500',
    Article: 'from-blue-500 to-indigo-500',
    Notice: 'from-red-500 to-pink-500',
    Discussion: 'from-forest to-sage',
    Event: 'from-purple-500 to-violet-500',
    General: 'from-sage to-mint',
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/forum"
          className="inline-flex items-center gap-2 text-forest hover:text-forest-dark transition-colors mb-6 group animate-fade-in"
        >
          <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Forum</span>
        </Link>

        {/* Main Content Card */}
        <article className="glass rounded-3xl overflow-hidden shadow-xl shadow-forest/10 animate-scale-in">
          {/* Cover Image */}
          {post.image?.url && (
            <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
              <img 
                src={post.image.url} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Badges on image */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                {post.isPinned && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                                 bg-gradient-to-r from-amber-500 to-orange-500 text-white 
                                 text-sm font-semibold shadow-lg">
                    <IoPin className="w-4 h-4" />
                    Pinned
                  </span>
                )}
                {post.isAdminPost && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                                 bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                    <HiOutlineSparkles className="w-4 h-4" />
                    Admin
                  </span>
                )}
              </div>

              {/* Category badge */}
              <div className="absolute bottom-4 left-4">
                <span className={`
                  px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg
                  bg-gradient-to-r ${categoryColors[post.category] || categoryColors.General}
                `}>
                  {post.category}
                </span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Category badges (if no image) */}
            {!post.image?.url && (
              <div className="flex items-center gap-2 mb-4 animate-slide-right">
                <span className={`
                  px-4 py-2 rounded-full text-sm font-semibold text-white shadow-md
                  bg-gradient-to-r ${categoryColors[post.category] || categoryColors.General}
                `}>
                  {post.category}
                </span>
                {post.isAdminPost && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                                 bg-forest/10 text-forest text-sm font-medium">
                    <HiOutlineSparkles className="w-4 h-4" />
                    Admin Post
                  </span>
                )}
                {post.isPinned && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                                 bg-amber-100 text-amber-700 text-sm font-medium">
                    <IoPin className="w-4 h-4" />
                    Pinned
                  </span>
                )}
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-forest-dark mb-6 leading-tight animate-slide-up">
              {post.title}
            </h1>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-rose-beige/20 mb-6 animate-slide-up"
                 style={{ animationDelay: '100ms' }}>
              <Link 
                to={`/user/${post.author?._id}`}
                className="flex items-center gap-3 group"
              >
                {post.author?.profileImage?.url ? (
                  <img 
                    src={post.author.profileImage.url} 
                    alt={post.author.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-mint/30 group-hover:ring-sage transition-all"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mint to-sage 
                                flex items-center justify-center text-white font-bold text-lg">
                    {post.author?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <span className="font-semibold text-forest-dark group-hover:text-forest transition-colors block">
                    {post.author?.name}
                  </span>
                  <span className="text-sm text-rose-beige">
                    {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-4 text-sm text-rose-beige">
                <span className="flex items-center gap-1.5">
                  <FiEye className="w-4 h-4" />
                  {post.views} views
                </span>
              </div>
            </div>

            {/* Post Content */}
            <div className="prose prose-lg max-w-none mb-8 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <p className="text-forest-dark/80 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-rose-beige/20 animate-slide-up"
                 style={{ animationDelay: '200ms' }}>
              {/* Left Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  disabled={liking}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300
                    ${isLiked
                      ? 'bg-red-50 text-red-500 hover:bg-red-100'
                      : 'glass hover:bg-white/80 text-forest'
                    }
                  `}
                >
                  <FiHeart 
                    className={`w-5 h-5 transition-transform ${liking ? 'animate-bounce-soft' : ''}`}
                    fill={isLiked ? 'currentColor' : 'none'}
                  />
                  <span>{post.likes?.length || 0}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass hover:bg-white/80 
                           text-forest font-medium transition-all duration-300"
                >
                  <FiShare2 className="w-5 h-5" />
                  <span className="hidden sm:inline">Share</span>
                </button>

                <button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass hover:bg-white/80 
                           text-forest font-medium transition-all duration-300"
                >
                  <FiBookmark className="w-5 h-5" />
                  <span className="hidden sm:inline">Save</span>
                </button>
              </div>

              {/* Author Actions */}
              {isAuthor && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2.5 rounded-xl glass hover:bg-white/80 text-forest transition-all duration-300"
                  >
                    <FiMoreHorizontal className="w-5 h-5" />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 glass rounded-2xl shadow-xl 
                                  overflow-hidden z-10 animate-scale-in">
                      <Link
                        to={`/forum/${id}/edit`}
                        className="flex items-center gap-3 px-4 py-3 text-forest hover:bg-mint/30 transition-colors"
                      >
                        <FiEdit className="w-4 h-4" />
                        <span>Edit Post</span>
                      </Link>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 
                                 hover:bg-red-50 transition-colors"
                      >
                        {deleting ? (
                          <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                        ) : (
                          <FiTrash2 className="w-4 h-4" />
                        )}
                        <span>Delete Post</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 glass rounded-3xl p-6 sm:p-8 shadow-xl shadow-forest/10 animate-slide-up"
             style={{ animationDelay: '250ms' }}>
          <CommentSection
            postId={id}
            comments={post.comments || []}
            onUpdate={(comments) => setPost(prev => ({ ...prev, comments }))}
          />
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(false)} 
        />
      )}
    </div>
  );
};

export default ForumPostDetail;