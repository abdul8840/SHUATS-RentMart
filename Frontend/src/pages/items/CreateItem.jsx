import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItemAPI } from '../../api/axios.js';
import ImageUpload from '../../components/common/ImageUpload.jsx';
import AIAssistant from '../../components/ai/AIAssistant.jsx';
import toast from 'react-hot-toast';
import {
  FiSave, FiTag, FiDollarSign, FiFileText, FiLayers, FiCheckCircle,
  FiAlertCircle, FiZap, FiImage, FiClock, FiTrendingUp, FiPackage,
  FiInfo, FiMapPin, FiCalendar, FiBook, FiUser, FiEdit3, FiStar
} from 'react-icons/fi';

const categories = [
  'Books', 'Previous Year Papers', 'Calculators', 'Electronic Devices',
  'Lab Equipment', 'Stationery', 'Sports Equipment', 'Musical Instruments',
  'Clothing', 'Furniture', 'Other'
];

const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

const departments = [
  'MCA', 'BCA', 'B.Tech CSE', 'B.Tech ME', 'B.Tech CE', 'B.Tech EE',
  'B.Tech ECE', 'MBA', 'MSc', 'BSc', 'BA', 'Other'
];

const inputCls = `
  w-full px-4 py-3.5 rounded-xl text-sm
  bg-white border-2 border-[var(--color-rose-beige)]/50
  text-gray-700 placeholder:text-gray-400
  focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]
  focus:border-[var(--color-sage)] hover:border-[var(--color-mint)]
  transition-all duration-200
`;

const selectCls = `${inputCls} appearance-none cursor-pointer bg-white`;

const Section = ({ icon, title, subtitle, children, step, currentStep }) => {
  const isActive = step === currentStep;
  const isCompleted = step < currentStep;

  return (
    <div
      className={`
        relative bg-white rounded-3xl p-6 sm:p-8
        border-2 transition-all duration-500
        ${isActive
          ? 'border-[var(--color-forest)] shadow-2xl shadow-[var(--color-forest)]/20 scale-[1.02]'
          : isCompleted
            ? 'border-[var(--color-mint)] shadow-lg'
            : 'border-[var(--color-rose-beige)]/30 shadow-md'
        }
        hover:shadow-xl
      `}
    >
      {/* Step Number Badge */}
      <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl
                    bg-[var(--color-forest)] flex items-center justify-center
                    text-white font-bold text-lg shadow-xl border-4 border-white">
        {isCompleted ? <FiCheckCircle size={24} /> : step}
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className={`
          w-14 h-14 rounded-2xl flex items-center justify-center
          flex-shrink-0 shadow-lg transition-all duration-300
          ${isActive
            ? 'bg-[var(--color-forest)] text-white scale-110'
            : isCompleted
              ? 'bg-[var(--color-mint)] text-[var(--color-forest)]'
              : 'bg-[var(--color-mint-light)] text-[var(--color-forest-dark)]'
          }
        `}>
          {icon}
        </div>
        <div className="flex-1">
          <h2 className="font-extrabold text-gray-900 text-xl mb-1">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-500 leading-relaxed">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-5">
        {children}
      </div>
    </div>
  );
};

const FieldLabel = ({ children, required, tooltip }) => (
  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
    {children}
    {required && <span className="text-red-500">*</span>}
    {tooltip && (
      <div className="group relative">
        <FiInfo size={14} className="text-gray-400 cursor-pointer" />
        <div className="absolute left-0 top-6 w-48 p-2 bg-gray-900 text-white text-xs
                      rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible
                      transition-all duration-200 z-10">
          {tooltip}
        </div>
      </div>
    )}
  </label>
);

