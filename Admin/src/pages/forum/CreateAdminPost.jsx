// CreateAdminPost.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminCreateForumPostAPI, generateContentAPI } from '../../api/axios.js';
import toast from 'react-hot-toast';
import { FiSave, FiZap, FiArrowLeft, FiTrello, FiFileText, FiAlertCircle } from 'react-icons/fi';

const CreateAdminPost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', content: '', category: 'Announcement' });
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const categories = [
    { value: 'Announcement', label: 'Announcement', icon: '📢', color: 'bg-blue-100 text-blue-700' },
    { value: 'Notice', label: 'Notice', icon: '📋', color: 'bg-amber-100 text-amber-700' },
    { value: 'Article', label: 'Article', icon: '📰', color: 'bg-purple-100 text-purple-700' },
    { value: 'Event', label: 'Event', icon: '🎉', color: 'bg-green-100 text-green-700' },
    { value: 'General', label: 'General', icon: '💬', color: 'bg-gray-100 text-gray-700' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAIGenerate = async (type) => {
    if (!aiPrompt.trim()) {
      toast.error('Enter a topic for AI generation');
      return;
    }
    setAiLoading(true);
    try {
      const { data } = await generateContentAPI({ prompt: aiPrompt, type });
      if (data.success) {
        if (type === 'title') {
          const firstTitle = data.generatedContent.split('\n').find(l => l.trim());
          if (firstTitle) {
            setFormData(prev => ({ ...prev, title: firstTitle.replace(/^\d+\.\s*/, '').trim() }));
          }
        } else {
          setFormData(prev => ({ ...prev, content: data.generatedContent }));
        }
        toast.success('AI content generated!');
      }
    } catch (error) {
      toast.error('AI generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }
    setLoading(true);
    try {
      const { data } = await adminCreateForumPostAPI(formData);
      if (data.success) {
        toast.success('Admin post published!');
        navigate('/forum/posts');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const getCharCount = () => {
    return {
      title: formData.title.length,
      content: formData.content.length
    };
  };

  const charCount = getCharCount();

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link to="/forum/posts" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 transition cursor-pointer">
            <FiArrowLeft className="w-4 h-4" />
            Back to Forum Posts
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-900">Create Admin Post</h1>
          <p className="text-green-600 mt-1">Admin posts are published immediately without approval</p>
        </div>

        {/* AI Assistant Section */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-purple-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-100 rounded-xl">
              <FiZap className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-purple-900">AI Content Assistant</h2>
            <span className="px-2 py-0.5 bg-purple-200 text-purple-700 text-xs rounded-full">Powered by AI</span>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-700 mb-2">What topic would you like to write about?</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., Exam preparation tips, Campus event announcement..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="flex-1 px-4 py-2 bg-white border border-purple-200 rounded-xl text-purple-700 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleAIGenerate('title')}
              disabled={aiLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 transition disabled:opacity-50 cursor-pointer text-sm"
            >
              <FiTrello className="w-4 h-4" />
              Generate Title
            </button>
            <button
              onClick={() => handleAIGenerate('caption')}
              disabled={aiLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 transition disabled:opacity-50 cursor-pointer text-sm"
            >
              <FiFileText className="w-4 h-4" />
              Generate Caption
            </button>
            <button
              onClick={() => handleAIGenerate('article')}
              disabled={aiLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition disabled:opacity-50 cursor-pointer text-sm"
            >
              <FiZap className="w-4 h-4" />
              Generate Full Article
            </button>
          </div>
          
          {aiLoading && (
            <div className="mt-4 flex items-center gap-2 text-purple-600">
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">AI is generating content...</span>
            </div>
          )}
        </div>

        {/* Post Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">Category</label>
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <label
                  key={cat.value}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition ${
                    formData.category === cat.value
                      ? `${cat.color} border-current`
                      : 'bg-white border-green-200 text-green-600 hover:border-green-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={formData.category === cat.value}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span>{cat.icon}</span>
                  <span className="text-sm font-medium">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter post title..."
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={200}
              className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-900 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition"
            />
            <div className="mt-1 text-right text-xs text-green-400">
              {charCount.title}/200
            </div>
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              placeholder="Write your post content here... You can use markdown for formatting."
              value={formData.content}
              onChange={handleChange}
              required
              rows={12}
              className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-900 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition resize-y"
            />
            <div className="mt-1 text-right text-xs text-green-400">
              {charCount.content} characters
            </div>
          </div>

          {/* Preview Section */}
          {formData.title && formData.content && (
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <h3 className="text-sm font-medium text-green-700 mb-3 flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4" />
                Preview
              </h3>
              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{categories.find(c => c.value === formData.category)?.icon}</span>
                  <h4 className="font-semibold text-green-900">{formData.title}</h4>
                </div>
                <div className="prose prose-sm max-w-none text-green-700 whitespace-pre-wrap">
                  {formData.content.substring(0, 300)}
                  {formData.content.length > 300 && '...'}
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.content}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Publish Post
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/forum/posts')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition cursor-pointer font-medium"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-8 p-4 bg-green-50 rounded-xl">
          <p className="text-sm text-green-600">
            💡 <span className="font-medium">Tip:</span> Admin posts are instantly visible to all users. Use this for announcements, important notices, or engaging articles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAdminPost;