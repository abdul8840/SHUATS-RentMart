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
  FiCheckCircle, FiXCircle, FiStar, FiPackage, FiClock,
  FiDollarSign, FiShield, FiZap, FiTrendingUp, FiAward
} from 'react-icons/fi';

const conditionConfig = {
  'New':      { 
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
    dot: 'bg-emerald-500',
    icon: <FiStar className="fill-current" />,
    badge: '✨ Brand New'
  },
  'Like New': { 
    color: 'bg-[var(--color-mint-light)] text-[var(--color-forest-dark)] border-[var(--color-mint)]', 
    dot: 'bg-[var(--color-sage)]',
    icon: <FiAward />,
    badge: '⭐ Like New'
  },
  'Good':     { 
    color: 'bg-blue-50 text-blue-700 border-blue-200', 
    dot: 'bg-blue-500',
    icon: <FiCheckCircle />,
    badge: '👍 Good'
  },
  'Fair':     { 
    color: 'bg-amber-50 text-amber-700 border-amber-200', 
    dot: 'bg-amber-500',
    icon: <FiClock />,
    badge: '🔶 Fair'
  },
  'Poor':     { 
    color: 'bg-red-50 text-red-600 border-red-200', 
    dot: 'bg-red-400',
    icon: <FiAlertTriangle />,
    badge: '⚠️ Poor'
  },
};

