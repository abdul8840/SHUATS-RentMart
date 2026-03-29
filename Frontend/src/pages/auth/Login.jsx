import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { loginAPI } from '../../api/axios.js';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await loginAPI(formData);
      if (data.success) {
        login(data.token, data.user);
        toast.success('Login successful!');
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
    <div>
      <div>
        <div>
          <h1>📚 SHUATS RentMart</h1>
          <p>Student Rental & Resale Platform</p>
        </div>

        <h2>Welcome Back!</h2>
        <p>Log in with your SHUATS email</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label><FiMail /> Email</label>
            <input
              type="email"
              name="email"
              placeholder="e.g., 24MCA020@shiats.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label><FiLock /> Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : <><FiLogIn /> Login</>}
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;