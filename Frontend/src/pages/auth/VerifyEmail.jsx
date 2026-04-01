import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { verifyEmailAPI, resendOTPAPI } from '../../api/axios.js';
import toast from 'react-hot-toast';
import {
  FiMail,
  FiCheckCircle,
  FiRefreshCw,
  FiArrowLeft,
  FiShield,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verified, setVerified] = useState(false);

  const inputRefs = useRef([]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Handle OTP input
  const handleOTPChange = (index, value) => {
    // Handle paste of full OTP
    if (value.length > 1) {
      const pastedOTP = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedOTP.forEach((char, i) => {
        if (i + index < 6 && /^\d$/.test(char)) {
          newOtp[i + index] = char;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + pastedOTP.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  // Handle paste on container
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  // Verify OTP
  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const { data } = await verifyEmailAPI({ email, otp: otpString });
      if (data.success) {
        setVerified(true);
        toast.success(data.message);
        setTimeout(() => {
          navigate('/pending-approval');
        }, 3000);
      }
    } catch (error) {
      const errData = error.response?.data;
      toast.error(errData?.message || 'Verification failed');

      if (errData?.expired) {
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }

      if (errData?.alreadyVerified) {
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!canResend) return;

    setResending(true);
    try {
      const { data } = await resendOTPAPI({ email });
      if (data.success) {
        toast.success(data.message);
        setCountdown(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      const errData = error.response?.data;
      if (errData?.retryAfter) {
        setCountdown(errData.retryAfter);
        setCanResend(false);
      }
      toast.error(errData?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  if (!email) return null;

  // ── SUCCESS STATE ──
  if (verified) {
    return (
      <div className="min-h-screen bg-[var(--color-cream-light)] flex items-center justify-center p-6">
        <div
          className="
          w-full max-w-md bg-[var(--color-cream-light)]/90 backdrop-blur-xl
          rounded-3xl shadow-2xl shadow-black/8
          border border-[var(--color-rose-beige)]/50
          overflow-hidden animate-scale-in
        "
        >
          <div className="h-1.5 bg-emerald-500" />
          <div className="p-8 text-center">
            <div
              className="
              w-20 h-20 mx-auto mb-6 rounded-full
              bg-emerald-50 flex items-center justify-center
              animate-bounce-soft
            "
            >
              <FiCheckCircle className="text-emerald-500" size={40} />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
              Email Verified! ✅
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Your email has been verified successfully. Your account is now
              pending admin approval.
            </p>
            <div
              className="
              bg-[var(--color-cream)] rounded-2xl p-4
              border border-[var(--color-rose-beige)]/50
            "
            >
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <FiClock size={16} />
                <span className="text-sm font-semibold">What's next?</span>
              </div>
              <p className="text-xs text-gray-500">
                An admin will review your student ID card and approve your
                account. You'll be redirected shortly...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)] flex">
      {/* ══ LEFT ILLUSTRATION PANEL ══ */}
      <div
        className="
        hidden lg:flex lg:w-5/12 xl:w-2/5
        relative overflow-hidden flex-col items-center justify-center p-10
        bg-gradient-to-br from-[var(--color-forest-dark)] via-[var(--color-forest)] to-[var(--color-sage)]
        sticky top-0 h-screen
      "
      >
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-black/10 translate-x-1/4 translate-y-1/4 blur-3xl" />
        <div
          className="
          absolute inset-0 opacity-10
          bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]
          bg-[size:40px_40px]
        "
        />

        <div className="relative z-10 text-white text-center max-w-sm">
          <div className="flex items-center justify-center gap-3 mb-8 animate-slide-down">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/20 shadow-xl">
              📚
            </div>
            <div className="text-left">
              <h1 className="text-xl font-extrabold">SHUATS RentMart</h1>
              <p className="text-[var(--color-mint-light)] text-xs">
                Campus Marketplace
              </p>
            </div>
          </div>

          <div
            className="
            w-48 h-48 mx-auto mb-8 rounded-3xl
            bg-white/10 backdrop-blur-sm border border-white/20
            flex items-center justify-center shadow-2xl
            relative overflow-hidden animate-slide-up
          "
          >
            <div className="text-6xl animate-bounce-soft">✉️</div>
            <div
              className="absolute top-2 right-3 text-xl animate-bounce-soft"
              style={{ animationDelay: '0.3s' }}
            >
              🔒
            </div>
            <div
              className="absolute bottom-2 left-3 text-xl animate-bounce-soft"
              style={{ animationDelay: '0.6s' }}
            >
              ✅
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
          </div>

          <h2
            className="text-xl font-extrabold mb-2 animate-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            Almost There!
          </h2>
          <p
            className="text-sm text-[var(--color-mint-light)] mb-6 animate-slide-up"
            style={{ animationDelay: '150ms' }}
          >
            Just one more step to access the campus marketplace
          </p>

          <div className="space-y-3">
            {[
              {
                icon: <FiMail size={16} />,
                title: 'Check Your Inbox',
                desc: 'We sent a 6-digit code'
              },
              {
                icon: <FiShield size={16} />,
                title: 'Enter the OTP',
                desc: 'Verify your SHUATS email'
              },
              {
                icon: <FiCheckCircle size={16} />,
                title: 'Get Verified',
                desc: 'Start using RentMart!'
              }
            ].map((item, i) => (
              <div
                key={i}
                style={{ animationDelay: `${i * 100 + 200}ms` }}
                className="animate-slide-right flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/15 text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-xs">{item.title}</p>
                  <p className="text-[var(--color-mint-light)] text-[11px]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ RIGHT FORM PANEL ══ */}
      <div className="w-full lg:w-7/12 xl:w-3/5 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md animate-scale-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-xl shadow-md">
              📚
            </div>
            <span className="text-lg font-extrabold gradient-text">
              SHUATS RentMart
            </span>
          </div>

          {/* Card */}
          <div
            className="
            bg-[var(--color-cream-light)]/90 backdrop-blur-xl
            rounded-3xl shadow-2xl shadow-black/8
            border border-[var(--color-rose-beige)]/50
            overflow-hidden
          "
          >
            <div className="h-1.5 gradient-bg" />

            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <div
                  className="
                  w-16 h-16 mx-auto mb-4 rounded-2xl
                  gradient-bg flex items-center justify-center
                  shadow-lg shadow-[var(--color-forest)]/30
                "
                >
                  <FiMail className="text-white" size={28} />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-1">
                  Verify Your Email ✉️
                </h2>
                <p className="text-sm text-gray-500">
                  We've sent a 6-digit code to
                </p>
                <p className="text-sm font-bold text-[var(--color-forest)] mt-1">
                  {email}
                </p>
              </div>

              {/* OTP Input */}
              <div className="mb-6" onPaste={handlePaste}>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 text-center">
                  Enter Verification Code
                </label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`
                        w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold
                        rounded-xl border-2 transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]
                        ${
                          digit
                            ? 'border-[var(--color-sage)] bg-[var(--color-mint-light)]/30 text-[var(--color-forest)]'
                            : 'border-[var(--color-rose-beige)] bg-[var(--color-cream)] text-gray-700'
                        }
                        hover:border-[var(--color-mint)]
                      `}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              {/* Timer & Resend */}
              <div className="text-center mb-6">
                {!canResend ? (
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <FiClock size={14} />
                    <span className="text-sm">
                      Resend OTP in{' '}
                      <span className="font-bold text-[var(--color-forest)]">
                        {Math.floor(countdown / 60)}:
                        {(countdown % 60).toString().padStart(2, '0')}
                      </span>
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={resending}
                    className="
                      flex items-center justify-center gap-2 mx-auto
                      text-sm font-semibold text-[var(--color-forest)]
                      hover:underline underline-offset-2
                      disabled:opacity-50 disabled:cursor-not-allowed
                      cursor-pointer transition-all duration-200
                    "
                  >
                    {resending ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-[var(--color-forest)]/30 border-t-[var(--color-forest)] rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiRefreshCw size={14} />
                        Resend OTP
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Info box */}
              <div
                className="
                bg-[var(--color-cream)] rounded-2xl p-4 mb-6
                border border-[var(--color-rose-beige)]/50
              "
              >
                <div className="flex items-start gap-2">
                  <FiAlertCircle
                    className="text-amber-500 flex-shrink-0 mt-0.5"
                    size={16}
                  />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">
                      Didn't receive the email?
                    </p>
                    <ul className="text-xs text-gray-400 mt-1 space-y-0.5">
                      <li>• Check your spam/junk folder</li>
                      <li>
                        • Make sure you entered the correct SHUATS email
                      </li>
                      <li>
                        • Wait for the timer to expire and click "Resend OTP"
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerify}
                disabled={loading || otp.join('').length !== 6}
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
                    Verifying…
                  </>
                ) : (
                  <>
                    <FiCheckCircle size={16} />
                    Verify Email
                  </>
                )}
              </button>

              {/* Back to Register */}
              <div className="text-center mt-5">
                <Link
                  to="/register"
                  className="
                    inline-flex items-center gap-1.5 text-sm text-gray-500
                    hover:text-[var(--color-forest)] cursor-pointer transition-colors
                  "
                >
                  <FiArrowLeft size={14} />
                  Back to Registration
                </Link>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            🔒 OTP expires in 10 minutes for security
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;