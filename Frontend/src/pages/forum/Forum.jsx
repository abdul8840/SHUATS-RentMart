import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { getForumPostsAPI, requestForumAccessAPI } from '../../api/axios.js';
import ForumPostCard from '../../components/forum/ForumPostCard.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import toast from 'react-hot-toast';
import { FiPlus, FiSend } from 'react-icons/fi';

const Forum = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', search: '', page: 1 });
  const [accessModal, setAccessModal] = useState(false);
  const [accessReason, setAccessReason] = useState('');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [filters]);

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

  const handleRequestAccess = async () => {
    if (!accessReason.trim()) { toast.error('Please provide a reason'); return; }
    setRequesting(true);
    try {
      const { data } = await requestForumAccessAPI({ reason: accessReason });
      if (data.success) {
        toast.success(data.message);
        setAccessModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Request failed');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div>
      <div>
        <h1>Campus Forum</h1>
        {user?.forumAccess ? (
          <Link to="/forum/create"><FiPlus /> New Post</Link>
        ) : !user?.forumAccessRequested ? (
          <button onClick={() => setAccessModal(true)}><FiSend /> Request Forum Access</button>
        ) : (
          <span>Forum access pending...</span>
        )}
      </div>

      <div>
        <SearchBar onSearch={(q) => setFilters({ ...filters, search: q, page: 1 })} placeholder="Search forum..." />
        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}>
          <option value="">All Categories</option>
          <option value="Announcement">Announcements</option>
          <option value="Article">Articles</option>
          <option value="Notice">Notices</option>
          <option value="Discussion">Discussions</option>
          <option value="Event">Events</option>
          <option value="General">General</option>
        </select>
      </div>

      {loading ? <Loader /> : (
        <div>
          {posts.length === 0 ? (
            <p>No forum posts found</p>
          ) : (
            posts.map((post) => <ForumPostCard key={post._id} post={post} />)
          )}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={(page) => setFilters({ ...filters, page })} />

      <Modal isOpen={accessModal} onClose={() => setAccessModal(false)} title="Request Forum Access">
        <div>
          <p>Tell us why you'd like to contribute to the campus forum:</p>
          <textarea placeholder="I'd like to share..." value={accessReason} onChange={(e) => setAccessReason(e.target.value)} rows={4} />
          <button onClick={handleRequestAccess} disabled={requesting}>
            {requesting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Forum;