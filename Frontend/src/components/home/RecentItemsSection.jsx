import { Link } from 'react-router-dom';
import { FiClock, FiArrowRight } from 'react-icons/fi';
import ItemCard from '../items/ItemCard';

const RecentItemsSection = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-gradient-to-b from-cream via-cream-light to-white">
      {/* Background Elements */}
      <div className="absolute top-1/4 -left-40 w-80 h-80 bg-forest/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-sage/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 sm:mb-16">
          <div className="flex items-center gap-4 flex-1">
            <div className="p-3 sm:p-4 bg-forest/15 rounded-2xl">
              <FiClock className="w-6 h-6 sm:w-8 sm:h-8 text-forest" />
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">
                Recently Added
              </h2>
              <p className="text-gray-500 text-sm sm:text-base mt-1">Fresh listings from campus</p>
            </div>
          </div>

          <Link
            to="/items?sort=newest"
            className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-forest/10 text-forest rounded-xl text-sm font-bold
              hover:bg-forest hover:text-white transition-all duration-300 group animate-slide-up animation-delay-200"
          >
            View All
            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {items.slice(0, 8).map((item, index) => (
            <div
              key={item._id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}
            >
              <ItemCard item={item} />
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <Link
          to="/items?sort=newest"
          className="sm:hidden flex items-center justify-center gap-2 w-full mt-8 py-4 bg-forest/10 text-forest rounded-xl text-sm font-bold
            hover:bg-forest hover:text-white transition-all duration-300 group"
        >
          View All Items
          <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};

export default RecentItemsSection;