import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { addCommentAPI, deleteCommentAPI } from '../../api/axios.js';
import { format } from 'date-fns';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CommentSection = ({ postId, comments, onUpdate }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
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
    try {
      await deleteCommentAPI(postId, commentId);
      onUpdate(comments.filter(c => c._id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div>
      <h4>Comments ({comments.length})</h4>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit" disabled={loading || !content.trim()}>
            <FiSend />
          </button>
        </div>
      </form>

      <div>
        {comments.map((comment) => (
          <div key={comment._id}>
            <div>
              <div>
                <span>{comment.user?.name || 'User'}</span>
                <span>{format(new Date(comment.createdAt), 'MMM dd, HH:mm')}</span>
              </div>
              {(comment.user?._id === user._id || comment.user === user._id) && (
                <button onClick={() => handleDelete(comment._id)}>
                  <FiTrash2 />
                </button>
              )}
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;