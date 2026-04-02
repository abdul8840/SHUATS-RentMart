import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FiHeart, FiMessageCircle, FiEye } from 'react-icons/fi';
import { IoPin } from "react-icons/io5";

const ForumPostCard = ({ post }) => {
  return (
    <div>
      <Link to={`/forum/${post._id}`}>
        {post.isPinned && <span><IoPin /> Pinned</span>}
        {post.image?.url && (
          <img src={post.image.url} alt={post.title} />
        )}
        <div>
          <span>{post.category}</span>
          {post.isAdminPost && <span>Admin</span>}
        </div>
        <h3>{post.title}</h3>
        <p>{post.content.substring(0, 150)}...</p>
        <div>
          <div>
            {post.author?.profileImage?.url ? (
              <img src={post.author.profileImage.url} alt={post.author.name} />
            ) : (
              <span>{post.author?.name?.charAt(0)}</span>
            )}
            <span>{post.author?.name}</span>
          </div>
          <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
        </div>
        <div>
          <span><FiHeart /> {post.likes?.length || 0}</span>
          <span><FiMessageCircle /> {post.comments?.length || 0}</span>
          <span><FiEye /> {post.views}</span>
        </div>
      </Link>
    </div>
  );
};

export default ForumPostCard;