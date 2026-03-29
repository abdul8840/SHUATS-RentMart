import { Link } from 'react-router-dom';
import TrustBadge from '../common/TrustBadge.jsx';
import {
  FiEye, FiTag, FiMapPin, FiShoppingBag,
  FiStar, FiPackage
} from 'react-icons/fi';

/* ── condition color map ── */
const conditionConfig = {
  'New':      { color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  'Like New': { color: 'bg-[var(--color-mint-light)] text-[var(--color-forest)]', dot: 'bg-[var(--color-sage)]' },
  'Good':     { color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  'Fair':     { color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  'Poor':     { color: 'bg-red-100 text-red-600', dot: 'bg-red-400' },
};

const ItemCard = ({ item }) => {
  const cond = conditionConfig[item.condition] ?? {
    color: 'bg-gray-100 text-gray-600',
    dot: 'bg-gray-400',
  };

  const isRent = item.listingType === 'rent';
  const period = item.rentalPeriod?.replace('per_', '') ?? '';

  return (
    <div className="
      group relative rounded-2xl overflow-hidden
      bg-[var(--color-cream-light)] border border-[var(--color-rose-beige)]/60
      hover:border-[var(--color-mint)] hover:shadow-2xl
      hover:shadow-[var(--color-forest)]/10 hover:-translate-y-1
      transition-all duration-300 ease-out animate-fade-in
    ">
      <Link to={`/items/${item._id}`} className="block">

        {/* ── IMAGE SECTION ── */}
        <div className="relative h-44 sm:h-48 overflow-hidden bg-[var(--color-cream)]">
          {item.images?.length > 0 ? (
            <img
              src={item.images[0].url}
              alt={item.title}
              className="
                w-full h-full object-cover
                group-hover:scale-105
                transition-transform duration-500 ease-out
              "
            />
          ) : (
            /* Placeholder */
            <div className="
              w-full h-full flex flex-col items-center justify-center gap-2
              bg-gradient-to-br from-[var(--color-cream)] to-[var(--color-mint-light)]
            ">
              <FiShoppingBag size={36} className="text-[var(--color-rose-beige)]" />
              <span className="text-xs text-gray-400">No Image</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="
            absolute inset-0
            bg-gradient-to-t from-black/30 via-transparent to-transparent
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
          " />

          {/* Listing type badge */}
          <span className={`
            absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-xs font-bold
            shadow-md backdrop-blur-sm
            ${isRent
              ? 'bg-[var(--color-forest)]/90 text-white'
              : 'bg-white/90 text-[var(--color-forest)]'
            }
          `}>
            {isRent ? '🔄 For Rent' : '🏷️ For Sale'}
          </span>

          {/* Views badge - top right */}
          <div className="
            absolute top-2.5 right-2.5 flex items-center gap-1
            px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm
            text-white text-xs
          ">
            <FiEye size={11} />
            <span>{item.views ?? 0}</span>
          </div>

          {/* Hover overlay CTA */}
          <div className="
            absolute inset-0 flex items-center justify-center
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
          ">
            <span className="
              px-4 py-2 rounded-xl bg-white/90 backdrop-blur-sm
              text-[var(--color-forest)] text-sm font-semibold
              shadow-lg transform scale-90 group-hover:scale-100
              transition-transform duration-300
            ">
              View Details →
            </span>
          </div>
        </div>

        {/* ── CONTENT SECTION ── */}
        <div className="p-4 space-y-3">

          {/* Title */}
          <h3 className="
            font-bold text-gray-800 text-sm leading-snug line-clamp-2
            group-hover:text-[var(--color-forest)]
            transition-colors duration-200
          ">
            {item.title}
          </h3>

          {/* Category */}
          <div className="flex items-center gap-1.5">
            <FiTag size={12} className="text-[var(--color-sage)] flex-shrink-0" />
            <span className="text-xs text-gray-500 truncate">{item.category}</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-[var(--color-forest)]">
              ₹{item.price}
            </span>
            {isRent && period && (
              <span className="text-xs text-gray-500 font-medium">/ {period}</span>
            )}
          </div>

          {/* Condition + Department row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Condition badge */}
            <span className={`
              inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium
              ${cond.color}
            `}>
              <span className={`w-1.5 h-1.5 rounded-full ${cond.dot}`} />
              {item.condition}
            </span>

            {/* Department */}
            {item.department && (
              <span className="
                px-2 py-0.5 rounded-md text-xs font-medium
                bg-[var(--color-cream)] text-gray-600
                border border-[var(--color-rose-beige)]/60
              ">
                {item.department}
              </span>
            )}

            {/* Semester */}
            {item.semester && (
              <span className="
                px-2 py-0.5 rounded-md text-xs font-medium
                bg-[var(--color-mint-light)] text-[var(--color-forest-dark)]
              ">
                Sem {item.semester}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-[var(--color-rose-beige)]/40" />

          {/* Seller row */}
          {item.seller && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="
                  w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                  bg-gradient-to-br from-[var(--color-forest)] to-[var(--color-sage)]
                  text-white text-[10px] font-bold
                ">
                  {item.seller.name?.[0]?.toUpperCase() ?? 'S'}
                </div>
                <span className="text-xs text-gray-600 truncate">
                  {item.seller.name}
                </span>
              </div>
              <TrustBadge score={item.seller.trustScore} />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ItemCard;