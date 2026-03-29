import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const StarRating = ({ rating = 0, onRate, size = 20, readonly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          disabled={readonly}
        >
          <FiStar
            size={size}
            fill={(hover || rating) >= star ? '#fbbf24' : 'none'}
            color={(hover || rating) >= star ? '#fbbf24' : '#d1d5db'}
          />
        </button>
      ))}
      {rating > 0 && <span>({rating}/5)</span>}
    </div>
  );
};

export default StarRating;