const inputCls = `
  w-full px-4 py-3 rounded-xl text-sm
  bg-[var(--color-cream)] border-2 border-[var(--color-rose-beige)]/70
  text-gray-700 placeholder:text-gray-400
  focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]
  focus:border-[var(--color-sage)]
  transition-all duration-200
`;

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestModal, setRequestModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
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
          rentalEndDate: requestData.rentalEndDate,
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Check out ${item.title} on SHUATS RentMart`,
        url: window.location.href
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      toast.success('Link copied to clipboard! 📋');
    }
  };

  if (loading) return <Loader />;
  if (!item) return (
    <div className="flex items-center justify-center py-20 text-gray-500">Item not found</div>
  );

  const isOwner = user?._id === item.seller?._id;
  const isRent = item.listingType === 'rent';
  const cond = conditionConfig[item.condition] ?? conditionConfig['Good'];

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)]">
      
      {/* ═══════════════════════════════════════════════════════
          BREADCRUMB NAVIGATION
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="flex items-center gap-2 text-sm animate-slide-right">
          <Link 
            to="/items" 
            className="text-[var(--color-forest-dark)]/60 hover:text-[var(--color-forest)] 
                     transition-colors cursor-pointer"
          >
            Browse Items
          </Link>
          <span className="text-[var(--color-rose-beige)]">/</span>
          <Link 
            to={`/items?category=${item.category}`}
            className="text-[var(--color-forest-dark)]/60 hover:text-[var(--color-forest)] 
                     transition-colors cursor-pointer"
          >
            {item.category}
          </Link>
          <span className="text-[var(--color-rose-beige)]">/</span>
          <span className="text-[var(--color-forest-dark)] font-medium truncate max-w-xs">
            {item.title}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ═══════════════════════════════════════════════════════
              LEFT COLUMN - IMAGE GALLERY (60%)
              ═══════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-4 animate-fade-in">

            {/* Main Image Display */}
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-2xl group">
              <div className="aspect-[4/3] relative">
                {item.images?.length > 0 ? (
                  <img
                    key={selectedImage}
                    src={item.images[selectedImage]?.url}
                    alt={item.title}
                    className="w-full h-full object-contain animate-fade-in"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 
                                bg-[var(--color-cream)]">
                    <FiPackage size={64} className="text-[var(--color-rose-beige)]" />
                    <p className="text-sm text-gray-400 font-medium">No Image Available</p>
                  </div>
                )}

                {/* Floating Badges Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
                  {/* Listing Type Badge */}
                  <div className="flex flex-col gap-2">
                    <span className={`
                      inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold
                      shadow-xl backdrop-blur-md
                      ${isRent 
                        ? 'bg-[var(--color-forest)]/90 text-white' 
                        : 'bg-white/90 text-[var(--color-forest-dark)]'
                      }
                      border-2 ${isRent ? 'border-white/20' : 'border-[var(--color-forest)]/20'}
                    `}>
                      {isRent ? '🔄 FOR RENT' : '🏷️ FOR SALE'}
                    </span>

                    {/* Condition Badge */}
                    <span className={`
                      inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold
                      ${cond.color} shadow-lg backdrop-blur-sm border-2
                    `}>
                      {cond.icon}
                      {cond.badge}
                    </span>
                  </div>

                  {/* Availability Badge */}
                  <span className={`
                    flex items-center gap-1.5 px-4 py-2
                    rounded-xl text-xs font-bold shadow-xl backdrop-blur-md
                    border-2
                    ${item.isAvailable 
                      ? 'bg-emerald-500/90 text-white border-white/20' 
                      : 'bg-red-500/90 text-white border-white/20'
                    }
                  `}>
                    {item.isAvailable
                      ? <><FiCheckCircle size={14} /> AVAILABLE</>
                      : <><FiXCircle size={14} /> UNAVAILABLE</>
                    }
                  </span>
                </div>

                {/* Navigation Arrows */}
                {item.images?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="
                        absolute left-4 top-1/2 -translate-y-1/2
                        w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm
                        flex items-center justify-center text-gray-700
                        hover:bg-white hover:scale-110 cursor-pointer
                        shadow-xl transition-all duration-300
                        opacity-0 group-hover:opacity-100
                      "
                    >
                      <FiChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="
                        absolute right-4 top-1/2 -translate-y-1/2
                        w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm
                        flex items-center justify-center text-gray-700
                        hover:bg-white hover:scale-110 cursor-pointer
                        shadow-xl transition-all duration-300
                        opacity-0 group-hover:opacity-100
                      "
                    >
                      <FiChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Bottom Info Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 
                              bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center justify-between">
                    {/* Image Counter */}
                    {item.images?.length > 1 && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full 
                                    bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
                        <div className="flex gap-1">
                          {item.images.map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer
                                ${i === selectedImage ? 'bg-white w-4' : 'bg-white/50'}
                              `}
                              onClick={() => setSelectedImage(i)}
                            />
                          ))}
                        </div>
                        <span>{selectedImage + 1} / {item.images.length}</span>
                      </div>
                    )}

                    {/* Views Counter */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full 
                                  bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
                      <FiEye size={14} />
                      <span>{item.views ?? 0} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Grid */}
            {item.images?.length > 1 && (
              <div className="grid grid-cols-5 gap-3 animate-slide-up">
                {item.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`
                      aspect-square rounded-2xl overflow-hidden
                      border-3 cursor-pointer transition-all duration-300
                      hover:scale-105 hover:shadow-lg
                      ${selectedImage === i
                        ? 'border-[var(--color-forest)] scale-105 shadow-lg ring-2 ring-[var(--color-forest)]/50'
                        : 'border-[var(--color-rose-beige)]/30 opacity-70 hover:opacity-100 hover:border-[var(--color-mint)]'
                      }
                    `}
                  >
                    <img src={img.url} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description Card - Desktop */}
            <div className="hidden lg:block bg-white rounded-3xl p-6 shadow-lg border-2 
                          border-[var(--color-rose-beige)]/30 animate-slide-up"
                 style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-mint-light)] 
                              flex items-center justify-center text-[var(--color-forest)]">
                  <FiPackage size={20} />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Product Description</h3>
              </div>

              <div className={`text-sm text-gray-600 leading-relaxed transition-all duration-300
                ${!showFullDesc && item.description?.length > 300 ? 'line-clamp-4' : ''}`}>
                {item.description}
              </div>

              {item.description?.length > 300 && (
                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="mt-3 text-sm font-semibold text-[var(--color-forest)] 
                           hover:text-[var(--color-forest-dark)] cursor-pointer 
                           flex items-center gap-1 transition-colors"
                >
                  {showFullDesc ? 'Show Less' : 'Read More'}
                  <FiChevronRight size={14} className={`transition-transform ${showFullDesc ? 'rotate-90' : ''}`} />
                </button>
              )}

              {/* Tags */}
              {item.tags?.length > 0 && (
                <div className="mt-6 pt-6 border-t-2 border-[var(--color-cream-dark)]">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Related Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="
                        px-3 py-1.5 rounded-xl text-xs font-medium
                        bg-[var(--color-mint-light)] text-[var(--color-forest-dark)]
                        border-2 border-[var(--color-mint)]/40
                        hover:bg-[var(--color-mint)] hover:scale-105
                        cursor-pointer transition-all duration-200
                      ">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              RIGHT COLUMN - ITEM INFO & ACTIONS (40%)
              ═══════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-4 animate-slide-left">

            {/* Main Info Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border-2 
                          border-[var(--color-rose-beige)]/30 space-y-4">
              
              {/* Category Badge */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold
                               bg-[var(--color-cream)] text-[var(--color-forest-dark)]
                               border-2 border-[var(--color-rose-beige)]/50
                               flex items-center gap-1.5">
                  <FiTag size={12} />
                  {item.category}
                </span>
                {item.department && (
                  <span className="px-3 py-1.5 rounded-lg text-xs font-semibold
                                 bg-[var(--color-mint-light)] text-[var(--color-forest)]
                                 border-2 border-[var(--color-mint)]/40
                                 flex items-center gap-1.5">
                    <FiUser size={12} />
                    {item.department}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                {item.title}
              </h1>

              {/* Price Section */}
              <div className="flex items-center justify-between p-5 rounded-2xl
                            bg-[var(--color-mint-light)]/30 border-2 border-[var(--color-mint)]/30">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-[var(--color-forest-dark)]/60 mb-1">
                    {isRent ? 'Rental Price' : 'Selling Price'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-[var(--color-forest-dark)]">
                      ₹{item.price}
                    </span>
                    {isRent && (
                      <span className="text-sm text-gray-500 font-medium">
                        / {item.rentalPeriod?.replace('per_', '')}
                      </span>
                    )}
                  </div>
                </div>
                {item.priceType === 'negotiable' && (
                  <div className="px-4 py-2 rounded-xl bg-amber-100 border-2 border-amber-200">
                    <p className="text-xs font-bold text-amber-700">💬 Negotiable</p>
                  </div>
                )}
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[var(--color-cream)] border-2 
                              border-[var(--color-rose-beige)]/30">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${cond.dot} animate-pulse-soft`} />
                    <p className="text-xs text-gray-500 font-medium">Condition</p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">{item.condition}</p>
                </div>

                {item.semester && (
                  <div className="p-4 rounded-2xl bg-[var(--color-cream)] border-2 
                                border-[var(--color-rose-beige)]/30">
                    <div className="flex items-center gap-2 mb-1">
                      <FiCalendar size={12} className="text-[var(--color-sage)]" />
                      <p className="text-xs text-gray-500 font-medium">Semester</p>
                    </div>
                    <p className="text-sm font-bold text-gray-800">Semester {item.semester}</p>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-[var(--color-cream)] border-2 
                              border-[var(--color-rose-beige)]/30">
                  <div className="flex items-center gap-2 mb-1">
                    <FiEye size={12} className="text-[var(--color-sage)]" />
                    <p className="text-xs text-gray-500 font-medium">Views</p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">{item.views ?? 0} views</p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--color-cream)] border-2 
                              border-[var(--color-rose-beige)]/30">
                  <div className="flex items-center gap-2 mb-1">
                    <FiClock size={12} className="text-[var(--color-sage)]" />
                    <p className="text-xs text-gray-500 font-medium">Posted</p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    {new Date(item.createdAt).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Seller Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border-2 
                          border-[var(--color-rose-beige)]/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-mint-light)] 
                              flex items-center justify-center text-[var(--color-forest)]">
                  <FiUser size={16} />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">Seller Information</h3>
              </div>

              <Link 
                to={`/user/${item.seller._id}`} 
                className="flex items-center gap-4 p-4 rounded-2xl
                         bg-[var(--color-cream)] border-2 border-[var(--color-rose-beige)]/30
                         hover:bg-[var(--color-mint-light)] hover:border-[var(--color-mint)]
                         cursor-pointer transition-all duration-300 group"
              >
                <div className="
                  w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0
                  bg-[var(--color-forest)] text-white font-bold text-xl shadow-lg
                  group-hover:scale-110 transition-transform duration-300
                ">
                  {item.seller.profileImage?.url ? (
                    <img src={item.seller.profileImage.url} alt={item.seller.name} 
                         className="w-full h-full object-cover" />
                  ) : (
                    item.seller.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 text-base 
                               group-hover:text-[var(--color-forest)] transition-colors truncate">
                    {item.seller.name}
                  </h4>
                  <p className="text-xs text-gray-500 truncate mb-2">{item.seller.department}</p>
                  <TrustBadge score={item.seller.trustScore} />
                </div>
                <FiChevronRight className="text-gray-400 group-hover:text-[var(--color-forest)] 
                                         transition-colors flex-shrink-0" />
              </Link>

              {/* Seller Stats */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center p-3 rounded-xl bg-[var(--color-cream)]">
                  <p className="text-lg font-bold text-[var(--color-forest)]">
                    {item.seller.trustScore ?? 0}
                  </p>
                  <p className="text-xs text-gray-500">Trust Score</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-[var(--color-cream)]">
                  <p className="text-lg font-bold text-[var(--color-forest)]">
                    {item.seller.itemsListed ?? 0}
                  </p>
                  <p className="text-xs text-gray-500">Listings</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-[var(--color-cream)]">
                  <p className="text-lg font-bold text-[var(--color-forest)]">
                    {item.seller.successfulDeals ?? 0}
                  </p>
                  <p className="text-xs text-gray-500">Deals</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isOwner && item.isAvailable && (
              <div className="space-y-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <button
                  onClick={() => setRequestModal(true)}
                  className="
                    w-full flex items-center justify-center gap-3
                    py-4 rounded-2xl font-bold text-base text-white
                    bg-[var(--color-forest)] hover:bg-[var(--color-forest-dark)]
                    shadow-2xl shadow-[var(--color-forest)]/40
                    hover:shadow-[var(--color-forest)]/60 hover:scale-[1.02]
                    active:scale-[0.98] cursor-pointer
                    transition-all duration-300 group
                  "
                >
                  <FiSend size={20} className="group-hover:translate-x-0.5 transition-transform" />
                  {isRent ? 'Request to Rent' : 'Make an Offer'}
                </button>

                <button
                  onClick={handleStartChat}
                  className="
                    w-full flex items-center justify-center gap-3
                    py-4 rounded-2xl font-bold text-base
                    bg-white text-[var(--color-forest)]
                    border-3 border-[var(--color-forest)]
                    hover:bg-[var(--color-mint-light)] hover:scale-[1.02]
                    active:scale-[0.98] cursor-pointer
                    shadow-lg transition-all duration-300 group
                  "
                >
                  <FiMessageSquare size={20} className="group-hover:rotate-12 transition-transform" />
                  Chat with Seller
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={() => setWishlisted(p => !p)}
                    className={`
                      flex-1 flex items-center justify-center gap-2
                      py-3.5 rounded-xl font-semibold text-sm
                      border-2 cursor-pointer transition-all duration-300
                      hover:scale-105 active:scale-95
                      ${wishlisted
                        ? 'bg-red-50 border-red-300 text-red-500 shadow-lg shadow-red-200'
                        : 'bg-white border-[var(--color-rose-beige)] text-gray-600 hover:border-red-300 hover:text-red-500'
                      }
                    `}
                  >
                    <FiHeart size={18} className={`${wishlisted ? 'fill-current' : ''} 
                                                   transition-all duration-300`} />
                    {wishlisted ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="
                      flex-1 flex items-center justify-center gap-2
                      py-3.5 rounded-xl font-semibold text-sm
                      bg-white border-2 border-[var(--color-rose-beige)]
                      text-gray-600 hover:border-[var(--color-mint)] 
                      hover:text-[var(--color-forest)] hover:bg-[var(--color-mint-light)]
                      cursor-pointer transition-all duration-300
                      hover:scale-105 active:scale-95
                    "
                  >
                    <FiShare2 size={18} />
                    Share
                  </button>
                </div>

                <Link
                  to={`/report?type=item&id=${item._id}`}
                  className="
                    flex items-center justify-center gap-2 w-full
                    py-3 rounded-xl text-xs font-medium text-gray-400
                    hover:text-red-500 hover:bg-red-50 cursor-pointer
                    transition-all duration-200
                  "
                >
                  <FiAlertTriangle size={14} /> Report this listing
                </Link>
              </div>
            )}

            {/* Owner Actions */}
            {isOwner && (
              <div className="space-y-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <Link
                  to={`/items/${item._id}/edit`}
                  className="
                    w-full flex items-center justify-center gap-3
                    py-4 rounded-2xl font-bold text-base
                    bg-[var(--color-forest)] text-white
                    hover:bg-[var(--color-forest-dark)]
                    shadow-2xl shadow-[var(--color-forest)]/40
                    hover:shadow-[var(--color-forest)]/60 hover:scale-[1.02]
                    active:scale-[0.98] cursor-pointer
                    transition-all duration-300 group
                  "
                >
                  <FiEdit size={20} className="group-hover:rotate-12 transition-transform" />
                  Edit Your Listing
                </Link>

                <div className="p-4 rounded-2xl bg-[var(--color-mint-light)]/30 
                              border-2 border-[var(--color-mint)]/30">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-forest-dark)]">
                    <FiShield size={16} />
                    <span className="font-medium">This is your listing</span>
                  </div>
                </div>
              </div>
            )}

            {/* Unavailable Banner */}
            {!item.isAvailable && (
              <div className="p-5 rounded-2xl bg-red-50 border-2 border-red-200 
                            animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center 
                                text-red-500 flex-shrink-0">
                    <FiXCircle size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-red-700 mb-1">No Longer Available</p>
                    <p className="text-sm text-red-600 leading-relaxed">
                      This item has already been {isRent ? 'rented out' : 'sold'} and is no longer available.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Trust & Safety */}
            <div className="p-5 rounded-2xl bg-[var(--color-cream)] border-2 
                          border-[var(--color-rose-beige)]/30">
              <div className="flex items-center gap-2 mb-3">
                <FiShield size={16} className="text-[var(--color-sage)]" />
                <h4 className="font-bold text-gray-800 text-sm">Safety Tips</h4>
              </div>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <FiCheckCircle size={14} className="text-[var(--color-sage)] flex-shrink-0 mt-0.5" />
                  <span>Meet in safe campus locations only</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle size={14} className="text-[var(--color-sage)] flex-shrink-0 mt-0.5" />
                  <span>Inspect item before payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle size={14} className="text-[var(--color-sage)] flex-shrink-0 mt-0.5" />
                  <span>Report suspicious activity</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile Description */}
        <div className="lg:hidden mt-6 bg-white rounded-3xl p-6 shadow-lg border-2 
                      border-[var(--color-rose-beige)]/30 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-mint-light)] 
                          flex items-center justify-center text-[var(--color-forest)]">
              <FiPackage size={20} />
            </div>
            <h3 className="font-bold text-gray-800 text-lg">Product Description</h3>
          </div>

          <div className={`text-sm text-gray-600 leading-relaxed transition-all duration-300
            ${!showFullDesc && item.description?.length > 200 ? 'line-clamp-3' : ''}`}>
            {item.description}
          </div>

          {item.description?.length > 200 && (
            <button
              onClick={() => setShowFullDesc(!showFullDesc)}
              className="mt-3 text-sm font-semibold text-[var(--color-forest)] 
                       hover:text-[var(--color-forest-dark)] cursor-pointer 
                       flex items-center gap-1 transition-colors"
            >
              {showFullDesc ? 'Show Less' : 'Read More'}
              <FiChevronRight size={14} className={`transition-transform ${showFullDesc ? 'rotate-90' : ''}`} />
            </button>
          )}

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div className="mt-6 pt-6 border-t-2 border-[var(--color-cream-dark)]">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Related Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, i) => (
                  <span key={i} className="
                    px-3 py-1.5 rounded-xl text-xs font-medium
                    bg-[var(--color-mint-light)] text-[var(--color-forest-dark)]
                    border-2 border-[var(--color-mint)]/40
                    hover:bg-[var(--color-mint)] hover:scale-105
                    cursor-pointer transition-all duration-200
                  ">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          REQUEST MODAL
          ═══════════════════════════════════════════════════════ */}
      <Modal
        isOpen={requestModal}
        onClose={() => setRequestModal(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-forest)] 
                          flex items-center justify-center text-white">
              <FiSend size={18} />
            </div>
            <span>{isRent ? 'Rent Request' : 'Purchase Offer'}</span>
          </div>
        }
      >
        <div className="space-y-5 p-1">
          {/* Message */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Message to Seller *
            </label>
            <textarea
              rows={4}
              placeholder={`Hi, I'm interested in ${isRent ? 'renting' : 'buying'} ${item.title}...`}
              value={requestData.message}
              onChange={(e) => setRequestData({ ...requestData, message: e.target.value })}
              className={`${inputCls} resize-none`}
            />
            <p className="text-xs text-gray-400 mt-1.5">
              {requestData.message.length} / 500 characters
            </p>
          </div>

          {/* Rental Dates */}
          {isRent && (
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[var(--color-mint-light)]/20 
                          border-2 border-[var(--color-mint)]/30 animate-slide-down">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={requestData.rentalStartDate}
                  onChange={(e) => setRequestData({ ...requestData, rentalStartDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={requestData.rentalEndDate}
                  onChange={(e) => setRequestData({ ...requestData, rentalEndDate: e.target.value })}
                  min={requestData.rentalStartDate || new Date().toISOString().split('T')[0]}
                  className={inputCls}
                />
              </div>
            </div>
          )}

          {/* Meetup Location */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <FiMapPin size={16} className="text-[var(--color-sage)]" />
              Preferred Meetup Location *
            </label>
            <MeetupMap
              onSelectLocation={(loc) => setSelectedMeetup(loc)}
              selectedLocation={selectedMeetup}
            />
            {selectedMeetup && (
              <div className="
                flex items-center gap-3 mt-3 px-4 py-3 rounded-xl
                bg-[var(--color-mint-light)] border-2 border-[var(--color-mint)]/40
                animate-scale-in
              ">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-forest)] 
                              flex items-center justify-center text-white flex-shrink-0">
                  <FiMapPin size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium">Selected Location</p>
                  <p className="text-sm font-bold text-[var(--color-forest)]">
                    {selectedMeetup.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="p-5 rounded-2xl bg-[var(--color-cream)] border-2 
                        border-[var(--color-rose-beige)]/30">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FiDollarSign size={16} className="text-[var(--color-sage)]" />
              Request Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Item</span>
                <span className="font-semibold text-gray-800">{item.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price</span>
                <span className="font-semibold text-[var(--color-forest)]">
                  ₹{item.price}{isRent && ` / ${item.rentalPeriod?.replace('per_', '')}`}
                </span>
              </div>
              {isRent && requestData.rentalStartDate && requestData.rentalEndDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-800">
                    {Math.ceil(
                      (new Date(requestData.rentalEndDate) - new Date(requestData.rentalStartDate)) 
                      / (1000 * 60 * 60 * 24)
                    )} days
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSendRequest}
            disabled={sendingRequest || !requestData.message || (isRent && (!requestData.rentalStartDate || !requestData.rentalEndDate))}
            className="
              w-full flex items-center justify-center gap-3
              py-4 rounded-2xl font-bold text-base text-white
              bg-[var(--color-forest)] hover:bg-[var(--color-forest-dark)]
              shadow-2xl shadow-[var(--color-forest)]/40
              hover:shadow-[var(--color-forest)]/60 hover:scale-[1.02]
              active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
              cursor-pointer transition-all duration-300 group
            "
          >
            {sendingRequest ? (
              <>
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                Sending Request...
              </>
            ) : (
              <>
                <FiSend size={20} className="group-hover:translate-x-0.5 transition-transform" />
                Send {isRent ? 'Rent' : 'Purchase'} Request
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-500 leading-relaxed">
            By sending this request, you agree to meet the seller on campus in a safe location.
            Always inspect items before making payment.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ItemDetail;