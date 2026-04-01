import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordAPI } from '../../api/axios.js';
import toast from 'react-hot-toast';
import {
  FiMail,
  FiSend,
  FiArrowLeft,
  FiCheckCircle,
  FiInbox
} from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await forgotPasswordAPI({ email });
      if (data.success) {
        setSent(true);
        toast.success(data.message);
      }
    } catch (error) {
      const errData = error.response?.data;
      if (errData?.requiresVerification) {
        toast.error('Please verify your email first');
      } else {
        toast.error(errData?.message || 'Failed to send reset email');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)] flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--color-mint-light)] opacity-40 blur-3xl animate-pulse-soft" />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[var(--color-rose-beige)] opacity-40 blur-3xl animate-pulse-soft"
          style={{ animationDelay: '1s' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[var(--color-mint)] opacity-10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-scale-in">
        {/* Card */}
        <div
          className="
          bg-[var(--color-cream-light)]/90 backdrop-blur-xl
          rounded-3xl shadow-2xl shadow-black/10
          border border-[var(--color-rose-beige)]/50
          overflow-hidden
        "
        >
          <div className="h-1.5 gradient-bg w-full" />

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

            {!sent ? (
              <>
                {/* Icon */}
                <div className="flex flex-col items-center mb-6">
                  <div
                    className="
                    w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center
                    text-white shadow-lg shadow-[var(--color-forest)]/30 mb-4
                    animate-bounce-soft
                  "
                  >
                    <FiMail size={28} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-800">
                    Forgot Password?
                  </h2>
                  <p className="text-sm text-gray-500 text-center mt-1 max-w-xs">
                    No worries! Enter your SHUATS email and we'll send you a
                    reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      SHUATS Email
                    </label>
                    <div className="relative group">
                      <div
                        className="
                        absolute left-4 top-1/2 -translate-y-1/2
                        text-gray-400 group-focus-within:text-[var(--color-forest)]
                        transition-colors duration-200
                      "
                      >
                        <FiMail size={16} />
                      </div>
                      <input
                        type="email"
                        placeholder="your_id@shiats.edu.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="
                          w-full pl-11 pr-4 py-3.5 rounded-xl text-sm
                          bg-[var(--color-cream)] border border-[var(--color-rose-beige)]/70
                          text-gray-700 placeholder:text-gray-400
                          focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]
                          focus:border-[var(--color-sage)]
                          hover:border-[var(--color-mint)]
                          transition-all duration-200
                        "
                      />
                    </div>
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
                        Sending…
                      </>
                    ) : (
                      <>
                        <FiSend size={15} />
                        Send Reset Link
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* ── SUCCESS STATE ── */
              <div className="flex flex-col items-center text-center gap-4 py-4 animate-scale-in">
                <div className="relative">
                  <div
                    className="
                    w-20 h-20 rounded-3xl bg-emerald-100 flex items-center justify-center
                    text-emerald-500 animate-bounce-soft
                  "
                  >
                    <FiInbox size={36} />
                  </div>
                  <div
                    className="
                    absolute -top-1 -right-1 w-7 h-7 rounded-full
                    bg-emerald-500 flex items-center justify-center
                    text-white shadow-md animate-scale-in
                  "
                  >
                    <FiCheckCircle size={14} />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-gray-800 mb-1">
                    Check your inbox!
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                    We've sent a password reset link to{' '}
                    <strong className="text-[var(--color-forest)]">
                      {email}
                    </strong>
                    . It expires in 1 hour.
                  </p>
                </div>

                <div className="w-full p-4 rounded-2xl bg-[var(--color-mint-light)] border border-[var(--color-mint)]/40 text-sm text-gray-600 text-left space-y-1">
                  <p className="font-semibold text-[var(--color-forest)] mb-2">
                    What to do next:
                  </p>
                  {[
                    'Check your email inbox',
                    'Click the reset link in the email',
                    'Create a new secure password'
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full gradient-bg text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back to login */}
            <div className="mt-6 flex justify-center">
              <Link
                to="/login"
                className="
                  flex items-center gap-1.5 text-sm font-semibold
                  text-[var(--color-forest)] hover:text-[var(--color-forest-dark)]
                  cursor-pointer transition-colors duration-200
                  hover:underline underline-offset-2
                "
              >
                <FiArrowLeft size={14} />
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          🔒 Secure password reset powered by SHUATS RentMart
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;