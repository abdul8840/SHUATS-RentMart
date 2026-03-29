const trustLevels = [
  { min: 90, level: 'Excellent',     stars: 5, color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', bar: 'from-emerald-400 to-emerald-600' },
  { min: 75, level: 'Very Good',     stars: 4, color: 'bg-[var(--color-mint-light)] text-[var(--color-forest)] border-[var(--color-mint)]', dot: 'bg-[var(--color-sage)]', bar: 'from-[var(--color-forest)] to-[var(--color-sage)]' },
  { min: 60, level: 'Good',          stars: 3, color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500', bar: 'from-blue-400 to-blue-600' },
  { min: 40, level: 'Average',       stars: 2, color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500', bar: 'from-amber-400 to-amber-500' },
  { min: 20, level: 'Below Average', stars: 1, color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-400', bar: 'from-orange-400 to-orange-500' },
  { min: 0,  level: 'New User',      stars: 0, color: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400', bar: 'from-gray-300 to-gray-400' },
];

const TrustBadge = ({ score = 0, showBar = false }) => {
  const config = trustLevels.find((t) => score >= t.min) ?? trustLevels.at(-1);

  return (
    <div className="inline-flex flex-col gap-1 animate-fade-in">

      {/* Badge pill */}
      <div className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        text-xs font-semibold border
        ${config.color}
        transition-all duration-200
      `}>
        {/* Dot indicator */}
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse-soft flex-shrink-0`} />

        {/* Stars */}
        {config.stars > 0 && (
          <span className="text-amber-400 leading-none" style={{ fontSize: '10px' }}>
            {'★'.repeat(config.stars)}{'☆'.repeat(5 - config.stars)}
          </span>
        )}
        {config.stars === 0 && <span>🆕</span>}

        {/* Label */}
        <span>{config.level}</span>

        {/* Score */}
        <span className="opacity-60">({score})</span>
      </div>

      {/* Optional progress bar */}
      {showBar && (
        <div className="w-full h-1 rounded-full bg-gray-200 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${config.bar} trust-bar transition-all duration-700`}
            style={{ width: `${score}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default TrustBadge;