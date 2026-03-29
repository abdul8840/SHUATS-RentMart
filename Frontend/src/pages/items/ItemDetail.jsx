import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getItemAPI, createRequestAPI, createChatAPI } from '../../api/axios.js';
import { useAuth } from '../../hooks/useAuth.js';
import TrustBadge from '../../components/common/TrustBadge.jsx';
import MeetupMap from '../../components/meetup/MeetupMap.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import toast from 'react-hot-toast';
import { FiMessageSquare, FiSend, FiEdit, FiMapPin, FiTag, FiCalendar, FiEye, FiAlertTriangle } from 'react-icons/fi';

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestModal, setRequestModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [requestData, setRequestData] = useState({
    message: '', meetupLocation: '', rentalStartDate: '', rentalEndDate: ''
  });
  const [selectedMeetup, setSelectedMeetup] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const { data } = await getItemAPI(id);
      if (data.success) {
        setItem(data.item);
      }
    } catch (error) {
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
          rentalEndDate: requestData.rentalEndDate
        })
      };

      const { data } = await createRequestAPI(payload);
      if (data.success) {
        toast.success('Request sent successfully!');
        setRequestModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setSendingRequest(false);
    }
  };

  const handleStartChat = async () => {
    try {
      const { data } = await createChatAPI({ participantId: item.seller._id, itemId: item._id });
      if (data.success) {
        navigate('/chat', { state: { selectedChat: data.chat } });
      }
    } catch (error) {
      toast.error('Failed to start chat');
    }
  };

  if (loading) return <Loader />;
  if (!item) return <p>Item not found</p>;

  const isOwner = user?._id === item.seller?._id;

  return (
    <div>
      {/* Image Gallery */}
      <div>
        <div>
          {item.images && item.images.length > 0 ? (
            <img src={item.images[selectedImage]?.url} alt={item.title} />
          ) : (
            <div>No Image Available</div>
          )}
        </div>
        {item.images && item.images.length > 1 && (
          <div>
            {item.images.map((img, index) => (
              <img key={index} src={img.url} alt={`${item.title}-${index}`} onClick={() => setSelectedImage(index)} data-selected={selectedImage === index} />
            ))}
          </div>
        )}
      </div>

      {/* Item Details */}
      <div>
        <div>
          <span>{item.listingType === 'rent' ? 'For Rent' : 'For Sale'}</span>
          <span>{item.category}</span>
        </div>

        <h1>{item.title}</h1>

        <p>₹{item.price} {item.listingType === 'rent' ? `/ ${item.rentalPeriod?.replace('per_', '')}` : ''}</p>
        {item.priceType === 'negotiable' && <span>Negotiable</span>}

        <div>
          <p><FiTag /> Condition: {item.condition}</p>
          <p>Department: {item.department}</p>
          {item.semester && <p><FiCalendar /> Semester {item.semester}</p>}
          <p><FiEye /> {item.views} views</p>
        </div>

        <div>
          <h3>Description</h3>
          <p>{item.description}</p>
        </div>

        {item.tags && item.tags.length > 0 && (
          <div>
            {item.tags.map((tag, i) => <span key={i}>#{tag}</span>)}
          </div>
        )}

        {/* Seller Info */}
        <div>
          <h3>Seller</h3>
          <Link to={`/user/${item.seller._id}`}>
            <div>
              {item.seller.profileImage?.url ? (
                <img src={item.seller.profileImage.url} alt={item.seller.name} />
              ) : (
                <div>{item.seller.name?.charAt(0)}</div>
              )}
              <div>
                <h4>{item.seller.name}</h4>
                <p>{item.seller.department}</p>
                <TrustBadge score={item.seller.trustScore} />
              </div>
            </div>
          </Link>
        </div>

        {/* Actions */}
        {!isOwner && item.isAvailable && (
          <div>
            <button onClick={() => setRequestModal(true)}>
              <FiSend /> {item.listingType === 'rent' ? 'Request to Rent' : 'Request to Buy'}
            </button>
            <button onClick={handleStartChat}>
              <FiMessageSquare /> Chat with Seller
            </button>
            <Link to={`/report?type=item&id=${item._id}`}>
              <FiAlertTriangle /> Report
            </Link>
          </div>
        )}

        {isOwner && (
          <div>
            <Link to={`/items/${item._id}/edit`}>
              <FiEdit /> Edit Listing
            </Link>
          </div>
        )}

        {!item.isAvailable && (
          <div>
            <p>This item is no longer available</p>
          </div>
        )}
      </div>

      {/* Request Modal */}
      <Modal isOpen={requestModal} onClose={() => setRequestModal(false)} title={`${item.listingType === 'rent' ? 'Rent' : 'Buy'} Request`}>
        <div>
          <div>
            <label>Message to Seller</label>
            <textarea placeholder="Hi, I'm interested in this item..." value={requestData.message} onChange={(e) => setRequestData({ ...requestData, message: e.target.value })} rows={3} />
          </div>

          {item.listingType === 'rent' && (
            <>
              <div>
                <label>Rental Start Date</label>
                <input type="date" value={requestData.rentalStartDate} onChange={(e) => setRequestData({ ...requestData, rentalStartDate: e.target.value })} />
              </div>
              <div>
                <label>Rental End Date</label>
                <input type="date" value={requestData.rentalEndDate} onChange={(e) => setRequestData({ ...requestData, rentalEndDate: e.target.value })} />
              </div>
            </>
          )}

          <div>
            <label><FiMapPin /> Select Meetup Location</label>
            <MeetupMap onSelectLocation={(loc) => setSelectedMeetup(loc)} selectedLocation={selectedMeetup} />
            {selectedMeetup && <p>Selected: {selectedMeetup.name}</p>}
          </div>

          <button onClick={handleSendRequest} disabled={sendingRequest}>
            {sendingRequest ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ItemDetail;