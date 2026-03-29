import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerAPI } from '../../api/axios.js';
import ImageUpload from '../../components/common/ImageUpload.jsx';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiBook, FiCalendar, FiUserPlus } from 'react-icons/fi';

const departments = ['MCA', 'BCA', 'B.Tech CSE', 'B.Tech ME', 'B.Tech CE', 'B.Tech EE', 'B.Tech ECE', 'MBA', 'MSc', 'BSc', 'BA', 'B.Pharm', 'M.Pharm', 'Other'];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', department: '', semester: ''
  });
  const [idCardImage, setIdCardImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

    const emailRegex = /^\d{2}[A-Za-z]+\d{3}@(shiats|shuats)\.com$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please use a valid SHUATS email (e.g., 24MCA020@shiats.com)');
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
        navigate('/pending-approval');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h1>📚 SHUATS RentMart</h1>
        <h2>Student Registration</h2>
        <p>Create your account using SHUATS email</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label><FiUser /> Full Name</label>
            <input type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required />
          </div>

          <div>
            <label><FiMail /> SHUATS Email</label>
            <input type="email" name="email" placeholder="e.g., 24MCA020@shiats.com" value={formData.email} onChange={handleChange} required />
            <small>Only @shiats.com or @shuats.com emails accepted</small>
          </div>

          <div>
            <label><FiBook /> Department</label>
            <select name="department" value={formData.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label><FiCalendar /> Semester</label>
            <select name="semester" value={formData.semester} onChange={handleChange} required>
              <option value="">Select Semester</option>
              {[1,2,3,4,5,6,7,8,9,10].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>

          <div>
            <label><FiLock /> Password</label>
            <input type="password" name="password" placeholder="Minimum 6 characters" value={formData.password} onChange={handleChange} required minLength={6} />
          </div>

          <div>
            <label><FiLock /> Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          <ImageUpload
            label="Upload SHUATS Student ID Card *"
            onImageSelect={setIdCardImage}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : <><FiUserPlus /> Register</>}
          </button>
        </form>

        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
};

export default Register;