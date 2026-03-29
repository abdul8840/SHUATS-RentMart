import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordAPI } from '../../api/axios.js';
import toast from 'react-hot-toast';
import { FiMail, FiSend } from 'react-icons/fi';

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
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2>Forgot Password</h2>
        {sent ? (
          <div>
            <p>✅ Password reset link has been sent to your email.</p>
            <p>Please check your inbox and follow the instructions.</p>
            <Link to="/login">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p>Enter your SHUATS email to receive a password reset link.</p>
            <div>
              <label><FiMail /> Email</label>
              <input type="email" placeholder="your_id@shiats.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : <><FiSend /> Send Reset Link</>}
            </button>
            <Link to="/login">Back to Login</Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;