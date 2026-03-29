import { FiBook, FiFileText, FiCpu, FiSmartphone, FiTool, FiEdit3, FiAward, FiMusic, FiShoppingBag } from 'react-icons/fi';

const iconMap = {
  'Books': { icon: <FiBook size={24} />, color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' },
  'Previous Year Papers': { icon: <FiFileText size={24} />, color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-600' },
  'Calculators': { icon: <FiCpu size={24} />, color: 'from-[var(--color-forest)] to-[var(--color-sage)]', bg: 'bg-[var(--color-mint-light)]', text: 'text-[var(--color-forest)]' },
  'Electronic Devices': { icon: <FiSmartphone size={24} />, color: 'from-slate-500 to-slate-700', bg: 'bg-slate-50', text: 'text-slate-600' },
  'Lab Equipment': { icon: <FiTool size={24} />, color: 'from-amber-400 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-600' },
  'Stationery': { icon: <FiEdit3 size={24} />, color: 'from-pink-400 to-pink-600', bg: 'bg-pink-50', text: 'text-pink-600' },
  'Sports Equipment': { icon: <FiAward size={24} />, color: 'from-orange-400 to-orange-600', bg: 'bg-orange-50', text: 'text-orange-600' },
  'Musical Instruments': { icon: <FiMusic size={24} />, color: 'from-violet-400 to-violet-600', bg: 'bg-violet-50', text: 'text-violet-600' },
};

const CategoryCard = ({ category, count, onClick }) => {
  const config = iconMap[category] || {
    icon: <FiShoppingBag size={24} />,
    color: 'from-[var(--color-forest)] to-[var(--color-sage)]',
    bg: 'bg-[var(--color-mint-light)]',
    text: 'text-[var(--color-forest)]',
  };

  return (
    <div
      onClick={onClick}
      className="
        group relative flex flex-col items-center gap-3
        p-5 rounded-2xl cursor-pointer
        bg-[var(--color-cream-light)] border border-[var(--color-rose-beige)]/50
        hover:border-[var(--color-mint)] hover:shadow-xl
        hover:shadow-[var(--color-forest)]/10
        hover:-translate-y-1.5 active:scale-95
        transition-all duration-300 ease-out
        overflow-hidden
        card-hover
      "
    >
      {/* Subtle background glow on hover */}
      <div className={`
        absolute inset-0 bg-gradient-to-br ${config.color}
        opacity-0 group-hover:opacity-5
        transition-opacity duration-300 rounded-2xl
      `} />

      {/* Shimmer effect on hover */}
      <div className="
        absolute inset-0 -translate-x-full group-hover:translate-x-full
        bg-gradient-to-r from-transparent via-white/20 to-transparent
        transition-transform duration-700 ease-in-out skew-x-12
      " />

      {/* Icon container */}
      <div className={`
        relative w-14 h-14 rounded-2xl
        bg-gradient-to-br ${config.color}
        flex items-center justify-center text-white
        shadow-lg group-hover:shadow-xl
        group-hover:scale-110 group-hover:rotate-3
        transition-all duration-300 ease-out
      `}>
        {config.icon}

        {/* Glow ring on hover */}
        <div className={`
          absolute inset-0 rounded-2xl bg-gradient-to-br ${config.color}
          opacity-0 group-hover:opacity-40 blur-md
          transition-opacity duration-300
        `} />
      </div>

      {/* Label */}
      <h4 className={`
        text-sm font-semibold text-center leading-tight
        text-gray-700 group-hover:${config.text}
        transition-colors duration-200
      `}>
        {category}
      </h4>

      {/* Count badge */}
      <span className={`
        px-2.5 py-0.5 rounded-full text-xs font-medium
        ${config.bg} ${config.text}
        group-hover:scale-105 transition-transform duration-200
      `}>
        {count} items
      </span>

      {/* Bottom accent line */}
      <div className={`
        absolute bottom-0 left-0 right-0 h-0.5
        bg-gradient-to-r ${config.color}
        scale-x-0 group-hover:scale-x-100
        transition-transform duration-300 origin-left
      `} />
    </div>
  );
};

export default CategoryCard;