import { Link } from 'react-router-dom';
import { FiChevronRight, FiBook, FiMonitor, FiHome, FiClipboard, FiTrendingUp } from 'react-icons/fi';

const CategoriesSection = ({ categories }) => {
  const categoryIcons = {
    'Books & Notes': <FiBook className="w-8 h-8" />,
    'Electronics': <FiMonitor className="w-8 h-8" />,
    'Furniture': <FiHome className="w-8 h-8" />,
    'Study Materials': <FiClipboard className="w-8 h-8" />,
  };

  const categoryColors = [
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-purple-500 to-pink-500',
    'from-rose-500 to-red-500',
    'from-indigo-500 to-blue-500',
  ];

  if (categories.length === 0) return null;

  return (
    <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-white">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(90deg, #40916c 1px, transparent 1px), linear-gradient(#40916c 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 sm:mb-16">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage/10 rounded-full text-sage text-sm font-semibold mb-4 animate-fade-in">
              <FiTrendingUp className="w-4 h-4" />
              Categories
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 animate-slide-up">
              Browse by Category
            </h2>

            <p className="text-gray-600 text-base sm:text-lg animate-slide-up animation-delay-100">
              Find exactly what you're looking for
            </p>
          </div>

          <Link
            to="/items"
            className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-forest/10 text-forest rounded-xl text-sm font-bold
              hover:bg-forest hover:text-white transition-all duration-300 group animate-slide-up animation-delay-200"
          >
            View All
            <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.slice(0, 12).map((cat, index) => {
            const gradient = categoryColors[index % categoryColors.length];

            return (
              <Link
                key={cat._id}
                to={`/items?category=${cat._id}`}
                className={`group relative overflow-hidden rounded-2xl p-5 sm:p-6 h-40 sm:h-48
                  flex flex-col items-center justify-center text-center
                  bg-gradient-to-br ${gradient} text-white
                  transition-all duration-500 hover:shadow-2xl hover:shadow-black/20
                  hover:-translate-y-3 cursor-pointer animate-slide-up border-2 border-white/20`}
                style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon */}
                <div className="relative z-10 mb-3 text-3xl sm:text-4xl group-hover:scale-125 transition-transform duration-500">
                  {categoryIcons[cat._id] || <FiClipboard className="w-8 h-8" />}
                </div>

                {/* Category Name */}
                <h3 className="relative z-10 font-bold text-sm sm:text-base mb-2 leading-tight group-hover:text-white transition-colors">
                  {cat._id}
                </h3>

                {/* Count */}
                <p className="relative z-10 text-xs sm:text-sm text-white/80 group-hover:text-white/90 transition-colors">
                  {cat.count} items
                </p>

                {/* Decorative Element */}
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
              </Link>
            );
          })}
        </div>

        {/* Mobile View All Button */}
        <Link
          to="/items"
          className="sm:hidden flex items-center justify-center gap-2 w-full mt-8 py-4 bg-forest/10 text-forest rounded-xl text-sm font-bold
            hover:bg-forest hover:text-white transition-all duration-300 group"
        >
          View All Categories
          <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};

export default CategoriesSection;