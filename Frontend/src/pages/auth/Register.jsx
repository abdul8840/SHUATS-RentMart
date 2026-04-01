import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerAPI } from '../../api/axios.js';
import ImageUpload from '../../components/common/ImageUpload.jsx';
import toast from 'react-hot-toast';
import {
  FiUser,
  FiMail,
  FiLock,
  FiBook,
  FiCalendar,
  FiUserPlus,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiShield,
  FiAward,
  FiBookOpen
} from 'react-icons/fi';

const departments = [
  'MCA',
  'BCA',
  'B.Tech CSE',
  'B.Tech ME',
  'B.Tech CE',
  'B.Tech EE',
  'B.Tech ECE',
  'MBA',
  'MSc',
  'BSc',
  'BA',
  'B.Pharm',
  'M.Pharm',
  'Other'
];

const perks = [
  {
    icon: <FiShield size={16} />,
    title: 'Verified Students Only',
    desc: 'Safe & trusted community'
  },
  {
    icon: <FiBookOpen size={16} />,
    title: 'Campus Resources',
    desc: 'Books, notes & equipment'
  },
  {
    icon: <FiAward size={16} />,
    title: 'Trust Score System',
    desc: 'Build your reputation'
  }
];

const inputCls = `
  w-full pl-11 pr-4 py-3 rounded-xl text-sm
  bg-[var(--color-cream)] border border-[var(--color-rose-beige)]/70
  text-gray-700 placeholder:text-gray-400
  focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]
  focus:border-[var(--color-sage)] hover:border-[var(--color-mint)]
  transition-all duration-200
`;

const FieldLabel = ({ children, required }) => (
  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
    {children}
    {required && <span className="text-red-400 ml-0.5">*</span>}
  </label>
);

const InputIcon = ({ icon }) => (
  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-forest)] transition-colors duration-200">
    {icon}
  </div>
);

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    semester: ''
  });
  const [idCardImage, setIdCardImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* password strength */
  const pwdStrength = (() => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6)
      return { label: 'Too short', color: 'bg-red-400', width: '20%' };
    if (p.length < 8)
      return { label: 'Weak', color: 'bg-orange-400', width: '40%' };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p))
      return { label: 'Fair', color: 'bg-amber-400', width: '60%' };
    if (!/[^A-Za-z0-9]/.test(p))
      return {
        label: 'Good',
        color: 'bg-[var(--color-sage)]',
        width: '80%'
      };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
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
    if (!idCardImage) {
      toast.error('Please upload your SHUATS Student ID Card');
      return;
    }
    const emailRegex = /^\d{2}[A-Za-z]+\d{3}@(shiats|shuats)\.edu\.in$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(
        'Please use a valid SHUATS email (e.g., 24MCA020@shiats.edu.in)'
      );
      return;
    }
    setLoading(true);
    try {
      const { data } = await registerAPI({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        semester: parseInt(formData.semester),
        idCardImage
      });
      if (data.success) {
        toast.success(data.message);
        if (data.requiresVerification) {
          navigate('/verify-email', {
            state: { email: data.email || formData.email }
          });
        } else {
          navigate('/pending-approval');
        }
      }
    } catch (error) {
      const errData = error.response?.data;
      toast.error(errData?.message || 'Registration failed');
      if (errData?.requiresVerification && errData?.email) {
        navigate('/verify-email', { state: { email: errData.email } });
      }
    } finally {
      setLoading(false);
    }
  };

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
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/20 shadow-xl animate-bounce-soft">
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
            <div className="text-6xl animate-bounce-soft">🎓</div>
            <div
              className="absolute top-2 right-2 text-xl animate-bounce-soft"
              style={{ animationDelay: '0.3s' }}
            >
              📖
            </div>
            <div
              className="absolute bottom-2 left-2 text-xl animate-bounce-soft"
              style={{ animationDelay: '0.6s' }}
            >
              💻
            </div>
            <div
              className="absolute top-2 left-3 text-lg animate-bounce-soft"
              style={{ animationDelay: '0.9s' }}
            >
              🔬
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
          </div>

          <h2
            className="text-xl font-extrabold mb-2 animate-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            Join Your Campus Community
          </h2>
          <p
            className="text-sm text-[var(--color-mint-light)] mb-6 animate-slide-up"
            style={{ animationDelay: '150ms' }}
          >
            Register with your SHUATS credentials to access the marketplace
          </p>

          <div className="space-y-3">
            {perks.map((p, i) => (
              <div
                key={i}
                style={{ animationDelay: `${i * 100 + 200}ms` }}
                className="animate-slide-right flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/15 hover:bg-white/15 transition-colors duration-200 text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  {p.icon}
                </div>
                <div>
                  <p className="font-semibold text-xs">{p.title}</p>
                  <p className="text-[var(--color-mint-light)] text-[11px]">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ RIGHT FORM PANEL ══ */}
      <div className="w-full lg:w-7/12 xl:w-3/5 flex items-start justify-center overflow-y-auto">
        <div className="w-full max-w-xl px-6 sm:px-10 py-8">
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
            overflow-hidden animate-scale-in
          "
          >
            <div className="h-1.5 gradient-bg" />

            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-gray-800 mb-1">
                  Student Registration 🎓
                </h2>
                <p className="text-sm text-gray-500">
                  Create your account using your SHUATS credentials
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <FieldLabel required>Full Name</FieldLabel>
                  <div className="relative group">
                    <InputIcon icon={<FiUser size={16} />} />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <FieldLabel required>SHUATS Email</FieldLabel>
                  <div className="relative group">
                    <InputIcon icon={<FiMail size={16} />} />
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g., 24MCA020@shiats.edu.in"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputCls}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 ml-1">
                    ⓘ Only @shiats.edu.in or @shuats.edu.in emails are accepted
                  </p>
                </div>

                {/* Department + Semester */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Department</FieldLabel>
                    <div className="relative group">
                      <InputIcon icon={<FiBook size={16} />} />
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        className={`${inputCls} appearance-none cursor-pointer`}
                      >
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <FieldLabel required>Semester</FieldLabel>
                    <div className="relative group">
                      <InputIcon icon={<FiCalendar size={16} />} />
                      <select
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        required
                        className={`${inputCls} appearance-none cursor-pointer`}
                      >
                        <option value="">Select Semester</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                          <option key={s} value={s}>
                            Semester {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <FieldLabel required>Password</FieldLabel>
                  <div className="relative group">
                    <InputIcon icon={<FiLock size={16} />} />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      name="password"
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className={`${inputCls} pr-12`}
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
                          style={{ width: pwdStrength.width }}
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

                {/* Confirm Password */}
                <div>
                  <FieldLabel required>Confirm Password</FieldLabel>
                  <div className="relative group">
                    <InputIcon icon={<FiLock size={16} />} />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`${inputCls} pr-12`}
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
                        absolute right-12 top-1/2 -translate-y-1/2
                        transition-all duration-200 animate-scale-in
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

                {/* ID Card Upload */}
                <div className="pt-1">
                  <div
                    className="
                    p-4 rounded-2xl border border-[var(--color-rose-beige)]/60
                    bg-[var(--color-cream)] space-y-3
                  "
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                        🪪
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          Student ID Card
                        </p>
                        <p className="text-xs text-gray-400">
                          Required for account verification
                        </p>
                      </div>
                      {idCardImage && (
                        <span className="ml-auto text-emerald-500 animate-scale-in">
                          <FiCheckCircle size={16} />
                        </span>
                      )}
                    </div>
                    <ImageUpload
                      label="Upload SHUATS Student ID Card *"
                      onImageSelect={setIdCardImage}
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
                    cursor-pointer transition-all duration-200 btn-ripple mt-2
                  "
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Registering…
                    </>
                  ) : (
                    <>
                      <FiUserPlus size={16} />
                      Create Account
                    </>
                  )}
                </button>
              </form>

              {/* Login link */}
              <p className="text-center text-sm text-gray-500 mt-5">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-[var(--color-forest)] hover:underline underline-offset-2 cursor-pointer"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4 pb-4">
            🔒 Your data is secure and only used for verification
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;