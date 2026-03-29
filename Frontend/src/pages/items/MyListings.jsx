import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyListingsAPI, deleteItemAPI } from '../../api/axios.js';
import Pagination from '../../components/common/Pagination.jsx';
import Loader from '../../components/common/Loader.jsx';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';

const MyListings = () => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', listingType: '', page: 1 });

  useEffect(() => {
    fetchListings();
  }, [filter]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data } = await getMyListingsAPI(filter);
      if (data.success) {
        setItems(data.items);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await deleteItemAPI(id);
      toast.success('Listing deleted');
      fetchListings();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div>
        <h1>My Listings</h1>
        <Link to="/items/create"><FiPlus /> New Listing</Link>
      </div>

      <div>
        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value, page: 1 })}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="sold">Sold</option>
          <option value="rented">Rented</option>
          <option value="removed">Removed</option>
        </select>
        <select value={filter.listingType} onChange={(e) => setFilter({ ...filter, listingType: e.target.value, page: 1 })}>
          <option value="">All Types</option>
          <option value="sell">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
      </div>

      {items.length === 0 ? (
        <div>
          <p>No listings found</p>
          <Link to="/items/create">Create your first listing</Link>
        </div>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item._id}>
              <div>
                {item.images?.[0]?.url ? <img src={item.images[0].url} alt={item.title} /> : <div>No Image</div>}
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>₹{item.price} | {item.listingType} | {item.condition}</p>
                <span>{item.status}</span>
              </div>
              <div>
                <Link to={`/items/${item._id}`}><FiEye /></Link>
                <Link to={`/items/${item._id}/edit`}><FiEdit /></Link>
                <button onClick={() => handleDelete(item._id)}><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={(page) => setFilter({ ...filter, page })} />
    </div>
  );
};

export default MyListings;