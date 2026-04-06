import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createForumPostAPI } from '../../api/axios.js';
import ImageUpload from '../../components/common/ImageUpload.jsx';
import AIAssistant from '../../components/ai/AIAssistant.jsx';
import toast from 'react-hot-toast';
import { 
  FiSave, FiArrowLeft, FiEdit3, FiTag, FiFileText, FiImage,
  FiAlertCircle, FiCheckCircle, FiZap, FiInfo, FiEye
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
  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    { 
      value: 'General', 
      label: 'General', 
      icon: '💬', 
      description: 'General discussions',
      color: 'from-[var(--color-forest)] to-[var(--color-sage)]',
      bgColor: 'bg-[var(--color-mint-light)]'
    },
    { 
      value: 'Announcement', 
      label: 'Announcement', 
      icon: '📢', 
      description: 'Important announcements',
      color: 'from-amber-500 to-amber-400',
      bgColor: 'bg-amber-50'
    },
    { 
      value: 'Article', 
      label: 'Article', 
      icon: '📝', 
      description: 'In-depth articles',
      color: 'from-blue-500 to-blue-400',
      bgColor: 'bg-blue-50'
    },
    { 
      value: 'Notice', 
      label: 'Notice', 
      icon: '📌', 
      description: 'Important notices',
      color: 'from-red-500 to-red-400',
      bgColor: 'bg-red-50'
    },
    { 
      value: 'Discussion', 
      label: 'Discussion', 
      icon: '💭', 
      description: 'Open discussions',
      color: 'from-purple-500 to-purple-400',
      bgColor: 'bg-purple-50'
    },
    { 
      value: 'Event', 
      label: 'Event', 
      icon: '🎉', 
      description: 'Campus events',
      color: 'from-pink-500 to-pink-400',
      bgColor: 'bg-pink-50'
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAIInsert = (content) => {
    setFormData(prev => ({ ...prev, content }));
    setShowAI(false);
    toast.success('✨ AI content inserted successfully!');
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
        toast.success('🎉 ' + data.message);
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
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed

  const selectedCategory = categories.find(c => c.value === formData.category);

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)]">

      {/* ═══════════════════════════════════════════════════════
          HERO HEADER
          ═══════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-[var(--color-forest-dark)] mb-8 py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-mint)] rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-sage)] rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link 
            to="/forum"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white 
                     transition-colors mb-6 group cursor-pointer animate-slide-right"
          >
            <FiArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Forum</span>
          </Link>

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm
                          flex items-center justify-center border-2 border-white/20 shadow-2xl">
              <FiEdit3 size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 leading-tight">
                Create Forum Post
              </h1>
              <p className="text-[var(--color-mint-light)] text-base">
                Share your knowledge and ideas with the campus community
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" 
               className="w-full h-auto">
            <path d="M0 48L60 42C120 36 240 24 360 20C480 16 600 20 720 28C840 36 960 48 1080 50C1200 52 1320 44 1380 40L1440 36V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V48Z" 
                  fill="var(--color-cream-light)"/>
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 -mt-12 relative z-20">

        {/* ═══════════════════════════════════════════════════════
            AI ASSISTANT
            ═══════════════════════════════════════════════════════ */}
        <div className="mb-8 animate-slide-up">
          <button
            type="button"
            onClick={() => setShowAI(!showAI)}
            className={`
              w-full flex items-center justify-between p-5 rounded-2xl
              transition-all duration-300 cursor-pointer
              ${showAI 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-2xl' 
                : 'bg-white border-2 border-[var(--color-rose-beige)]/30 text-gray-700 hover:border-purple-300 hover:shadow-lg'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                ${showAI ? 'bg-white/20' : 'bg-gradient-to-br from-purple-500 to-blue-500'}
              `}>
                <HiOutlineSparkles size={24} className={showAI ? 'text-white animate-pulse-soft' : 'text-white'} />
              </div>
              <div className="text-left">
                <p className="font-bold text-base">AI Writing Assistant</p>
                <p className={`text-sm ${showAI ? 'text-white/80' : 'text-gray-500'}`}>
                  Generate engaging content with AI
                </p>
              </div>
            </div>
            <FiZap size={20} className={showAI ? 'animate-pulse-soft' : ''} />
          </button>
          
          {showAI && (
            <div className="mt-4 animate-slide-down">
              <AIAssistant onInsert={handleAIInsert} mode="forum" />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ═══════════════════════════════════════════════════════
              CATEGORY SELECTION
              ═══════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 
                        border-[var(--color-rose-beige)]/30 animate-slide-up"
               style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-mint-light)] 
                            flex items-center justify-center text-[var(--color-forest)]">
                <FiTag size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Select Category</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`
                    group relative overflow-hidden p-5 rounded-2xl
                    border-3 cursor-pointer transition-all duration-300
                    hover:scale-105 hover:shadow-xl
                    ${formData.category === cat.value
                      ? `${cat.bgColor} border-[var(--color-forest)] shadow-lg scale-105`
                      : 'bg-white border-[var(--color-rose-beige)]/40 hover:border-[var(--color-mint)]'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-3 relative z-10">
                    <span className="text-4xl">{cat.icon}</span>
                    <div className="text-center">
                      <span className={`
                        font-bold text-sm block mb-1
                        ${formData.category === cat.value ? 'text-gray-900' : 'text-gray-700'}
                      `}>
                        {cat.label}
                      </span>
                      <span className="text-xs text-gray-500">{cat.description}</span>
                    </div>
                  </div>
                  
                  {formData.category === cat.value && (
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full 
                                  bg-[var(--color-forest)] flex items-center justify-center
                                  text-white shadow-lg animate-scale-in">
                      <FiCheckCircle size={16} />
                    </div>
                  )}

                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 
                                bg-gradient-to-br from-black to-transparent 
                                transition-opacity duration-300" />
                </button>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              TITLE INPUT
              ═══════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 
                        border-[var(--color-rose-beige)]/30 animate-slide-up"
               style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-mint-light)] 
                            flex items-center justify-center text-[var(--color-forest)]">
                <FiFileText size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Post Title</h2>
            </div>
            
            <input
              type="text"
              name="title"
              placeholder="Enter a compelling title that grabs attention..."
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={150}
              className="
                w-full px-5 py-4 rounded-xl text-base
                bg-[var(--color-cream)] border-2 border-[var(--color-rose-beige)]/50
                text-gray-800 placeholder:text-gray-400 font-medium
                focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]
                focus:border-[var(--color-sage)] transition-all duration-200
              "
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-400">
                {formData.title.length} / 150 characters
              </p>
              {formData.title.length >= 20 && formData.title.length <= 100 && (
                <span className="text-xs text-emerald-600 flex items-center gap-1">
                  <FiCheckCircle size={12} />
                  Good title length
                </span>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              CONTENT EDITOR
              ═══════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 
                        border-[var(--color-rose-beige)]/30 animate-slide-up"
               style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-mint-light)] 
                              flex items-center justify-center text-[var(--color-forest)]">
                  <FiEdit3 size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Post Content</h2>
              </div>
              
              {/* Writing Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
                              bg-[var(--color-mint-light)]/50 text-[var(--color-forest)]">
                  <FiFileText size={14} />
                  <span className="font-medium">{wordCount} words</span>
                </div>
                {readingTime > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
                                bg-blue-50 text-blue-700">
                    <FiEye size={14} />
                    <span className="font-medium">{readingTime} min read</span>
                  </div>
                )}
              </div>
            </div>
            
            <textarea
              name="content"
              placeholder="Write your post content here...&#10;&#10;Share your thoughts, ideas, or announcements with the campus community. Be clear, concise, and engaging!"
              value={formData.content}
              onChange={handleChange}
              required
              rows={14}
              className="
                w-full px-5 py-4 rounded-xl text-base
                bg-[var(--color-cream)] border-2 border-[var(--color-rose-beige)]/50
                text-gray-800 placeholder:text-gray-400 leading-relaxed
                focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]
                focus:border-[var(--color-sage)] transition-all duration-200
                resize-none
              "
            />
            
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-400">
                {charCount} characters • {wordCount} words
              </p>
              {wordCount >= 50 && (
                <span className="text-xs text-emerald-600 flex items-center gap-1">
                  <FiCheckCircle size={12} />
                  Good content length
                </span>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              IMAGE UPLOAD
              ═══════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 
                        border-[var(--color-rose-beige)]/30 animate-slide-up"
               style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-mint-light)] 
                            flex items-center justify-center text-[var(--color-forest)]">
                <FiImage size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Cover Image</h2>
                <p className="text-sm text-gray-500">Optional - Add a visual to your post</p>
              </div>
            </div>
            
            <ImageUpload onImageSelect={setImage} />

            {/* Image Tips */}
            <div className="mt-4 p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
              <div className="flex gap-3">
                <FiInfo size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-semibold mb-1">Image Tips</p>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li>Use high-quality images (1200x630px recommended)</li>
                    <li>Keep file size under 2MB for faster loading</li>
                    <li>Ensure image is relevant to your content</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              APPROVAL NOTICE
              ═══════════════════════════════════════════════════════ */}
          <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 
                        animate-slide-up" style={{ animationDelay: '500ms' }}>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center 
                            justify-center text-amber-600 flex-shrink-0">
                <FiAlertCircle size={24} />
              </div>
              <div>
                <p className="text-base font-bold text-amber-900 mb-1">
                  Approval Required
                </p>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Student posts require admin approval before publishing. Your post will be 
                  reviewed within <strong>24 hours</strong>. You'll receive a notification 
                  once it's approved or if any changes are needed.
                </p>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              PREVIEW SECTION (Optional)
              ═══════════════════════════════════════════════════════ */}
          {formData.title && formData.content && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 
                          border-[var(--color-rose-beige)]/30 animate-slide-up"
                 style={{ animationDelay: '550ms' }}>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="w-full flex items-center justify-between mb-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-mint-light)] 
                                flex items-center justify-center text-[var(--color-forest)]">
                    <FiEye size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Preview Your Post</h2>
                </div>
                <span className="text-sm text-gray-500">
                  {showPreview ? 'Hide' : 'Show'}
                </span>
              </button>

              {showPreview && (
                <div className="pt-4 border-t-2 border-[var(--color-cream-dark)] animate-slide-down">
                  <div className="p-5 rounded-2xl bg-[var(--color-cream)]/50">
                    {/* Category Badge */}
                    <span className={`
                      inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-4
                      text-sm font-bold border-2 ${selectedCategory.bgColor}
                    `}>
                      <span className="text-base">{selectedCategory.icon}</span>
                      {selectedCategory.label}
                    </span>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {formData.title}
                    </h3>

                    {/* Content Preview */}
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {formData.content.substring(0, 300)}
                      {formData.content.length > 300 && '...'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
              SUBMIT BUTTONS
              ═══════════════════════════════════════════════════════ */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-up"
               style={{ animationDelay: '600ms' }}>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
              className={`
                flex-1 flex items-center justify-center gap-3 
                px-8 py-5 rounded-2xl font-bold text-lg
                transition-all duration-300 shadow-2xl
                ${loading || !formData.title.trim() || !formData.content.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[var(--color-forest)] text-white hover:bg-[var(--color-forest-dark)] hover:scale-105 cursor-pointer shadow-[var(--color-forest)]/40'
                }
              `}
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <FiSave size={24} />
                  <span>Publish Post</span>
                </>
              )}
            </button>
            
            <Link
              to="/forum"
              className="flex items-center justify-center gap-2 px-8 py-5 rounded-2xl
                       font-bold text-lg bg-[var(--color-cream)] text-gray-700
                       border-2 border-[var(--color-rose-beige)]
                       hover:bg-[var(--color-rose-beige)]/30 cursor-pointer
                       transition-all duration-300"
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