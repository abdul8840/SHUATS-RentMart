import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createForumPostAPI } from '../../api/axios.js';
import ImageUpload from '../../components/common/ImageUpload.jsx';
import AIAssistant from '../../components/ai/AIAssistant.jsx';
import toast from 'react-hot-toast';
import { FiSave } from 'react-icons/fi';

const CreateForumPost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', content: '', category: 'General' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAIInsert = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleAITitleInsert = (content) => {
    const firstLine = content.split('\n').find(l => l.trim());
    if (firstLine) {
      setFormData(prev => ({ ...prev, title: firstLine.replace(/^\d+\.\s*/, '').trim() }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await createForumPostAPI({ ...formData, image });
      if (data.success) {
        toast.success(data.message);
        navigate('/forum');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Forum Post</h1>

      <AIAssistant onInsert={handleAIInsert} mode="forum" />

      <form onSubmit={handleSubmit}>
        <div>
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="General">General</option>
            <option value="Announcement">Announcement</option>
            <option value="Article">Article</option>
            <option value="Notice">Notice</option>
            <option value="Discussion">Discussion</option>
            <option value="Event">Event</option>
          </select>
        </div>

        <div>
          <label>Title</label>
          <input type="text" name="title" placeholder="Post title..." value={formData.title} onChange={handleChange} required />
        </div>

        <div>
          <label>Content</label>
          <textarea name="content" placeholder="Write your post content..." value={formData.content} onChange={handleChange} required rows={10} />
        </div>

        <ImageUpload label="Cover Image (optional)" onImageSelect={setImage} />

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : <><FiSave /> Submit Post</>}
        </button>
        <p>Note: Student posts require admin approval before publishing.</p>
      </form>
    </div>
  );
};

export default CreateForumPost;