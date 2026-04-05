import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FiHeart, FiMessageCircle, FiEye, FiMoreVertical, FiBookmark, FiShare2 } from 'react-icons/fi';
import { IoPin } from 'react-icons/io5';
import { HiOutlineSparkles } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const ForumPostCard = ({ post, index = 0, onLike, user }) => {
  const [liking, setLiking] = useState(false);

  const categoryColors = {
    Announcement: 'from-amber-500 to-orange-500',
    Article: 'from-blue-500 to-indigo-500',
    Notice: 'from-red-500 to-pink-500',
    Discussion: 'from-forest to-sage',
    Event: 'from-purple-500 to-violet-500',
    General: 'from-sage to-mint',
  };

  const categoryBadgeColors = {
    Announcement: 'bg-amber-50 text-amber-700 border-amber-200',
    Article: 'bg-blue-50 text-blue-700 border-blue-200',
    Notice: 'bg-red-50 text-red-700 border-red-200',
    Discussion: 'bg-mint/30 text-forest border-mint',
    Event: 'bg-purple-50 text-purple-700 border-purple-200',
    General: 'bg-sage/20 text-forest border-sage/30',
  };

  const isLiked = post?.likes?.some(l => (l._id || l) === user?._id);

  const handleLike = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking like
    if (liking) return;
    
    setLiking(true);
    try {
      await onLike(post._id);
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setLiking(false);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault(); // Prevent navigation
    const url = `${window.location.origin}/forum/${post._id}`;
    try {
      await navigator.share({
        title: post.title,
        url: url
      });
    } catch {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <article
      className="glass rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-forest/10 
                 transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header - Author Info */}
      <div className="flex items-center justify-between p-4">
        <Link to={`/forum/${post._id}`} className="flex items-center gap-3 flex-1 min-w-0">
          {post.author?.profileImage?.url ? (
            <img 
              src={post.author.profileImage.url} 
              alt={post.author.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-mint/30 flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mint to-sage 
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
              <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
              {post.isPinned && (
                <span className="flex items-center gap-1 text-amber-600">
                  <IoPin className="w-3 h-3" />
                  Pinned
                </span>
              )}
            </div>
          </div>
        </Link>

        <button 
          onClick={(e) => e.preventDefault()}
          className="p-2 rounded-xl hover:bg-mint/20 transition-colors"
        >
          <FiMoreVertical className="w-5 h-5 text-rose-beige" />
        </button>
      </div>

      {/* Post Image */}
      {post.image?.url && (
        <Link to={`/forum/${post._id}`}>
          <div className="relative w-full aspect-square bg-cream-dark">
            <img 
              src={post.image.url} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between p-4">
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
                w-6 h-6 transition-all cursor-pointer
                ${isLiked 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-rose-beige group-hover:text-red-500'
                }
                ${liking ? 'animate-bounce-soft' : ''}
              `}
            />
            <span className="text-sm font-medium text-forest-dark">
              {post.likes?.length || 0}
            </span>
          </button>
          
          <Link 
            to={`/forum/${post._id}`} 
            className="group flex items-center gap-2 transition-all duration-300 hover:scale-110 cursor-pointer"
          >
            <FiMessageCircle className="w-6 h-6 text-rose-beige group-hover:text-forest transition-colors" />
            <span className="text-sm font-medium text-forest-dark">
              {post.comments?.length || 0}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <FiEye className="w-6 h-6 text-rose-beige" />
            <span className="text-sm font-medium text-forest-dark">
              {post.views || 0}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleShare}
            className="transition-all duration-300 hover:scale-110"
          >
            <FiShare2 className="w-6 h-6 text-rose-beige hover:text-forest transition-colors cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-4">
        {/* Category Badge */}
        <div className="mb-3">
          <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border
            ${categoryBadgeColors[post.category] || categoryBadgeColors.General}
          `}>
            {post.category}
          </span>
        </div>

        {/* Title & Content */}
        <Link to={`/forum/${post._id}`}>
          <h3 className="font-bold text-forest-dark mb-2 hover:text-forest transition-colors">
            {post.title}
          </h3>
          
          <p className="text-rose-beige text-sm leading-relaxed line-clamp-3">
            {post.content.substring(0, 200)}
            {post.content.length > 200 && (
              <span className="text-forest font-medium hover:underline ml-1">
                ...more
              </span>
            )}
          </p>
        </Link>
      </div>
    </article>
  );
};

export default ForumPostCard;