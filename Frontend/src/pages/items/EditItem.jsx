import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemAPI, updateItemAPI, deleteItemAPI } from '../../api/axios.js';
import ImageUpload from '../../components/common/ImageUpload.jsx';
import AIAssistant from '../../components/ai/AIAssistant.jsx';
import Loader from '../../components/common/Loader.jsx';
import toast from 'react-hot-toast';
import {
  FiSave, FiTrash2, FiAlertTriangle,
  FiFileText, FiTag, FiDollarSign, FiZap, FiToggleRight
} from 'react-icons/fi';

const categories  = ['Books','Previous Year Papers','Calculators','Electronic Devices','Lab Equipment','Stationery','Sports Equipment','Musical Instruments','Clothing','Furniture','Other'];
const conditions  = ['New','Like New','Good','Fair','Poor'];

const inputCls = `
  w-full px-4 py-3 rounded-xl text-sm
  bg-[var(--color-cream)] border border-[var(--color-rose-beige)]/70
  text-gray-700 placeholder:text-gray-400
  focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]
  focus:border-[var(--color-sage)] hover:border-[var(--color-mint)]
  transition-all duration-200
`;

const Section = ({ icon, title, children, delay = 0 }) => (
  <div
    style={{ animationDelay: `${delay}ms` }}
    className="
      animate-slide-up bg-[var(--color-cream-light)]
      border border-[var(--color-rose-beige)]/50
      rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm
      hover:shadow-md hover:border-[var(--color-mint)]/50
      transition-all duration-300
    "
  >
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white flex-shrink-0 shadow-md">
        {icon}
      </div>
      <h2 className="font-bold text-gray-800 text-sm">{title}</h2>
    </div>
    {children}
  </div>
);

const FieldLabel = ({ children }) => (
  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
    {children}
  </label>
);

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData]     = useState(null);
  const [newImages, setNewImages]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => { fetchItem(); }, [id]);

  const fetchItem = async () => {
    try {
      const { data } = await getItemAPI(id);
      if (data.success) {
        const item = data.item;
        setFormData({
          title: item.title, description: item.description,
          listingType: item.listingType, category: item.category,
          department: item.department, semester: item.semester || '',
          condition: item.condition, price: item.price,
          priceType: item.priceType, rentalPeriod: item.rentalPeriod || 'per_month',
          tags: item.tags?.join(', ') || '',
          isAvailable: item.isAvailable, images: item.images,
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
        toast.success('Item updated successfully!');
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

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-10">

      {/* ── PAGE HEADER ── */}
      <div className="
        relative overflow-hidden rounded-2xl mb-6
        bg-gradient-to-br from-[var(--color-forest-dark)] via-[var(--color-forest)] to-[var(--color-sage)]
        p-6 sm:p-8
      ">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
              ✏️ Editing Listing
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 mb-1 leading-tight line-clamp-1">
              {formData.title}
            </h1>
            <p className="text-[var(--color-mint-light)] text-sm">
              Update your listing details below
            </p>
          </div>

          {/* Delete button */}
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="
              flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
              bg-white/10 text-white border border-white/20
              hover:bg-red-500/80 hover:border-red-400
              cursor-pointer transition-all duration-200
              backdrop-blur-sm flex-shrink-0
            "
          >
            <FiTrash2 size={15} />
            Delete Listing
          </button>
        </div>
      </div>

      {/* ── AI ASSISTANT ── */}
      <div className="mb-6 animate-slide-up">
        <div className="flex items-center gap-2 mb-2 px-1">
          <FiZap size={14} className="text-[var(--color-forest)]" />
          <span className="text-xs font-semibold text-[var(--color-forest)] uppercase tracking-wider">
            AI Writing Assistant
          </span>
        </div>
        <AIAssistant
          onInsert={(content) => setFormData(p => ({ ...p, description: content }))}
          mode="item"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ── AVAILABILITY TOGGLE ── */}
        <div className="animate-slide-up">
          <div className={`
            flex items-center justify-between p-4 rounded-2xl border-2
            transition-all duration-300 cursor-pointer
            ${formData.isAvailable
              ? 'border-[var(--color-forest)] bg-[var(--color-mint-light)]'
              : 'border-[var(--color-rose-beige)] bg-[var(--color-cream)]'
            }
          `}
            onClick={() => setFormData(p => ({ ...p, isAvailable: !p.isAvailable }))}
          >
            <div className="flex items-center gap-3">
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center
                transition-all duration-300
                ${formData.isAvailable ? 'gradient-bg text-white' : 'bg-gray-100 text-gray-400'}
              `}>
                <FiToggleRight size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">Availability</p>
                <p className="text-xs text-gray-500">
                  {formData.isAvailable ? 'Item is visible to buyers' : 'Item is hidden from browse'}
                </p>
              </div>
            </div>
            {/* Toggle pill */}
            <div className={`
              relative w-12 h-6 rounded-full transition-all duration-300
              ${formData.isAvailable ? 'gradient-bg' : 'bg-gray-300'}
            `}>
              <div className={`
                absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md
                transition-all duration-300
                ${formData.isAvailable ? 'left-6' : 'left-0.5'}
              `} />
              <input
                type="checkbox" name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="sr-only"
              />
            </div>
          </div>
        </div>

        {/* ── BASIC INFO ── */}
        <Section icon={<FiFileText size={14} />} title="Basic Information" delay={80}>
          <div>
            <FieldLabel>Item Title</FieldLabel>
            <input
              type="text" name="title"
              value={formData.title} onChange={handleChange} required
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Category</FieldLabel>
              <select name="category" value={formData.category} onChange={handleChange} className={`${inputCls} appearance-none cursor-pointer`}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Condition</FieldLabel>
              <select name="condition" value={formData.condition} onChange={handleChange} className={`${inputCls} appearance-none cursor-pointer`}>
                {conditions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <FieldLabel>Description</FieldLabel>
            <textarea
              name="description" rows={5}
              value={formData.description} onChange={handleChange}
              className={`${inputCls} resize-none`}
            />
            <p className="text-xs text-gray-400 mt-1">{formData.description?.length} characters</p>
          </div>

          <div>
            <FieldLabel>Tags (comma separated)</FieldLabel>
            <input
              type="text" name="tags"
              value={formData.tags} onChange={handleChange}
              placeholder="e.g., math, engineering"
              className={inputCls}
            />
            {formData.tags && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {formData.tags.split(',').map((t, i) => t.trim() && (
                  <span key={i} className="px-2 py-0.5 rounded-md text-xs font-medium bg-[var(--color-mint-light)] text-[var(--color-forest)] border border-[var(--color-mint)]/40">
                    #{t.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* ── PRICING ── */}
        <Section icon={<FiDollarSign size={14} />} title="Pricing" delay={160}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Price (₹)</FieldLabel>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[var(--color-forest)]">₹</span>
                <input
                  type="number" name="price" min="0"
                  value={formData.price} onChange={handleChange}
                  className={`${inputCls} pl-8`}
                />
              </div>
            </div>
            <div>
              <FieldLabel>Price Type</FieldLabel>
              <select name="priceType" value={formData.priceType} onChange={handleChange} className={`${inputCls} appearance-none cursor-pointer`}>
                <option value="fixed">Fixed</option>
                <option value="negotiable">Negotiable</option>
              </select>
            </div>
          </div>
        </Section>

        {/* ── IMAGES ── */}
        <Section icon={<FiTag size={14} />} title="Images" delay={240}>
          {/* Existing images */}
          {formData.images?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Current Images
              </p>
              <div className="flex gap-2 flex-wrap">
                {formData.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img.url} alt={`img-${i}`}
                      className="
                        w-20 h-20 object-cover rounded-xl border-2
                        border-[var(--color-rose-beige)]/50
                        group-hover:border-[var(--color-sage)]
                        transition-all duration-200
                      "
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <ImageUpload
            label="Add More Images"
            onImageSelect={setNewImages}
            multiple={true}
            existingImages={formData.images}
          />
        </Section>

        {/* ── SUBMIT ── */}
        <div className="animate-slide-up" style={{ animationDelay: '320ms' }}>
          <button
            type="submit" disabled={saving}
            className="
              w-full flex items-center justify-center gap-2
              px-6 py-4 rounded-2xl font-bold text-white text-sm
              gradient-bg shadow-lg shadow-[var(--color-forest)]/30
              hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
              disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
              cursor-pointer transition-all duration-200 btn-ripple
            "
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving Changes…
              </>
            ) : (
              <>
                <FiSave size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="
            relative w-full max-w-md bg-[var(--color-cream-light)]
            rounded-2xl p-6 shadow-2xl animate-scale-in
            border border-[var(--color-rose-beige)]/50
          ">
            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-red-500 animate-bounce-soft">
                <FiAlertTriangle size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Delete Listing?</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                This will permanently remove <strong>"{formData.title}"</strong> from the platform. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="
                  flex-1 py-3 rounded-xl text-sm font-semibold
                  bg-[var(--color-cream)] text-gray-700
                  border border-[var(--color-rose-beige)]/60
                  hover:bg-[var(--color-rose-beige)]/30
                  cursor-pointer transition-all duration-200
                "
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="
                  flex-1 flex items-center justify-center gap-2
                  py-3 rounded-xl text-sm font-semibold
                  bg-red-500 text-white hover:bg-red-600
                  shadow-lg shadow-red-500/30
                  disabled:opacity-60 cursor-pointer
                  transition-all duration-200
                "
              >
                {deleting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiTrash2 size={15} />
                )}
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditItem;