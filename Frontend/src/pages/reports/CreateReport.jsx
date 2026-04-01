import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createReportAPI } from '../../api/axios.js';
import toast from 'react-hot-toast';
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiSend,
  FiUser,
  FiPackage,
  FiMessageSquare,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiChevronDown,
} from 'react-icons/fi';

const reasons = [
  { value: 'Spam', icon: '🚫', description: 'Unsolicited or repetitive content' },
  { value: 'Fake Listing', icon: '🎭', description: 'Item doesn\'t exist or is misrepresented' },
  { value: 'Inappropriate Content', icon: '⚠️', description: 'Offensive or unsuitable material' },
  { value: 'Fraud', icon: '🕵️', description: 'Deceptive or scam-related activity' },
  { value: 'Harassment', icon: '😤', description: 'Bullying, threats, or intimidation' },
  { value: 'Duplicate', icon: '📋', description: 'Same content posted multiple times' },
  { value: 'Wrong Category', icon: '📂', description: 'Listed in incorrect category' },
  { value: 'Other', icon: '📝', description: 'Something else not listed above' },
];

const reportTypeConfig = {
  user: {
    icon: <FiUser className="w-5 h-5" />,
    label: 'User',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-50',
    description: 'Report inappropriate behavior or suspicious user activity',
  },
  item: {
    icon: <FiPackage className="w-5 h-5" />,
    label: 'Item',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-50',
    description: 'Report a fake, misleading, or inappropriate listing',
  },
  forum_post: {
    icon: <FiMessageSquare className="w-5 h-5" />,
    label: 'Forum Post',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    iconBg: 'bg-purple-50',
    description: 'Report offensive or rule-breaking forum content',
  },
};

const CreateReport = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reportType = searchParams.get('type') || 'user';
  const targetId = searchParams.get('id') || '';

  const [formData, setFormData] = useState({ reason: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);

  const typeConfig = reportTypeConfig[reportType] || reportTypeConfig.user;
  const selectedReason = reasons.find((r) => r.value === formData.reason);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reason) {
      toast.error('Please select a reason for your report');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        reportType,
        reason: formData.reason,
        description: formData.description,
        ...(reportType === 'user' && { reportedUser: targetId }),
        ...(reportType === 'item' && { reportedItem: targetId }),
        ...(reportType === 'forum_post' && { reportedPost: targetId }),
      };

      const { data } = await createReportAPI(payload);
      if (data.success) {
        setSubmitted(true);
        toast.success('Report submitted successfully!');
        setTimeout(() => navigate(-1), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  // Success State
  if (submitted) {
    return (
      <div className="min-h-screen bg-cream-light flex items-center justify-center p-4">
        <div className="glass rounded-3xl p-8 sm:p-12 text-center max-w-md w-full animate-scale-in shadow-xl">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-soft">
            <FiCheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Report Submitted</h2>
          <p className="text-gray-500 mb-2">
            Thank you for helping keep our community safe.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Our admin team will review your report and take appropriate action.
          </p>
          <div className="w-full h-1.5 bg-cream-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-forest to-sage rounded-full"
              style={{
                animation: 'progressBar 2s ease-in-out forwards',
              }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-3">Redirecting you back...</p>

          <style>{`
            @keyframes progressBar {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-light">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-500 via-rose-500 to-orange-500 px-4 sm:px-6 lg:px-8 pt-6 pb-16 sm:pb-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full border-4 border-white" />
          <div className="absolute bottom-5 left-10 w-24 h-24 rounded-full border-4 border-white" />
          <div className="absolute top-20 left-1/3 w-16 h-16 rounded-full border-4 border-white" />
        </div>

        <div className="max-w-2xl mx-auto relative z-10 animate-fade-in">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors text-sm cursor-pointer group"
          >
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shrink-0">
              <FiAlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                Submit a Report
              </h1>
              <p className="text-white/80 text-sm sm:text-base">
                Help us maintain a safe and trusted community
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 pb-12">
        {/* Report Type Card */}
        <div
          className="glass rounded-2xl p-4 sm:p-5 mb-5 shadow-lg animate-slide-up border-l-4 border-l-red-400"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${typeConfig.iconBg}`}>
              {typeConfig.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm text-gray-500">Reporting a</p>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${typeConfig.color}`}
                >
                  {typeConfig.icon}
                  {typeConfig.label}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{typeConfig.description}</p>
            </div>
          </div>
          {targetId && (
            <div className="mt-3 pt-3 border-t border-cream-dark/50">
              <p className="text-xs text-gray-400">
                Target ID:{' '}
                <span className="font-mono text-gray-600 bg-cream-dark px-2 py-0.5 rounded">
                  {targetId.length > 20 ? `${targetId.slice(0, 8)}...${targetId.slice(-8)}` : targetId}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Report Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Reason Selection */}
          <div
            className="glass rounded-2xl overflow-hidden shadow-md animate-slide-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
          >
            <div className="p-4 sm:p-5 border-b border-cream-dark/50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4 text-red-500" />
                Reason for Report
                <span className="text-red-500 text-sm">*</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Select the category that best describes the issue
              </p>
            </div>
            <div className="p-4 sm:p-5">
              {/* Custom Select (Mobile-friendly) */}
              <div className="relative sm:hidden">
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full appearance-none bg-white border-2 border-cream-dark rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-800 focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all cursor-pointer"
                  required
                >
                  <option value="">Select a reason...</option>
                  {reasons.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.icon} {r.value}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Desktop Grid Selection */}
              <div className="hidden sm:grid grid-cols-2 gap-2.5">
                {reasons.map((r) => {
                  const isSelected = formData.reason === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, reason: r.value })}
                      className={`relative flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-300 cursor-pointer group
                        ${
                          isSelected
                            ? 'border-forest bg-forest/5 shadow-md shadow-forest/10'
                            : 'border-cream-dark bg-white hover:border-sage-light hover:bg-cream/50'
                        }`}
                    >
                      {/* Selected checkmark */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-forest rounded-full flex items-center justify-center animate-scale-in">
                          <FiCheckCircle className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}

                      <span className="text-xl shrink-0 mt-0.5">{r.icon}</span>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-semibold transition-colors ${
                            isSelected ? 'text-forest-dark' : 'text-gray-800 group-hover:text-forest'
                          }`}
                        >
                          {r.value}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                          {r.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected reason preview (Mobile) */}
              {formData.reason && (
                <div className="sm:hidden mt-3 p-3 bg-forest/5 border border-forest/20 rounded-xl animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedReason?.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-forest-dark">{selectedReason?.value}</p>
                      <p className="text-xs text-gray-500">{selectedReason?.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div
            className="glass rounded-2xl overflow-hidden shadow-md animate-slide-up"
            style={{ animationDelay: '0.15s', animationFillMode: 'both' }}
          >
            <div className="p-4 sm:p-5 border-b border-cream-dark/50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FiFileText className="w-4 h-4 text-forest" />
                Additional Details
                <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Provide more context to help our team investigate
              </p>
            </div>
            <div className="p-4 sm:p-5">
              <div className="relative">
                <textarea
                  placeholder="Describe the issue in detail. Include any relevant information that might help us investigate..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  maxLength={1000}
                  className="w-full bg-white border-2 border-cream-dark rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400
                    focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none
                    transition-all duration-300 resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <FiShield className="w-3.5 h-3.5" />
                    <span>Your report is confidential</span>
                  </div>
                  <span
                    className={`text-xs font-medium transition-colors ${
                      formData.description.length > 900
                        ? 'text-red-500'
                        : formData.description.length > 700
                          ? 'text-amber-500'
                          : 'text-gray-400'
                    }`}
                  >
                    {formData.description.length}/1000
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div
            className="rounded-2xl p-4 sm:p-5 bg-amber-50/80 border border-amber-200/60 animate-slide-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-amber-100 rounded-lg shrink-0 mt-0.5">
                <FiAlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-800 mb-1.5">
                  Before you submit
                </h4>
                <ul className="space-y-1.5 text-xs text-amber-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    False reports may result in action against your account
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    Reports are reviewed by our admin team within 24-48 hours
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    You'll be notified once a decision has been made
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div
            className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2 animate-slide-up"
            style={{ animationDelay: '0.25s', animationFillMode: 'both' }}
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border-2 border-gray-200
                hover:bg-cream hover:border-cream-dark hover:text-gray-800
                transition-all duration-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.reason}
              className="relative px-8 py-3 rounded-xl text-sm font-semibold text-white
                bg-gradient-to-r from-red-500 to-rose-500
                shadow-lg shadow-red-500/25
                hover:shadow-xl hover:shadow-red-500/35 hover:from-red-600 hover:to-rose-600
                disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                transition-all duration-300 cursor-pointer btn-ripple
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReport;