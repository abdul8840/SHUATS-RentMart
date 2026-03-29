import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPasswordAPI } from '../../api/axios.js';
import toast from 'react-hot-toast';
import { FiLock } from 'react-icons/fi';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await resetPasswordAPI(token, { password: formData.password });
      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label><FiLock /> New Password</label>
            <input type="password" placeholder="Minimum 6 characters" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} />
          </div>
          <div>
            <label><FiLock /> Confirm New Password</label>
            <input type="password" placeholder="Confirm password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;