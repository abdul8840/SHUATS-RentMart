import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createReviewAPI, getRequestAPI } from '../../api/axios.js';
import StarRating from '../../components/common/StarRating.jsx';
import Loader from '../../components/common/Loader.jsx';
import toast from 'react-hot-toast';
import { FiStar } from 'react-icons/fi';

const WriteReview = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  const fetchRequest = async () => {
    try {
      const { data } = await getRequestAPI(requestId);
      if (data.success) setRequest(data.request);
    } catch (error) {
      toast.error('Request not found');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a rating'); return; }
    setSubmitting(true);
    try {
      const { data } = await createReviewAPI({ requestId, rating, comment });
      if (data.success) {
        toast.success('Review submitted!');
        navigate(-1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Review failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1><FiStar /> Write a Review</h1>

      {request && (
        <div>
          <p>Item: {request.item?.title}</p>
          <p>Transaction: {request.requestType}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Rating</label>
          <StarRating rating={rating} onRate={setRating} size={32} />
        </div>
        <div>
          <label>Comment (optional)</label>
          <textarea placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default WriteReview;