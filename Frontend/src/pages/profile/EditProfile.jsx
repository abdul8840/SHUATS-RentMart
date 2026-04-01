import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { updateProfileAPI, changePasswordAPI } from '../../api/axios.js';
import ImageUpload from '../../components/common/ImageUpload.jsx';
import toast from 'react-hot-toast';
import {
  FiSave, FiLock, FiUser, FiBook, FiCalendar,
  FiArrowLeft, FiEye, FiEyeOff, FiCheckCircle,
  FiCamera, FiEdit, FiShield
} from 'react-icons/fi';

const departments = [
  'MCA', 'BCA', 'B.Tech CSE', 'B.Tech ME', 'B.Tech CE',
  'B.Tech EE', 'B.Tech ECE', 'MBA', 'MSc', 'BSc', 'BA',
  'B.Pharm', 'M.Pharm', 'Other'
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
    {children}{required && <span className="text-red-400 ml-0.5">*</span>}
  </label>
);

const InputIcon = ({ icon }) => (
  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-forest)] transition-colors duration-200">
    {icon}
  </div>
);

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    semester: user?.semester || ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  // Password strength
  const pwdStrength = (() => {
    const p = passwordData.newPassword;
    if (!p) return null;
    if (p.length < 6) return { label: 'Too short', color: 'bg-red-400', width: '20%' };
    if (p.length < 8) return { label: 'Weak', color: 'bg-orange-400', width: '40%' };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: 'Fair', color: 'bg-amber-400', width: '60%' };
    if (!/[^A-Za-z0-9]/.test(p)) return { label: 'Good', color: 'bg-[var(--color-sage)]', width: '80%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  })();

  const pwdMatch =
    passwordData.confirmPassword &&
    passwordData.newPassword === passwordData.confirmPassword;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const payload = { ...formData };
      if (profileImage) payload.profileImage = profileImage;
      const { data } = await updateProfileAPI(payload);
      if (data.success) {
        updateUser(data.user);
        toast.success('Profile updated successfully!');
        navigate('/profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSavingPassword(true);
    try {
      const { data } = await changePasswordAPI({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (data.success) {
        toast.success('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password change failed');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)]">

      {/* ══ HEADER ══ */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-forest-dark)] via-[var(--color-forest)] to-[var(--color-sage)]" />
        <div className="
          absolute inset-0 opacity-10
          bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]
          bg-[size:40px_40px]
        " />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <Link
            to="/profile"
            className="
              inline-flex items-center gap-2 text-white/70 hover:text-white
              text-sm font-medium mb-4 transition-colors cursor-pointer
            "
          >
            <FiArrowLeft size={16} />
            Back to Profile
          </Link>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <div className="
              w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm
              flex items-center justify-center
            ">
              <FiEdit size={18} />
            </div>
            Edit Profile
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Update your personal information and security settings
          </p>
        </div>
      </div>

      {/* ══ CONTENT ══ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-4 pb-10 relative z-20">

        {/* Section Tabs */}
        <div className="
          flex gap-1 p-1.5 rounded-2xl mb-6
          bg-white/70 backdrop-blur-sm
          border border-[var(--color-rose-beige)]/40
          shadow-sm w-fit
        ">
          {[
            { id: 'profile', label: 'Profile', icon: <FiUser size={15} /> },
            { id: 'password', label: 'Password', icon: <FiLock size={15} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-xl
                text-sm font-semibold cursor-pointer
                transition-all duration-200
                ${activeSection === tab.id
                  ? 'gradient-bg text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-[var(--color-cream)]'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Profile Section ── */}
        {activeSection === 'profile' && (
          <div className="
            bg-white/90 backdrop-blur-xl rounded-2xl
            border border-[var(--color-rose-beige)]/40
            shadow-sm overflow-hidden animate-slide-up
          ">
            <div className="h-1 gradient-bg" />
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white">
                  <FiUser size={16} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">Profile Information</h2>
                  <p className="text-xs text-gray-500">Update your personal details</p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-5">

                {/* Profile Image Preview + Upload */}
                <div className="flex flex-col items-center gap-4 pb-4 border-b border-[var(--color-rose-beige)]/20">
                  <div className="relative group">
                    <div className="
                      w-24 h-24 rounded-2xl overflow-hidden
                      border-3 border-[var(--color-rose-beige)]/50
                      bg-[var(--color-cream)]
                    ">
                      {user?.profileImage?.url ? (
                        <img src={user.profileImage.url} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-extrabold text-gray-300">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="
                      absolute -bottom-1 -right-1
                      w-8 h-8 rounded-lg gradient-bg
                      flex items-center justify-center text-white shadow-md
                    ">
                      <FiCamera size={12} />
                    </div>
                  </div>
                  <ImageUpload
                    label="Change Profile Photo"
                    onImageSelect={setProfileImage}
                    compact
                  />
                  {profileImage && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium animate-scale-in">
                      <FiCheckCircle size={12} />
                      New photo selected
                    </span>
                  )}
                </div>

                {/* Name */}
                <div>
                  <FieldLabel required>Full Name</FieldLabel>
                  <div className="relative group">
                    <InputIcon icon={<FiUser size={16} />} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Enter your full name"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <FieldLabel required>Department</FieldLabel>
                  <div className="relative group">
                    <InputIcon icon={<FiBook size={16} />} />
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className={`${inputCls} appearance-none cursor-pointer`}
                    >
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                {/* Semester */}
                <div>
                  <FieldLabel required>Semester</FieldLabel>
                  <div className="relative group">
                    <InputIcon icon={<FiCalendar size={16} />} />
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      className={`${inputCls} appearance-none cursor-pointer`}
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(s => (
                        <option key={s} value={s}>Semester {s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={savingProfile}
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
                  {savingProfile ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <FiSave size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Password Section ── */}
        {activeSection === 'password' && (
          <div className="
            bg-white/90 backdrop-blur-xl rounded-2xl
            border border-[var(--color-rose-beige)]/40
            shadow-sm overflow-hidden animate-slide-up
          ">
            <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <FiLock size={16} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">Change Password</h2>
                  <p className="text-xs text-gray-500">Update your account security</p>
                </div>
              </div>

              {/* Security notice */}
              <div className="
                mb-6 p-4 rounded-xl
                bg-amber-50 border border-amber-200/60
              ">
                <div className="flex items-start gap-2">
                  <FiShield size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    <strong>Security tip:</strong> Use a strong password with at least 8 characters,
                    including uppercase letters, numbers, and special characters.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">

                {/* Current Password */}
                <div>
                  <FieldLabel required>Current Password</FieldLabel>
                  <div className="relative group">
                    <InputIcon icon={<FiLock size={16} />} />
                    <input
                      type={showCurrentPwd ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                      placeholder="Enter current password"
                      className={`${inputCls} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPwd(p => !p)}
                      className="
                        absolute right-3 top-1/2 -translate-y-1/2
                        w-8 h-8 rounded-lg flex items-center justify-center
                        text-gray-400 hover:text-[var(--color-forest)]
                        hover:bg-[var(--color-mint-light)]
                        cursor-pointer transition-all duration-150
                      "
                    >
                      {showCurrentPwd ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <FieldLabel required>New Password</FieldLabel>
                  <div className="relative group">
                    <InputIcon icon={<FiLock size={16} />} />
                    <input
                      type={showNewPwd ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                      minLength={6}
                      placeholder="Minimum 6 characters"
                      className={`${inputCls} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPwd(p => !p)}
                      className="
                        absolute right-3 top-1/2 -translate-y-1/2
                        w-8 h-8 rounded-lg flex items-center justify-center
                        text-gray-400 hover:text-[var(--color-forest)]
                        hover:bg-[var(--color-mint-light)]
                        cursor-pointer transition-all duration-150
                      "
                    >
                      {showNewPwd ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {pwdStrength && (
                    <div className="mt-2 animate-slide-down">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pwdStrength.color} transition-all duration-500`}
                          style={{ width: pwdStrength.width }}
                        />
                      </div>
                      <p className={`text-[10px] mt-0.5 ml-1 font-medium ${
                        pwdStrength.label === 'Strong' ? 'text-emerald-500' :
                        pwdStrength.label === 'Good' ? 'text-[var(--color-sage)]' :
                        'text-amber-500'
                      }`}>
                        {pwdStrength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <FieldLabel required>Confirm New Password</FieldLabel>
                  <div className="relative group">
                    <InputIcon icon={<FiLock size={16} />} />
                    <input
                      type={showConfirmPwd ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                      placeholder="Confirm new password"
                      className={`${inputCls} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPwd(p => !p)}
                      className="
                        absolute right-3 top-1/2 -translate-y-1/2
                        w-8 h-8 rounded-lg flex items-center justify-center
                        text-gray-400 hover:text-[var(--color-forest)]
                        hover:bg-[var(--color-mint-light)]
                        cursor-pointer transition-all duration-150
                      "
                    >
                      {showConfirmPwd ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                    {passwordData.confirmPassword && (
                      <div className={`
                        absolute right-12 top-1/2 -translate-y-1/2
                        transition-all duration-200 animate-scale-in
                        ${pwdMatch ? 'text-emerald-500' : 'text-red-400'}
                      `}>
                        <FiCheckCircle size={15} />
                      </div>
                    )}
                  </div>
                  {passwordData.confirmPassword && !pwdMatch && (
                    <p className="text-[10px] text-red-500 mt-1 ml-1 animate-slide-down">
                      Passwords do not match
                    </p>
                  )}
                </div>

                {/* Change Password Button */}
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="
                    w-full flex items-center justify-center gap-2
                    py-3.5 rounded-xl font-bold text-white text-sm
                    bg-gradient-to-r from-amber-500 to-orange-500
                    shadow-lg shadow-amber-500/30
                    hover:shadow-xl hover:shadow-amber-500/40
                    hover:scale-[1.02] active:scale-[0.98]
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
                    cursor-pointer transition-all duration-200
                  "
                >
                  {savingPassword ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Changing…
                    </>
                  ) : (
                    <>
                      <FiLock size={16} />
                      Change Password
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;