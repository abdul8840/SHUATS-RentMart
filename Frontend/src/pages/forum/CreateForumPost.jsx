import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createForumPostAPI } from '../../api/axios.js';
import ImageUpload from '../../components/common/ImageUpload.jsx';
import AIAssistant from '../../components/ai/AIAssistant.jsx';
import toast from 'react-hot-toast';
import { 
  FiSave, 
  FiArrowLeft, 
  FiEdit3, 
  FiTag, 
  FiFileText,
  FiImage,
  FiAlertCircle
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';

const CreateForumPost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    category: 'General' 
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const categories = [
    { value: 'General', label: 'General', icon: '💬', description: 'General discussions' },
    { value: 'Announcement', label: 'Announcement', icon: '📢', description: 'Important announcements' },
    { value: 'Article', label: 'Article', icon: '📝', description: 'In-depth articles' },
    { value: 'Notice', label: 'Notice', icon: '📌', description: 'Important notices' },
    { value: 'Discussion', label: 'Discussion', icon: '💭', description: 'Open discussions' },
    { value: 'Event', label: 'Event', icon: '🎉', description: 'Campus events' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAIInsert = (content) => {
    setFormData(prev => ({ ...prev, content }));
    setShowAI(false);
    toast.success('AI content inserted');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

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

  const wordCount = formData.content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = formData.content.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-light via-cream to-cream-dark">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-mint/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sage/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-down">
          <Link 
            to="/forum"
            className="inline-flex items-center gap-2 text-forest hover:text-forest-dark transition-colors mb-4 group"
          >
            <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Forum</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-forest/20">
              <FiEdit3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-forest-dark">Create Forum Post</h1>
              <p className="text-rose-beige">Share your thoughts with the campus community</p>
            </div>
          </div>
        </div>

        {/* AI Assistant Toggle */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <button
            type="button"
            onClick={() => setShowAI(!showAI)}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300
              ${showAI 
                ? 'bg-gradient-to-r from-forest to-sage text-white shadow-lg shadow-forest/30' 
                : 'glass hover:shadow-md'
              }
            `}
          >
            <HiOutlineSparkles className={`w-5 h-5 ${showAI ? 'animate-pulse-soft' : ''}`} />
            <span className="font-medium">AI Writing Assistant</span>
          </button>
          
          {showAI && (
            <div className="mt-4 animate-scale-in">
              <AIAssistant onInsert={handleAIInsert} mode="forum" />
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="glass rounded-3xl p-6 animate-slide-up" style={{ animationDelay: '150ms' }}>
            <label className="flex items-center gap-2 text-lg font-semibold text-forest-dark mb-4">
              <FiTag className="w-5 h-5" />
              Category
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`
                    relative p-4 rounded-2xl border-2 transition-all duration-300 text-left
                    ${formData.category === cat.value
                      ? 'border-forest bg-forest/5 shadow-md'
                      : 'border-rose-beige/30 hover:border-sage hover:bg-white/50'
                    }
                  `}
                >
                  <span className="text-2xl mb-2 block">{cat.icon}</span>
                  <span className={`
                    font-semibold block
                    ${formData.category === cat.value ? 'text-forest' : 'text-forest-dark'}
                  `}>
                    {cat.label}
                  </span>
                  <span className="text-xs text-rose-beige">{cat.description}</span>
                  
                  {formData.category === cat.value && (
                    <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-forest animate-scale-in" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="glass rounded-3xl p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <label className="flex items-center gap-2 text-lg font-semibold text-forest-dark mb-4">
              <FiFileText className="w-5 h-5" />
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter a compelling title for your post..."
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 rounded-2xl bg-white/80 border border-rose-beige/30
                       focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none
                       placeholder:text-rose-beige/60 text-forest-dark text-lg font-medium
                       transition-all duration-300"
            />
          </div>

          {/* Content */}
          <div className="glass rounded-3xl p-6 animate-slide-up" style={{ animationDelay: '250ms' }}>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 text-lg font-semibold text-forest-dark">
                <FiEdit3 className="w-5 h-5" />
                Content
              </label>
              <div className="flex items-center gap-3 text-sm text-rose-beige">
                <span>{wordCount} words</span>
                <span className="w-1 h-1 rounded-full bg-rose-beige" />
                <span>{charCount} characters</span>
              </div>
            </div>
            
            <textarea
              name="content"
              placeholder="Write your post content here... Share your thoughts, ideas, or announcements with the campus community."
              value={formData.content}
              onChange={handleChange}
              required
              rows={12}
              className="w-full px-5 py-4 rounded-2xl bg-white/80 border border-rose-beige/30
                       focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none
                       placeholder:text-rose-beige/60 text-forest-dark leading-relaxed
                       transition-all duration-300 resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="glass rounded-3xl p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <label className="flex items-center gap-2 text-lg font-semibold text-forest-dark mb-4">
              <FiImage className="w-5 h-5" />
              Cover Image
              <span className="text-sm font-normal text-rose-beige">(optional)</span>
            </label>
            <ImageUpload onImageSelect={setImage} />
          </div>

          {/* Notice */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 animate-slide-up"
               style={{ animationDelay: '350ms' }}>
            <FiAlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 font-medium">Approval Required</p>
              <p className="text-xs text-amber-700 mt-1">
                Student posts require admin approval before publishing. Your post will be reviewed within 24 hours.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
              className={`
                flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl
                font-semibold text-lg transition-all duration-300
                ${loading || !formData.title.trim() || !formData.content.trim()
                  ? 'bg-rose-beige/30 text-rose-beige cursor-not-allowed'
                  : 'bg-gradient-to-r from-forest to-sage text-white shadow-lg shadow-forest/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                }
              `}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5" />
                  <span>Submit Post</span>
                </>
              )}
            </button>
            
            <Link
              to="/forum"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl
                       glass font-semibold text-forest hover:bg-white/80 transition-all duration-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateForumPost;