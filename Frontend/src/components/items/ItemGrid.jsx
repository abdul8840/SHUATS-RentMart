import ItemCard from './ItemCard.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { FiShoppingBag } from 'react-icons/fi';

/* ── Skeleton card ── */
const SkeletonCard = () => (
  <div className="
    rounded-2xl overflow-hidden
    bg-[var(--color-cream-light)] border border-[var(--color-rose-beige)]/50
    animate-pulse
  ">
    {/* Image skeleton */}
    <div className="h-44 sm:h-48 bg-gradient-to-r from-[var(--color-cream)] via-[var(--color-rose-beige)]/30 to-[var(--color-cream)] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />

    {/* Content skeleton */}
    <div className="p-4 space-y-3">
      {/* Badge row */}
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-lg bg-[var(--color-rose-beige)]/50" />
        <div className="h-5 w-20 rounded-lg bg-[var(--color-rose-beige)]/30" />
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <div className="h-3.5 rounded-lg bg-[var(--color-rose-beige)]/50 w-full" />
        <div className="h-3.5 rounded-lg bg-[var(--color-rose-beige)]/40 w-3/4" />
      </div>

      {/* Category */}
      <div className="h-3 rounded-lg bg-[var(--color-rose-beige)]/30 w-1/2" />

      {/* Price */}
      <div className="h-6 rounded-lg bg-[var(--color-mint-light)]/60 w-24" />

      {/* Badges */}
      <div className="flex gap-2">
        <div className="h-5 w-14 rounded-md bg-[var(--color-rose-beige)]/40" />
        <div className="h-5 w-16 rounded-md bg-[var(--color-rose-beige)]/30" />
      </div>

      {/* Divider */}
      <div className="h-px bg-[var(--color-rose-beige)]/30" />

      {/* Seller row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--color-rose-beige)]/50" />
          <div className="h-3 w-20 rounded-lg bg-[var(--color-rose-beige)]/40" />
        </div>
        <div className="h-5 w-16 rounded-full bg-[var(--color-mint-light)]/60" />
      </div>
    </div>
  </div>
);

/* ── Main grid component ── */
const ItemGrid = ({ items, loading }) => {

  /* Loading state — 8 skeleton cards */
  if (loading) {
    return (
      <div className="
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
        gap-4 lg:gap-5
      ">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 80}ms` }}
            className="animate-fade-in"
          >
            <SkeletonCard />
          </div>
        ))}
      </div>
    );
  }

  /* Empty state */
  if (!items || items.length === 0) {
    return (
      <div className="
        flex items-center justify-center py-20
        animate-fade-in
      ">
        <EmptyState
          icon={<FiShoppingBag size={48} />}
          title="No items found"
          message="Try adjusting your search or filters to discover more items"
        />
      </div>
    );
  }

  /* Items grid */
  return (
    <div className="space-y-4">
      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing{' '}
          <span className="font-semibold text-[var(--color-forest)]">
            {items.length}
          </span>{' '}
          {items.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Grid */}
      <div className="
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
        gap-4 lg:gap-5
      ">
        {items.map((item, i) => (
          <div
            key={item._id}
            style={{ animationDelay: `${i * 60}ms` }}
            className="animate-slide-up"
          >
            <ItemCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemGrid;