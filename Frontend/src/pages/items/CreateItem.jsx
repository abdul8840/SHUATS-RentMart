import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItemAPI } from '../../api/axios.js';
import ImageUpload from '../../components/common/ImageUpload.jsx';
import AIAssistant from '../../components/ai/AIAssistant.jsx';
import toast from 'react-hot-toast';
import {
  FiSave, FiTag, FiDollarSign, FiFileText,
  FiLayers, FiCheckCircle, FiAlertCircle, FiZap
} from 'react-icons/fi';

const categories  = ['Books','Previous Year Papers','Calculators','Electronic Devices','Lab Equipment','Stationery','Sports Equipment','Musical Instruments','Clothing','Furniture','Other'];
const conditions  = ['New','Like New','Good','Fair','Poor'];
const departments = ['MCA','BCA','B.Tech CSE','B.Tech ME','B.Tech CE','B.Tech EE','B.Tech ECE','MBA','MSc','BSc','BA','Other'];

/* ── shared input classes ── */
const inputCls = `
  w-full px-4 py-3 rounded-xl text-sm
  bg-[var(--color-cream)] border border-[var(--color-rose-beige)]/70
  text-gray-700 placeholder:text-gray-400
  focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]
  focus:border-[var(--color-sage)] hover:border-[var(--color-mint)]
  transition-all duration-200
`;

const selectCls = `
  ${inputCls} appearance-none cursor-pointer
`;

/* ── section wrapper ── */
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
      <div className="
        w-8 h-8 rounded-lg gradient-bg flex items-center justify-center
        text-white flex-shrink-0 shadow-md
      ">
        {icon}
      </div>
      <h2 className="font-bold text-gray-800 text-sm">{title}</h2>
    </div>
    {children}
  </div>
);

const FieldLabel = ({ children, required }) => (
  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
    {children}{required && <span className="text-red-400 ml-0.5">*</span>}
  </label>
);

const CreateItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', listingType: 'sell', category: '',
    department: '', semester: '', condition: 'Good', price: '',
    priceType: 'fixed', rentalPeriod: 'per_month', tags: '',
  });
  const [images, setImages]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep]       = useState(0); // progress feedback

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price:    parseFloat(formData.price),
        semester: formData.semester ? parseInt(formData.semester) : undefined,
        images,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      };
      const { data } = await createItemAPI(payload);
      if (data.success) {
        toast.success('Item listed successfully! 🎉');
        navigate(`/items/${data.item._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const isRent = formData.listingType === 'rent';

  /* progress bar width */
  const filled = Object.entries(formData)
    .filter(([k, v]) => ['title','description','category','department','condition','price'].includes(k) && v)
    .length;
  const progress = Math.round((filled / 6) * 100);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-10">

      {/* ── PAGE HEADER ── */}
      <div className="
        relative overflow-hidden rounded-2xl mb-6
        gradient-bg p-6 sm:p-8
      ">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnptNiAwaDZ2LTZoLTZ2NnptLTEyIDBoLTZ2Nmg2di02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            Create New Listing
          </h1>
          <p className="text-[var(--color-mint-light)] text-sm">
            List your item for rent or sale to fellow students
          </p>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-white/70">Form completion</span>
              <span className="text-xs font-bold text-white">{progress}%</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── AI ASSISTANT ── */}
      <div className="mb-6 animate-slide-up">
        <div className="
          flex items-center gap-2 mb-2 px-1
        ">
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

        {/* ── LISTING TYPE ── */}
        <Section icon={<FiLayers size={14} />} title="Listing Type" delay={0}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'sell', emoji: '🏷️', label: 'For Sale', desc: 'Sell your item' },
              { value: 'rent', emoji: '🔄', label: 'For Rent', desc: 'Rent it out' },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`
                  relative flex flex-col items-center gap-1.5 p-4 rounded-xl
                  border-2 cursor-pointer transition-all duration-200
                  ${formData.listingType === opt.value
                    ? 'border-[var(--color-forest)] bg-[var(--color-mint-light)] shadow-md'
                    : 'border-[var(--color-rose-beige)]/60 bg-[var(--color-cream)] hover:border-[var(--color-mint)]'
                  }
                `}
              >
                <input
                  type="radio" name="listingType" value={opt.value}
                  checked={formData.listingType === opt.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-2xl">{opt.emoji}</span>
                <span className="font-bold text-sm text-gray-800">{opt.label}</span>
                <span className="text-xs text-gray-500">{opt.desc}</span>
                {formData.listingType === opt.value && (
                  <span className="
                    absolute top-2 right-2 text-[var(--color-forest)]
                    animate-scale-in
                  ">
                    <FiCheckCircle size={14} />
                  </span>
                )}
              </label>
            ))}
          </div>
        </Section>

        {/* ── BASIC INFO ── */}
        <Section icon={<FiFileText size={14} />} title="Basic Information" delay={80}>
          {/* Title */}
          <div>
            <FieldLabel required>Item Title</FieldLabel>
            <input
              type="text" name="title"
              placeholder="e.g., Engineering Mathematics Textbook"
              value={formData.title} onChange={handleChange} required
              className={inputCls}
            />
          </div>

          {/* Category + Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Category</FieldLabel>
              <select name="category" value={formData.category} onChange={handleChange} required className={selectCls}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel required>Department Relevance</FieldLabel>
              <select name="department" value={formData.department} onChange={handleChange} required className={selectCls}>
                <option value="">Select Department</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Semester + Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Semester</FieldLabel>
              <select name="semester" value={formData.semester} onChange={handleChange} className={selectCls}>
                <option value="">Any Semester</option>
                {[1,2,3,4,5,6,7,8,9,10].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel required>Condition</FieldLabel>
              <select name="condition" value={formData.condition} onChange={handleChange} required className={selectCls}>
                {conditions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <FieldLabel required>Description</FieldLabel>
            <textarea
              name="description" rows={5}
              placeholder="Describe your item in detail — edition, year, usage, any damage…"
              value={formData.description} onChange={handleChange} required
              className={`${inputCls} resize-none`}
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.description.length} characters
            </p>
          </div>

          {/* Tags */}
          <div>
            <FieldLabel>Tags</FieldLabel>
            <input
              type="text" name="tags"
              placeholder="e.g., math, engineering, 3rd-year (comma separated)"
              value={formData.tags} onChange={handleChange}
              className={inputCls}
            />
            {/* Tag preview */}
            {formData.tags && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {formData.tags.split(',').map((t, i) => t.trim() && (
                  <span key={i} className="
                    px-2 py-0.5 rounded-md text-xs font-medium
                    bg-[var(--color-mint-light)] text-[var(--color-forest)]
                    border border-[var(--color-mint)]/40 animate-scale-in
                  ">
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
            {/* Price */}
            <div>
              <FieldLabel required>Price (₹)</FieldLabel>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[var(--color-forest)]">₹</span>
                <input
                  type="number" name="price" min="0"
                  placeholder="Enter price"
                  value={formData.price} onChange={handleChange} required
                  className={`${inputCls} pl-8`}
                />
              </div>
            </div>

            {/* Price type */}
            <div>
              <FieldLabel>Price Type</FieldLabel>
              <select name="priceType" value={formData.priceType} onChange={handleChange} className={selectCls}>
                <option value="fixed">Fixed</option>
                <option value="negotiable">Negotiable</option>
              </select>
            </div>
          </div>

          {/* Rental period */}
          {isRent && (
            <div className="animate-slide-down">
              <FieldLabel>Rental Period</FieldLabel>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'per_day', label: 'Per Day' },
                  { value: 'per_week', label: 'Per Week' },
                  { value: 'per_month', label: 'Per Month' },
                  { value: 'per_semester', label: 'Per Semester' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`
                      flex items-center justify-center px-3 py-2.5
                      rounded-xl border-2 cursor-pointer text-xs font-semibold
                      transition-all duration-200
                      ${formData.rentalPeriod === opt.value
                        ? 'border-[var(--color-forest)] bg-[var(--color-mint-light)] text-[var(--color-forest)]'
                        : 'border-[var(--color-rose-beige)]/60 text-gray-600 hover:border-[var(--color-mint)]'
                      }
                    `}
                  >
                    <input
                      type="radio" name="rentalPeriod" value={opt.value}
                      checked={formData.rentalPeriod === opt.value}
                      onChange={handleChange} className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price preview */}
          {formData.price && (
            <div className="
              flex items-center gap-2 px-4 py-3 rounded-xl
              bg-[var(--color-mint-light)] border border-[var(--color-mint)]/40
              animate-scale-in
            ">
              <FiCheckCircle size={16} className="text-[var(--color-forest)]" />
              <span className="text-sm text-gray-700">
                Listed at{' '}
                <strong className="text-[var(--color-forest)]">₹{formData.price}</strong>
                {isRent && ` / ${formData.rentalPeriod?.replace('per_','')}`}
                {formData.priceType === 'negotiable' && ' · Negotiable'}
              </span>
            </div>
          )}
        </Section>

        {/* ── IMAGES ── */}
        <Section icon={<FiTag size={14} />} title="Item Images" delay={240}>
          <ImageUpload
            label="Upload Images (max 5)"
            onImageSelect={setImages}
            multiple={true}
          />
          {images.length === 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
              <FiAlertCircle size={13} className="text-amber-500 flex-shrink-0" />
              <p className="text-xs text-amber-700">At least 1 image is required</p>
            </div>
          )}
        </Section>

        {/* ── SUBMIT ── */}
        <div className="animate-slide-up" style={{ animationDelay: '320ms' }}>
          <button
            type="submit"
            disabled={loading}
            className="
              w-full flex items-center justify-center gap-2
              px-6 py-4 rounded-2xl font-bold text-white text-sm
              gradient-bg shadow-lg shadow-[var(--color-forest)]/30
              hover:shadow-xl hover:shadow-[var(--color-forest)]/40
              hover:scale-[1.02] active:scale-[0.98]
              disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
              cursor-pointer transition-all duration-200 btn-ripple
            "
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Listing…
              </>
            ) : (
              <>
                <FiSave size={16} />
                Create Listing
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateItem;