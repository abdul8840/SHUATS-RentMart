import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPasswordAPI } from '../../api/axios.js';
import toast from 'react-hot-toast';
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiShield,
  FiArrowLeft
} from 'react-icons/fi';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const pwdStrength = (() => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6)
      return { label: 'Too short', color: 'bg-red-400', pct: '20%' };
    if (p.length < 8)
      return { label: 'Weak', color: 'bg-orange-400', pct: '40%' };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p))
      return { label: 'Fair', color: 'bg-amber-400', pct: '60%' };
    if (!/[^A-Za-z0-9]/.test(p))
      return { label: 'Good', color: 'bg-[var(--color-sage)]', pct: '80%' };
    return { label: 'Strong', color: 'bg-emerald-500', pct: '100%' };
  })();

  const pwdMatch =
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await resetPasswordAPI(token, {
        password: formData.password
      });
      if (data.success) {
        toast.success(data.message);
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `
    w-full pl-11 pr-12 py-3.5 rounded-xl text-sm
    bg-[var(--color-cream)] border border-[var(--color-rose-beige)]/70
    text-gray-700 placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]
    focus:border-[var(--color-sage)] hover:border-[var(--color-mint)]
    transition-all duration-200
  `;

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)] flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--color-mint-light)] opacity-40 blur-3xl animate-pulse-soft" />
        <div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[var(--color-rose-beige)] opacity-40 blur-3xl animate-pulse-soft"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="relative w-full max-w-md animate-scale-in">
        <div
          className="
          bg-[var(--color-cream-light)]/90 backdrop-blur-xl
          rounded-3xl shadow-2xl shadow-black/10
          border border-[var(--color-rose-beige)]/50
          overflow-hidden
        "
        >
          <div className="h-1.5 gradient-bg" />

          <div className="p-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-xl shadow-md animate-bounce-soft">
                📚
              </div>
              <span className="text-lg font-extrabold gradient-text">
                SHUATS RentMart
              </span>
            </div>

            {!success ? (
              <>
                {/* Header */}
                <div className="flex flex-col items-center mb-7">
                  <div
                    className="
                    w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center
                    text-white shadow-lg shadow-[var(--color-forest)]/30 mb-4
                    animate-bounce-soft
                  "
                  >
                    <FiShield size={28} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-800">
                    Reset Password
                  </h2>
                  <p className="text-sm text-gray-500 text-center mt-1 max-w-xs">
                    Create a strong new password for your account.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* New password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                      New Password{' '}
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-forest)] transition-colors">
                        <FiLock size={16} />
                      </div>
                      <input
                        type={showPwd ? 'text' : 'password'}
                        placeholder="Minimum 6 characters"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            password: e.target.value
                          })
                        }
                        required
                        minLength={6}
                        className={inputCls}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((p) => !p)}
                        className="
                          absolute right-3 top-1/2 -translate-y-1/2
                          w-8 h-8 rounded-lg flex items-center justify-center
                          text-gray-400 hover:text-[var(--color-forest)]
                          hover:bg-[var(--color-mint-light)]
                          cursor-pointer transition-all duration-150
                        "
                      >
                        {showPwd ? (
                          <FiEyeOff size={14} />
                        ) : (
                          <FiEye size={14} />
                        )}
                      </button>
                    </div>
                    {pwdStrength && (
                      <div className="mt-2 animate-slide-down">
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pwdStrength.color} transition-all duration-500`}
                            style={{ width: pwdStrength.pct }}
                          />
                        </div>
                        <p
                          className={`text-[10px] mt-0.5 ml-1 font-medium ${
                            pwdStrength.label === 'Strong'
                              ? 'text-emerald-500'
                              : pwdStrength.label === 'Good'
                              ? 'text-[var(--color-sage)]'
                              : 'text-amber-500'
                          }`}
                        >
                          {pwdStrength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                      Confirm New Password{' '}
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-forest)] transition-colors">
                        <FiLock size={16} />
                      </div>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Confirm your new password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value
                          })
                        }
                        required
                        className={inputCls}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((p) => !p)}
                        className="
                          absolute right-3 top-1/2 -translate-y-1/2
                          w-8 h-8 rounded-lg flex items-center justify-center
                          text-gray-400 hover:text-[var(--color-forest)]
                          hover:bg-[var(--color-mint-light)]
                          cursor-pointer transition-all duration-150
                        "
                      >
                        {showConfirm ? (
                          <FiEyeOff size={14} />
                        ) : (
                          <FiEye size={14} />
                        )}
                      </button>
                      {formData.confirmPassword && (
                        <div
                          className={`
                          absolute right-12 top-1/2 -translate-y-1/2 animate-scale-in
                          ${pwdMatch ? 'text-emerald-500' : 'text-red-400'}
                        `}
                        >
                          <FiCheckCircle size={15} />
                        </div>
                      )}
                    </div>
                    {formData.confirmPassword && !pwdMatch && (
                      <p className="text-[10px] text-red-500 mt-1 ml-1 animate-slide-down">
                        Passwords do not match
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full flex items-center justify-center gap-2
                      py-3.5 rounded-xl font-bold text-white text-sm
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
                        Resetting…
                      </>
                    ) : (
                      <>
                        <FiShield size={15} />
                        Reset Password
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* ── SUCCESS ── */
              <div className="flex flex-col items-center text-center gap-5 py-4 animate-scale-in">
                <div
                  className="
                  w-20 h-20 rounded-3xl bg-emerald-100 flex items-center justify-center
                  text-emerald-500 shadow-lg shadow-emerald-500/20 animate-bounce-soft
                "
                >
                  <FiCheckCircle size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-gray-800 mb-1">
                    Password Reset!
                  </h3>
                  <p className="text-sm text-gray-500">
                    Your password has been updated successfully. Redirecting to
                    login…
                  </p>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-bg rounded-full"
                    style={{
                      animation: 'progress 2.5s linear forwards',
                      width: '0%'
                    }}
                  />
                </div>
                <Link
                  to="/login"
                  className="
                    flex items-center gap-1.5 text-sm font-semibold
                    text-[var(--color-forest)] hover:underline underline-offset-2
                    cursor-pointer transition-colors duration-200
                  "
                >
                  <FiArrowLeft size={14} />
                  Go to Login now
                </Link>
              </div>
            )}

            {/* Back to login */}
            {!success && (
              <div className="mt-6 flex justify-center">
                <Link
                  to="/login"
                  className="
                    flex items-center gap-1.5 text-sm font-semibold
                    text-[var(--color-forest)] hover:underline underline-offset-2
                    cursor-pointer transition-colors duration-200
                  "
                >
                  <FiArrowLeft size={14} />
                  Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          🔐 This reset link is valid for 1 hour only
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;