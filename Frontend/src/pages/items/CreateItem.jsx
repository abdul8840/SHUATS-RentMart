import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItemAPI } from '../../api/axios.js';
import ImageUpload from '../../components/common/ImageUpload.jsx';
import AIAssistant from '../../components/ai/AIAssistant.jsx';
import toast from 'react-hot-toast';
import { FiSave } from 'react-icons/fi';

const categories = ['Books', 'Previous Year Papers', 'Calculators', 'Electronic Devices', 'Lab Equipment', 'Stationery', 'Sports Equipment', 'Musical Instruments', 'Clothing', 'Furniture', 'Other'];
const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
const departments = ['MCA', 'BCA', 'B.Tech CSE', 'B.Tech ME', 'B.Tech CE', 'B.Tech EE', 'B.Tech ECE', 'MBA', 'MSc', 'BSc', 'BA', 'Other'];

const CreateItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', listingType: 'sell', category: '', department: '', semester: '', condition: 'Good', price: '', priceType: 'fixed', rentalPeriod: 'per_month', tags: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        semester: formData.semester ? parseInt(formData.semester) : undefined,
        images,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
      };

      const { data } = await createItemAPI(payload);
      if (data.success) {
        toast.success('Item listed successfully!');
        navigate(`/items/${data.item._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const handleAIInsert = (content) => {
    setFormData(prev => ({ ...prev, description: content }));
  };

  return (
    <div>
      <h1>Create New Listing</h1>

      <AIAssistant onInsert={handleAIInsert} mode="item" />

      <form onSubmit={handleSubmit}>
        <div>
          <label>Listing Type *</label>
          <div>
            <label>
              <input type="radio" name="listingType" value="sell" checked={formData.listingType === 'sell'} onChange={handleChange} /> For Sale
            </label>
            <label>
              <input type="radio" name="listingType" value="rent" checked={formData.listingType === 'rent'} onChange={handleChange} /> For Rent
            </label>
          </div>
        </div>

        <div>
          <label>Item Title *</label>
          <input type="text" name="title" placeholder="e.g., Engineering Mathematics Textbook" value={formData.title} onChange={handleChange} required />
        </div>

        <div>
          <label>Category *</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label>Department Relevance *</label>
          <select name="department" value={formData.department} onChange={handleChange} required>
            <option value="">Select Department</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div>
          <label>Semester</label>
          <select name="semester" value={formData.semester} onChange={handleChange}>
            <option value="">Any Semester</option>
            {[1,2,3,4,5,6,7,8,9,10].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>

        <div>
          <label>Condition *</label>
          <select name="condition" value={formData.condition} onChange={handleChange} required>
            {conditions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label>Description *</label>
          <textarea name="description" placeholder="Describe your item in detail..." value={formData.description} onChange={handleChange} required rows={5} />
        </div>

        <div>
          <div>
            <label>Price (₹) *</label>
            <input type="number" name="price" placeholder="Enter price" value={formData.price} onChange={handleChange} required min="0" />
          </div>
          <div>
            <label>Price Type</label>
            <select name="priceType" value={formData.priceType} onChange={handleChange}>
              <option value="fixed">Fixed</option>
              <option value="negotiable">Negotiable</option>
            </select>
          </div>
        </div>

        {formData.listingType === 'rent' && (
          <div>
            <label>Rental Period</label>
            <select name="rentalPeriod" value={formData.rentalPeriod} onChange={handleChange}>
              <option value="per_day">Per Day</option>
              <option value="per_week">Per Week</option>
              <option value="per_month">Per Month</option>
              <option value="per_semester">Per Semester</option>
            </select>
          </div>
        )}

        <div>
          <label>Tags (comma separated)</label>
          <input type="text" name="tags" placeholder="e.g., math, engineering, 3rd-year" value={formData.tags} onChange={handleChange} />
        </div>

        <ImageUpload label="Item Images * (max 5)" onImageSelect={setImages} multiple={true} />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : <><FiSave /> Create Listing</>}
        </button>
      </form>
    </div>
  );
};

export default CreateItem;