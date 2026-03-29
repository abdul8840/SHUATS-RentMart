import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const StarRating = ({
  rating   = 0,
  onRate,
  size     = 20,
  readonly = false,
}) => {
  const [hover, setHover] = useState(0);

  const active = hover || rating;

  return (
    <div className="flex items-center gap-1 animate-fade-in">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = active >= star;

        return (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRate?.(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            disabled={readonly}
            className={`
              relative transition-all duration-150
              ${readonly
                ? 'cursor-default'
                : 'cursor-pointer hover:scale-125 active:scale-110'
              }
              ${isActive && !readonly ? 'animate-bounce-soft' : ''}
            `}
            style={{ animationDelay: `${star * 50}ms` }}
          >
            <FiStar
              size={size}
              fill={isActive ? '#fbbf24' : 'none'}
              color={isActive ? '#fbbf24' : '#d1d5db'}
              className={`
                transition-all duration-150 drop-shadow-sm
                ${isActive && !readonly ? 'filter drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]' : ''}
              `}
            />

            {/* Sparkle effect on active */}
            {isActive && !readonly && hover === star && (
              <span className="
                absolute -top-1 -right-1 text-[8px]
                animate-bounce-soft pointer-events-none
              ">✨</span>
            )}
          </button>
        );
      })}

      {/* Rating label */}
      {rating > 0 && (
        <div className="flex items-center gap-1.5 ml-1 animate-scale-in">
          <span className="text-xs font-bold text-amber-500">{rating}.0</span>
          <span className="text-xs text-gray-400">/ 5</span>
        </div>
      )}
    </div>
  );
};

export default StarRating;