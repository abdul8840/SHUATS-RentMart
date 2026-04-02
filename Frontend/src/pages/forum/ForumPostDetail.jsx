import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { getForumPostAPI, toggleLikePostAPI, deleteForumPostAPI } from '../../api/axios.js';
import CommentSection from '../../components/forum/CommentSection.jsx';
import Loader from '../../components/common/Loader.jsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { FiHeart, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';

const ForumPostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      await deleteForumPostAPI(id);
      toast.success('Post deleted');
      navigate('/forum');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const isLiked = post?.likes?.some(l => (l._id || l) === user?._id);
  const isAuthor = post?.author?._id === user?._id;

  if (loading) return <Loader />;
  if (!post) return <p>Post not found</p>;

  return (
    <div>
      {post.image?.url && <img src={post.image.url} alt={post.title} />}

      <div>
        <span>{post.category}</span>
        {post.isAdminPost && <span>Admin Post</span>}
        {post.isPinned && <span>📌 Pinned</span>}
      </div>

      <h1>{post.title}</h1>

      <div>
        <Link to={`/user/${post.author?._id}`}>
          {post.author?.profileImage?.url ? (
            <img src={post.author.profileImage.url} alt="" />
          ) : (
            <span>{post.author?.name?.charAt(0)}</span>
          )}
          <span>{post.author?.name}</span>
        </Link>
        <span>{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</span>
        <span><FiEye /> {post.views}</span>
      </div>

      <div>
        <p>{post.content}</p>
      </div>

      <div>
        <button onClick={handleLike}>
          <FiHeart fill={isLiked ? 'red' : 'none'} color={isLiked ? 'red' : 'currentColor'} />
          {post.likes?.length || 0}
        </button>
        {isAuthor && (
          <>
            <Link to={`/forum/${id}/edit`}><FiEdit /> Edit</Link>
            <button onClick={handleDelete}><FiTrash2 /> Delete</button>
          </>
        )}
      </div>

      <CommentSection
        postId={id}
        comments={post.comments || []}
        onUpdate={(comments) => setPost(prev => ({ ...prev, comments }))}
      />
    </div>
  );
};

export default ForumPostDetail;