const CreateItem = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '', description: '', listingType: 'sell', category: '',
    department: '', semester: '', condition: 'Good', price: '',
    priceType: 'fixed', rentalPeriod: 'per_month', tags: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

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
        price: parseFloat(formData.price),
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

  // Progress calculation
  const requiredFields = ['title', 'description', 'category', 'department', 'condition', 'price'];
  const filledFields = requiredFields.filter(field => formData[field]).length;
  const hasImages = images.length > 0;
  const progress = Math.round(((filledFields / requiredFields.length) * 80) + (hasImages ? 20 : 0));

  // Auto-advance steps
  const getActiveStep = () => {
    if (!formData.listingType) return 1;
    if (!formData.title || !formData.category || !formData.department || !formData.condition) return 2;
    if (!formData.description) return 3;
    if (!formData.price) return 4;
    if (images.length === 0) return 5;
    return 6;
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)]">

      {/* ═══════════════════════════════════════════════════════
          HERO HEADER WITH PROGRESS
          ═══════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-[var(--color-forest-dark)] mb-8 py-20">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-mint)] rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-sage)] rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* Left Content */}
            <div className="flex-1 animate-slide-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-sage)]/20 
                            backdrop-blur-sm rounded-full border border-[var(--color-mint)]/30 mb-4">
                <FiZap size={14} className="text-[var(--color-mint)] animate-pulse-soft" />
                <span className="text-[var(--color-mint-light)] text-sm font-medium">
                  Smart Listing Creator
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
                Create New Listing
                <span className="block text-2xl sm:text-3xl text-[var(--color-mint-light)] 
                              font-normal mt-2">
                  Share Your Items with Campus
                </span>
              </h1>

              <p className="text-[var(--color-cream)] text-base leading-relaxed max-w-2xl">
                List your books, electronics, or any campus essentials. Reach thousands of
                students looking for quality items at great prices.
              </p>
            </div>

            {/* Progress Circle */}
            <div className="flex items-center justify-center animate-scale-in">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white">{progress}%</span>
                  <span className="text-xs text-[var(--color-mint-light)]">Complete</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white/80">Form Progress</span>
              <span className="text-sm font-bold text-white">{filledFields} / {requiredFields.length} fields</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-white rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 48L60 42C120 36 240 24 360 20C480 16 600 20 720 28C840 36 960 48 1080 50C1200 52 1320 44 1380 40L1440 36V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V48Z"
              fill="var(--color-cream-light)" />
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
                  Let our AI help you write compelling descriptions that attract more buyers
                </p>
              </div>
            </div>
            <AIAssistant
              onInsert={(content) => setFormData(p => ({ ...p, description: content }))}
              mode="item"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ═══════════════════════════════════════════════════════
              STEP 1: LISTING TYPE
              ═══════════════════════════════════════════════════════ */}
          <Section
            icon={<FiLayers size={24} />}
            title="Choose Listing Type"
            subtitle="Select whether you want to sell or rent out your item"
            step={1}
            currentStep={getActiveStep()}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  value: 'sell',
                  icon: '🏷️',
                  title: 'For Sale',
                  desc: 'Sell your item permanently',
                  color: 'from-blue-500 to-blue-400',
                  bgColor: 'bg-blue-50',
                  borderColor: 'border-blue-300'
                },
                {
                  value: 'rent',
                  icon: '🔄',
                  title: 'For Rent',
                  desc: 'Rent it out for a period',
                  color: 'from-[var(--color-forest)] to-[var(--color-sage)]',
                  bgColor: 'bg-[var(--color-mint-light)]',
                  borderColor: 'border-[var(--color-mint)]'
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`
                    relative flex flex-col p-6 rounded-2xl
                    border-3 cursor-pointer transition-all duration-300
                    hover:scale-105 hover:shadow-xl
                    ${formData.listingType === opt.value
                      ? `${opt.borderColor} ${opt.bgColor} shadow-lg scale-105`
                      : 'border-[var(--color-rose-beige)]/40 bg-white hover:border-[var(--color-mint)]'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="listingType"
                    value={opt.value}
                    checked={formData.listingType === opt.value}
                    onChange={handleChange}
                    className="sr-only"
                  />

                  {/* Icon */}
                  <div className="text-5xl mb-3">{opt.icon}</div>

                  {/* Title */}
                  <h4 className="font-bold text-gray-900 text-lg mb-1">{opt.title}</h4>
                  <p className="text-sm text-gray-500">{opt.desc}</p>

                  {/* Check Badge */}
                  {formData.listingType === opt.value && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full
                                  bg-[var(--color-forest)] flex items-center justify-center
                                  text-white shadow-lg animate-scale-in">
                      <FiCheckCircle size={18} />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </Section>

          {/* ═══════════════════════════════════════════════════════
              STEP 2: BASIC INFORMATION
              ═══════════════════════════════════════════════════════ */}
          <Section
            icon={<FiFileText size={24} />}
            title="Basic Information"
            subtitle="Tell us about your item"
            step={2}
            currentStep={getActiveStep()}
          >
            {/* Title */}
            <div>
              <FieldLabel required tooltip="Be specific and descriptive to attract buyers">
                <FiEdit3 size={14} />
                Item Title
              </FieldLabel>
              <input
                type="text"
                name="title"
                placeholder="e.g., Engineering Mathematics Textbook - 5th Edition"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={100}
                className={inputCls}
              />
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs text-gray-400">
                  {formData.title.length} / 100 characters
                </p>
                {formData.title.length >= 20 && formData.title.length <= 80 && (
                  <span className="text-xs text-emerald-600 flex items-center gap-1">
                    <FiCheckCircle size={12} />
                    Good length
                  </span>
                )}
              </div>
            </div>

            {/* Category & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel required>
                  <FiTag size={14} />
                  Category
                </FieldLabel>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className={selectCls}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <FiTag size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <FieldLabel required>
                  <FiUser size={14} />
                  Department
                </FieldLabel>
                <div className="relative">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className={selectCls}
                  >
                    <option value="">Select Department</option>
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <FiUser size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Semester & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel tooltip="Optional - relevant for books and course materials">
                  <FiCalendar size={14} />
                  Semester (Optional)
                </FieldLabel>
                <div className="relative">
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className={selectCls}
                  >
                    <option value="">Any Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <FiCalendar size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <FieldLabel required>
                  <FiStar size={14} />
                  Condition
                </FieldLabel>
                <div className="relative">
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                    className={selectCls}
                  >
                    {conditions.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <FiStar size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* ═══════════════════════════════════════════════════════
              STEP 3: DESCRIPTION
              ═══════════════════════════════════════════════════════ */}
          <Section
            icon={<FiBook size={24} />}
            title="Detailed Description"
            subtitle="Provide comprehensive details about your item"
            step={3}
            currentStep={getActiveStep()}
          >
            <div>
              <FieldLabel required tooltip="Include edition, condition details, usage, any defects">
                <FiFileText size={14} />
                Description
              </FieldLabel>
              <textarea
                name="description"
                rows={6}
                placeholder="Describe your item in detail... Include:&#10;• Edition or model&#10;• Current condition&#10;• Usage history&#10;• Any defects or issues&#10;• What's included"
                value={formData.description}
                onChange={handleChange}
                required
                maxLength={1000}
                className={`${inputCls} resize-none font-mono text-sm`}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400">
                  {formData.description.length} / 1000 characters
                </p>
                <div className="flex gap-3 text-xs">
                  {formData.description.length >= 100 && (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <FiCheckCircle size={12} />
                      Detailed
                    </span>
                  )}
                  {formData.description.split('\n').length >= 3 && (
                    <span className="text-blue-600 flex items-center gap-1">
                      <FiCheckCircle size={12} />
                      Well formatted
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <FieldLabel tooltip="Comma-separated tags help buyers find your item">
                <FiTag size={14} />
                Tags (Optional)
              </FieldLabel>
              <input
                type="text"
                name="tags"
                placeholder="e.g., mathematics, engineering, 3rd-year, unused"
                value={formData.tags}
                onChange={handleChange}
                className={inputCls}
              />
              {/* Tag Preview */}
              {formData.tags && (
                <div className="flex flex-wrap gap-2 mt-3 p-3 rounded-xl bg-[var(--color-mint-light)]/30
                              border-2 border-[var(--color-mint)]/20">
                  {formData.tags.split(',').map((t, i) => {
                    const trimmed = t.trim();
                    if (!trimmed) return null;
                    return (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold
                                 bg-white text-[var(--color-forest)] 
                                 border-2 border-[var(--color-mint)]/40
                                 shadow-sm animate-scale-in"
                        style={{ animationDelay: `${i * 50}ms` }}
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
              STEP 4: PRICING
              ═══════════════════════════════════════════════════════ */}
          <Section
            icon={<FiDollarSign size={24} />}
            title="Price Your Item"
            subtitle="Set a competitive price for your listing"
            step={4}
            currentStep={getActiveStep()}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Price */}
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
                    step="1"
                    placeholder="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className={`${inputCls} pl-10 text-lg font-bold`}
                  />
                </div>
              </div>

              {/* Price Type */}
              <div>
                <FieldLabel>
                  <FiTrendingUp size={14} />
                  Price Type
                </FieldLabel>
                <select
                  name="priceType"
                  value={formData.priceType}
                  onChange={handleChange}
                  className={selectCls}
                >
                  <option value="fixed">💎 Fixed Price</option>
                  <option value="negotiable">💬 Negotiable</option>
                </select>
              </div>
            </div>

            {/* Rental Period (if rent) */}
            {isRent && (
              <div className="p-5 rounded-2xl bg-[var(--color-mint-light)]/30 
                            border-2 border-[var(--color-mint)]/30 animate-slide-down">
                <FieldLabel>
                  <FiClock size={14} />
                  Rental Period
                </FieldLabel>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  {[
                    { value: 'per_day', label: 'Per Day', icon: '📅' },
                    { value: 'per_week', label: 'Per Week', icon: '📆' },
                    { value: 'per_month', label: 'Per Month', icon: '🗓️' },
                    { value: 'per_semester', label: 'Per Semester', icon: '📚' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`
                        flex flex-col items-center gap-2 p-4 rounded-xl
                        border-2 cursor-pointer transition-all duration-300
                        hover:scale-105 hover:shadow-lg
                        ${formData.rentalPeriod === opt.value
                          ? 'border-[var(--color-forest)] bg-white shadow-lg scale-105'
                          : 'border-[var(--color-mint)]/40 bg-white/50 hover:border-[var(--color-mint)]'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="rentalPeriod"
                        value={opt.value}
                        checked={formData.rentalPeriod === opt.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-2xl">{opt.icon}</span>
                      <span className="text-xs font-bold text-gray-700 text-center">
                        {opt.label}
                      </span>
                      {formData.rentalPeriod === opt.value && (
                        <FiCheckCircle size={14} className="text-[var(--color-forest)]" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Preview */}
            {formData.price && (
              <div className="p-5 rounded-2xl bg-[var(--color-mint-light)]/30 
                            border-2 border-[var(--color-mint)]/30 animate-scale-in">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Your asking price</p>
                    <p className="text-3xl font-extrabold text-[var(--color-forest)]">
                      ₹{formData.price}
                      {isRent && (
                        <span className="text-base font-normal text-gray-500 ml-2">
                          / {formData.rentalPeriod?.replace('per_', '')}
                        </span>
                      )}
                    </p>
                  </div>
                  {formData.priceType === 'negotiable' && (
                    <div className="px-4 py-2 rounded-xl bg-amber-100 border-2 border-amber-200">
                      <p className="text-xs font-bold text-amber-700 flex items-center gap-1">
                        <FiTrendingUp size={14} />
                        Negotiable
                      </p>
                    </div>
                  )}
                </div>

                {/* Price Suggestion */}
                {formData.price && formData.category && (
                  <div className="mt-4 pt-4 border-t-2 border-[var(--color-mint)]/20">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <FiInfo size={12} />
                      Tip: Similar {formData.category.toLowerCase()} items are priced between ₹
                      {Math.round(formData.price * 0.8)} - ₹{Math.round(formData.price * 1.2)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Section>

          {/* ═══════════════════════════════════════════════════════
              STEP 5: IMAGES
              ═══════════════════════════════════════════════════════ */}
          <Section
            icon={<FiImage size={24} />}
            title="Upload Images"
            subtitle="Add clear photos to attract more buyers (max 5 images)"
            step={5}
            currentStep={getActiveStep()}
          >
            <ImageUpload
              label=""
              onImageSelect={setImages}
              multiple={true}
              maxImages={5}
            />

            {/* Image Tips */}
            <div className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-200">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <FiImage size={16} />
                Photo Tips for Best Results
              </h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <FiCheckCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>Use good lighting - natural daylight works best</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>Show item from multiple angles</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>Include any defects or wear clearly</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>Keep background clean and uncluttered</span>
                </li>
              </ul>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="relative group animate-scale-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden border-2 
                                  border-[var(--color-mint)]/40 shadow-lg 
                                  group-hover:border-[var(--color-forest)] 
                                  group-hover:shadow-xl transition-all">
                      <img
                        src={
                          img instanceof File
                            ? URL.createObjectURL(img)
                            : typeof img === "string"
                              ? img
                              : ""
                        }
                        alt={`Preview ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {i === 0 && (
                      <div className="absolute top-2 left-2 px-2 py-1 rounded-lg
                                    bg-[var(--color-forest)] text-white text-xs font-bold
                                    shadow-lg">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {images.length === 0 && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-amber-50 
                            border-2 border-amber-200">
                <FiAlertCircle size={20} className="text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  <strong>At least 1 image is required.</strong> Items with 3+ photos get
                  2x more views!
                </p>
              </div>
            )}
          </Section>

          {/* ═══════════════════════════════════════════════════════
              STEP 6: REVIEW & SUBMIT
              ═══════════════════════════════════════════════════════ */}
          {progress >= 80 && (
            <Section
              icon={<FiCheckCircle size={24} />}
              title="Review & Publish"
              subtitle="Double-check everything before publishing"
              step={6}
              currentStep={getActiveStep()}
            >
              {/* Summary Card */}
              <div className="p-6 rounded-2xl bg-[var(--color-mint-light)]/30 
                            border-2 border-[var(--color-mint)]/40 space-y-4">
                <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <FiPackage size={18} />
                  Listing Summary
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border-2 border-[var(--color-mint)]/30">
                    <p className="text-xs text-gray-500 mb-1">Title</p>
                    <p className="font-semibold text-gray-900 text-sm">{formData.title || '—'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border-2 border-[var(--color-mint)]/30">
                    <p className="text-xs text-gray-500 mb-1">Category</p>
                    <p className="font-semibold text-gray-900 text-sm">{formData.category || '—'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border-2 border-[var(--color-mint)]/30">
                    <p className="text-xs text-gray-500 mb-1">Price</p>
                    <p className="font-semibold text-[var(--color-forest)] text-sm">
                      ₹{formData.price || '0'}
                      {isRent && ` / ${formData.rentalPeriod?.replace('per_', '')}`}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border-2 border-[var(--color-mint)]/30">
                    <p className="text-xs text-gray-500 mb-1">Images</p>
                    <p className="font-semibold text-gray-900 text-sm">{images.length} uploaded</p>
                  </div>
                </div>

                {formData.description && (
                  <div className="p-4 rounded-xl bg-white border-2 border-[var(--color-mint)]/30">
                    <p className="text-xs text-gray-500 mb-2">Description</p>
                    <p className="text-sm text-gray-700 line-clamp-3">{formData.description}</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || progress < 100}
                className="
                  w-full flex items-center justify-center gap-3
                  px-8 py-5 rounded-2xl font-bold text-lg text-white
                  bg-[var(--color-forest)] hover:bg-[var(--color-forest-dark)]
                  shadow-2xl shadow-[var(--color-forest)]/40
                  hover:shadow-[var(--color-forest)]/60 hover:scale-[1.02]
                  active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
                  cursor-pointer transition-all duration-300 group
                "
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white 
                                  rounded-full animate-spin" />
                    Creating Your Listing...
                  </>
                ) : (
                  <>
                    <FiSave size={24} className="group-hover:scale-110 transition-transform" />
                    Publish Listing
                  </>
                )}
              </button>

              {progress < 100 && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-amber-50 
                              border-2 border-amber-200">
                  <FiAlertCircle size={18} className="text-amber-600 flex-shrink-0" />
                  <p className="text-sm text-amber-700">
                    Please complete all required fields to publish your listing
                  </p>
                </div>
              )}
            </Section>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateItem;