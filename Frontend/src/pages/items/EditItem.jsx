import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemAPI, updateItemAPI, deleteItemAPI } from '../../api/axios.js';
import ImageUpload from '../../components/common/ImageUpload.jsx';
import AIAssistant from '../../components/ai/AIAssistant.jsx';
import Loader from '../../components/common/Loader.jsx';
import toast from 'react-hot-toast';
import {
  FiSave, FiTrash2, FiAlertTriangle, FiFileText, FiTag, FiDollarSign,
  FiZap, FiToggleRight, FiImage, FiCheckCircle, FiXCircle, FiEdit3,
  FiPackage, FiClock, FiTrendingUp, FiInfo, FiUser, FiCalendar,
  FiStar, FiBook, FiLayers
} from 'react-icons/fi';

const categories = [
  'Books', 'Previous Year Papers', 'Calculators', 'Electronic Devices',
  'Lab Equipment', 'Stationery', 'Sports Equipment', 'Musical Instruments',
  'Clothing', 'Furniture', 'Other'
];

const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

const inputCls = `
  w-full px-4 py-3.5 rounded-xl text-sm
  bg-white border-2 border-[var(--color-rose-beige)]/50
  text-gray-700 placeholder:text-gray-400
  focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]
  focus:border-[var(--color-sage)] hover:border-[var(--color-mint)]
  transition-all duration-200
`;

const Section = ({ icon, title, children, delay = 0 }) => (
  <div
    style={{ animationDelay: `${delay}ms` }}
    className="
      animate-slide-up bg-white rounded-3xl p-6 sm:p-8
      border-2 border-[var(--color-rose-beige)]/30 shadow-lg
      hover:shadow-xl hover:border-[var(--color-mint)]/50
      transition-all duration-300
    "
  >
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 rounded-2xl bg-[var(--color-forest)] 
                    flex items-center justify-center text-white shadow-lg">
        {icon}
      </div>
      <h2 className="font-bold text-gray-900 text-xl">{title}</h2>
    </div>
    <div className="space-y-5">
      {children}
    </div>
  </div>
);

const FieldLabel = ({ children, required }) => (
  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
    {children}
    {required && <span className="text-red-500">*</span>}
  </label>
);

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => { fetchItem(); }, [id]);

  const fetchItem = async () => {
    try {
      const { data } = await getItemAPI(id);
      if (data.success) {
        const item = data.item;
        setFormData({
          title: item.title,
          description: item.description,
          listingType: item.listingType,
          category: item.category,
          department: item.department,
          semester: item.semester || '',
          condition: item.condition,
          price: item.price,
          priceType: item.priceType,
          rentalPeriod: item.rentalPeriod || 'per_month',
          tags: item.tags?.join(', ') || '',
          isAvailable: item.isAvailable,
          images: item.images,
        });
      }
    } catch {
      toast.error('Item not found');
      navigate('/my-listings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setHasChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        newImages: newImages.length > 0 ? newImages : undefined,
      };
      const { data } = await updateItemAPI(id, payload);
      if (data.success) {
        toast.success('Item updated successfully! ✅');
        navigate(`/items/${id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteItemAPI(id);
      toast.success('Item deleted successfully');
      navigate('/my-listings');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <Loader />;
  if (!formData) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-500">Item not found</p>
    </div>
  );

  const isRent = formData.listingType === 'rent';

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)]">

      {/* ═══════════════════════════════════════════════════════
          HERO HEADER
          ═══════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-[var(--color-forest-dark)] mb-8 py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-mint)] 
                        rounded-full blur-3xl animate-pulse-soft"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            <div className="flex-1 animate-slide-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-sage)]/20 
                            backdrop-blur-sm rounded-full border border-[var(--color-mint)]/30 mb-4">
                <FiEdit3 size={14} className="text-[var(--color-mint)]" />
                <span className="text-[var(--color-mint-light)] text-sm font-medium">
                  Editing Mode
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight 
                           line-clamp-1">
                {formData.title}
              </h1>

              <p className="text-[var(--color-cream)] text-base leading-relaxed">
                Update your listing details to keep it accurate and attractive
              </p>

              {hasChanges && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 
                              bg-amber-500/20 backdrop-blur-sm rounded-xl 
                              border border-amber-400/30 animate-pulse-soft">
                  <FiAlertTriangle size={14} className="text-amber-300" />
                  <span className="text-amber-200 text-sm font-medium">
                    Unsaved changes
                  </span>
                </div>
              )}
            </div>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="
                group flex items-center gap-3 px-6 py-3.5 rounded-2xl
                bg-white/10 text-white font-bold text-base
                border-2 border-white/20 backdrop-blur-sm
                hover:bg-red-500 hover:border-red-400
                cursor-pointer shadow-xl transition-all duration-300
                flex-shrink-0 hover:scale-105
              "
            >
              <FiTrash2 size={20} className="group-hover:rotate-12 transition-transform" />
              Delete Listing
            </button>
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
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-6 
                        border-2 border-purple-200 shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500
                            flex items-center justify-center text-white shadow-lg flex-shrink-0">
                <FiZap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">AI Writing Assistant</h3>
                <p className="text-sm text-gray-600">
                  Enhance your description with AI-powered suggestions
                </p>
              </div>
            </div>
            <AIAssistant
              onInsert={(content) => {
                setFormData(p => ({ ...p, description: content }));
                setHasChanges(true);
              }}
              mode="item"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ═══════════════════════════════════════════════════════
              AVAILABILITY TOGGLE
              ═══════════════════════════════════════════════════════ */}
          <div className="animate-slide-up">
            <div
              onClick={() => {
                setFormData(p => ({ ...p, isAvailable: !p.isAvailable }));
                setHasChanges(true);
              }}
              className={`
                flex items-center justify-between p-6 rounded-3xl
                border-3 cursor-pointer transition-all duration-300
                hover:scale-[1.02] hover:shadow-2xl
                ${formData.isAvailable
                  ? 'border-emerald-300 bg-emerald-50 shadow-lg shadow-emerald-200'
                  : 'border-red-300 bg-red-50 shadow-lg shadow-red-200'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center
                  shadow-lg transition-all duration-300
                  ${formData.isAvailable 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-red-500 text-white'
                  }
                `}>
                  <FiToggleRight size={28} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">Item Availability</p>
                  <p className="text-sm text-gray-600">
                    {formData.isAvailable 
                      ? '✅ Visible to all buyers on the marketplace' 
                      : '🚫 Hidden from search results'
                    }
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className={`
                relative w-16 h-8 rounded-full transition-all duration-300
                ${formData.isAvailable ? 'bg-emerald-500' : 'bg-red-400'}
              `}>
                <div className={`
                  absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg
                  transition-all duration-300
                  ${formData.isAvailable ? 'left-9' : 'left-1'}
                `} />
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="sr-only"
                />
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              BASIC INFORMATION
              ═══════════════════════════════════════════════════════ */}
          <Section icon={<FiFileText size={20} />} title="Basic Information" delay={100}>
            {/* Title */}
            <div>
              <FieldLabel required>
                <FiEdit3 size={14} />
                Item Title
              </FieldLabel>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={100}
                className={inputCls}
              />
              <p className="text-xs text-gray-400 mt-1.5">
                {formData.title.length} / 100 characters
              </p>
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel required>
                  <FiTag size={14} />
                  Category
                </FieldLabel>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`${inputCls} appearance-none cursor-pointer`}
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel required>
                  <FiStar size={14} />
                  Condition
                </FieldLabel>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className={`${inputCls} appearance-none cursor-pointer`}
                >
                  {conditions.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <FieldLabel required>
                <FiBook size={14} />
                Description
              </FieldLabel>
              <textarea
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className={`${inputCls} resize-none`}
              />
              <p className="text-xs text-gray-400 mt-1.5">
                {formData.description?.length} / 1000 characters
              </p>
            </div>

            {/* Tags */}
            <div>
              <FieldLabel>
                <FiTag size={14} />
                Tags (comma separated)
              </FieldLabel>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., math, engineering, semester-3"
                className={inputCls}
              />
              {formData.tags && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.split(',').map((t, i) => {
                    const trimmed = t.trim();
                    if (!trimmed) return null;
                    return (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold
                                 bg-[var(--color-mint-light)] text-[var(--color-forest)]
                                 border-2 border-[var(--color-mint)]/40 animate-scale-in"
                      >
                        #{trimmed}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </Section>

          {/* ═══════════════════════════════════════════════════════
              PRICING
              ═══════════════════════════════════════════════════════ */}
          <Section icon={<FiDollarSign size={20} />} title="Pricing" delay={200}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel required>
                  <FiDollarSign size={14} />
                  Price (₹)
                </FieldLabel>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 
                                 font-bold text-[var(--color-forest)] text-lg">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className={`${inputCls} pl-10 text-lg font-bold`}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>
                  <FiTrendingUp size={14} />
                  Price Type
                </FieldLabel>
                <select
                  name="priceType"
                  value={formData.priceType}
                  onChange={handleChange}
                  className={`${inputCls} appearance-none cursor-pointer`}
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="negotiable">Negotiable</option>
                </select>
              </div>
            </div>

            {/* Price Preview */}
            <div className="p-5 rounded-2xl bg-[var(--color-mint-light)]/30 
                          border-2 border-[var(--color-mint)]/30">
              <p className="text-sm text-gray-600 mb-2">Current asking price</p>
              <p className="text-3xl font-extrabold text-[var(--color-forest)]">
                ₹{formData.price}
                {isRent && (
                  <span className="text-base font-normal text-gray-500 ml-2">
                    / {formData.rentalPeriod?.replace('per_', '')}
                  </span>
                )}
              </p>
            </div>
          </Section>

          {/* ═══════════════════════════════════════════════════════
              IMAGES
              ═══════════════════════════════════════════════════════ */}
          <Section icon={<FiImage size={20} />} title="Images" delay={300}>
            {/* Existing Images */}
            {formData.images?.length > 0 && (
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">
                  Current Images ({formData.images.length})
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {formData.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative group aspect-square rounded-2xl overflow-hidden
                               border-2 border-[var(--color-rose-beige)]/30
                               hover:border-[var(--color-mint)] transition-all"
                    >
                      <img
                        src={img.url}
                        alt={`img-${i}`}
                        className="w-full h-full object-cover"
                      />
                      {i === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-1 rounded-lg
                                      bg-[var(--color-forest)] text-white text-xs font-bold">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Images */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">Add More Images</p>
              <ImageUpload
                label=""
                onImageSelect={(imgs) => {
                  setNewImages(imgs);
                  setHasChanges(true);
                }}
                multiple={true}
                existingImages={formData.images}
              />
            </div>
          </Section>

          {/* ═══════════════════════════════════════════════════════
              SUBMIT BUTTON
              ═══════════════════════════════════════════════════════ */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" 
               style={{ animationDelay: '400ms' }}>
            <button
              type="submit"
              disabled={saving || !hasChanges}
              className="
                flex-1 flex items-center justify-center gap-3
                px-8 py-5 rounded-2xl font-bold text-lg text-white
                bg-[var(--color-forest)] hover:bg-[var(--color-forest-dark)]
                shadow-2xl shadow-[var(--color-forest)]/40
                hover:shadow-[var(--color-forest)]/60 hover:scale-[1.02]
                active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
                cursor-pointer transition-all duration-300 group
              "
            >
              {saving ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white 
                                rounded-full animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <FiSave size={24} className="group-hover:scale-110 transition-transform" />
                  Save Changes
                </>
              )}
            </button>

            {!hasChanges && (
              <div className="flex items-center justify-center gap-2 px-4 py-3 
                            rounded-2xl bg-[var(--color-mint-light)]/30 
                            border-2 border-[var(--color-mint)]/30">
                <FiCheckCircle size={18} className="text-[var(--color-forest)]" />
                <span className="text-sm font-medium text-[var(--color-forest)]">
                  All changes saved
                </span>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* ═══════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
          ═══════════════════════════════════════════════════════ */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="
            relative w-full max-w-md bg-white
            rounded-3xl p-8 shadow-2xl animate-scale-in
            border-2 border-[var(--color-rose-beige)]/30
          ">
            <div className="flex flex-col items-center text-center gap-6 mb-8">
              <div className="
                w-24 h-24 rounded-3xl bg-red-100 flex items-center justify-center
                text-red-500 animate-bounce-soft shadow-2xl
              ">
                <FiAlertTriangle size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
                  Delete This Listing?
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  You're about to permanently delete{' '}
                  <strong className="text-gray-900">"{formData.title}"</strong>.
                  This action cannot be undone and all data will be lost.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="
                  flex-1 py-4 rounded-2xl text-base font-bold
                  bg-[var(--color-cream)] text-gray-700
                  border-2 border-[var(--color-rose-beige)]
                  hover:bg-[var(--color-rose-beige)]/30 hover:scale-105
                  cursor-pointer transition-all duration-200
                "
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="
                  flex-1 flex items-center justify-center gap-3
                  py-4 rounded-2xl text-base font-bold
                  bg-red-500 text-white hover:bg-red-600
                  shadow-2xl shadow-red-500/40
                  hover:scale-105 disabled:opacity-60 cursor-pointer
                  transition-all duration-200
                "
              >
                {deleting ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white 
                                  rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={20} />
                    Delete Forever
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditItem;