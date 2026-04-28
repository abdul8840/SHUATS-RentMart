// ItemDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminGetItemDetailAPI, adminRemoveItemAPI } from '../../api/axios.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Loader from '../../components/common/Loader.jsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  FiXCircle,
  FiUser,
  FiTag,
  FiDollarSign,
  FiEye,
  FiMapPin,
  FiCalendar,
  FiCheckCircle,
  FiXCircle as FiXCircleOutline,
  FiPackage,
  FiHeart,
  FiShare2,
  FiFlag,
  FiClock,
  FiFolder,
  FiHash,
} from 'react-icons/fi';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const { data } = await adminGetItemDetailAPI(id);
      if (data.success) setItem(data.item);
    } catch (error) {
      toast.error('Item not found');
      navigate('/items');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm('Remove this item from the marketplace?')) return;
    try {
      await adminRemoveItemAPI(id);
      toast.success('Item removed');
      fetchItem();
    } catch (error) {
      toast.error('Remove failed');
    }
  };

  const nextImage = () => {
    if (item?.images && imageIndex < item.images.length - 1) {
      setImageIndex(imageIndex + 1);
    }
  };

  const prevImage = () => {
    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1);
    }
  };

  if (loading) return <Loader />;
  if (!item) return (
    <div className="min-h-screen flex items-center justify-center bg-green-50/30">
      <div className="text-center">
        <div className="text-6xl mb-4">📦</div>
        <p className="text-green-800 text-lg">Item not found</p>
        <Link to="/items" className="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
          Back to Items
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link to="/items" className="text-green-600 hover:text-green-700 flex items-center gap-2 mb-2 text-sm">
              ← Back to Items
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-green-900">Item Details</h1>
          </div>
          {item.status !== 'removed' && (
            <button
              onClick={handleRemove}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all duration-200 border border-red-200 shadow-sm"
            >
              <FiXCircle className="w-4 h-4" />
              Remove Item
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-green-100">
              {item.images?.length > 0 ? (
                <>
                  <img
                    src={item.images[imageIndex]?.url}
                    alt={`${item.title}-${imageIndex}`}
                    className="w-full h-80 sm:h-96 object-contain bg-gray-50"
                  />
                  {item.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        disabled={imageIndex === 0}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextImage}
                        disabled={imageIndex === item.images.length - 1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        →
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {item.images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setImageIndex(i)}
                            className={`w-2 h-2 rounded-full transition-all ${i === imageIndex ? 'bg-green-600 w-4' : 'bg-gray-400'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-80 sm:h-96 flex items-center justify-center bg-gray-100">
                  <FiPackage className="w-20 h-20 text-gray-400" />
                </div>
              )}
            </div>
            {item.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {item.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${i === imageIndex ? 'border-green-500' : 'border-transparent'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold text-green-900">{item.title}</h2>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 transition">
                    <FiHeart className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-green-600 rounded-full hover:bg-gray-100 transition">
                    <FiShare2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition">
                    <FiFlag className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <StatusBadge status={item.status} />
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {item.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
                {!item.isAvailable && (
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                    Not Available
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-green-800">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <FiDollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-500">Price</p>
                    <p className="text-2xl font-bold text-green-800">
                      ₹{item.price.toLocaleString()}
                      {item.listingType === 'rent' && (
                        <span className="text-sm font-normal text-green-500"> / {item.rentalPeriod?.replace('per_', '')}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-green-800">
                    <div className="p-2 bg-green-100 rounded-xl">
                      <FiTag className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-green-500">Category</p>
                      <p className="font-medium text-green-900">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-green-800">
                    <div className="p-2 bg-green-100 rounded-xl">
                      <FiHash className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-green-500">Condition</p>
                      <p className="font-medium text-green-900 capitalize">{item.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-green-800">
                    <div className="p-2 bg-green-100 rounded-xl">
                      <FiFolder className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-green-500">Department</p>
                      <p className="font-medium text-green-900">{item.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-green-800">
                    <div className="p-2 bg-green-100 rounded-xl">
                      <FiClock className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-green-500">Semester</p>
                      <p className="font-medium text-green-900">{item.semester || 'Any'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2 border-t border-green-100">
                  <div className="flex items-center gap-2 text-green-600">
                    <FiEye className="w-4 h-4" />
                    <span className="text-sm">{item.views} views</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <FiCalendar className="w-4 h-4" />
                    <span className="text-sm">Listed: {format(new Date(item.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <FiCheckCircle className="w-4 h-4" />
                    <span className="text-sm">{item.isAvailable ? 'Available' : 'Not Available'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Description</h3>
              <p className="text-green-700 leading-relaxed">{item.description}</p>
            </div>

            {/* Tags */}
            {item.tags?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Seller Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                <FiUser className="w-5 h-5" />
                Seller Information
              </h3>
              <Link to={`/users/${item.seller?._id}`} className="block hover:bg-green-50 rounded-xl transition">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {item.seller?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-green-900">{item.seller?.name}</p>
                    <p className="text-sm text-green-600">{item.seller?.email}</p>
                    <p className="text-sm text-green-600">{item.seller?.department}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-green-700">Trust Score:</span>
                      <div className="flex-1 max-w-32 h-2 bg-green-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${item.seller?.trustScore || 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-green-700">{item.seller?.trustScore || 0}/100</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;