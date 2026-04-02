import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FiHeart, FiMessageCircle, FiEye, FiArrowRight } from 'react-icons/fi';
import { IoPin } from 'react-icons/io5';
import { HiOutlineSparkles } from 'react-icons/hi2';

const ForumPostCard = ({ post, index = 0 }) => {
  const categoryColors = {
    Announcement: 'from-amber-500 to-orange-500',
    Article: 'from-blue-500 to-indigo-500',
    Notice: 'from-red-500 to-pink-500',
    Discussion: 'from-forest to-sage',
    Event: 'from-purple-500 to-violet-500',
    General: 'from-sage to-mint',
  };

  const categoryBgColors = {
    Announcement: 'bg-amber-50 text-amber-700 border-amber-200',
    Article: 'bg-blue-50 text-blue-700 border-blue-200',
    Notice: 'bg-red-50 text-red-700 border-red-200',
    Discussion: 'bg-mint/30 text-forest border-mint',
    Event: 'bg-purple-50 text-purple-700 border-purple-200',
    General: 'bg-sage/20 text-forest border-sage/30',
  };

  return (
    <div
      className="group animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link 
        to={`/forum/${post._id}`}
        className="block glass rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-forest/10 
                   transition-all duration-500 card-hover"
      >
        {/* Pinned Badge */}
        {post.isPinned && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 
                         rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white 
                         text-xs font-semibold shadow-lg animate-pulse-soft">
            <IoPin className="w-3.5 h-3.5" />
            <span>Pinned</span>
          </div>
        )}

        {/* Image */}
        {post.image?.url && (
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <img 
              src={post.image.url} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Category on image */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <span className={`
                px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm
                bg-gradient-to-r ${categoryColors[post.category] || categoryColors.General}
              `}>
                {post.category}
              </span>
              {post.isAdminPost && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 
                               backdrop-blur-sm text-white text-xs font-medium">
                  <HiOutlineSparkles className="w-3 h-3" />
                  Admin
                </span>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-5 sm:p-6">
          {/* Category badges (if no image) */}
          {!post.image?.url && (
            <div className="flex items-center gap-2 mb-3">
              <span className={`
                px-3 py-1 rounded-full text-xs font-semibold border
                ${categoryBgColors[post.category] || categoryBgColors.General}
              `}>
                {post.category}
              </span>
              {post.isAdminPost && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full 
                               bg-forest/10 text-forest text-xs font-medium">
                  <HiOutlineSparkles className="w-3 h-3" />
                  Admin
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-forest-dark mb-2 
                        group-hover:text-forest transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-rose-beige text-sm leading-relaxed line-clamp-2 mb-4">
            {post.content.substring(0, 150)}...
          </p>

          {/* Author & Date */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-rose-beige/20">
            <div className="flex items-center gap-3">
              {post.author?.profileImage?.url ? (
                <img 
                  src={post.author.profileImage.url} 
                  alt={post.author.name}
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-mint/30"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-mint to-sage 
                              flex items-center justify-center text-white font-bold text-sm">
                  {post.author?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-forest-dark block">
                  {post.author?.name}
                </span>
                <span className="text-xs text-rose-beige">
                  {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* Stats & CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-sm text-rose-beige group-hover:text-forest transition-colors">
                <FiHeart className="w-4 h-4" />
                <span>{post.likes?.length || 0}</span>
              </span>
              <span className="flex items-center gap-1.5 text-sm text-rose-beige group-hover:text-forest transition-colors">
                <FiMessageCircle className="w-4 h-4" />
                <span>{post.comments?.length || 0}</span>
              </span>
              <span className="flex items-center gap-1.5 text-sm text-rose-beige group-hover:text-forest transition-colors">
                <FiEye className="w-4 h-4" />
                <span>{post.views}</span>
              </span>
            </div>
            
            <span className="flex items-center gap-1 text-sm font-medium text-forest opacity-0 
                           group-hover:opacity-100 transition-all duration-300 translate-x-2 
                           group-hover:translate-x-0">
              Read more
              <FiArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ForumPostCard;