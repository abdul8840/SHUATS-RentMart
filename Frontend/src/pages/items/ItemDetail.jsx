import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getItemAPI, createRequestAPI, createChatAPI } from '../../api/axios.js';
import { useAuth } from '../../hooks/useAuth.js';
import TrustBadge from '../../components/common/TrustBadge.jsx';
import MeetupMap from '../../components/meetup/MeetupMap.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import toast from 'react-hot-toast';
import {
  FiMessageSquare, FiSend, FiEdit, FiMapPin, FiTag,
  FiCalendar, FiEye, FiAlertTriangle, FiUser,
  FiChevronLeft, FiChevronRight, FiHeart, FiShare2,
  FiCheckCircle, FiXCircle, FiStar, FiPackage
} from 'react-icons/fi';

const conditionConfig = {
  'New':      { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  'Like New': { color: 'bg-[var(--color-mint-light)] text-[var(--color-forest)] border-[var(--color-mint)]', dot: 'bg-[var(--color-sage)]' },
  'Good':     { color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  'Fair':     { color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  'Poor':     { color: 'bg-red-100 text-red-600 border-red-200', dot: 'bg-red-400' },
};

const inputCls = `
  w-full px-4 py-3 rounded-xl text-sm
  bg-[var(--color-cream)] border border-[var(--color-rose-beige)]/70
  text-gray-700 placeholder:text-gray-400
  focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]
  focus:border-[var(--color-sage)]
  transition-all duration-200
`;

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [requestModal, setRequestModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted]   = useState(false);
  const [requestData, setRequestData] = useState({
    message: '', meetupLocation: '', rentalStartDate: '', rentalEndDate: '',
  });
  const [selectedMeetup, setSelectedMeetup] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => { fetchItem(); }, [id]);

  const fetchItem = async () => {
    try {
      const { data } = await getItemAPI(id);
      if (data.success) setItem(data.item);
    } catch {
      toast.error('Item not found');
      navigate('/items');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    setSendingRequest(true);
    try {
      const payload = {
        itemId: item._id,
        requestType: item.listingType === 'rent' ? 'rent' : 'buy',
        message: requestData.message,
        meetupLocation: selectedMeetup?.name || requestData.meetupLocation,
        ...(item.listingType === 'rent' && {
          rentalStartDate: requestData.rentalStartDate,
          rentalEndDate:   requestData.rentalEndDate,
        }),
      };
      const { data } = await createRequestAPI(payload);
      if (data.success) {
        toast.success('Request sent successfully! 🎉');
        setRequestModal(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setSendingRequest(false);
    }
  };

  const handleStartChat = async () => {
    try {
      const { data } = await createChatAPI({ participantId: item.seller._id, itemId: item._id });
      if (data.success) navigate('/chat', { state: { selectedChat: data.chat } });
    } catch {
      toast.error('Failed to start chat');
    }
  };

  const prevImage = () =>
    setSelectedImage(p => p === 0 ? item.images.length - 1 : p - 1);
  const nextImage = () =>
    setSelectedImage(p => p === item.images.length - 1 ? 0 : p + 1);

  if (loading) return <Loader />;
  if (!item) return (
    <div className="flex items-center justify-center py-20 text-gray-500">Item not found</div>
  );

  const isOwner = user?._id === item.seller?._id;
  const isRent  = item.listingType === 'rent';
  const cond    = conditionConfig[item.condition] ?? { color: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-12">

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">

        {/* ══ LEFT — IMAGE GALLERY ══ */}
        <div className="lg:col-span-3 space-y-3">

          {/* Main image */}
          <div className="
            relative rounded-2xl overflow-hidden
            bg-[var(--color-cream)] border border-[var(--color-rose-beige)]/50
            aspect-[4/3] shadow-lg group
          ">
            {item.images?.length > 0 ? (
              <img
                key={selectedImage}
                src={item.images[selectedImage]?.url}
                alt={item.title}
                className="w-full h-full object-cover animate-fade-in"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[var(--color-cream)] to-[var(--color-mint-light)]">
                <FiPackage size={48} className="text-[var(--color-rose-beige)]" />
                <p className="text-sm text-gray-400">No Image Available</p>
              </div>
            )}

            {/* Listing badge */}
            <span className={`
              absolute top-4 left-4 px-3 py-1.5 rounded-xl text-xs font-bold
              shadow-lg backdrop-blur-sm
              ${isRent ? 'bg-[var(--color-forest)]/90 text-white' : 'bg-white/90 text-[var(--color-forest)]'}
            `}>
              {isRent ? '🔄 For Rent' : '🏷️ For Sale'}
            </span>

            {/* Availability badge */}
            <span className={`
              absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5
              rounded-xl text-xs font-bold shadow-lg backdrop-blur-sm
              ${item.isAvailable ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}
            `}>
              {item.isAvailable
                ? <><FiCheckCircle size={11} /> Available</>
                : <><FiXCircle size={11} /> Unavailable</>
              }
            </span>

            {/* Nav arrows */}
            {item.images?.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="
                    absolute left-3 top-1/2 -translate-y-1/2
                    w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm
                    flex items-center justify-center text-gray-700
                    hover:bg-white hover:scale-110 cursor-pointer
                    shadow-md transition-all duration-200
                    opacity-0 group-hover:opacity-100
                  "
                >
                  <FiChevronLeft size={18} />
                </button>
                <button
                  onClick={nextImage}
                  className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm
                    flex items-center justify-center text-gray-700
                    hover:bg-white hover:scale-110 cursor-pointer
                    shadow-md transition-all duration-200
                    opacity-0 group-hover:opacity-100
                  "
                >
                  <FiChevronRight size={18} />
                </button>

                {/* Image counter */}
                <div className="
                  absolute bottom-4 left-1/2 -translate-x-1/2
                  px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm
                  text-white text-xs font-medium
                ">
                  {selectedImage + 1} / {item.images.length}
                </div>
              </>
            )}

            {/* Views */}
            <div className="
              absolute bottom-4 left-4 flex items-center gap-1.5
              px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm
              text-white text-xs
            ">
              <FiEye size={12} />
              {item.views ?? 0} views
            </div>
          </div>

          {/* Thumbnail strip */}
          {item.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {item.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`
                    flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden
                    border-2 cursor-pointer transition-all duration-200
                    ${selectedImage === i
                      ? 'border-[var(--color-forest)] scale-105 shadow-md'
                      : 'border-transparent hover:border-[var(--color-mint)] opacity-70 hover:opacity-100'
                    }
                  `}
                >
                  <img src={img.url} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ══ RIGHT — ITEM INFO ══ */}
        <div className="lg:col-span-2 space-y-4">

          {/* Title card */}
          <div className="
            bg-[var(--color-cream-light)] border border-[var(--color-rose-beige)]/50
            rounded-2xl p-5 shadow-sm space-y-3
          ">
            {/* Category + condition */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-[var(--color-cream)] px-2.5 py-1 rounded-lg border border-[var(--color-rose-beige)]/50">
                <FiTag size={11} />
                {item.category}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${cond.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cond.dot}`} />
                {item.condition}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
              {item.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--color-forest)]">
                ₹{item.price}
              </span>
              {isRent && (
                <span className="text-sm text-gray-500 font-medium">
                  / {item.rentalPeriod?.replace('per_', '')}
                </span>
              )}
              {item.priceType === 'negotiable' && (
                <span className="
                  px-2 py-0.5 rounded-md text-xs font-semibold
                  bg-amber-100 text-amber-700 border border-amber-200
                ">
                  Negotiable
                </span>
              )}
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--color-rose-beige)]/40">
              {[
                { icon: <FiTag size={12} />, label: 'Dept', value: item.department },
                item.semester && { icon: <FiCalendar size={12} />, label: 'Semester', value: `Sem ${item.semester}` },
              ].filter(Boolean).map((meta, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="text-[var(--color-sage)]">{meta.icon}</span>
                  <span className="text-gray-400">{meta.label}:</span>
                  <span className="font-medium truncate">{meta.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Seller card */}
          <div className="
            bg-[var(--color-cream-light)] border border-[var(--color-rose-beige)]/50
            rounded-2xl p-5 shadow-sm
          ">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Seller</p>
            <Link to={`/user/${item.seller._id}`} className="flex items-center gap-3 group">
              <div className="
                w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0
                bg-gradient-to-br from-[var(--color-forest)] to-[var(--color-sage)]
                text-white font-bold text-lg shadow-md
                group-hover:scale-105 transition-transform duration-200
              ">
                {item.seller.profileImage?.url ? (
                  <img src={item.seller.profileImage.url} alt={item.seller.name} className="w-full h-full object-cover" />
                ) : (
                  item.seller.name?.charAt(0)?.toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-800 text-sm group-hover:text-[var(--color-forest)] transition-colors truncate">
                  {item.seller.name}
                </h4>
                <p className="text-xs text-gray-500 truncate">{item.seller.department}</p>
                <TrustBadge score={item.seller.trustScore} />
              </div>
            </Link>
          </div>

          {/* Action buttons */}
          {!isOwner && item.isAvailable && (
            <div className="space-y-2">
              <button
                onClick={() => setRequestModal(true)}
                className="
                  w-full flex items-center justify-center gap-2
                  py-3.5 rounded-2xl font-bold text-sm text-white
                  gradient-bg shadow-lg shadow-[var(--color-forest)]/30
                  hover:shadow-xl hover:shadow-[var(--color-forest)]/40
                  hover:scale-[1.02] active:scale-[0.98]
                  cursor-pointer transition-all duration-200 btn-ripple
                "
              >
                <FiSend size={16} />
                {isRent ? 'Request to Rent' : 'Request to Buy'}
              </button>

              <button
                onClick={handleStartChat}
                className="
                  w-full flex items-center justify-center gap-2
                  py-3.5 rounded-2xl font-bold text-sm
                  bg-[var(--color-cream-light)] text-[var(--color-forest)]
                  border-2 border-[var(--color-forest)]/30
                  hover:bg-[var(--color-mint-light)] hover:border-[var(--color-forest)]
                  hover:scale-[1.02] active:scale-[0.98]
                  cursor-pointer transition-all duration-200
                "
              >
                <FiMessageSquare size={16} />
                Chat with Seller
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setWishlisted(p => !p)}
                  className={`
                    flex-1 flex items-center justify-center gap-2
                    py-3 rounded-xl font-semibold text-sm
                    border-2 cursor-pointer transition-all duration-200
                    ${wishlisted
                      ? 'bg-red-50 border-red-300 text-red-500'
                      : 'bg-[var(--color-cream)] border-[var(--color-rose-beige)] text-gray-600 hover:border-red-300 hover:text-red-500'
                    }
                  `}
                >
                  <FiHeart size={15} className={wishlisted ? 'fill-current' : ''} />
                  {wishlisted ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!'); }}
                  className="
                    flex-1 flex items-center justify-center gap-2
                    py-3 rounded-xl font-semibold text-sm
                    bg-[var(--color-cream)] border-2 border-[var(--color-rose-beige)]
                    text-gray-600 hover:border-[var(--color-mint)] hover:text-[var(--color-forest)]
                    cursor-pointer transition-all duration-200
                  "
                >
                  <FiShare2 size={15} />
                  Share
                </button>
              </div>

              <Link
                to={`/report?type=item&id=${item._id}`}
                className="
                  flex items-center justify-center gap-1.5 w-full
                  py-2 rounded-xl text-xs text-gray-400
                  hover:text-red-500 cursor-pointer
                  transition-colors duration-200
                "
              >
                <FiAlertTriangle size={12} /> Report this listing
              </Link>
            </div>
          )}

          {/* Owner actions */}
          {isOwner && (
            <Link
              to={`/items/${item._id}/edit`}
              className="
                w-full flex items-center justify-center gap-2
                py-3.5 rounded-2xl font-bold text-sm
                bg-[var(--color-cream-light)] text-[var(--color-forest)]
                border-2 border-[var(--color-forest)]/30
                hover:bg-[var(--color-mint-light)] hover:border-[var(--color-forest)]
                cursor-pointer transition-all duration-200
              "
            >
              <FiEdit size={16} />
              Edit Your Listing
            </Link>
          )}

          {/* Unavailable banner */}
          {!item.isAvailable && (
            <div className="
              flex items-center gap-3 p-4 rounded-2xl
              bg-red-50 border border-red-200
            ">
              <FiXCircle size={20} className="text-red-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-700 text-sm">No Longer Available</p>
                <p className="text-xs text-red-500">This item has already been rented or sold.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ DESCRIPTION + TAGS ══ */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--color-cream-light)] border border-[var(--color-rose-beige)]/50 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full gradient-bg inline-block" />
            Description
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {item.description}
          </p>

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[var(--color-rose-beige)]/40">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, i) => (
                  <span key={i} className="
                    px-2.5 py-1 rounded-lg text-xs font-medium
                    bg-[var(--color-mint-light)] text-[var(--color-forest)]
                    border border-[var(--color-mint)]/40
                    hover:bg-[var(--color-mint)] cursor-default
                    transition-colors duration-200
                  ">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick info card */}
        <div className="bg-[var(--color-cream-light)] border border-[var(--color-rose-beige)]/50 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full gradient-bg inline-block" />
            Quick Info
          </h3>
          {[
            { label: 'Category', value: item.category, icon: <FiTag size={13} /> },
            { label: 'Condition', value: item.condition, icon: <FiStar size={13} /> },
            { label: 'Department', value: item.department, icon: <FiUser size={13} /> },
            item.semester && { label: 'Semester', value: `Semester ${item.semester}`, icon: <FiCalendar size={13} /> },
            { label: 'Views', value: `${item.views ?? 0} views`, icon: <FiEye size={13} /> },
          ].filter(Boolean).map((info, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--color-rose-beige)]/30 last:border-0">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="text-[var(--color-sage)]">{info.icon}</span>
                {info.label}
              </div>
              <span className="text-xs font-semibold text-gray-700">{info.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ REQUEST MODAL ══ */}
      <Modal
        isOpen={requestModal}
        onClose={() => setRequestModal(false)}
        title={`${isRent ? 'Rent' : 'Buy'} Request`}
      >
        <div className="space-y-4 p-1">
          {/* Message */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Message to Seller
            </label>
            <textarea
              rows={3}
              placeholder="Hi, I'm interested in this item…"
              value={requestData.message}
              onChange={(e) => setRequestData({ ...requestData, message: e.target.value })}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Rental dates */}
          {isRent && (
            <div className="grid grid-cols-2 gap-3 animate-slide-down">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={requestData.rentalStartDate}
                  onChange={(e) => setRequestData({ ...requestData, rentalStartDate: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={requestData.rentalEndDate}
                  onChange={(e) => setRequestData({ ...requestData, rentalEndDate: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
          )}

          {/* Meetup */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              <FiMapPin size={12} />
              Meetup Location
            </label>
            <MeetupMap
              onSelectLocation={(loc) => setSelectedMeetup(loc)}
              selectedLocation={selectedMeetup}
            />
            {selectedMeetup && (
              <div className="
                flex items-center gap-2 mt-2 px-3 py-2 rounded-xl
                bg-[var(--color-mint-light)] border border-[var(--color-mint)]/40
                animate-scale-in
              ">
                <FiMapPin size={13} className="text-[var(--color-forest)]" />
                <span className="text-xs font-medium text-[var(--color-forest)]">
                  {selectedMeetup.name}
                </span>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSendRequest}
            disabled={sendingRequest || !requestData.message}
            className="
              w-full flex items-center justify-center gap-2
              py-3.5 rounded-2xl font-bold text-sm text-white
              gradient-bg shadow-lg shadow-[var(--color-forest)]/30
              hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
              cursor-pointer transition-all duration-200 btn-ripple
            "
          >
            {sendingRequest ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <FiSend size={15} />
                Send Request
              </>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ItemDetail;