import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemAPI, updateItemAPI, deleteItemAPI } from '../../api/axios.js';
import ImageUpload from '../../components/common/ImageUpload.jsx';
import AIAssistant from '../../components/ai/AIAssistant.jsx';
import Loader from '../../components/common/Loader.jsx';
import toast from 'react-hot-toast';
import { FiSave, FiTrash2 } from 'react-icons/fi';

const categories = ['Books', 'Previous Year Papers', 'Calculators', 'Electronic Devices', 'Lab Equipment', 'Stationery', 'Sports Equipment', 'Musical Instruments', 'Clothing', 'Furniture', 'Other'];
const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const { data } = await getItemAPI(id);
      if (data.success) {
        const item = data.item;
        setFormData({
          title: item.title, description: item.description, listingType: item.listingType,
          category: item.category, department: item.department, semester: item.semester || '',
          condition: item.condition, price: item.price, priceType: item.priceType,
          rentalPeriod: item.rentalPeriod || 'per_month', tags: item.tags?.join(', ') || '',
          isAvailable: item.isAvailable, images: item.images
        });
      }
    } catch (error) {
      toast.error('Item not found');
      navigate('/my-listings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        newImages: newImages.length > 0 ? newImages : undefined
      };

      const { data } = await updateItemAPI(id, payload);
      if (data.success) {
        toast.success('Item updated successfully!');
        navigate(`/items/${id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await deleteItemAPI(id);
      toast.success('Item deleted');
      navigate('/my-listings');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <Loader />;
  if (!formData) return <p>Item not found</p>;

  return (
    <div>
      <div>
        <h1>Edit Listing</h1>
        <button onClick={handleDelete}><FiTrash2 /> Delete</button>
      </div>

      <AIAssistant onInsert={(content) => setFormData(prev => ({ ...prev, description: content }))} mode="item" />

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div>
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
        </div>

        <div>
          <label>Condition</label>
          <select name="condition" value={formData.condition} onChange={handleChange}>{conditions.map(c => <option key={c} value={c}>{c}</option>)}</select>
        </div>

        <div>
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={5} />
        </div>

        <div>
          <label>Price (₹)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" />
        </div>

        <div>
          <label>
            <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
            Available
          </label>
        </div>

        <ImageUpload label="Add More Images" onImageSelect={setNewImages} multiple={true} existingImages={formData.images} />

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : <><FiSave /> Save Changes</>}
        </button>
      </form>
    </div>
  );
};

export default EditItem;