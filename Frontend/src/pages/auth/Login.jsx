import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { loginAPI } from '../../api/axios.js';
import toast from 'react-hot-toast';
import {
  FiMail, FiLock, FiLogIn, FiEye, FiEyeOff,
  FiShoppingBag, FiMessageSquare, FiUsers
} from 'react-icons/fi';

/* Feature bullets shown on the illustration panel */
const features = [
  { icon: <FiShoppingBag size={16} />, title: 'Rent & Resell', desc: 'Books, gadgets, lab equipment' },
  { icon: <FiMessageSquare size={16} />, title: 'Campus Chat', desc: 'Message sellers directly' },
  { icon: <FiUsers size={16} />, title: 'Student Community', desc: 'Forum & meetup locations' },
];

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange  = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginAPI(formData);
      if (data.success) {
        login(data.token, data.user);
        toast.success('Welcome back! 🎉');
        navigate('/');
      }
    } catch (error) {
      const errData = error.response?.data;
      if (errData?.accountStatus === 'pending') {
        toast.error('Your account is pending approval');
        navigate('/pending-approval');
      } else if (errData?.accountStatus === 'rejected') {
        toast.error('Your account has been rejected');
        navigate('/pending-approval');
      } else {
        toast.error(errData?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)] flex">

      {/* ══ LEFT ILLUSTRATION PANEL ══ */}
      <div className="
        hidden lg:flex lg:w-1/2 xl:w-3/5
        relative overflow-hidden flex-col items-center justify-center p-12
        bg-gradient-to-br from-[var(--color-forest-dark)] via-[var(--color-forest)] to-[var(--color-sage)]
      ">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-black/10 translate-x-1/4 translate-y-1/4 blur-3xl" />
        <div className="absolute top-1/2 right-0 w-48 h-48 rounded-full bg-[var(--color-mint)]/20 translate-x-1/2 blur-2xl" />

        {/* Grid pattern overlay */}
        <div className="
          absolute inset-0 opacity-10
          bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]
          bg-[size:40px_40px]
        " />

        <div className="relative z-10 text-white text-center max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10 animate-slide-down">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl border border-white/20 shadow-xl animate-bounce-soft">
              📚
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-extrabold leading-tight">SHUATS RentMart</h1>
              <p className="text-[var(--color-mint-light)] text-sm">Campus Marketplace</p>
            </div>
          </div>

          {/* Illustration placeholder / graphic */}
          <div className="
            w-56 h-56 mx-auto mb-10 rounded-3xl
            bg-white/10 backdrop-blur-sm border border-white/20
            flex items-center justify-center
            shadow-2xl animate-slide-up
            relative overflow-hidden
          ">
            {/* Inner graphic */}
            <div className="text-7xl animate-bounce-soft">🎓</div>
            {/* Floating elements */}
            <div className="absolute top-3 right-3 text-2xl animate-bounce-soft" style={{ animationDelay: '0.3s' }}>📖</div>
            <div className="absolute bottom-3 left-3 text-2xl animate-bounce-soft" style={{ animationDelay: '0.6s' }}>💻</div>
            <div className="absolute top-3 left-4 text-xl animate-bounce-soft" style={{ animationDelay: '0.9s' }}>🔬</div>
            <div className="absolute bottom-4 right-4 text-xl animate-bounce-soft" style={{ animationDelay: '1.2s' }}>📐</div>
            {/* Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
          </div>

          {/* Feature list */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            {features.map((f, i) => (
              <div
                key={i}
                style={{ animationDelay: `${i * 100 + 300}ms` }}
                className="animate-slide-right flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-colors duration-200"
              >
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-[var(--color-mint-light)] text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-white/50 text-xs mt-8">
            Exclusively for SHUATS University Students
          </p>
        </div>
      </div>

      {/* ══ RIGHT FORM PANEL ══ */}
      <div className="
        w-full lg:w-1/2 xl:w-2/5
        flex items-center justify-center p-6 sm:p-10
        relative overflow-hidden
      ">
        {/* Mobile background blobs */}
        <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[var(--color-mint-light)] opacity-40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[var(--color-rose-beige)] opacity-50 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md animate-scale-in">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-xl shadow-md">📚</div>
            <span className="text-lg font-extrabold gradient-text">SHUATS RentMart</span>
          </div>

          {/* Card */}
          <div className="
            bg-[var(--color-cream-light)]/90 backdrop-blur-xl
            rounded-3xl shadow-2xl shadow-black/8
            border border-[var(--color-rose-beige)]/50
            overflow-hidden
          ">
            <div className="h-1.5 gradient-bg" />

            <div className="p-8">
              <div className="mb-7">
                <h2 className="text-2xl font-extrabold text-gray-800 mb-1">Welcome Back! 👋</h2>
                <p className="text-sm text-gray-500">Log in with your SHUATS email to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    SHUATS Email
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-forest)] transition-colors duration-200">
                      <FiMail size={16} />
                    </div>
                    <input
                      type="email" name="email"
                      placeholder="e.g., 24MCA020@shiats.com"
                      value={formData.email}
                      onChange={handleChange} required
                      className="
                        w-full pl-11 pr-4 py-3.5 rounded-xl text-sm
                        bg-[var(--color-cream)] border border-[var(--color-rose-beige)]/70
                        text-gray-700 placeholder:text-gray-400
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]
                        focus:border-[var(--color-sage)] hover:border-[var(--color-mint)]
                        transition-all duration-200
                      "
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-forest)] transition-colors duration-200">
                      <FiLock size={16} />
                    </div>
                    <input
                      type={showPwd ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange} required
                      className="
                        w-full pl-11 pr-12 py-3.5 rounded-xl text-sm
                        bg-[var(--color-cream)] border border-[var(--color-rose-beige)]/70
                        text-gray-700 placeholder:text-gray-400
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]
                        focus:border-[var(--color-sage)] hover:border-[var(--color-mint)]
                        transition-all duration-200
                      "
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(p => !p)}
                      className="
                        absolute right-3 top-1/2 -translate-y-1/2
                        w-8 h-8 rounded-lg flex items-center justify-center
                        text-gray-400 hover:text-[var(--color-forest)]
                        hover:bg-[var(--color-mint-light)]
                        cursor-pointer transition-all duration-150
                      "
                    >
                      {showPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Forgot password */}
                <div className="flex justify-end -mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[var(--color-forest)] hover:underline underline-offset-2 cursor-pointer transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit" disabled={loading}
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
                      Logging in…
                    </>
                  ) : (
                    <>
                      <FiLogIn size={16} />
                      Login
                    </>
                  )}
                </button>
              </form>

              {/* Register link */}
              <p className="text-center text-sm text-gray-500 mt-6">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-bold text-[var(--color-forest)] hover:underline underline-offset-2 cursor-pointer"
                >
                  Register here
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            🎓 Only SHUATS students can access this platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;