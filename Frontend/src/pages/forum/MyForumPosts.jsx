import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyForumPostsAPI, deleteForumPostAPI } from '../../api/axios.js';
import Loader from '../../components/common/Loader.jsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { FiEye, FiTrash2, FiPlus } from 'react-icons/fi';

const MyForumPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await getMyForumPostsAPI();
      if (data.success) setPosts(data.posts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      await deleteForumPostAPI(id);
      toast.success('Post deleted');
      setPosts(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div>
        <h1>My Forum Posts</h1>
        <Link to="/forum/create"><FiPlus /> New Post</Link>
      </div>

      {posts.length === 0 ? (
        <p>You haven't created any posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id}>
            <h3>{post.title}</h3>
            <div>
              <span>{post.category}</span>
              <span>{post.status}</span>
            </div>
            <p>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</p>
            <div>
              <Link to={`/forum/${post._id}`}><FiEye /> View</Link>
              <button onClick={() => handleDelete(post._id)}><FiTrash2 /> Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyForumPosts;