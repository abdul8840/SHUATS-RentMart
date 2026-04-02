import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { addCommentAPI, deleteCommentAPI } from '../../api/axios.js';
import { format } from 'date-fns';
import { FiSend, FiTrash2, FiMessageCircle } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const CommentSection = ({ postId, comments, onUpdate }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const { data } = await addCommentAPI(postId, { content: content.trim() });
      if (data.success) {
        setContent('');
        onUpdate(data.comments);
        toast.success('Comment added');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    setDeletingId(commentId);
    try {
      await deleteCommentAPI(postId, commentId);
      onUpdate(comments.filter(c => c._id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-8 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest to-sage flex items-center justify-center shadow-md shadow-forest/20">
          <FiMessageCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-forest-dark">
            Comments
          </h4>
          <p className="text-sm text-rose-beige">
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </p>
        </div>
      </div>

      {/* Comment Input Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          {/* User Avatar */}
          <div className="flex-shrink-0 hidden sm:block">
            {user?.profileImage?.url ? (
              <img 
                src={user.profileImage.url} 
                alt={user.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-mint/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mint to-sage flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Input Container */}
          <div className="flex-1 relative">
            <div className="glass rounded-2xl p-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-sage/30">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="flex-1 px-4 py-3 bg-transparent outline-none placeholder:text-rose-beige/60 text-forest-dark"
                />
                <button
                  type="submit"
                  disabled={loading || !content.trim()}
                  className={`
                    p-3 rounded-xl transition-all duration-300 flex items-center justify-center mr-1
                    ${content.trim() && !loading
                      ? 'bg-gradient-to-r from-forest to-sage text-white shadow-lg shadow-forest/30 hover:shadow-xl hover:scale-105 active:scale-95'
                      : 'bg-rose-beige/20 text-rose-beige cursor-not-allowed'
                    }
                  `}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FiSend className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-mint/20 flex items-center justify-center mb-4">
              <HiOutlineSparkles className="w-8 h-8 text-sage" />
            </div>
            <p className="text-rose-beige font-medium">No comments yet</p>
            <p className="text-sm text-rose-beige/60 mt-1">Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment, index) => {
            const isOwner = comment.user?._id === user._id || comment.user === user._id;
            
            return (
              <div
                key={comment._id}
                className="group glass rounded-2xl p-4 hover:shadow-md transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {comment.user?.profileImage?.url ? (
                      <img 
                        src={comment.user.profileImage.url} 
                        alt={comment.user.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage/50 to-mint/50 flex items-center justify-center text-forest font-bold text-sm">
                        {comment.user?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-forest-dark">
                          {comment.user?.name || 'User'}
                        </span>
                        <span className="text-xs text-rose-beige">
                          {format(new Date(comment.createdAt), 'MMM dd, HH:mm')}
                        </span>
                      </div>
                      
                      {isOwner && (
                        <button
                          onClick={() => handleDelete(comment._id)}
                          disabled={deletingId === comment._id}
                          className="p-2 rounded-lg text-rose-beige hover:text-red-500 hover:bg-red-50 
                                   transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                          {deletingId === comment._id ? (
                            <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                          ) : (
                            <FiTrash2 className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                    
                    <p className="mt-2 text-forest-dark/80 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentSection;