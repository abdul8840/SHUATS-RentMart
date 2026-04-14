import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth.js';
import { adminLoginAPI } from '../../api/axios.js';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiLogIn, FiShield, FiAlertCircle } from 'react-icons/fi';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await adminLoginAPI(formData);
      if (data.success) {
        if (data.user.role !== 'admin') {
          toast.error('Access denied. Admin only.');
          return;
        }
        const success = login(data.token, data.user);
        if (success) {
          toast.success('Admin login successful!');
          navigate('/dashboard');
        } else {
          toast.error('Access denied.');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4 shadow-lg shadow-green-600/30">
            <FiShield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SHUATS RentMart
          </h1>
          <h2 className="text-lg font-semibold text-green-600 mb-1">
            Admin Panel
          </h2>
          <p className="text-sm text-gray-500">
            Secure administrative access
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Security Notice Bar */}
          <div className="bg-green-50 border-b border-green-100 px-6 py-3">
            <div className="flex items-center gap-2 text-green-800">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-xs font-medium">
                Authorized personnel only. All activities are logged.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Email Input */}
            <div>
              <label 
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
              >
                <FiMail className="w-4 h-4 text-green-600" />
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="admin@shuats.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-gray-900"
              />
            </div>

            {/* Password Input */}
            <div>
              <label 
                htmlFor="password"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
              >
                <FiLock className="w-4 h-4 text-green-600" />
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter admin password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-gray-900"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-green-600/20"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <FiLogIn className="w-5 h-5" />
                  <span>Login to Admin Panel</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Protected by advanced security measures
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600 font-medium">System Online</span>
          </div>
        </div>

        {/* Version Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            RentMart Admin v1.0 • © 2024 SHUATS
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;